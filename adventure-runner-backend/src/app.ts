import express from "express";
import fsPromises from "fs.promises";
import fs from "fs";
import { marked } from 'marked';
import yaml from "yaml";
import hbs from "hbs";
import fetch from "node-fetch";

const app = express();
const port = 3000;

//TODO make decision here
/*marked.setOptions({
    sanitize: false
});*/

const crToXPMapping = {
    "0": 10,
    "1/8": 25,
    "1/4": 50,
    "1/2": 100,
    "1": 200,
    "2": 450,
    "3": 700,
    "4": 1100,
    "5": 1800,
    "6": 2300,
    "7": 2900,
    "8": 3900,
    "9": 5000,
    "10": 5900,
    "11": 7200,
    "12": 8400,
    "13": 10000,
    "14": 11500,
    "15": 13000,
    "16": 15000,
    "17": 18000,
    "18": 20000,
    "19": 22000,
    "20": 25000,
    "21": 33000,
    "22": 41000,
    "23": 50000,
    "24": 62000,
    "30": 155000
}
const abilityScores = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma"
];
const scoreToMofidierMapping = {
    "1": "-5",
    "2": "-4",
    "3": "-4",
    "4": "-3",
    "5": "-3",
    "6": "-2",
    "7": "-2",
    "8": "-1",
    "9": "-1",
    "10": "+0",
    "11": "+0",
    "12": "+1",
    "13": "+1",
    "14": "+2",
    "15": "+2",
    "16": "+3",
    "17": "+3",
    "18": "+4",
    "19": "+4",
    "20": "+5",
    "21": "+5",
    "22": "+6",
    "23": "+6",
    "24": "+7",
    "25": "+7",
    "26": "+8",
    "27": "+8",
    "28": "+9",
    "29": "+9",
    "30": "+10"
}

app.set("views", __dirname + "/../views");

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("ifNotEquals", function (arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("ifGreaterThan", function (arg1, arg2, options) {
    return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("eq", function (arg1, arg2) {
    return arg1 == arg2;
});
hbs.registerHelper("capitalizeFirst", function (arg1) {
    let str = ("" + arg1)
    if (str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return str;
});
hbs.registerHelper("expByCr", function (arg1) {
    return crToXPMapping[arg1]
});
hbs.registerHelper("breaklines", function (text) {
    text = hbs.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
    return new hbs.SafeString(text);
});
hbs.registerPartial("spell", hbs.compile(fs.readFileSync(`${__dirname}/../views/spell.hbs`).toString()));
app.set('view engine', 'hbs');

app.get("/api/tree", async (req, res, next) => {
    try {
        res.send(await readFileTree(`${__dirname}/../../content`));
    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.get("/api/content/*", async (req, res, next) => {
    try {
        switch (req.url.split(".").slice(-1)[0]) {
            case "md":
                res.send(await renderMdPage(req.url));
                break;
            default: res.send(await renderCreature(pathFromContent(req.url), true)); break;
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

const renderMdPage = async (url) => {
    const fileContent = await fsPromises.readFile(`${__dirname}/../../content/${pathFromContent(decodeURI(url))}`);
    const html = marked.parse(fileContent.toString());
    const promises = [];
    const regex = /<!--creature:(.+)-->/gm;
    html.replace(regex, (match, creatureSpec) => {
        const parts = creatureSpec.split(" ");
        const promise = renderCreature(
            "Creatures/" + parts[0],
            parts.includes("wide"),
            parts.includes("showDescription"),
            parts.includes("float"));
        promises.push(promise);
    });
    const data = await Promise.all(promises);
    return html.replace(regex, () => data.shift());
}

const resolveSpells = async (spell_list: string[]) => {
    const spells = await Promise.all(spell_list.map(spell_url => fetch(spell_url).then(res => res.json())));
    return spells;
}

const renderCreature = async (path, wide = false, showDescription = true, float = false) => {
    const parsedFileContent = await getParsedFileContent(path);
    abilityScores.forEach(score => {
        parsedFileContent[score + "Mod"] = scoreToMofidierMapping[parsedFileContent[score].toString()]
    });
    parsedFileContent["wide"] = wide;
    parsedFileContent["showDescription"] = showDescription;
    parsedFileContent["float"] = float;
    parsedFileContent["spells"] = await resolveSpells(parsedFileContent["spell_list"]);
    return new Promise((resolve, reject) => {
        app.render("statblock.hbs", parsedFileContent, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}

const getParsedFileContent = async (path) => {
    const fileContent = await fsPromises.readFile(`${__dirname}/../../content/${path}`);
    switch (path.split(".").slice(-1)[0]) {
        case "json": return JSON.parse(fileContent.toString())
        case "yaml": return yaml.parse(fileContent.toString())
    }
}

interface ContentTreeNode {
    name: string;
    path: string;
    children: ContentTreeNode[];
    isPage: boolean;
}

const pathFromContent = path => {
    const parts = path.split("/");
    const contentIdx = parts.findIndex(p => p === "content");
    return parts.slice(contentIdx + 1,).join("/");
}

const readFileTree = async (currentDir: string): Promise<ContentTreeNode> => {
    const list = await fsPromises.readdir(currentDir);
    const fileTree = {
        name: currentDir.split("/").slice(-1)[0],
        path: pathFromContent(currentDir),
        children: [],
        isPage: false
    } as ContentTreeNode;
    for (const [idx, fileName] of list.entries()) {
        const filePath = `${currentDir}/${fileName}`;
        const fileInfo = fs.lstatSync(filePath);
        if (fileInfo.isDirectory()) {
            fileTree.children.push(await readFileTree(filePath));
        } else {
            fileTree.children.push({
                name: fileName,
                path: `${pathFromContent(currentDir)}/${fileName}`,
                children: [],
                isPage: true
            } as ContentTreeNode);
        }
    }
    return fileTree;
};

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

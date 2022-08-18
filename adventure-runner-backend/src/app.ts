import express from "express";
import fsPromises from "fs.promises";
import fs from "fs";
import { marked } from 'marked';
import yaml from "yaml";
import hbs from "hbs";

const app = express();
const port = 3000;

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
    switch (req.url.split(".").slice(-1)[0]) {
        case "md":
            const fileContent = await fsPromises.readFile(`${__dirname}/../../content/${pathFromContent(decodeURI(req.url))}`);
            res.send(marked.parse(fileContent.toString()));
            break;
        default: res.send(await renderCreature(pathFromContent(req.url))); break;
    }
});

const renderCreature = async (path) => {
    const parsedFileContent = await getParsedFileContent(path);
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

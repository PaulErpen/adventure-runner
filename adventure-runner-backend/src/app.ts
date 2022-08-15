import express from "express";
import fsPromises from "fs.promises";
import fs from "fs";
const app = express();
const port = 3000;

app.get("/api/content", async (req, res, next) => {
    try {
        res.send(await readFileTree(`${__dirname}/../../content`));
    } catch (error) {
        console.error(error);
        next(error);
    }
});

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
        name: currentDir.slice(7,).split("/").slice(-1)[0],
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

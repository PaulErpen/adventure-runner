interface ContentTreeNode {
    name: string;
    path: string;
    children: ContentTreeNode[];
    isPage: boolean;
}
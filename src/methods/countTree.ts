function countTree(tree: Record<string, Array<string>>) {
    let size = 0;
    Object.values(tree).forEach(array => size += array.length);
    return size;
}

export { countTree };
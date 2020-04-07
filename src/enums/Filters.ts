export interface Filter {
    name: string;
    api: string;
}

export const filters = new Array<Filter>();
filters.push({
    name: 'colors',
    api: 'color'
}, {
    name: 'habitats',
    api: 'habitat'
}, {
    name: 'shapes',
    api: 'shape'
});
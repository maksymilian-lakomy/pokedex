import { Dictionary } from 'vue-router/types/router';

export function parseQuery (query: Dictionary<string | (string | null)[]>): Record<string, Array<string>> {
    const finalQuery: Record<string, Array<string>> = {};
    for(const q in query) {
        if (query[q] === null)
            continue;
        finalQuery[q] = new Array<string>();
        if (!(query[q] instanceof Array))
            finalQuery[q] = [query[q] as string];
        else
            finalQuery[q] = [...query[q] as Array<string>];
    }
    return finalQuery;
}
import { Dictionary } from 'vue-router/types/router';

export class Queries {
    private readonly _queries: Record<string, Array<string>> = {};

    constructor(queries: Dictionary<string | (string | null)[]>) {
        for (const query in queries) {
            if (queries[query] === null)
                continue;
            this._queries[query] = new Array<string>();
            if (queries[query] instanceof Array)
                this._queries[query] = [...queries[query] as Array<string>];
            else
                this._queries[query] = [queries[query] as string];
        }
    }

    public get queries(): Readonly<Record<string, Array<string>>> {
        return this._queries;
    }

    public has(query: string, value?: string): boolean {
        if (this._queries[query] !== undefined) {
            if (value !== undefined && !this._queries[query].includes(value))
                return false;
            return true;
        }
        return false;
    }

    public setQuery(query: string, value: string | Array<string>): void {
        if (value.length === 0 && this._queries[query] !== undefined) {
            delete this._queries[query];
        } else {
            this._queries[query] = typeof value === 'string' ? [value] : [...value];
        }
    }

    public addToQuery(query: string, value: string | Array<string>) {
        if (this._queries[query] === undefined)
            this._queries[query] = [];
        if (typeof value === 'string')
            this._queries[query].push(value);
        else
            this._queries[query].push(...value);
    }

    public removeFromQuery(query: string, value: string | Array<string>) {
        if (!this._queries[query]) return;
        if (typeof value === 'string')
            this._queries[query] = this._queries[query].filter(_query => _query !== value);
        else
            this._queries[query] = this._queries[query].filter(_query => !value.includes(_query));
        if (this._queries[query].length === 0)
            delete this._queries[query];
    }
}
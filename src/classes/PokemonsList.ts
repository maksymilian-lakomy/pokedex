import pokemonFilterService from '@/services/pokemonFilterService';
import pokemonSpeciesService from '@/services/pokemonSpeciesService';
import { countTree } from '@/methods/countTree';

function intersection(obj1: Record<string, string>, obj2: Record<string, string>) {
    for (const name in obj1)
        if (obj2[name] === undefined)
            delete obj1[name];
}

interface Options {
    filters?: Record<string, Array<string>>;
    search?: string;
    page?: number;
}

export class PokemonsSpeciesList {
    private _pokemonsSpeciesUrls: Record<string, string> = {};

    private _filters: Record<string, Array<string>> | null = null;

    public get filters(): Readonly<Record<string, Array<string>>> {
        return this._filters !== null ? this._filters : {};
    }

    private _search = '';

    public get search(): string {
        return this._search;
    }

    public get pokemonsUrls(): Array<string> {
        const search = this._search.toLowerCase().split(' ').join('-');
        const names = Object.keys(this._pokemonsSpeciesUrls);
        const urls: Array<string> = [];
        names.forEach(name => {
            if (name.startsWith(search))
                urls.push(this._pokemonsSpeciesUrls[name]);
        })
        return urls;
    }

    public get selectedPokemonsUrls(): Array<string> {
        return this.pokemonsUrls.splice(this._pokemonsPerPage * (this._currentPage - 1), this._pokemonsPerPage);
    }

    private _pokemonsPerPage = 20;
    private _currentPage = 0;

    public get pageAmount(): number {
        const length = this.pokemonsUrls.length;
        return (Math.floor(length / this._pokemonsPerPage) + ((length % this._pokemonsPerPage) !== 0 ? 1 : 0));
    }

    public get currentPage(): number {
        return this._currentPage;
    }

    private async loadPokemonsSpeciesMapWithFilters() {
        if (this._filters === null) throw new Error('Something went wrong!');
        const filters: Array<string> = Object.keys(this._filters);
        const results = await Promise.all(
            filters.map(filter =>
                pokemonFilterService.getAllFilteredPokemonSpecies({
                    filter,
                    options: this._filters![filter]
                })
            )
        );

        for (let i = 1; i < results.length; i++) intersection(results[0], results[i]);
        this._pokemonsSpeciesUrls = results[0];
    }

    private async loadPokemonsSpeciesMap() {
        this._pokemonsSpeciesUrls = await pokemonSpeciesService.getMap();
    }

    public async reloadSpeciesList() {
        if (this._filters !== null && countTree(this._filters) > 0)
            await this.loadPokemonsSpeciesMapWithFilters();
        else
            await this.loadPokemonsSpeciesMap();
    }

    public setOptions({ filters, page, search }: Options) {
        if (filters !== undefined) this._filters = filters;
        if (page !== undefined) this._currentPage = page;
        if (search !== undefined) this._search = search;
    }
}
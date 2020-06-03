import PokemonSpeciesData from './PokemonSpeciesData';

import pokemonFilterService from '@/services/pokemonFilterService';
import pokemonSpeciesService from '@/services/pokemonSpeciesService';

function intersection (obj1: Record<string, string>, obj2: Record<string, string>) {
    for (const name in obj1)
        if (obj2[name] === undefined)
            delete obj1[name];
}

export class PokemonsSpeciesList {
    private _pokemonsSpeciesUrls: Record<string, string> = {};

    private _filters: Record<string, Array<string>> | null = null;
    private _search = '';

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
        if (this._filters === null) return;

        const filterKeys = Object.keys(this._filters);
        const results = await Promise.all(
            filterKeys.map(filter =>
                pokemonFilterService.getAllFilteredPokemonSpecies({
                    filter,
                    options: this._filters![filter]
                })
            )
        );
        for (let i = 1; i < results.length; i++) intersection(results[0], results[i]);
        this._pokemonsSpeciesUrls = { ...results[0] };
    }

    private async loadPokemonsSpeciesMap() {
        this._pokemonsSpeciesUrls = await pokemonSpeciesService.getMap();
    }

    private reloadSpeciesList() {
        if (this._filters !== null && Object.keys(this._filters).filter(options => options.length > 0).length > 0)
            this.loadPokemonsSpeciesMapWithFilters();
        else
            this.loadPokemonsSpeciesMap();
    }

    public setFilters(filters: Record<string, Array<string>> | null): void {
        for (const filter in filters)
            if (filters[filter].length === 0)
                delete filters[filter]
        this._filters = filters;
        this.reloadSpeciesList();
    }

    public setSearch(search: string | null): void {
        this._search = search === null ? '' : search;
    }

    public setPage(page: number): void {
        if (page > 0 || page <= this.pageAmount)
            this._currentPage = page;
    }
}
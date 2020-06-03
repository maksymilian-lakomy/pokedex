interface SearchPayload {
    search: string;
}

interface LoadPokemonSpeciesMapPayload {
    useFilters: boolean;
}

interface FiltersPayload {
    filters: Record<string, Array<string>>;
}

export {
    LoadPokemonSpeciesMapPayload,
    FiltersPayload
}
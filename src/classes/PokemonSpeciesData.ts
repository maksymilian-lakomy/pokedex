import PokemonSimpleData from "./PokemonSimpleData";
import PokemonData from './PokemonData';

interface VarietyApi {
    is_default: boolean;
    pokemon: PokemonSimpleData;
}

interface PokemonSpeciesApiData {
    id: number;
    name: string;
    evolution_chain: EvolutionChain;

    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
        };
        version: {
            name: string;
            url: string;
        };
    }[];

    color: Tag;
    habitat: Tag;
    shape: Tag;
    varieties: VarietyApi[];
    generation: Generation;
}

interface EvolutionChain {
    url: string;
}

import Tag from './Tag';

interface Variety {
    isDefault: boolean;
    pokemon: PokemonSimpleData;
    pokemonFull?: PokemonData;
}

interface Generation {
    name: string;
}

export default class PokemonSpeciesData {
    readonly id: number;
    readonly name: string;
    readonly evolutionChain: number;

    readonly flavorTextEntries: {
        text: string;
        language: string;
        version: {
            name: string;
            url: string;
        };
    }[];

    readonly color: Tag;
    readonly habitat: Tag;
    readonly shape: Tag;

    readonly generation: Generation;

    readonly varieties: Variety[];

    constructor(apiData: PokemonSpeciesApiData) {
        this.id = apiData.id;
        this.name = apiData.name;
        this.evolutionChain = +apiData.evolution_chain.url.replace("https://pokeapi.co/api/v2/evolution-chain/", "").replace('/', "");
        this.flavorTextEntries = apiData.flavor_text_entries.filter(entry => entry.language.name === "en").map(entry => {
            const newEntry: {
                text: string;
                language: string;
                version: {
                    name: string;
                    url: string;
                };
            } = { text: entry.flavor_text, language: entry.language.name, version: entry.version };
            return newEntry;
        })

        this.color = apiData.color;
        this.habitat = apiData.habitat;
        this.shape = apiData.shape;
        this.generation = apiData.generation;
        this.varieties = apiData.varieties.map(apiVariety => {
            return {
                isDefault: apiVariety.is_default,
                pokemon: apiVariety.pokemon
            } as Variety;
        });
    }
}
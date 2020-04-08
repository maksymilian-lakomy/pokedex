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
    readonly evolutionChain: EvolutionChain;

    readonly color: Tag;
    readonly habitat: Tag;
    readonly shape: Tag;

    readonly generation: Generation;

    readonly varieties: Variety[];

    constructor(apiData: PokemonSpeciesApiData) {
        this.id = apiData.id;
        this.name = apiData.name;
        this.evolutionChain = apiData.evolution_chain;
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
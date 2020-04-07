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

    color: Color;
    shape: Shape;
    varieties: VarietyApi[];
}

interface Color {
    name: string;
    url: string;
}

interface EvolutionChain {
    url: string;
}

interface Shape {
    name: string;
    url: string;
}

interface Variety {
    isDefault: boolean;
    pokemon: PokemonSimpleData;
    pokemonFull?: PokemonData;
}

export default class PokemonSpeciesData {
    readonly id: number;
    readonly name: string;
    readonly evolutionChain: EvolutionChain;

    readonly color: Color;
    readonly shape: Shape;

    readonly varieties: Variety[];

    constructor(apiData: PokemonSpeciesApiData) {
        this.id = apiData.id;
        this.name = apiData.name;
        this.evolutionChain = apiData.evolution_chain;
        this.color = apiData.color;
        this.shape = apiData.shape;
        this.varieties = apiData.varieties.map(apiVariety => {
            return {
                isDefault: apiVariety.is_default,
                pokemon: apiVariety.pokemon
            } as Variety;
        });
    }
}
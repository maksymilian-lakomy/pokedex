import PokemonSpeciesData from './PokemonSpeciesData';

export interface EvolutionApiData {
    evolves_to: EvolutionApiData[];
    species: {
        name: string;
        url: string;
    };
}

export default class EvolutionData {
    readonly name: string;
    readonly url: string;
    readonly evolvesFrom?: string;
    readonly evolvesTo: Array<string> = [];
    speciesData?: PokemonSpeciesData;

    constructor(name: string, url: string, evolvesTo: Array<string>, evolvesFrom?: string) {
        this.name = name;
        this.url = url;
        this.evolvesFrom = evolvesFrom;
        Object.assign(this.evolvesTo, evolvesTo);
    }

}
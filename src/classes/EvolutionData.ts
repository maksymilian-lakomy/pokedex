import PokemonSpeciesData from './PokemonSpeciesData';

interface EvolutionApiData {
    evolves_to: EvolutionApiData[];
    species: {
        name: string;
        url: string;
    };
}

export default class EvolutionData {
    readonly evolvesTo = new Array<EvolutionData>();
    readonly species: {
        readonly name: string;
        readonly url: string;
    };
    speciesData?: PokemonSpeciesData;

    constructor(apiData: EvolutionApiData) {
        this.species = apiData.species;
        for (const evolveTo of apiData.evolves_to) 
            this.evolvesTo.push(new EvolutionData(evolveTo));
    }

}
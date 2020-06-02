import Service from './Service';

const pokemonEndPoint = '/evolution-chain';

import EvolutionData, { EvolutionApiData } from '@/classes/EvolutionData';
import pokemonSpeciesService from './pokemonSpeciesService';

interface GetEvolutionChain {
    evolutionChainId: string;
}

function mapEvolutionTree(map: Record<string, EvolutionData>, evolutionChain: EvolutionApiData, from?: string): void {
    const evolvesTo = evolutionChain.evolves_to.map(evolution => evolution.species.name);
    const evolutionData = new EvolutionData(evolutionChain.species.name, evolutionChain.species.url, evolvesTo, from);
    map[evolutionData.name] = evolutionData;

    evolutionChain.evolves_to.forEach(_evolutionChain => mapEvolutionTree(map, _evolutionChain, evolutionChain.species.name));
}

export default {
    async getEvolutionData({ evolutionChainId }: GetEvolutionChain): Promise<Record<string, EvolutionData>> {
        const response = await Service.get(`${pokemonEndPoint}/${evolutionChainId}`);
        const result = response.data.chain as EvolutionApiData;
        const map: Record<string, EvolutionData> = {};
        mapEvolutionTree(map, result);
        return map;
    },

    async getSpeciesFromEvolutionChain(map: Record<string, EvolutionData>): Promise<Record<string, EvolutionData>> {
        const pokemonsData = await Promise.all(Object.values(map).map(evolutionData => pokemonSpeciesService.getByUrl({url: evolutionData.url, full: true})));
        pokemonsData.forEach(pokemon => map[pokemon.name].speciesData = pokemon);
        return map;
    }
}


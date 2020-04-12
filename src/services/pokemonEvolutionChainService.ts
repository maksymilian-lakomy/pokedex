import Service from './Service';
import { AxiosResponse } from 'axios';

const pokemonEndPoint = '/evolution-chain';

import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import EvolutionData from '@/classes/EvolutionData';
import pokemonSpeciesService from './pokemonSpeciesService';



interface GetEvolutionChain {
    evolutionChainId: string;
}


export default {
    async getEvolutionData({evolutionChainId}: GetEvolutionChain): Promise<EvolutionData> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/${evolutionChainId}`);
        if (response.status !== 200) 
            throw response;
        const result = new EvolutionData(response.data.chain);
        return result;
    },

    async getSpeciesFromEvolutionChain(evolutionData: EvolutionData): Promise<EvolutionData> {
        evolutionData.speciesData = await pokemonSpeciesService.getByUrl({url: evolutionData.species.url, full: true});
        for (const index in evolutionData.evolvesTo)
            evolutionData.evolvesTo[index] = await this.getSpeciesFromEvolutionChain(evolutionData.evolvesTo[index]);
        return evolutionData;
    }
}


import Tag from './Tag';

export interface PokemonApiData {
    id: number;
    name: string;

    weight: number;
    height: number;

    base_experience: number;

    species: Tag;

    sprites: {
        back_default: string;
        front_default: string;
    };

    types: {
        slot: number;
        type: Tag;   
    }[];

}

export default class PokemonData {
    readonly id: number;
    readonly name: string;

    readonly height: number;
    readonly weight: number;
    readonly baseExperience: number;

    readonly species: Tag;

    readonly sprites: {
        backDefault: string;
        frontDefault: string;
    }

    readonly tags: Tag[];

    constructor(apiData: PokemonApiData) {
        this.id = apiData.id;
        this.name = apiData.name;

        this.height = apiData.height;
        this.weight = apiData.weight;
        this.baseExperience = apiData.base_experience;

        this.species = apiData.species;

        this.sprites = {
            backDefault: apiData.sprites.back_default,
            frontDefault: apiData.sprites.front_default
        }
        this.tags = apiData.types.map(type => {
            return type.type;
        });

    }

}
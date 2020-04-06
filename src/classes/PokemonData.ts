interface Type {
    slot: number;
    type: {
        name: string,
        url: string
    }
}

interface Species {
    name: string;
    url: string;
}

export interface IPokemonData {
    id: number;
    name: string;

    weight: number;
    height: number;

    base_experience: number;

    species: Species;

    sprites: {
        back_default: string,
        front_default: string
    }

    types: Type[];

}

export default class PokemonData {
    readonly id: number;
    readonly name: string;

    readonly height: number;
    readonly weight: number;
    readonly baseExperience: number;

    readonly species: Species;

    readonly sprites: {
        backDefault: string,
        frontDefault: string
    }

    readonly types: Type[];

    constructor(apiData: IPokemonData) {
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
        this.types = apiData.types;

    }

}
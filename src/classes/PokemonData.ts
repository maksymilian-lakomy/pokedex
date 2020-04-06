interface IType {
    slot: number;
    type: {
        name: string,
        url: string
    }
}

interface ISpecies {
    name: string;
    url: string;
}

export interface IPokemonData {
    id: number;
    name: string;

    weight: number;
    height: number;

    base_experience: number;

    species: ISpecies;

    sprites: {
        back_default: string,
        front_default: string
    }

    types: IType[];

}

export default class PokemonData {
    readonly id: number;
    readonly name: string;

    readonly height: number;
    readonly weight: number;
    readonly baseExperience: number;

    readonly species: ISpecies;

    readonly sprites: {
        backDefault: string,
        frontDefault: string
    }

    readonly types: IType[];

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
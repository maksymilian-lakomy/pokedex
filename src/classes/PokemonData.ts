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

    stats: {
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    }[];
    
    abilities: {
        ability: Ability;
    }[];

    types: {
        slot: number;
        type: Tag;   
    }[];

}

interface Stat {
    base: number;
    effort: 0;
    stat: {
        name: string;
        url: string;
    };
}

interface Ability {
    name: string;
    url: string;
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

    readonly stats: Stat[];
    readonly abilities: Ability[];

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

        this.abilities = apiData.abilities.map(ability => ability.ability);

        this.stats = apiData.stats.map(stat => {
            return {
                base: stat.base_stat,
                effort: stat.effort,
                stat: stat.stat
            } as Stat;
        });

        this.tags = apiData.types.map(type => {
            return type.type;
        });

    }

}
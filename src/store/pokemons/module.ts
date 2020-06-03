import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { PokemonsSpeciesList } from '@/classes/PokemonsList';


export { getModule };

@Module({
    namespaced: true,
    name: 'pokemons'
})
export class PokemonsModule extends VuexModule {
    private pokemonsList = new PokemonsSpeciesList();

    public get pokemonsUrls(): Array<string> {
        return this.pokemonsList.selectedPokemonsUrls;
    }

    public get pageAmount(): number {
        return this.pokemonsList.pageAmount;
    }

    public get currentPage(): number {
        return this.pokemonsList.currentPage;
    }

    @Mutation
    private mSetSearch(search: string | null) {
        this.pokemonsList.setSearch(search);
    }

    @Mutation
    private mSetFilters(filters: Record<string, Array<string>> | null) {
        this.pokemonsList.setFilters(filters);
    }

    @Mutation
    private mSetPage(page: number) {
        this.pokemonsList.setPage(page);
    }

    @Action({rawError: true})
    public setFilters(filters: Record<string, Array<string>>) {
        this.context.commit('mSetFilters', filters);
    }

    @Action({rawError: true})
    public resetFilters() {
        this.context.commit('mSetFilters', null);
    }

    @Action({rawError: true})
    public setSearch(search: string | null) {
        this.context.commit('mSetSearch', search);
    }

    @Action({rawError: true})
    public setPage(number: number) {
        this.context.commit('mSetPage', number);
    }

}

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent, compressToUint8Array } from 'lz-string';

const name = 'favorites';

export class FavoritesStore {
    public setInFavorites(pokemonName: string): void {
        if (!localStorage.getItem(name))
            localStorage.setItem(name, JSON.stringify([]));
        const storage = JSON.parse(localStorage.getItem(name)!) as Array<string>;
        storage.includes(pokemonName) ? storage.splice(storage.indexOf(pokemonName, 0), 1) : storage.push(pokemonName);
        return;
    }

    public get favoritesUrl(): string {
        if (!localStorage.getItem(name))
            localStorage.setItem(name, JSON.stringify([]));
        return compressToEncodedURIComponent(localStorage.getItem(name)!);
    }

    public get pokemonsArray(): Array<string> {
        if (!localStorage.getItem(name))
            localStorage.setItem(name, JSON.stringify([]));
        return JSON.parse(localStorage.getItem(name)!);
    }

    public static getFromCompressedArray(compressedArray: string): Array<string> {
        const array = JSON.parse(decompressFromEncodedURIComponent(compressedArray));
        if (!(array instanceof Array))
            throw new Error('Passed string is not an array!');
        return array;
    }
}
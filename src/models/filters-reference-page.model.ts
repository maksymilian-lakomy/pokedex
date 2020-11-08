export namespace FiltersReferencePage {
  export const availableFilters: ReadonlyArray<string> = [
    'color',
    'habitat',
    'shape',
  ];

  export interface FilterReference {
    name: string;
    url: string;
  }

  export interface FiltersReferencePage {
    count: number;
    next?: any;
    previous?: any;
    results: FilterReference[];
  }
}

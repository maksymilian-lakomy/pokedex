export namespace FiltersReferencePage {
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

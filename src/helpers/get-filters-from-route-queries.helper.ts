import { Route } from 'vue-router';

import { PokemonsFilterService } from '@/services';

type Filters = Map<string, string[]>;

export const getFiltersFromRouteQueries = (route: Route): Filters => {
  const queriedFilters = Object.keys(route.query).filter((query) =>
    PokemonsFilterService.availableFilters.includes(query)
  );

  const filtersMap: Filters = new Map();

  queriedFilters.forEach((filter) => {
    const nullableValues = route.query[filter];
    let values: string[];
    if (nullableValues instanceof Array) {
      values = nullableValues.filter((value) => value !== null) as string[];
    } else {
      values = [nullableValues];
    }
    filtersMap.set(filter, values);
  });

  return filtersMap;
};

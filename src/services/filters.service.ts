import { AxiosResponse } from 'axios';

import { FiltersReferencePage } from '@/models';
import { service } from './base.service';

export namespace FiltersService {
  type FilterReferencePage = FiltersReferencePage.FiltersReferencePage;

  export const getFilters = async (
    filterType: string
  ): Promise<AxiosResponse<FilterReferencePage>> => {
    const response: AxiosResponse<FilterReferencePage> = await service.get(
      `pokemon-${filterType}`
    );

    return response;
  };
}

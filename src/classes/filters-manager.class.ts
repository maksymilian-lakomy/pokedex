import { FiltersReferencePage } from '@/models';
import { FiltersService } from '@/services/filters.service';

const availableFilters = FiltersReferencePage.availableFilters;

export class FiltersManager {
  public async getFilters(): Promise<Map<string, string[]>> {
    const promises = availableFilters.map((filter) => {
      return FiltersService.getFilters(filter);
    });

    const responses = await Promise.all(promises);
    const result = new Map<string, string[]>();

    responses.forEach((response, i) => {
      result.set(
        availableFilters[i],
        response.data.results.map((filter) => filter.name)
      );
    });

    return result;
  }
}

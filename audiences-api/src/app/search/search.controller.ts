import {
  AddSingleWordsPipe,
  ArrayRemoveDuplicatesPipe,
  ControllerDecoratorWithGuardsAndSwagger,
  TrimEachElementPipe,
} from '@instigo-app/api-shared';
import { DefaultValuePipe, Get, Inject, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SearchResult } from '../shared/model';
import { SearchService } from './search.service';

@ControllerDecoratorWithGuardsAndSwagger({ resource: 'search', useGuards: false })
export class SearchController {
  @Inject(SearchService)
  private readonly searchService: SearchService;

  @ApiResponse({
    status: 200,
    description: 'Search audiences',
    type: String,
    isArray: true,
  })
  @Get()
  searchByKeywords(
    @Query(
      'keywords',
      new DefaultValuePipe([]),
      ParseArrayPipe,
      ArrayRemoveDuplicatesPipe,
      TrimEachElementPipe,
      AddSingleWordsPipe,
    )
    keywords: string[],
    @Query('id', new DefaultValuePipe([]), ParseArrayPipe, ArrayRemoveDuplicatesPipe, TrimEachElementPipe)
    ids: string[],
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SearchResult[]> {
    if (ids.length) {
      return this.searchService.searchByIds({ ids });
    }
    return this.searchService.searchByKeywords({ keywords, offset });
  }

  @ApiResponse({
    status: 200,
    description: 'segment auto complete',
    type: String,
  })
  @Get('/segment_auto_complete')
  segmentAutoComplete(
    @Query(
      'keywords',
      new DefaultValuePipe(null),
      ParseArrayPipe,
      ArrayRemoveDuplicatesPipe,
      TrimEachElementPipe,
      AddSingleWordsPipe,
    )
    keywords: string | string[],
    @Query('limit', ParseIntPipe, new DefaultValuePipe(5)) limit: number,
  ): Promise<{ id: string; name: string }[]> {
    return this.searchService.segmentAutoComplete({ keywords, limit });
  }

  @ApiResponse({
    status: 200,
    description: 'Get keywords suggestions based on selected keywords',
    type: String,
    isArray: true,
  })
  @Get('/keywords-suggestions')
  async keywordsSuggestions(
    @Query(
      'keywords',
      new DefaultValuePipe([]),
      ParseArrayPipe,
      ArrayRemoveDuplicatesPipe,
      TrimEachElementPipe,
      AddSingleWordsPipe,
    )
    keywords: string[],
    @Query('id', new DefaultValuePipe([]), ParseArrayPipe, ArrayRemoveDuplicatesPipe, TrimEachElementPipe)
    ids: string[],
  ): Promise<string[]> {
    return await this.searchService.keywordsSuggestions(keywords, ids);
  }
}

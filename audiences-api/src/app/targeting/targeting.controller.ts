import { ControllerDecoratorWithGuardsAndSwagger, CurrentUser, ParseJSONPipe } from '@instigo-app/api-shared';
import {
  AdAccountDTO,
  AdSetDTO,
  BrowseOutput,
  CampaignDTO,
  FacebookTargetingOptionStatus,
  InstigoTargetingTypes,
  ReachOutputDto,
  SearchOutputDto,
  SupportedProviders,
  TargetingConditionDto,
  TargetingDto,
} from '@instigo-app/data-transfer-object';
import { Body, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { User, UserTargetings } from '@prisma/client';
import { TargetingService } from './targeting.service';
import { TargetingExportService } from './targeting-export/targeting-export.service';
import { CurrentAccessTokenPipe } from '@audiences-api/prisma/current-user-accesstoken.pipe';

@ControllerDecoratorWithGuardsAndSwagger({ resource: 'targeting' })
export class TargetingController {
  @Inject(TargetingService)
  private readonly targetingService: TargetingService;

  @Inject(TargetingExportService)
  private readonly targetingExportService: TargetingExportService;

  @ApiResponse({
    status: 200,
    description: 'Search targeting criteria given a provider',
    type: SearchOutputDto,
    isArray: true,
  })
  @Get('search')
  search(
    @CurrentUser(CurrentAccessTokenPipe) accessToken: string,
    @Query('provider') provider: SupportedProviders,
    @Query('adAccountProviderId') adAccountProviderId: string,
    @Query('searchQuery') searchQuery?: string,
    @Query('type') type?: InstigoTargetingTypes,
    @Query('providerSubType') providerSubType?: string,
  ): Promise<SearchOutputDto[]> {
    return this.targetingService.search({
      adAccountProviderId,
      provider,
      providerSubType,
      accessToken,
      searchQuery,
      type,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'get suggestions based on the current selection',
    isArray: true,
  })
  @Put('suggestions/:adAccountProviderId')
  suggestions(
    @Param('adAccountProviderId') adAccountProviderId: string,
    @Body('targeting') selected: TargetingConditionDto[],
    @CurrentUser(CurrentAccessTokenPipe) accessToken: string,
  ): Promise<SearchOutputDto[]> {
    return this.targetingService.suggestions({ accessToken, selected, adAccountProviderId });
  }

  @ApiResponse({
    status: 200,
    description: 'Get audience reach estimation from the targeting, given a provider',
  })
  @Post('reach/:adAccountProviderId')
  reach(
    @Param('adAccountProviderId') adAccountProviderId: string,
    @Body('targeting') targeting: TargetingDto,
    @CurrentUser(CurrentAccessTokenPipe) accessToken: string,
  ): Promise<ReachOutputDto> {
    return this.targetingService.reach({
      targeting,
      accessToken,
      adAccountProviderId,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Get targeting status',
  })
  @Post('targeting-status/:adAccountProviderId')
  targetingStatus(
    @Param('adAccountProviderId') adAccountProviderId: string,
    @Body('targeting') targeting: TargetingDto,
    @CurrentUser(CurrentAccessTokenPipe) accessToken: string,
  ): Promise<FacebookTargetingOptionStatus[]> {
    return this.targetingService.getSegmentsTargetingStatus({
      targeting,
      accessToken,
      adAccountProviderId,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Get the targeting tree with possible types and entities, given a provider',
  })
  @Get('browse/:adAccountProviderId')
  browse(
    @CurrentUser(CurrentAccessTokenPipe) accessToken: string,
    @Param('adAccountProviderId') adAccountProviderId: string,
    @Query('limitTypes', ParseJSONPipe) limitTypes?: InstigoTargetingTypes[],
  ): Promise<BrowseOutput> {
    return this.targetingService.browse({ accessToken, adAccountProviderId, limitTypes });
  }

  @ApiResponse({
    status: 201,
    description: 'save user targeting',
  })
  @Post('save')
  saveUserTargeting(
    @CurrentUser() user: Partial<User>,
    @Body('targeting') targeting: TargetingDto,
    @Body('userTags') userTags: string[],
    @Body('name') name: string,
  ): Promise<UserTargetings> {
    return this.targetingService.saveUserTargeting({ user, targeting, userTags, name });
  }

  @Post('save_and_export')
  async saveAndExportToFacebook(
    @CurrentUser() user: Partial<User>,
    @CurrentUser(CurrentAccessTokenPipe) accessToken: string,
    @Body('adAccount') adAccount: AdAccountDTO,
    @Body('targeting') targeting: TargetingDto,
    @Body('userTags') userTags: string[],
    @Body('name') name: string,
  ): Promise<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }> {
    await this.targetingService.saveUserTargeting({ user, targeting, userTags, name });
    return await this.targetingExportService.facebookExport(targeting, adAccount, accessToken, name);
  }
}

import { pMap, TargetingHelperService } from '@instigo-app/api-shared';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { LdaTopic, SearchResult, Segment } from '../shared/model';
import { SaveFacebookAudienceEvent, SAVE_FACEBOOK_AUDIENCE } from '../targeting/targeting.service';
@Injectable()
export class SearchFallBackService {
  @Inject(TargetingHelperService)
  private readonly targetingHelperService: TargetingHelperService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async facebookFallback(options: { keywords: string[]; lowestRank: number }): Promise<SearchResult[]> {
    const { keywords, lowestRank = 0.5 } = options;
    const interests: any[] = await pMap(keywords, (keyword) => this.facebookSearch({ keyword }));
    if (interests.length === 0) {
      throw new Error('No interests found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const id = uuidv4() as string;
    const fallback = {
      id,
      spec: {
        id,
        name: `FACEBOOK GENERATED`,
        targeting: {
          flexible_spec: [
            {
              interests: interests.map((interest: Segment) => ({
                id: interest.id,
                name: interest.name,
                path: interest.path,
                size: (Number(interest.audience_size_lower_bound) + Number(interest.audience_size_upper_bound)) / 2,
                type: interest.path[0],
                topic: interest.topic,
              })) as unknown as Segment[],
            },
          ],
        },
      },
      topics: this.extractTopics(interests),
      rank: lowestRank,
    };
    this.eventEmitter.emit(SAVE_FACEBOOK_AUDIENCE, new SaveFacebookAudienceEvent({ audience: fallback }));
    return [fallback];
  }

  private extractTopics(interests: Segment[]): string[] {
    const ldaTopics: LdaTopic[] = this.targetingHelperService.getLdaTopics(
      interests.map((interest: { name: string }) => interest.name),
    );
    return ldaTopics?.map((topic) => topic.term) || [];
  }

  private async facebookSearch(options: { keyword: string }): Promise<Segment[]> {
    const { keyword } = options;
    const appToken = this.configService.get<string>('APP_TOKEN');
    return await this.httpService
      .get(`https://graph.facebook.com/v14.0/search?type=adinterest&q=${keyword}&access_token=${appToken}`)
      .pipe(map((res: AxiosResponse<{ data: Segment[] }>) => res.data?.data || []))
      .toPromise();
  }
}

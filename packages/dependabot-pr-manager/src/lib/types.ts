import { RestEndpointMethodTypes } from '@octokit/rest';

export type PullRequest =
  RestEndpointMethodTypes['pulls']['list']['response']['data'];

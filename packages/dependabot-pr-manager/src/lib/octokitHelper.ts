import { Octokit } from '@octokit/rest';

export const octokitFactory = (auth: string) => new Octokit({ auth });

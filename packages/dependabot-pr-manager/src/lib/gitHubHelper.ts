import { Octokit } from '@octokit/rest';
import { colors } from './colors';

interface GitHubHelperOptions {
  token: string;
  owner: string;
  repo: string;
}

export class GitHubHelper {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(options: GitHubHelperOptions) {
    this.octokit = new Octokit({ auth: options.token });
    this.owner = options.owner;
    this.repo = options.repo;
  }

  async getDependabotPRs() {
    console.log(
      `${colors.blue}Fetching open Dependabot pull requests...${colors.reset}`
    );
    const { data: pullRequests } = await this.octokit.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: 'open',
    });

    const dependabotPRs = pullRequests.filter(
      (pr) => pr.user !== null && pr.user.login === 'dependabot[bot]'
    );
    console.log(
      `${colors.green}Found ${dependabotPRs.length} Dependabot pull requests. 🤖 ${colors.reset}`
    );
    return dependabotPRs;
  }

  async closeDependabotPRs(prs: any[]) {
    console.log(
      `${colors.blue}Closing Dependabot pull requests...${colors.reset}`
    );

    for (const pr of prs) {
      await this.octokit.pulls.update({
        owner: this.owner,
        repo: this.repo,
        pull_number: pr.number,
        state: 'closed',
      });
      console.log(
        `${colors.yellow}Closed PR #${pr.number}: ${pr.title}${colors.reset}`
      );
    }

    console.log(
      `${colors.green}All Dependabot pull requests have been closed.${colors.reset}`
    );
  }

  async mergeDependabotPRs(prs: any[]) {
    console.log(
      `${colors.blue}Merging Dependabot pull requests...${colors.reset}`
    );

    for (const pr of prs) {
      await this.octokit.pulls.merge({
        owner: this.owner,
        repo: this.repo,
        pull_number: pr.number,
      });
      console.log(
        `${colors.yellow}Merged PR #${pr.number}: ${pr.title}${colors.reset}`
      );
    }

    console.log(
      `${colors.green}All Dependabot pull requests have been merged.${colors.reset}`
    );
  }
}

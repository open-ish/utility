#!/usr/bin/env node

import { argv } from './args';
import { consoleHelper } from '../consoleHelper';
import { octokitFactory } from '../octokitHelper';
import { getDependabotPRs } from '../getDependabotPrs';
import { PullRequest } from '../types';

const GITHUB_TOKEN = argv.githubToken;
const REPO_OWNER = argv.repoOwner;
const REPO_NAME = argv.repoName;

const octokit = octokitFactory(GITHUB_TOKEN);

export async function closeDependabotPRs(prs: PullRequest) {
  consoleHelper(`Closing Dependabot pull requests...`, 'blue');

  for (const pr of prs) {
    await octokit.pulls.update({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: pr.number,
      state: 'closed',
    });
    consoleHelper(`Closed PR #[${pr.title}](${pr.html_url})`, 'yellow');
  }

  consoleHelper(`All Dependabot pull requests have been closed.`, 'green');
}

export async function main() {
  consoleHelper('Starting the process...', 'blue');
  const dependabotPRs = await getDependabotPRs({
    octokit,
    REPO_OWNER,
    REPO_NAME,
  });

  if (dependabotPRs.length === 0) {
    consoleHelper(
      'No open Dependabot pull requests found. Exiting...',
      'green',
    );
    return;
  }

  consoleHelper(
    `Found ${dependabotPRs.length} Dependabot pull requests. 🤖`,
    'green',
  );

  dependabotPRs.forEach((pr) => {
    consoleHelper(`PR #[${pr.title}](${pr.html_url})`, 'yellow');
  });

  await closeDependabotPRs(dependabotPRs);
}

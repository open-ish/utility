#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('githubToken', {
    alias: 't',
    description: 'GitHub token',
    type: 'string',
    demandOption: true,
  })
  .option('repoOwner', {
    alias: 'o',
    description: 'Repository owner',
    type: 'string',
    demandOption: true,
  })
  .option('repoName', {
    alias: 'n',
    description: 'Repository name',
    type: 'string',
    demandOption: true,
  }).argv;

const GITHUB_TOKEN = argv.githubToken;
const REPO_OWNER = argv.repoOwner;
const REPO_NAME = argv.repoName;

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Fetch open Dependabot pull requests
async function getDependabotPRs() {
  console.log(
    `${colors.blue}Fetching open Dependabot pull requests...${colors.reset}`
  );
  const { data: pullRequests } = await octokit.pulls.list({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    state: 'open',
  });

  const dependabotPRs = pullRequests.filter(
    (pr) => pr.user.login === 'dependabot[bot]'
  );

  console.log(
    `${colors.green}Found ${dependabotPRs.length} Dependabot pull requests. 🤖 ${colors.reset}`
  );
  dependabotPRs.forEach((pr) => {
    console.log(`${colors.yellow}[${pr.title}](${pr.html_url})${colors.reset}`);
  });

  return dependabotPRs;
}

// Close Dependabot pull requests
async function closeDependabotPRs(prs) {
  console.log(
    `${colors.blue}Closing Dependabot pull requests...${colors.reset}`
  );

  for (const pr of prs) {
    await octokit.pulls.update({
      owner: REPO_OWNER,
      repo: REPO_NAME,
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

async function main() {
  console.log(`${colors.blue}Starting the process...${colors.reset}`);
  const dependabotPRs = await getDependabotPRs();

  if (dependabotPRs.length === 0) {
    console.log(
      `${colors.green}No open Dependabot pull requests found.${colors.reset}`
    );
    return;
  }

  await closeDependabotPRs(dependabotPRs);
}

main().catch((error) => {
  if (error.message.includes('@octokit/rest')) {
    console.error(
      `${colors.red}Please install @octokit/rest package as DevDependencies.${colors.reset}`
    );
    process.exit;
  }

  console.error(`${colors.red}${error}${colors.reset}`);
  process.exit(1);
});

#!/usr/bin/env node

import { execSync } from 'child_process';
import { RestEndpointMethodTypes } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

import { argv } from './args';
import { consoleHelper } from '../consoleHelper';
import { octokitFactory } from '../octokitHelper';

const REPO_URL = argv.repoUrl;
const COMBINED_BRANCH = argv.combinedBranch;
const MAIN_BRANCH = argv.mainBranch;
const GITHUB_TOKEN = argv.githubToken;
const REPO_OWNER = argv.repoOwner;
const REPO_NAME = argv.repoName;
const INSTALL_DEPS_COMMAND = argv.installDepsCommand;
const FILES_TO_COMMIT = argv.filesToCommit;

const octokit = octokitFactory(GITHUB_TOKEN);

type PullRequest = RestEndpointMethodTypes['pulls']['list']['response']['data'];

export async function getDependabotPRs(): Promise<PullRequest> {
  consoleHelper(`Fetching open Dependabot pull requests...`, 'blue');
  const { data: pullRequests } = await octokit.pulls.list({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    state: 'open',
  });

  const dependabotPRs = pullRequests.filter(
    (pr) => pr.user && pr.user.login === 'dependabot[bot]',
  );
  consoleHelper(
    `Found ${dependabotPRs.length} Dependabot pull requests. 🤖`,
    'green',
  );
  return dependabotPRs;
}

export async function extractDependencies(
  prs: PullRequest,
): Promise<Record<string, string>> {
  consoleHelper(
    'Extracting dependencies from Dependabot pull requests...',
    'blue',
  );
  const dependencies: Record<string, string> = {};

  const filePromises = prs.map((pr) =>
    octokit.pulls.listFiles({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: pr.number,
    }),
  );

  const filesArray = await Promise.all(filePromises);

  filesArray.flat().forEach(({ data: files }) => {
    files
      .filter((file) => file.filename === 'package.json')
      .forEach((file) => {
        if (!file.patch) return;
        const lines = file.patch.split('\n');
        lines.forEach((line) => {
          const match = line.match(/^\+\s+"([^"]+)":\s+"([^"]+)",?$/);
          if (match) {
            const [, name, version] = match;
            dependencies[name] = version;
          }
        });
      });
  });

  consoleHelper('Dependencies extracted successfully.', 'green');
  return dependencies;
}

export function updatePackageJson(dependencies: Record<string, string>): void {
  consoleHelper('Updating package.json with new dependencies...', 'blue');
  const packageJsonPath = path.resolve('package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  for (const [name, version] of Object.entries(dependencies)) {
    consoleHelper(`Updating ${name} to ${version}`, 'yellow');
    if (packageJson.dependencies && packageJson.dependencies[name]) {
      packageJson.dependencies[name] = version;
    } else if (
      packageJson.devDependencies &&
      packageJson.devDependencies[name]
    ) {
      packageJson.devDependencies[name] = version;
    }
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  consoleHelper('package.json updated successfully.', 'green');
}

export async function main(): Promise<void> {
  consoleHelper('Starting the process...', 'blue');
  const repoName = path.basename(REPO_URL, '.git');
  const dependabotPRs: PullRequest = await getDependabotPRs();

  if (Object.keys(dependabotPRs).length === 0) {
    consoleHelper('No Dependabot PR to update. Exiting...', 'yellow');
    return;
  }

  const dependencies = await extractDependencies(dependabotPRs);

  updatePackageJson(dependencies);

  consoleHelper('Installing new dependencies...', 'blue');
  execSync(INSTALL_DEPS_COMMAND);

  consoleHelper('Creating new branch', 'blue');
  execSync(`git checkout -b ${COMBINED_BRANCH}`);

  consoleHelper('Committing and pushing changes...', 'blue');
  execSync(`git add ${FILES_TO_COMMIT}`);
  execSync('git commit -m "ci: combined dependabot updates" -n');
  execSync(`git push origin ${COMBINED_BRANCH}`);

  consoleHelper('Creating pull request', 'blue');
  const dependenciesList = Object.entries(dependencies)
    .map(([name, version]) => `- **${name}**: ${version}`)
    .join('\n');

  const prBody = `This pull request combines all Dependabot updates for this month.\n\n### Updated Dependencies:\n${dependenciesList}`;
  const { data: pr } = await octokit.pulls.create({
    headers: {
      authorization: `token ${GITHUB_TOKEN}`,
    },
    owner: REPO_OWNER,
    repo: repoName,
    title: 'ci: update dependencies by dependabot-pr-manager',
    head: COMBINED_BRANCH,
    base: MAIN_BRANCH,
    body: prBody,
  });

  consoleHelper(`Pull request created: ${pr.html_url}`, 'green');
}

#!/usr/bin/env node

import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('repoUrl', {
    alias: 'r',
    description: 'Repository URL',
    type: 'string',
    demandOption: true,
  })
  .option('combinedBranch', {
    alias: 'c',
    description: 'Combined branch name',
    type: 'string',
    demandOption: true,
  })
  .option('mainBranch', {
    alias: 'm',
    description: 'Main branch name',
    type: 'string',
    demandOption: true,
  })
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
  })
  .option('installDepsCommand', {
    alias: 'i',
    description: 'Command to install dependencies - default is yarn install',
    type: 'string',
    default: 'yarn install',
    demandOption: false,
  }).argv;

const REPO_URL = argv.repoUrl;
const COMBINED_BRANCH = argv.combinedBranch;
const MAIN_BRANCH = argv.mainBranch;
const GITHUB_TOKEN = argv.githubToken;
const REPO_OWNER = argv.repoOwner;
const REPO_NAME = argv.repoName;
const INSTALL_DEPS_COMMAND = argv.installDepsCommand;

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const octokit = new Octokit({ auth: GITHUB_TOKEN });

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
  return dependabotPRs;
}

async function extractDependencies(prs) {
  console.log(
    `${colors.blue}Extracting dependencies from Dependabot pull requests...${colors.reset}`
  );
  const dependencies = {};

  const filePromises = prs.map((pr) =>
    octokit.pulls.listFiles({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: pr.number,
    })
  );

  const filesArray = await Promise.all(filePromises);

  filesArray.flat().forEach(({ data: files }) => {
    files
      .filter((file) => file.filename === 'package.json')
      .forEach((file) => {
        const lines = file.patch.split('\n');
        lines.forEach((line) => {
          const match = line.match(/^\+\s+"([^"]+)":\s+"([^"]+)",?$/);
          if (match) {
            const [_, name, version] = match;
            dependencies[name] = version;
          }
        });
      });
  });

  console.log(
    `${colors.green}Dependencies extracted successfully.${colors.reset}`
  );
  return dependencies;
}

function updatePackageJson(dependencies) {
  console.log(
    `${colors.blue}Updating package.json with new dependencies...${colors.reset}`
  );
  const packageJsonPath = path.resolve('package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  for (const [name, version] of Object.entries(dependencies)) {
    console.log(
      `${colors.yellow}Updating ${name} to ${version}${colors.reset}`
    );
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
  console.log(
    `${colors.green}package.json updated successfully.${colors.reset}`
  );
}

async function main() {
  console.log(`${colors.blue}Starting the process...${colors.reset}`);
  const repoName = path.basename(REPO_URL, '.git');
  const dependabotPRs = await getDependabotPRs();
  const dependencies = await extractDependencies(dependabotPRs);

  if (Object.keys(dependencies).length === 0) {
    console.log(
      `${colors.yellow}No dependencies to update. Exiting...${colors.reset}`
    );
    return;
  }

  updatePackageJson(dependencies);
  console.log(`${colors.blue}Installing new dependencies...${colors.reset}`);
  execSync(INSTALL_DEPS_COMMAND);
  console.log(
    `${colors.blue}Creating new branch ${COMBINED_BRANCH}...${colors.reset}`
  );
  execSync(`git checkout -b ${COMBINED_BRANCH}`);

  console.log(`${colors.blue}Committing and pushing changes...${colors.reset}`);
  execSync('git add .');
  execSync('git commit -m "ci: combined dependabot updates" -n');
  execSync(`git push origin ${COMBINED_BRANCH}`);

  console.log(`${colors.blue}Creating pull request...${colors.reset}`);
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

  console.log(
    `${colors.green}Pull request created: ${pr.html_url}${colors.reset}`
  );
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

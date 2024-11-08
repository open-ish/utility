import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Args {
  repoUrl: string;
  combinedBranch: string;
  mainBranch: string;
  githubToken: string;
  repoOwner: string;
  repoName: string;
  installDepsCommand: string;
  filesToCommit: string;
}

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
  })
  .option('filesToCommit', {
    alias: 'fc',
    description: 'files to be committed',
    type: 'string',
    default: 'package.json yarn.lock',
    demandOption: false,
  }).argv as Args;

export { argv };

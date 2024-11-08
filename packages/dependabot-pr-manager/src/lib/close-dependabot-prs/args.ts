import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Args {
  githubToken: string;
  repoOwner: string;
  repoName: string;
}

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
  }).argv as Args;

export { argv };

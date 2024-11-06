# dependabot-pr-manager

## Installation

Install it on devDependencies. Ex:

```bash
npm i dependabot-pr-manager -D
```

## Motivation

`dependabot-pr-manager` is a utility to manage dependabot PRs. It groups DependaBot PRs on the repository and creates a PR with the updated dependencies. It is useful when you have multiple dependabot PRs and you want to merge them all at once.

### What does it do?

dependabot-pr-manager has two main scripts: `merge-dependabot-pr` and `close-dependabot-prs`.

- the `merge-dependabot-prs` groups all Dependabot PRs into a single PR. So, it do not merge it automatically, giving you the opportunity to review/update the changes before merging.
- the `close-dependabot-prs` close all Dependabot prs

See the [How to Use](#how-to-use) section for more information on how to use the `dependabot-pr-manager` library in your CI pipeline.

## How to Use

You can use the `dependabot-pr-manager` library in your CI pipeline to automatically manage and merge Dependabot PRs. Below is an example of how to set up a GitHub Action to run the `dependabot-pr-manager` script on the second day of every month and allow manual triggering via a GitHub button. Additionally, it includes a job to close the Dependabot PRs when the created PR is commented with "[dependabot-pr-manager] close prs".

file example: .github/workflows/dependabot-pr-manager.yml

```yaml
name: Merge and Close Dependabot PRs

on:
  schedule:
    - cron: '0 0 2 * *' # Runs at 00:00 on the 2nd day of every month, so if your dependabot runs monthly in the first day, all PRs will be merged on the second day. Change to fit your needs.
  workflow_dispatch: # Allows manual triggering via GitHub button
  issue_comment:
    types: [created]

jobs:
  merge-dependabot-prs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run merge-dependabot-prs
        run: |
          npx merge-dependabot-prs \
            --repoUrl=https://github.com/open-ish/utility.git \
            --combinedBranch=ci/combined-dependabot-update \
            --mainBranch=main \
            --githubToken=${{ secrets.YOUR_GIT_HUB_TOKEN }} \
            --repoOwner=open-ish \
            --repoName=utility

  close-dependabot-prs:
    if: github.event.issue.pull_request && contains(github.event.comment.body, '[dependabot-pr-manager] close prs')
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run close-dependabot-prs
        run: |
          npx close-dependabot-prs \
            --repoUrl=https://github.com/open-ish/utility.git \
            --githubToken=${{ secrets.YOUR_GIT_HUB_TOKEN }} \
            --repoOwner=open-ish \
            --repoName=utility
```

- merge-dependabot-prs Job: This job runs the merge-dependabot-prs script to group and merge Dependabot PRs.
- close-dependabot-prs Job: This job runs the close-dependabot-prs script to close the Dependabot PRs when the pull request created from dependabot-pr-manager be commented with `'[dependabot-pr-manager] close prs'`.

## Package params

- `--repoUrl`(required): The repository URL;
- `--combinedBranch`(required): The branch that will be created with the combined PRs;
- `--mainBranch`(required): The main branch of the repository;
- `--githubToken`(required): The GitHub token;
- `--repoOwner`(required): The repository owner;
- `--repoName`(required): The repository name;
- `installDepsCommand`: The command to install the dependencies. Default: `yarn install`

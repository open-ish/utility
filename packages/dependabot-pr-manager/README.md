# dependabot-pr-manager

This package is in BETA. Please, report any issues you find.

## Installation

Install it on devDependencies. Ex:

```bash
npm i dependabot-pr-manager --save-dev
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
    - cron: '0 9 * * 1' # Runs at 09am (UTC) on the 1nd day of every month (useful if your dependabot runs monthly in the first day at 08am). Change to fit your needs.
  workflow_dispatch: # Allows manual triggering via GitHub button
  issue_comment:
    types: [created]

jobs:
  merge-dependabot-prs:
    if: github.event_name == 'workflow_dispatch' || github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install Yarn
        run: npm install -g yarn

      - name: Install dependencies
        run: yarn install

      - name: Set up Git
        run: |
          git config --global user.name "dependabot[bot]" # change to it be the user that will merge the PRs 
          git config --global user.email "49699333+dependabot[bot]@users.noreply.github.com" # change to it be the user that will merge the PRs

      - name: Run merge-dependabot-prs
        run: |
          npx merge-dependabot-prs \
            --repoUrl=https://github.com/open-ish/utility.git \
            --combinedBranch=ci/combined-dependabot-updates \
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
          node-version: '18'

      - name: Install Yarn
        run: npm install -g yarn

      - name: Install dependencies
        run: yarn install

      - name: Run close-dependabot-prs
        run: |
          npx close-dependabot-prs \
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

## Examples

[See this PR example](https://github.com/open-ish/utility/pull/63)

![The PR](https://github.com/user-attachments/assets/65b88b81-6eee-41ce-bd18-30353f73ec7b)

- Grouping Dependabot PRs

![Grouping Dependabot PRs](https://github.com/user-attachments/assets/a6495e62-bdda-4929-b469-38d1c6c7c48e)

- Closing Dependabot PRs after comment `[dependabot-pr-manager] close prs`

![Closing Dependabot PRs](https://github.com/user-attachments/assets/f090c41d-2125-45d4-afc9-2aa7c22b9bee)

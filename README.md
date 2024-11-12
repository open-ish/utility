<div align='center'>
  <br>
  <img alt="utility" src="https://private-user-images.githubusercontent.com/47509510/385065781-e6a36538-e6f0-4706-85b2-69c3b72fc478.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzEzNjA2NjksIm5iZiI6MTczMTM2MDM2OSwicGF0aCI6Ii80NzUwOTUxMC8zODUwNjU3ODEtZTZhMzY1MzgtZTZmMC00NzA2LTg1YjItNjljM2I3MmZjNDc4LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDExMTElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMTExVDIxMjYwOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWFmYTYxZWI5ZWU4ZWYwZGRkMjQ2ODUwYjc0NzVkMzRhMmE2NGEwZDI5MzhhODU4MDhmYTk1MWQ4ZjI5ZjhlYjQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.6j3r4jAIPp5HFAJWxjl28nkVnRA4-l5MKuKEk5AW300" width="350px">
    <br>
    <br>
</div>


This project was generated as a developer's utility belt, where they might find solutions to be used independently on the system solution (business-wise) and js framework.

_Enjoy it? Don't forget to starring! ⭐_

## Project structure

It's a monorepo with npm packages, all installable independently

- **NX**: a set of extensible dev tools for monorepos, which helps us build and manage multiple projects within a single repository;
- **Typescript**: a typed superset of JavaScript that compiles to plain JavaScript, providing powerful tools for building large-scale applications;
- **Semantic-release**: semantic-release-plus is a drop in replacement for semantic release that adds some enhancements.

## Packages

- 🕸 [trycatchfy](./packages/trycatchfy/README.md): Standardize the way you try/catch HTTP request - [example](https://github.com/tassioFront/frontend-pattern/blob/main/src/hooks/useGetGHInfoByUserName/useGetGHInfoByUserName.ts#L47);
- 💾 [storagefy](./packages/storagefy/README.md): LocalStorage helper - [example](https://github.com/tassioFront/frontend-pattern/blob/main/src/helpers/useInfo.ts#L6);
- ⚡ [http-front-cache](./packages/http-front-cache/README.md): Provide a simple and efficient way to cache the results of service functions in the browser;
- 🤖 [dependabot-pr-manager](./packages/dependabot-pr-manager/README.md): manage dependabot PRs. It groups DependaBot PRs on the repository and creates a PR with the updated dependencies. It is useful when you have multiple dependabot PRs and you want to merge them all at once.

## Installing utility packages

utility's packages are available on npmjs.com, so you can install them using npm or yarn and following the anatomy `@openish-u/PACKAGE_NAME`. Ex:

```bash
npm i @openish-u/http-front-cache
```

```bash
yarn add @openish-u/storagefy
```

## Migration from utility prefix to openish-u

If you are using the old prefix `utility-PACKAGE-NAME` you can migrate to the new prefix `@openish-u/PACKAGE-NAME` safely. The packages are the same, only the prefix has changed.

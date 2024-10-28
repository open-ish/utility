# Utility

This project was generated as a developer's utility belt, where they might find solutions to be used independently on the system solution (business-wise) and js framework.

## Project structure

It's a monorepo with npm packages, all installable independently

- **NX**: a set of extensible dev tools for monorepos, which helps us build and manage multiple projects within a single repository;
- **Typescript**: a typed superset of JavaScript that compiles to plain JavaScript, providing powerful tools for building large-scale applications;
- **Semantic-release**: semantic-release-plus is a drop in replacement for semantic release that adds some enhancements.

## Packages

- [trycatchfy](./packages/trycatchfy/): Standardize the way you try/catch HTTP request - [example](https://github.com/tassioFront/frontend-pattern/blob/main/src/hooks/useGetGHInfoByUserName/useGetGHInfoByUserName.ts#L47);
- [storagefy](./packages/storagefy/): LocalStorage helper - [example](https://github.com/tassioFront/frontend-pattern/blob/main/src/helpers/useInfo.ts#L6);
- [http-front-cache](./packages/http-front-cache): Provide a simple and efficient way to cache the results of service functions in the browser;


## Installing utility packages

- create the GITHUB_TOKEN in [personal-access-tokens-classic](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-tokens-classic)
- create a `.npmrc` file in the root of the project with the following content:
```
//npm.pkg.github.com/:_authToken=GITHUB_TOKEN
@open-ish:registry=https://npm.pkg.github.com
```
- more info in [github docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- Install any package you want

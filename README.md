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

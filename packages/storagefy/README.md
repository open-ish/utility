# storagefy

LocalStorage helper

Are you reading this on `npm`? Check out the [full and updated documentation on GitHub](https://github.com/open-ish/utility/blob/564d3761148a3947f583bd8566dd547560b62f71/packages/storagefy/README.md).

```bash
npm i @openish-u/storagefy
```

## Motivation

Have you needed to create a localStorage service? I guess you have. The`storagefy` helper resolves it at once.

## How to use it

### get data

```TS
import { storageService } from 'utility-storagefy';

// JS
const data = storageService.get('myObjetct')

// TS
interface ICustomType {}
const data = storageService.get<ICustomType>('myObjetct')
```

### set data

```TS
import { storageService } from './storagefy';

// JS
const data = storageService.set('myObjetctKey', {name: 'obj'})

// TS
interface ICustomType {}
const data = storageService.set<ICustomType>('myObjetctKey', {name: 'obj'})
```

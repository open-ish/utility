# storagefy

LocalStorage helper

## Motivation

Have you needed to create a localStorage service? I guess you have. The`storagefy` helper resolves it at once.

## How to use it

### get data

```TS
import { storageService } from './storagefy';

// JS
const data = storageService.get('myObjetct')

// TS
const data = storageService.get<ICustomType>('myObjetct')
```

### set data

```TS
import { storageService } from './storagefy';

// JS
const data = storageService.set('myObjetctKey', {name: 'obj'})

// TS
const data = storageService.set<ICustomType>('myObjetctKey', {name: 'obj'})
```

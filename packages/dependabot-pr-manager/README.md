# http front cache

```bash
npm i utility-http-front-cache
```

## Motivation

1. The data to be cached is not too big.
2. The data to be cached is not sensitive.
3. The data to be cached does not change too often.
4. The cache does not need to be updated based on user navigation (e.g., caching cart data is not recommended as the user can add more products and the cache will not be updated).
5. The service parameters do not change too often (if they change too often, the cache will not be used).

## How to Use

### Example

```typescript
import { cacheOnSessionStorage } from 'utility-http-front-cache';

type Params = [string];
type Result = { data: string[] };

const fetchData: ServiceFunction<Params, Result> = async (param: string) => {
  const response = await fetch(`https://api.example.com/data?param=${param}`);
  return response.json();
};

const cachedFetchData = cacheOnSessionStorage(fetchData, 5 * 60 * 1000); // Cache for 5 minutes

// Usage
cachedFetchData('exampleParam').then((result) => {
  console.log(result);
});
```

## Another Storage

Currently, the `cacheOnSessionStorage` utility only supports [session storage as provider](https://github.com/open-ish/utility/blob/c6d98898bbc6119cd482b736f57ec897443e71de/packages/http-front-cache/src/lib/providers/session-storage.ts#L1-L8). However, it can be easily extended to support other storage mechanisms such as local storage or indexedDB by using the `cacheFactory` function.

```typescript
import { cacheFactory, ServiceFunction } from 'utility-http-front-cache';

const customProvider = {
  getItem: (key: string) => Uint8Array; // cacheFactory converts the result from serviceFunction on UInt8Array, so you can assumes that the data returned on getItem is always a UInt8Array. Example of provider here https://github.com/open-ish/utility/blob/c6d98898bbc6119cd482b736f57ec897443e71de/packages/http-front-cache/src/lib/providers/session-storage.ts#L1-L8
  setItem: (key: string, value: Uint8Array) => void;
  removeItem: (key: string) => void;
};

export const cacheOnMyCustomProvider = <TParams extends unknown[], TResult>(
  serviceFunction: ServiceFunction<TParams, TResult>,
  expire: number
): ServiceFunction<TParams, TResult> => {
  return async (...params: TParams): Promise<TResult> => {
    return cacheFactory<TParams, TResult>({
      params,
      expire,
      serviceFunction: fetchData,
      provider: customProvider,
    });
  };
};

// usage
const cachedFetchData = cacheOnMyCustomProvider(fetchData, 5 * 60 * 1000); // Cache for 5 minutes

cachedFetchData('exampleParam').then((result) => {
  console.log(result);
});


```

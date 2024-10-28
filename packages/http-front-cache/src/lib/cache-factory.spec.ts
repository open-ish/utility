import { cacheFactory } from './cache-factory';
import { Provider } from './types';
import pako from 'pako';
import hash from 'object-hash';

const defaultResponse = { data: [{ name: 'test', value: 'test' }] };
const defaultParams = { param: 'test' };
const defaultHashedParams = hash([defaultParams]);

const mockServiceFunction = jest.fn(async (param: any) => {
  return defaultResponse;
});

const expireTime = 5 * 60 * 1000;

const provider: Record<string, string> = {};

const mockProvider: Provider = {
  getItem: (key) => JSON.stringify(provider[key]) || null,
  setItem: (key, value) => {
    // @ts-ignore
    provider[key] = value;
  },
  removeItem: (key) => {
    delete provider[key];
  },
  //@ts-ignore
  clear: () => {
    Object.keys(provider).forEach((key) => {
      delete provider[key];
    });
  },
};

const cachedServiceFunction = (params: any) => {
  return cacheFactory({
    params: [params],
    expire: expireTime,
    serviceFunction: mockServiceFunction,
    provider: mockProvider,
  });
};

describe('cacheFactory', () => {
  beforeEach(() => {
    // @ts-ignore
    mockProvider.clear();
    jest.clearAllMocks();
  });

  it('should call the service function and cache the result', async () => {
    const result = await cachedServiceFunction(defaultParams);

    expect(result).toEqual(defaultResponse);
    expect(mockServiceFunction).toHaveBeenCalledTimes(1);

    const cachedEntry = mockProvider.getItem(defaultHashedParams);
    expect(cachedEntry).not.toBeNull();

    const decompressedEntry = pako.inflate(JSON.parse(cachedEntry as string), {
      to: 'string',
    });
    const entry = JSON.parse(decompressedEntry);
    expect(entry.data).toEqual(defaultResponse);
  });

  it('should call the service function again if the cache has expired and remove the data from the provider', async () => {
    await cachedServiceFunction(defaultParams);

    const cachedEntry = mockProvider.getItem(defaultHashedParams) as string;
    const decompressedEntry = pako.inflate(JSON.parse(cachedEntry), {
      to: 'string',
    });
    const entry = JSON.parse(decompressedEntry);

    // forcing the cache to expire
    entry.timestamp -= expireTime + 1;
    const expiredCompressedEntry = pako.deflate(JSON.stringify(entry));
    mockProvider.setItem(defaultHashedParams, expiredCompressedEntry);

    const result = await cachedServiceFunction(defaultParams);
    expect(result).toEqual(defaultResponse);
    expect(mockServiceFunction).toHaveBeenCalledTimes(2);
    expect(mockProvider.getItem(defaultHashedParams)).not.toBeNull();
  });

  it('should not set data in the cache if the service function throws an error', async () => {
    mockServiceFunction.mockImplementationOnce(async () => {
      throw new Error('Error');
    });
    let errorMessage = '';

    try {
      await cachedServiceFunction(defaultParams);
    } catch (e) {
      errorMessage = (e as Error).message;
    }

    expect(mockServiceFunction).toHaveBeenCalledTimes(1);
    expect(errorMessage).toBe('Error');
    expect(mockProvider.getItem(defaultHashedParams)).toBeNull();
  });
});

import { storageService } from './storagefy';

const fakeData: { [key: string]: any } = {
  object: { test: 'test', name: 'obj' },
  boolean: true,
  string: 'test',
};

const localStorageMock = (() => {
  return {
    getItem(key: string) {
      return fakeData[key as keyof typeof fakeData];
    },
    setItem(key: string, value: any) {
      fakeData[key] = value;
    },
    removeItem(key: string) {
      delete fakeData[key];
    },
    clear: jest.fn(),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('storagefy', () => {
  const THERE_IS_NOT_AT_STORAGE = 'not-exist';
  const OBJECT_TYPE = 'object';
  const STRING_TYPE = 'string';
  const BOOLEAN_TYPE = 'boolean';
  it('get - should return data from local storage', () => {
    expect(storageService.get(THERE_IS_NOT_AT_STORAGE)).toBe(undefined);
    expect(storageService.get<object>(OBJECT_TYPE)).toEqual(
      fakeData[OBJECT_TYPE]
    );
    expect(storageService.get<string>(STRING_TYPE)).toEqual(
      fakeData[STRING_TYPE]
    );
    expect(storageService.get<boolean>(BOOLEAN_TYPE)).toEqual(
      fakeData[BOOLEAN_TYPE]
    );
  });
  it('set - should set data at local storage', () => {
    storageService.set<object>(OBJECT_TYPE, { test: 'other' });
    expect(storageService.get(OBJECT_TYPE)).toEqual({ test: 'other' });
    storageService.set<string>(STRING_TYPE, 'another');
    expect(storageService.get(STRING_TYPE)).toBe('another');
    storageService.set<boolean>(BOOLEAN_TYPE, false);
    expect(storageService.get(BOOLEAN_TYPE)).toBeFalsy();
  });

  it('remove and clear - should remove data from local storage', () => {
    storageService.set(OBJECT_TYPE, { test: 'other' });
    storageService.remove(OBJECT_TYPE);
    expect(storageService.get(OBJECT_TYPE)).toBeUndefined();
    storageService.clear();
    expect(localStorageMock.clear).toHaveBeenCalled();
  });
});

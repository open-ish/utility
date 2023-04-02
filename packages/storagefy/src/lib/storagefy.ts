interface StoragePlugin {
  set: <T>(key: string, data: T) => void;
  get: <T>(key: string) => T;
  remove: (key: string) => void;
  clear: () => void;
}

/**
 * @param get: get data from localStorage
 * @param set: set data at localStorage
 * @param remove: remove a specific field at localStorage
 * @param clear: clear localStorage
 */
export const storageService: StoragePlugin = {
  get: (key) => {
    const rawData = localStorage.getItem(key);
    try {
      return JSON.parse(rawData as string);
    } catch (error) {
      return rawData;
    }
  },
  set: (key, data) => {
    const stringifyData = JSON.stringify(data);

    localStorage.setItem(key, stringifyData);
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

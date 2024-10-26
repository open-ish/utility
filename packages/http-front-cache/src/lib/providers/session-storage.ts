export const sessionStorageProvider = {
  getItem: (key: string) => sessionStorage.getItem(key),
  setItem: <T>(key: string, value: T) =>
    sessionStorage.setItem(key, JSON.stringify(value)),
  removeItem: (key: string) => sessionStorage.removeItem(key),
};

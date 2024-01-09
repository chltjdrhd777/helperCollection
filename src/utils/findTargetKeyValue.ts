export function findTargetKeyValue<Key extends string | number, ReturnType extends string | number | undefined>(
  obj: { [key in Key]: any },
  keyPropertyName: Key,
): ReturnType {
  function recursiveSearch(currentObj: { [key in Key]: any }): ReturnType {
    for (const key in currentObj) {
      if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
        const result = recursiveSearch(currentObj[key]);
        if (result) {
          return result;
        }
      } else if (key === keyPropertyName) {
        return currentObj[key];
      }
    }
    return undefined as ReturnType;
  }

  return recursiveSearch(obj);
}

export default function getLabel<
  Key extends string | number,
  ReturnType extends string | number | undefined,
>(target: { [key in Key]: any } | any, keyPropertyName: Key): ReturnType {
  function recursiveSearch(
    currentObj: { [key in Key]: any } | Array<{ [key in Key]: any }>,
  ): ReturnType {
    if (Array.isArray(currentObj)) {
      for (let el of currentObj) {
        const result = recursiveSearch(el);
        if (result) {
          return result;
        }
      }
    } else {
      for (const key in currentObj) {
        if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
          const result = recursiveSearch(currentObj[key]);
          if (result) {
            return result;
          }
        } else if (key === 'value' && currentObj[key] === keyPropertyName) {
          return currentObj['label' as Key];
        }
      }
    }

    return target['value' as Key] ?? (undefined as ReturnType);
  }

  return recursiveSearch(target);
}

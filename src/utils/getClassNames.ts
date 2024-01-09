export function getClassName(classList: (string | { [key: string]: boolean })[]) {
  const result = [] as string[];

  const handleObjectClass = (className: Object) => {
    const entries = Object.entries(className);
    for (let [key, value] of entries) {
      !!value === true && result.push(key);
    }
  };

  classList.forEach((className) => {
    if (className instanceof Object) {
      handleObjectClass(className);
    } else {
      result.push(className);
    }
  });

  return result.join(' ');
}

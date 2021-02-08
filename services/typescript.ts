// @ts-ignore
export const query: (object, string) => any = (obj: object, path: string) => {
  return (
    path
      .split('.')
      // @ts-ignore
      .reduce((curObj, property) => curObj && curObj[property], obj)
  );
};

// @ts-ignore
export const mutate: (object, string, any) => any = (
  obj: object,
  path: string,
  prop: any
) => {
  path.split('.').reduce((curObj, property, idx, arr) => {
    if (!curObj) {
      throw new Error(
        `Cannot mutate ${path} of ${obj}. Property ${property} is undefined`
      );
    }
    if (idx === arr.length - 1) {
      // @ts-ignore
      curObj[property] = prop;
    }
    // @ts-ignore
    return curObj[property];
  }, obj);

  return obj;
};

import { mutate, query } from './typescript';

// @ts-ignore
export function deserializeDates<T, D>(
  data: T[],
  dateProperties: (keyof T)[],
  deserializer: (string: D) => D
) {
  return data.map((dataObject: T) => {
    const result: T = dateProperties.reduce((deserialized, path) => {
      const dateString = query(deserialized, path);
      const date = dateString != null ? deserializer(dateString) : dateString;
      return mutate(deserialized, path, date);
    }, dataObject);

    return {
      ...result,
    };
  });
}

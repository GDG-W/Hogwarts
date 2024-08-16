// Gets all non-builtin properties up the prototype chain.
const getAllProperties = (object: object): Set<[object: object, key: PropertyKey]> => {
  const properties = new Set<[object: object, key: PropertyKey]>();

  let currentObject: object | null = object;

  do {
    for (const key of Reflect.ownKeys(object)) {
      properties.add([object, key]);
    }
  } while (
    (currentObject = Reflect.getPrototypeOf(currentObject)) &&
    currentObject !== Object.prototype &&
    currentObject !== null
  );

  return properties;
};

type IncludeExclude = {
  include?: (string | RegExp)[];
  exclude?: (string | RegExp)[];
};

export default function autoBind<T extends object>(
  self: T,
  { include, exclude }: IncludeExclude = {},
): T {
  const filter = (key: PropertyKey): boolean => {
    const match = (pattern: string | RegExp) =>
      typeof pattern === 'string' ? key === pattern : pattern.test(key.toString());

    if (include) {
      return include.some(match);
    }

    if (exclude) {
      return !exclude.some(match);
    }

    return true;
  };

  // @ts-ignore
  for (const [object, key] of getAllProperties(self.constructor.prototype)) {
    if (key === 'constructor' || !filter(key)) {
      continue;
    }

    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    if (descriptor && typeof descriptor.value === 'function') {
      // @ts-ignore
      self[key as keyof T] = self[key as keyof T].bind(self);
    }
  }

  return self;
}

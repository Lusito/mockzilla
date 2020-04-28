import { MockzillaAssimilatedMap } from "./types";
import { MockzillaError } from "./error";
import { getAllProperties, denyPropertyAccess } from "./utils";
import { deepMock } from "./deepMock";

interface MockAssimilateOptions<T> {
    mock: T[];
    whitelist?: string[];
}

export function mockAssimilate<T extends { [s: string]: any }, TKey extends string>(
    instance: T,
    name: string,
    { mock: mockKeys, whitelist }: MockAssimilateOptions<TKey>
): MockzillaAssimilatedMap<Pick<T, TKey>> {
    const [proxy, mock] = deepMock<T>(name);
    const properties = getAllProperties(instance);

    // Validate, that every mock is in properties
    for (const key of mockKeys) {
        if (!properties.includes(key as TKey))
            throw new MockzillaError(`Property "${key}" does not exist on ${name}, so it can't be assimilated`);
        else if (typeof instance[key] !== "function")
            throw new MockzillaError(`Property "${key}" on ${name} is not a function, so it can't be assimilated`);
    }

    // Validate, that every whitelist item is in properties
    if (whitelist) {
        const key = whitelist.find((property) => !properties.includes(property as TKey));
        if (key) throw new MockzillaError(`Property "${key}" does not exist on ${name}, so it can't be whitelisted`);
    }

    for (const property of properties) {
        if (mockKeys.includes(property as TKey)) {
            mock[property].mockAllowMethod();
            (instance as any)[property] = proxy[property];
        } else if (whitelist && !whitelist.includes(property as TKey)) denyPropertyAccess(instance, property);
    }

    return mock;
}

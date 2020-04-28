import { MockzillaError } from "./error";

export function denyPropertyAccess<T>(instance: T, property: string) {
    Object.defineProperty(instance, property, {
        get() {
            throw new MockzillaError(`Property "${property}" was expected to be left ontouched`);
        },
        set() {
            throw new MockzillaError(`Property "${property}" was expected to be left ontouched`);
        },
    });
}

export function getAllProperties(obj: any) {
    const properties = new Set<string>();
    for (let current = obj; Object.getPrototypeOf(current); current = Object.getPrototypeOf(current))
        Object.getOwnPropertyNames(current).forEach((item) => properties.add(item));
    properties.delete("constructor");
    return [...properties.keys()];
}

export function whitelistPropertyAccess(instance: any, ...whitelist: string[]) {
    for (const property of getAllProperties(instance)) {
        if (!whitelist.includes(property)) denyPropertyAccess(instance, property);
    }
}

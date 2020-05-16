// fixme: store actual call parameters and let the test retrieve them?

export interface MockzillaExpectation {
    stack: string;
    spy?: (...args: any[]) => any;
    args?: any[];
    returns?: any;
    throws?: Error;
}

export interface MockzillaTimes {
    times: (count: number) => void;
}

export type MockzillaAsyncFunction<T> = {
    andResolve: T;
    andReject: (error: Error) => MockzillaTimes;
    times: (count: number) => void;
};

export type MockzillaSyncFunction<T> = {
    andReturn: T;
    andThrow: (error: Error) => MockzillaTimes;
    times: (count: number) => void;
};

export type MockzillaFunction<T extends (...args: any[]) => any> = ReturnType<T> extends Promise<infer TP>
    ? TP extends void
        ? MockzillaAsyncFunction<() => MockzillaTimes>
        : MockzillaAsyncFunction<(result: TP) => MockzillaTimes>
    : ReturnType<T> extends void
    ? MockzillaSyncFunction<() => MockzillaTimes>
    : MockzillaSyncFunction<(result: ReturnType<T>) => MockzillaTimes>;

export type MockzillaProperty<T> = {
    mock: (value: T) => void;
    mockAllow: () => void;
    mockAllowMethod: () => void;
    mockPath: string;
};

export type MockzillaDeep<T> = { [TKey in keyof T]: MockzillaDeep<T[TKey]> } &
    MockzillaProperty<T> &
    (T extends (...args: any[]) => any
        ? {
              spy: (fn: T) => MockzillaTimes;
              expect: ((...args: Parameters<T>) => MockzillaFunction<T>) & MockzillaFunction<T>;
              getMockCalls: () => Array<Parameters<T>>;
          }
        : {});

export type MockzillaAssimilated<T> = T extends (...args: any[]) => any
    ? {
          spy: (fn: T) => MockzillaTimes;
          expect: ((...args: Parameters<T>) => MockzillaFunction<T>) & MockzillaFunction<T>;
          getMockCalls: () => Array<Parameters<T>>;
      }
    : unknown;

export type MockzillaAssimilatedMap<T> = { [TKey in keyof T]: MockzillaAssimilated<T[TKey]> };

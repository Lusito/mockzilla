# Expectations

When you are mocking a method, you have two ways to add expectations:
- `expect()` allows you to be specific about an expected call
- `spy()` allows you to handle the call yourself.

- Each of these calls is only good for one call.
  - If you call the original method multiple times, you will get an error unless you add more expectations.
- Expectations must be added before calling the original methods.

## Expect

Expect has the following signature:

```javascript
expect: ((...args: Parameters<T>) => MockzillaFunction<T>) & MockzillaFunction<T>;
```

Let's see a few example uses:

```javascript
test("", () => {
    const [worker, mockWorker] = deepMock<MyWorker>("myWorker");

    // parameters will be ignored
    mockWorker.myFunction.expect;
    // The call must be made with these 2 parameters.
    mockWorker.myFunction.expect("foo", "bar");
    // The call must be made with "foo" as first parameter any anything as second parameter.
    // I.e. this is the equivalent of expect(x).toHaveBeenCalledWith(...)
    mockWorker.myFunction.expect("foo", expect.anything());
    //...
})
```

You can further specify details of the call by adding a dot after any of the above and using these available options:


For synchronous functions:

```javascript
    // Always available:
    times: (count: number) => void;

    // Available on synchronous methods:
    andReturn: (result: ReturnType<T>) => MockzillaTimes;
    andThrow: (error: Error) => MockzillaTimes;

    // Available on asynchronous methods:
    andResolve: (result: Promise<ReturnType<T>>) => MockzillaTimes;
    andReject: (error: Error) => MockzillaTimes;
```

- As you can see, all of these (except `times`) return MockzillaTimes, which allows you to call `times()` on them.
- Times can be used to repeat the statement you just made `count` times.

Let's see a few example uses:

```javascript
test("", () => {
    const [worker, mockWorker] = deepMock<MyWorker>("myWorker");

    mockWorker.myFunction.expect.andReturn("foo");
    mockWorker.myAsyncFunction.expect.andThrow(new Error("No way"));
    mockWorker.myAsyncFunction.expect("foo", expect.anything()).andResolve({ foo: "bar" }).times(5);
    //...
})
```

## Spy

Spy is comparatively simple. It only expects the call and then delegates it to the function you specified.

```javascript
spy: (fn: T) => MockzillaTimes;
```

Let's see a few example uses:

```javascript
test("", () => {
    const [worker, mockWorker] = deepMock<MyWorker>("myWorker");

    let storedParam = null;
    mockWorker.myFunction.spy((param) => {
        storedParam = param;
        return true;
    });

    const spy = jest.fn();
    mockWorker.myFunction.spy(spy).times(2);
    //...
})
```

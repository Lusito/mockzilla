# mockzilla

[![Minified + gzipped size](https://badgen.net/bundlephobia/minzip/mockzilla)](https://www.npmjs.com/package/mockzilla)
[![NPM version](https://badgen.net/npm/v/mockzilla)](https://www.npmjs.com/package/mockzilla)
[![License](https://badgen.net/github/license/lusito/mockzilla)](https://github.com/lusito/mockzilla/blob/master/LICENSE)
[![Stars](https://badgen.net/github/stars/lusito/mockzilla)](https://github.com/lusito/mockzilla)
[![Watchers](https://badgen.net/github/watchers/lusito/mockzilla)](https://github.com/lusito/mockzilla)

mockzilla is a mocking toolkit leveraging the power of TypeScript to enhance your jest experience.

This is a **Work In Progress**! The API might change before version 1.0 is released.

#### Features

- Deep Mocking
- Mock Assimilation (replace methods of an existing object with mocks)
- Time manipulation
- Property protection & whitelisting

#### Why use mockzilla

- Integrates with jest
- Typesafety and code-completion out of the box.
- Deadsimple to use
- Liberal license: [zlib/libpng](https://github.com/Lusito/mockzilla/blob/master/LICENSE)

### Installation via NPM

```npm i -D mockzilla```

### Examples

The following examples are only basic examples. Try it for yourself, there is more functionality, that I've not yet documented.

#### Deep Mocking

**Problem:**

You have a deeply nested API, which requires you to call it like this:

```TypeScript
// Web-Extension example 1
browser.webRequest.onBeforeRedirect.addListener(callback, filter);
// Web-Extension example 2
const activeTabs = await browser.tabs.query({ active: true });
...
```

**Solution:**

By using `deepMock<T>(name, autoCleanup=true)` you can easily create mocks for the above scenario. After you've set it up (see further below), you can mock the above calls like this:

```TypeScript
// Web-Extension example 1
mockBrowser.webRequest.onBeforeRedirect.addListener.expect(expect.anything(), filter);
// Web-Extension example 2
mockBrowser.tabs.query.expect({ active: true }).andResolve([activeTab]);
```

**Details:**

`deepMock` expects two parameters:
- A `name` used for error messages
- An optional `autoCleanup` boolean (defaults to true).

Use `autoCleanup=true` if you create the mock instance within your `test()` or `it()` block to automatically verify the mocks and disable them after the test has finished. Since this is a very common use-case, it's the default behavior.

- Verify means: If your mock expectation has not been fullfilled, the test will fail.
- Disabling means: An exception will be thrown if the mocked instance (proxy) has been used after disabling.

`deepMock` returns an array with 3 items in it:

1. The proxy instance (i.e. the object your logic will use).
2. A `MockzillaDeep<T>` mock builder. This is used to set up your mocks during tests.
3. A `MockzillaNode`, which is for some rare situations where you need more control. In most cases you can ignore this.


To perform the autoCleanup, you'll need to setup an afterEach:

```TypeScript
afterEach(() => performAutoCleanup());
```

#### Mock Assimilation

**Problem:**

You want to ensure internal methods of an object get called as expected and have no other side-effects:

```TypeScript
expect(myInstance.run()).toBe(true); // run calls runA, runB and runC
```

**Solution:**

You can use `mockAssimilate(instance, name, { mock: [], whitelist?: []}` you can assimilate your instance by overriding methods with mockable functions. You can use whitelist to ensure no property gets touched without you knowing.

```TypeScript
const mock = mockAssimilate(myInstance, "myInstance", {
    mock: ["runA", "runB", "runC"],
    whitelist: ["run", "someProp"],
    // The names listed in `mock` are automatically whitelisted.
    // If whitelist is not specified, other properties may be accessed.
});
// All of these are type-safe, i.e. you get auto-completion and compile-time validation on parameters and return types.
mock.runA.expect(expect.anything(), true).andReturn(true);
mock.runB.expect(expect.anything(), "foo").andReturn("bar");
mock.runC.expect("bar", expect.anything()).andReturn("done");
expect(myInstance.run()).toBe(true);
```
if the test passes, we know, that `runA/B/C` have been called and that nothing other than `run` and `someProp` have been accessed (get, set or called) during the test.

#### Time

**Problem:**

You are using setTimeout and clearTimeout in your code and don't know how to test that without slowing down the code:

```TypeScript
function runDelayed(callback: (foo: string) => void, delay: number) {
    setTimeout(() => {
        callback("bar");
    }, delay);
}
```

**Solution:**

After you call `mockTime()`, `setTimeout()` and `clearTimeout()` will be replaced, so that you can manually manipulate time using `advanceTime(ms)`:

```TypeScript
// somewhere in setupTests.ts:
mockTime();
afterEach(() => verifyAndDisableTimeouts());

// Somewhere in a test:
test("should run callback delayed", () => {
    const callback = jest.fn();
    runDelayed(callback, 1000);

    advanceTime(999);
    expect(callback).not.toHaveBeenCalled();

    advanceTime(1); // current time (999) += 1ms
    expect(callback).toHaveBeenCalled();
});

```

`verifyAndDisableTimeouts` ensures, that no timeout is leftover. I.e. if the timeout never got executed, the test will fail.

#### Utilities

`denyPropertyAccess<T>(instance: T, property: string)`

Use this if you want to verify, that a specified property will not get accessed during the test:

```TypeScript
denyPropertyAccess(myInstance, "modifiedDate");
```

`whitelistPropertyAccess(instance: any, ...whitelist: string[])`

This can be used to call denyPropertyAccess on all properties except the ones in the whitelist:

```TypeScript
whitelistPropertyAccess(myInstance, "run", "tasks", "showNotification");
```

### Report issues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/mockzilla/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

mockzilla has been released under the [zlib/libpng](https://github.com/Lusito/mockzilla/blob/master/LICENSE) license, meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.

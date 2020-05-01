# mockzilla

[![Minified + gzipped size](https://badgen.net/bundlephobia/minzip/mockzilla)](https://www.npmjs.com/package/mockzilla)
[![NPM version](https://badgen.net/npm/v/mockzilla)](https://www.npmjs.com/package/mockzilla)
[![License](https://badgen.net/github/license/lusito/mockzilla)](https://github.com/lusito/mockzilla/blob/master/LICENSE)
[![Stars](https://badgen.net/github/stars/lusito/mockzilla)](https://github.com/lusito/mockzilla)
[![Watchers](https://badgen.net/github/watchers/lusito/mockzilla)](https://github.com/lusito/mockzilla)

mockzilla is a mocking toolkit leveraging the power of TypeScript to enhance your jest experience.

This is a **Work In Progress**! The API might change before version 1.0 is released.

#### Features

- [Deep Mocking](https://lusito.github.io/mockzilla/deep-mock.html)
- [Mock Assimilation](https://lusito.github.io/mockzilla/mock-assimilate.html) (replace methods of an existing object with mocks)
- [Time Manipulation](https://lusito.github.io/mockzilla/mock-time.html)
- [Property protection & whitelisting](https://lusito.github.io/mockzilla/utils.html)

#### Why use mockzilla

- Integrates with jest
- Typesafety and code-completion out of the box.
- Deadsimple to use
- Liberal license: [zlib/libpng](https://github.com/Lusito/mockzilla/blob/master/LICENSE)

### Getting Started

Check out the [documentation page](https://lusito.github.io/mockzilla/) for examples

### Example

This is an example of how a deep mock with mockzilla looks like:

```TypeScript
import type { Browser } from "webextension-polyfill-ts";
import { deepMock, MockzillaDeep } from "mockzilla";

const [browser, mockBrowser, mockBrowserNode] = deepMock<Browser>("browser", false);

jest.mock("webextension-polyfill-ts", () => ({ browser }));

describe("Web-Extension Helpers", () => {
    beforeEach(() => mockBrowserNode.enable());

    afterEach(() => mockBrowserNode.verifyAndDisable());

    describe("getActiveTabs()", () => {
        it("should return active tabs", async () => {
            const tabs: any[] = [{id: 1}, {id: 2}];
            mockBrowser.tabs.query.expect({ active: true }).andResolve(tabs);

            expect(await getActiveTabs()).toEqual(tabs);
        });
    });

    describe("onBeforeRedirect()", () => {
        it("should register a listener and return a handle to remove the listener again", () => {
            const listener = jest.fn();
            mockBrowser.webRequest.onBeforeRedirect.addListener.expect(listener, expect.anything());

            const removeListener = onBeforeRedirect(listener);

            mockBrowser.webRequest.onBeforeRedirect.removeListener.expect(listener);
            removeListener();
        });
    });
});
```

### Report issues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/mockzilla/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

mockzilla has been released under the [zlib/libpng](https://github.com/Lusito/mockzilla/blob/master/LICENSE) license, meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.

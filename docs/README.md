---
home: true
heroText: mockzilla
tagline: A mocking toolkit leveraging the power of TypeScript to enhance your jest experience.
actionText: Get Started →
actionLink: /setup
features:
- title: Painless
  details: Writing mocks should be simple and fun. With mockzilla you can skip writing manual mocks of deeply nested APIs and focus on writing tests.
- title: Typesafe
  details: You use TypeScript to have code-completion and type-safety? Great! mockzilla uses the types you have to ensure a pleasant experience!
- title: Good Errors
  details: Errors should point to where the errors come from. mockzilla will give you hints on where you expected calls and where they actually happened.
footer: Zlib/Libpng License | Copyright © 2020 Santo Pfingsten
---

This is a **Work In Progress**! The API might change before version 1.0 is released.

### Features

- [Deep Mocking](deep-mock.md)
- [Mock Assimilation](mock-assimilate.md) (replace methods of an existing object with mocks)
- [Time Manipulation](mock-time.md)
- [Property protection & whitelisting](utils.md)

### Example: Web-Extensions

This is an example of how a deep mock with mockzilla looks like:

```TypeScript
import type { Browser } from "webextension-polyfill";
import { deepMock } from "mockzilla";

const [browser, mockBrowser, mockBrowserNode] = deepMock<Browser>("browser", false);

jest.mock("webextension-polyfill", () => browser);

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

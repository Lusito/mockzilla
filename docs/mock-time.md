# Time Mocking

## Problem

You are using setTimeout and clearTimeout in your code and don't know how to test it without slowing down the code:

`run-delayed.ts`

```javascript
function runDelayed(callback: (foo: string) => void, delay: number) {
    setTimeout(() => {
        callback("bar");
    }, delay);
}
```

## Solution

We can replace `setTimeout()` and `clearTimeout()` to help test this code.

### Setup Code

Time mocks are not enabled by default. You'll need to enable them. first:

`setupTests.ts`

```javascript
import { mockTime } from "mockzilla";

mockTime();
```

- This will replace `setTimeout()` and `clearTimeout()` on the `global` object (i.e. `window`).
- It will also register itself with `afterEach` to verify no timeout is unexecuted when the test is over.

### Manipulating Time

When you've set up time mocking as seen above, time will be frozen in regards to `setTimeout`.
But now you can manually manipulate time using `advanceTime(ms)`:

`run-delayed.spec.ts`

```javascript
import { advanceTime } from "mockzilla";

test("should run callback delayed", () => {
    const callback = jest.fn();
    runDelayed(callback, 1000);

    advanceTime(999);
    expect(callback).not.toHaveBeenCalled();

    advanceTime(1); // current time (999) += 1ms
    expect(callback).toHaveBeenCalled();
});
```

As you can see, advanceTime adds the specified value to current time. Any callback registered via setTimeout, which has run out of time will now be executed and removed from the internal list.

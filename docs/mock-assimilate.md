# Mock Assimilation

## Problem

You want to ensure internal methods of an object get called as expected and have no other side-effects:

`my-class.ts`

```javascript
class MyClass {
    private someProp = { hip: "hop" };

    public run(param1: boolean, param2: string) {
        if (!this.runA(this.someProp, param2))
            return false;
        const resultB = this.runB(this.someProp, param1);
        return this.runC(resultB, this.someProp) === "done";
    }
    private runA(config: any, param: boolean) {
        return !param;
    }
    private runB(config: any, value: string) {
        return value === "foo" ? "bar" : "nope";
    }
    private runC(value: string, config: any) {
        return value === "bar" ? "done" : "huh?";
    }
}
```

## Solution

You can use `mockAssimilate(instance, name, { mock: [], whitelist?: []}` to assimilate your instance by overriding methods with mockable functions.

- You can use whitelist to ensure no property gets touched without you knowing.
- The names listed in `mock` are automatically whitelisted.
- If whitelist is not specified, other properties may be accessed.

**Important:** Use mockAssimilate only from within `it()`, `test()` or `beforeEach()` blocks.

`my-class.spec.ts`

```javascript
import { mockAssimilate } from "mockzilla";

describe("MyClass", () => {
    describe("#run()", () => {
        it("should return false with param1=false and param2='foo'", () => {
            const myInstance = new MyClass();
            const mock = mockAssimilate(myInstance, "myInstance", {
                mock: ["runA"],
                whitelist: ["run", "someProp"],
            });
            // Notice how you get auto-completion and type-checking:
            mock.runA.expect(expect.anything(), true).andReturn(true);

            expect(myInstance.run(false, "foo")).toBe(true);
        });

        it("should return true with param1=true and param2='foo'", () => {
            const myInstance = new MyClass();
            const mock = mockAssimilate(myInstance, "myInstance", {
                mock: ["runA", "runB", "runC"],
                whitelist: ["run", "someProp"],
            });
            // Notice how you get auto-completion and type-checking:
            mock.runA.expect(expect.anything(), true).andReturn(true);
            mock.runB.expect(expect.anything(), "foo").andReturn("bar");
            mock.runC.expect("bar", expect.anything()).andReturn("done");

            expect(myInstance.run(true, "foo")).toBe(true);
            // if the test passes, we know, that `runA/B/C` have been called
            // and that nothing other than `run` and `someProp` have been accessed (get, set or called) during the test.
        });
    });
});
```

If you want to know more about what you can do with these expect calls, check out [Expectations](expectations.md).

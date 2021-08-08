import { formatStackTrace } from "jest-message-util";
import { ValidationError } from "jest-validate";

const VALID_STACK_LINE = /^\s*at .* \((.+):([0-9]+):([0-9]+)\)$/;
const VALID_STACK_LINE2 = /^\s*at (.+):([0-9]+):([0-9]+)$/;

export function getCleanStack() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stack = new Error().stack!.split("\n");
    const firstValidLine = stack.findIndex(
        (line) => !line.includes("mockzilla") && (VALID_STACK_LINE.test(line) || VALID_STACK_LINE2.test(line))
    );
    if (firstValidLine !== -1) return `\n${stack.slice(firstValidLine).join("\n")}`;
    return "Error analyzing stack trace";
}

export function colorizeStack(stack: string, noStackTrace = false) {
    return formatStackTrace(
        `  \n${stack}`,
        {
            rootDir: "",
            testMatch: [],
        },
        {
            noStackTrace,
        }
    );
}

export class MockzillaError extends ValidationError {
    public constructor(message: string, excludeStack?: boolean) {
        super("", "");
        this.message = excludeStack ? message : `${message}\n\nInvocation: \n${colorizeStack(getCleanStack())}\n`;
    }
}

import { MockzillaError } from "./error";

interface TimeoutEntry {
    start: number;
    callback: () => void;
}

let currentTime = 0;
let timeouts: TimeoutEntry[] = [];

// fixme: remember stack in order to show the invocation afterwards
const setTimeout = (callback: () => void, ms: number) => {
    const entry: TimeoutEntry = {
        start: currentTime + ms,
        callback,
    };
    timeouts.push(entry);
    return entry;
};

const clearTimeout = (entry: TimeoutEntry) => {
    const index = timeouts.indexOf(entry);
    if (index >= 0) timeouts.splice(index, 1);
};

export function advanceTime(ms: number) {
    currentTime += ms;
    const remaining: TimeoutEntry[] = [];
    const expired: TimeoutEntry[] = [];
    for (const entry of timeouts) {
        if (entry.start <= currentTime) expired.push(entry);
        else remaining.push(entry);
    }
    timeouts = remaining;
    expired.sort((a, b) => a.start - b.start).forEach((e) => e.callback());
}

export function mockTime() {
    (global as any).setTimeout = setTimeout;
    (global as any).clearTimeout = clearTimeout;
}

export function verifyAndDisableTimeouts() {
    try {
        if (timeouts.length !== 0)
            throw new MockzillaError(`${timeouts.length} timeouts still active after test has finished`, true);
    } finally {
        timeouts = [];
        currentTime = 0;
    }
}

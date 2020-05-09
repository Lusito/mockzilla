# Setup

## Install With NPM

```
npm i -D mockzilla
```

## Install With Yarn

```
yarn add --dev mockzilla
```

## Jest

Aside from mockzilla itself, you'll only need [jest](https://jestjs.io/).

Here's a quick setup guide for jest with TypeScript: (you can skip this if you are already using jest with TypeScript)

Install with NPM

```
npm i -D jest @types/jest ts-jest
```

Or with Yarn:
```
yarn add --dev jest @types/jest ts-jest
```

Create a file `jest.config.js`:
```javascript
module.exports = {
    transform: {
        ".+\\.ts$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: ["ts", "js"],
};
```

add a test script to your package.json:

```json
  "scripts": {
    ...
    "test": "jest"
  }
```

Now all you need to do is write test files and run the tests with NPM:
```
npm t
```

Or with Yarn:
```
yarn test
```

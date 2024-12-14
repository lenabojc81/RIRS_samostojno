module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  testEnvironment: "node",
  collectCoverageFrom: [
    'src/*.{js,jsx,ts,tsx}', // Specifically include components directory in coverage
    '!**/*.test.{js,jsx,ts,tsx}', // Exclude test files
    '!**/node_modules/**', // Exclude node_modules
  ],
};

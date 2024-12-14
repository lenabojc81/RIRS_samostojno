// module.exports = {
//     collectCoverage: true,
//     coverageDirectory: 'coverage',
//     testEnvironment: 'node',
// };

module.exports = {
    transform: {
      "^.+\\.js$": "babel-jest",
    },
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "text"],
    testEnvironment: "node",
};

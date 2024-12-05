// module.exports = {
//     collectCoverage: true,
//     coverageDirectory: 'coverage',
//     testEnvironment: 'jsdom',
// };

const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './', // Path to your Next.js app
});

const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom', // Ensure compatibility with DOM-based tests
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Custom setup file for Testing Library

    // Add coverage configuration
    collectCoverage: true, // Enable coverage collection
    coverageDirectory: 'coverage', // Specify the directory where coverage reports are saved
    coverageReporters: ['json', 'lcov', 'text', 'clover'], // Define coverage report formats
    collectCoverageFrom: [
        'components/**/*.{js,jsx,ts,tsx}', // Include components in coverage
        'pages/**/*.{js,jsx,ts,tsx}', // Include pages in coverage
        '!**/node_modules/**', // Exclude node_modules
        '!**/.next/**', // Exclude Next.js build files
    ],
};

module.exports = createJestConfig(customJestConfig);

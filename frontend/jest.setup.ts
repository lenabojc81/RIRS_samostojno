import '@testing-library/jest-dom';

Object.defineProperty(window, "location", {
    writable: true,
    value: {
        ...window.location,
        reload: jest.fn(),
    },
});

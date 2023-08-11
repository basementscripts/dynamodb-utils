module.exports = {
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  moduleFileExtensions: [
    "js",
    "ts"
  ],
  testMatch: [
    "**/__tests__/**/*.test.(ts)"
  ],
  coverageReporters: [
    "json-summary"
  ]
};
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|jfif|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  
  // other Jest configurations if needed
};

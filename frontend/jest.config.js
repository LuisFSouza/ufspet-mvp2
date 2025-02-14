module.exports = {
    moduleNameMapper: {
      '^react-router-dom$': require.resolve('react-router-dom')
    }, 
    testEnvironment: 'jsdom',
    setupFiles: ["<rootDir>/jest.setup.js"],
  };
  
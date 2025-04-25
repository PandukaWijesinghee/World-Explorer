import '@testing-library/jest-dom';


const originalConsoleError = console.error;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const msg = args[0];
    
    // ignore the ReactDOMTestUtils.act deprecation warning
    if (typeof msg === 'string' && msg.includes('ReactDOMTestUtils.act is deprecated in favor of `React.act`')) {
      return;
    }
    originalConsoleError(...args);
  });
});

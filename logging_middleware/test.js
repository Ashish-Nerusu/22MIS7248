const { Log, setConfig, STACKS, LEVELS } = require('./index');

async function test() {
  // Use a public mock API or invalid url just to see it fail gracefully
  setConfig({
    apiBaseUrl: 'http://localhost:9999/log',
    authUrl: 'http://localhost:9999/auth',
    appSecret: 'test-secret'
  });

  console.log('Sending valid log...');
  const res1 = await Log(STACKS.BACKEND, LEVELS.INFO, 'controller', 'This is a test log');
  console.log('Valid log result:', res1);

  console.log('Sending invalid log (wrong package)...');
  const res2 = await Log(STACKS.BACKEND, LEVELS.INFO, 'component', 'This should fail validation');
  console.log('Invalid log result:', res2);
}

test();

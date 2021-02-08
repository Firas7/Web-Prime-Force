const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { after, before, describe, it } = (exports.lab = Lab.script());
const index = require('./testindex');
let server = null;

before(async () => {
  //console.log("BEFORE");

  server = await index.init();
  //console.log(server._core.router)
  //console.log(server._core.phase)
});

after(async () => {
  //console.log("AFTER");
  //await index.stop();
});
describe('User suite', () => {
  it('Server JWT test', async () => {
    const options = {
      method: 'GET',
      url: '/api/contracts',
    };
    const data = await server.inject(options);
    expect(data.statusCode).to.equal(401);
  });

  it('should fail in adding user due to no payload', async () => {
    const options = {
      method: 'POST',
      url: '/api/users/register',
    };
    const data = await server.inject(options);
    //console.log(data)
    expect(data.statusCode).to.equal(400);
    expect(data.result.message).to.equal('Invalid request payload input');
  });

  it('should add user successfully', async () => {
    const options = {
      method: 'POST',
      url: '/api/users/register',
      payload: JSON.stringify({
        email: 'test12345@stud.hs-hannover.de',
        firstname: 'simon',
        lastname: 'simon',
        password: 'Test1234_',
      }),
    };
    const data = await server.inject(options);
    expect(data.statusCode).to.equal(201);
  });

  it('should fail in adding user, where user already exists', async () => {
    const options = {
      method: 'POST',
      url: '/api/users/register',
      payload: JSON.stringify({
        email: 'test12345@stud.hs-hannover.de',
        firstname: 'simon',
        lastname: 'simon',
        password: 'Test1234_',
      }),
    };
    const data = await server.inject(options);
    expect(data.statusCode).to.equal(400);
    expect(data.result.message).to.equal('Email taken');
  });
});

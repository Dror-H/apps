/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-var-requires */
export function getRedisMockClient() {
  // ioredis-mock v4.18.2
  const Redis = require('ioredis-mock');
  if (typeof Redis === 'object') {
    // the first mock is an ioredis shim because ioredis-mock depends on it
    // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
    Redis.Command = { _transformer: { argument: {}, reply: {} } };
    return {
      Command: { _transformer: { argument: {}, reply: {} } },
    };
  }
  // second mock for our code
  return function (...args) {
    const instance = new Redis(args);
    instance.options = {};
    instance.info = async () => 'redis_version:5.0.0';
    instance.connect = () => jest.fn();
    instance.disconnect = () => jest.fn();
    instance.duplicate = () => instance;
    instance.client = (clientCommandName, ...args) => {
      if (!instance.clientProps) {
        instance.clientProps = {};
      }

      switch (clientCommandName) {
        case 'setname': {
          const [name] = args;
          instance.clientProps.name = name;
          return 'OK';
        }
        case 'error': {
          return;
        }
        case 'getname':
          return instance.clientProps.name;
        default:
          throw new Error(`This implementation of the client command does not support ${clientCommandName}`);
      }
    };

    return instance;
  };
}

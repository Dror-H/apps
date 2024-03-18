import { spawn } from 'child_process';

export function spawnRelaxed(options: { path; out?; args? }): Promise<any> {
  const { path, out, args } = options;
  console.log('spawn relaxed');
  return new Promise((resolve, reject) => {
    const process = spawn('relaxed', [path, out, '--build-once', '--no-sandbox'].concat(args || []));
    process.stdout.on('data', (data) => {
      console.log(`relaxed: ${data}`);
    });
    process.stderr.on('data', (data) => {
      console.error(`relaxederr: ${data}`);
    });
    process.on('close', (code) => {
      console.log(`Build ${code} ${path}`);
      resolve('Build done');
    });
    process.on('uncaughtException', (err) => {
      console.log('Caught exception: ' + err);
      reject('Caught exception: ' + err);
    });
  });
}

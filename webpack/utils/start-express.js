import cp from 'child_process';
import path from 'path';

import debug from 'debug';
import watch from 'node-watch';
import browserSync from 'browser-sync';
import { noop } from 'lodash';

let started;
let server;
let serverReload;

const PORT = parseInt(process.env.PORT, 10) + 2 || 3002;
const HOST = `localhost:${parseInt(process.env.PORT, 10) || 3000}`;
const SERVER = path.resolve(__dirname, '../../server/index');

function startServer() {
  function restartServer() {
    debug('dev')('restarting express server');
    serverReload = true;
    server.kill('SIGTERM');
    return startServer();
  }

  const env = { ...process.env, NODE_ENV: 'development', BABEL_ENV: 'server' };
  server = cp.fork(SERVER, { env });

  server.once('message', function(message) {
    if (message.match(/^online$/)) {
      // server restarted, reload page
      if (serverReload) {
        serverReload = false;
        browserSync.reload();
      }

      if (!started) {
        started = true;
        browserSync({ port: PORT, proxy: HOST });

        // Listen for `rs` in stdin to restart server
        debug('dev')('type `rs` in console to restart express server');
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function(data) {
          const parsedData = (data + '').trim().toLowerCase();
          if (parsedData === 'rs') return restartServer();
        });

        // Start watch on server files
        // and reload browser on changes
        watch(
          path.resolve(__dirname, '../../server'),
          file => !file.match('webpack-stats.json') && restartServer()
        );
      }
    }
  });
}

process.on('exit', () => server.kill('SIGTERM'));
export default () => !server ? startServer() : noop();

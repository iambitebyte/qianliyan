const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync('.env.production', 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#') && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const LOG_DIR = envVars.LOG_DIR || './logs';

module.exports = {
  apps: [{
    name: 'qianliyan',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: envVars,
    error_file: path.join(LOG_DIR, 'qianliyan-error.log'),
    out_file: path.join(LOG_DIR, 'qianliyan-out.log'),
    log_file: path.join(LOG_DIR, 'qianliyan.log'),
    time: true
  }]
}

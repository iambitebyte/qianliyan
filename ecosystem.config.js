const fs = require('fs');

const envFile = fs.readFileSync('.env.production', 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#') && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

module.exports = {
  apps: [{
    name: 'qianliyan',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: envVars,
    log_file: '../logs/qianliyan.log',
    error_file: '../logs/qianliyan-error.log'
  }]
}

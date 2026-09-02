import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from the root .env file
const envPath = path.resolve(rootDir, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded root .env file');
} else {
  console.warn('⚠️ No .env file found in root directory');
}

// Pass all environment variables down to child processes
const env = { ...process.env, FORCE_COLOR: '1' };

console.log('🚀 Starting Backend and Frontend...');

// Start Backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(rootDir, 'backend'),
  env,
  shell: true,
  stdio: 'pipe'
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[Backend]\x1b[0m ${data.toString()}`);
});
backend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[Backend Error]\x1b[0m ${data.toString()}`);
});

// Start Frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(rootDir, 'frontend'),
  env,
  shell: true,
  stdio: 'pipe'
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[35m[Frontend]\x1b[0m ${data.toString()}`);
});
frontend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[Frontend Error]\x1b[0m ${data.toString()}`);
});

const handleExit = () => {
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);

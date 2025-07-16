import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'jobseek.com',
  appName: 'JobSeek',
  webDir: '.next',
  server: {
    url: "http://localhost:3000", 
    cleartext: true
  }
};

export default config;

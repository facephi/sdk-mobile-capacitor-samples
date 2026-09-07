import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'example',
  webDir: 'www/browser',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;

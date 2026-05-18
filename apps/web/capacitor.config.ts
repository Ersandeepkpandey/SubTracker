import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.subtrack.app",
  appName: "SubTrack",
  webDir: "out",
  server: {
    url: "http://194.164.151.64.nip.io",
    cleartext: true, // allows HTTP (switch to false once you have HTTPS)
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;

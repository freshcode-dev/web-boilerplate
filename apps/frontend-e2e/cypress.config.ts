import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: nxE2EPreset(__dirname),
	video: true,
	videosFolder: "../../dist/cypress/apps/frontend-e2e/videos",
	screenshotsFolder: "../../dist/cypress/apps/frontend-e2e/screenshots",
	chromeWebSecurity: false
});

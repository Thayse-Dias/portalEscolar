const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
    video: true, // Habilita gravação de vídeos
    screenshotOnRunFailure: true,
    baseUrl: "http://localhost:52222",
    env: {
      allure: true,
      allureResultsPath: "allure-results"
    }
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mocha',
    overwrite: false,
    html: false,
    json: true
  }
});
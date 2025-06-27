const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  defaultCommandTimeout: 9000,
  e2e: {
    env: {
      AMIGOZ_URL: 'https://staging.happyconsig.com.br/login',
      BACKOFFICE_URL: 'https://backoffice-staging.happyconsig.com.br',
      API_URL: 'https://backoffice-staging.happyconsig.com.br/api',
      EMAIL_VALIDO: process.env.EMAIL_VALIDO,
      CPF_VALIDO: process.env.CPF_VALIDO,
      SENHA_VALIDA: process.env.SENHA_VALIDA,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

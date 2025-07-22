export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7071',
  azureAdB2C: {
    clientId: '${clientId}', // Will be replaced during deployment
    authority: 'https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/B2C_1_signupsignin',
    authorityDomain: '${tenant}.b2clogin.com',
    scopes: ['api://cafelokaal/orders.read']
  }
};

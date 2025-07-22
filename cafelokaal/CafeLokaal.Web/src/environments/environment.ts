export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7071',
  msalConfig: {
    auth: {
      clientId: '${clientId}', // Replace with your Azure AD B2C app registration client ID
      authority: 'https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/B2C_1_signupsignin',
      knownAuthorities: ['${tenant}.b2clogin.com'],
      redirectUri: 'http://localhost:4200'
    }
  }
};

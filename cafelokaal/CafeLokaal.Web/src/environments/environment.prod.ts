export const environment = {
  production: true,
  apiBaseUrl: '/api',
  msalConfig: {
    auth: {
      clientId: '${clientId}', // Replace with your Azure AD B2C app registration client ID
      authority: 'https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/B2C_1_signupsignin',
      knownAuthorities: ['${tenant}.b2clogin.com'],
      redirectUri: 'https://${domain}'
    }
  }
};

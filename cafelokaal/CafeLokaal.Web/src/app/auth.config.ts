import { LogLevel, Configuration, BrowserCacheLocation, PublicClientApplication } from '@azure/msal-browser';
import { environment } from './environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

const msalConfiguration: Configuration = {
  auth: {
    clientId: environment.azureAdB2C.clientId,
    authority: environment.azureAdB2C.authority,
    knownAuthorities: [environment.azureAdB2C.authorityDomain],
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: isIE
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
        }
      },
      logLevel: environment.production ? LogLevel.Warning : LogLevel.Info
    }
  }
};

export const msalInstance = new PublicClientApplication(msalConfiguration);
export const msalConfig = msalInstance;

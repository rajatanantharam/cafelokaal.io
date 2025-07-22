param location string
param environmentName string
param tags object
param apiBaseUrl string

var staticWebAppName = 'stapp-${environmentName}'

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  tags: tags
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    provider: 'Custom'
    enableDefaultTelemetry: false
    buildProperties: {
      apiLocation: 'api'
      appLocation: 'CafeLokaal.Web'
      outputLocation: 'dist/CafeLokaal.Web/browser'
    }
  }
}

resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2022-03-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    API_BASE_URL: apiBaseUrl
  }
}

output webUri string = staticWebApp.properties.defaultHostname

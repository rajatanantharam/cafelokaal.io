param location string
param environmentName string
param tags object

@description('App Service Plan SKU')
param appServicePlanSku object = {
  name: 'P1v2'
  tier: 'PremiumV2'
  size: 'P1v2'
  family: 'Pv2'
  capacity: 1
}

var appServicePlanName = 'plan-${environmentName}'
var appServiceName = 'app-${environmentName}'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: appServicePlanSku
  properties: {
    reserved: true
  }
}

resource appService 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceName
  location: location
  tags: tags
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|8.0'
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
      cors: {
        allowedOrigins: ['*']
      }
    }
    httpsOnly: true
  }
  identity: {
    type: 'SystemAssigned'
  }
}

output apiBaseUrl string = 'https://${appService.properties.defaultHostName}'

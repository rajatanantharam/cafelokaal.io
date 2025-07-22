targetScope = 'subscription'

@description('Environment name')
param environmentName string

@description('Location for all resources')
param location string = 'eastus'

@description('Tags for all resources')
param tags object = {}

var defaultTags = union({
  'azd-env-name': environmentName
}, tags)

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: defaultTags
}

module api './modules/api.bicep' = {
  name: 'api-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    tags: defaultTags
  }
}

module web './modules/web.bicep' = {
  name: 'web-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    tags: defaultTags
    apiBaseUrl: api.outputs.apiBaseUrl
  }
}

module monitoring './modules/monitoring.bicep' = {
  name: 'monitoring-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    tags: defaultTags
  }
}

module database './modules/database.bicep' = {
  name: 'database-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    tags: defaultTags
  }
}

module keyVault './modules/keyvault.bicep' = {
  name: 'keyvault-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    tags: defaultTags
  }
}

module identity './modules/identity.bicep' = {
  name: 'identity-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    tags: defaultTags
  }
}

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output API_BASE_URL string = api.outputs.apiBaseUrl
output WEB_URI string = web.outputs.webUri

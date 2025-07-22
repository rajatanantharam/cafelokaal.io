param location string
param environmentName string
param tags object

@secure()
param administratorLoginPassword string = newGuid()

var sqlServerName = 'sql-${environmentName}'
var sqlDatabaseName = 'sqldb-${environmentName}'

resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: sqlServerName
  location: location
  tags: tags
  properties: {
    administratorLogin: 'sqladmin'
    administratorLoginPassword: administratorLoginPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  tags: tags
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
}

resource sqlServerFirewallRule 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAllAzureIPs'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

output databaseName string = sqlDatabase.name
output serverName string = sqlServer.name
output serverFqdn string = sqlServer.properties.fullyQualifiedDomainName

param location string
param environmentName string
param tags object

var identityName = 'id-${environmentName}'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
  tags: tags
}

output identityId string = managedIdentity.id
output identityClientId string = managedIdentity.properties.clientId
output identityPrincipalId string = managedIdentity.properties.principalId

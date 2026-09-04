targetScope = 'subscription'

@description('Azure region')
param location string = 'westeurope'
@description('Resource group name')
param resourceGroupName string = 'rg-ak-site-prod'
@description('Globally unique ACR name (letters/numbers only)')
param acrName string
@description('AKS cluster name')
param aksName string = 'aks-ak-site-prod'
@description('Node VM size')
param nodeVmSize string = 'Standard_D2ds_v5'
@minValue(1)
@maxValue(5)
param nodeCount int = 2

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
}

module platform './platform.bicep' = {
  name: 'personal-site-platform'
  scope: rg
  params: {
    location: location
    acrName: acrName
    aksName: aksName
    nodeVmSize: nodeVmSize
    nodeCount: nodeCount
  }
}

output resourceGroup string = rg.name
output acrLoginServer string = platform.outputs.acrLoginServer
output aksName string = platform.outputs.aksName

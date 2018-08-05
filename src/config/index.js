// ipfs multihash to retrieve ABIs
export const ipfsABIsHash = 'QmciEP63apfMjqwx4Z2RYX8x4N4JdpTV2K5ipWwqSCx1fW'
export const ipfsTokensHash = 'QmRH8e8ssnj1CWVepGvAdwaADKNkEpgDU5bffTbeS6JuG9'
// hardcoded FORCED registry address
export const hardcodedRegistryAddress = ''
export const defaultRegistryAddress = '0xafbbefb788e478d30f2aca7c8fc8b8271a9603a2'

export function getIpfsABIsHash(network) {
  if (network === 'mainnet') {
    return 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu'
  } else {
    return ipfsABIsHash
  }
}

export const registries = {
  mainnet: [
    {
      name: 'The adChain Registry',
      registryAddress: '0x5e2eb68a31229b469e34999c467b017222677183',
      votingAddress: '0xb4b26709ffed2cd165b9b49eea1ac38d133d7975',
      tokenAddress: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
      tokenSymbol: 'ADT',
      tokenName: 'adToken',
      multihash: 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu',
    },
  ],
  rinkeby: [
    {
      name: 'Humans',
      registryAddress: '0xafbbefb788e478d30f2aca7c8fc8b8271a9603a2',
      votingAddress: '0xa1b09c9f6523b7e3a6d57cacf07ab6357524c96e',
      tokenAddress: '0x6709a93136ecfe3cff7615152cb423a202a8efb8',
      tokenSymbol: 'HMN',
      tokenName: 'Human',
      multihash: 'QmciEP63apfMjqwx4Z2RYX8x4N4JdpTV2K5ipWwqSCx1fW',
    },
  ],
}

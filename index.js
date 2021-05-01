// strawman crosschain id format

// [ magic, proto, network_id, actor_id, checksum ]

const crypto = require('crypto')
const rlp = require('rlp')
const { base58btc } = require('multiformats/bases/base58')

const ethereumMainnet = {
  katydid: encodeKaytdidLocation([60, 1]),
  actorIdLength: 20
}

const ethereumRopsten = {
  katydid: encodeKaytdidLocation([60, 3]),
  actorIdLength: 20
}

const filMainnet = {
  katydid: encodeKaytdidLocation([461, 'f']),
  actorIdLength: 25
}


logExamples('eth mainnet', ethereumMainnet, 4)
logExamples('eth ropsten', ethereumRopsten, 4)
logExamples('fil mainnet', filMainnet, 4)

function logExamples (label, network, amount) {
  for (let i = 0; i < amount; i++) {
    const address = crypto.randomBytes(network.actorIdLength)
    const actorId = encodeKaytdidLocation([address])
    const id = encodeKatydid({ networkId: network.katydid, actorId })
    console.log(`${label}: ${base58btc.encode(id)} ${id.toString('hex')}`)
  }
}

function encodeKatydid ({ networkId, actorId }) {
  const proto = Buffer.from('f031', 'hex')
  const checksum = Buffer.from([0])
  const location = rlp.encode([networkId, actorId])
  return Buffer.concat([proto, location, checksum])
}

function encodeKaytdidLocation (sections) {
  return rlp.encode(sections)
}
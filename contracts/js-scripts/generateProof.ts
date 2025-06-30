import { Noir } from '@noir-lang/noir_js'
import { ethers } from 'ethers'
import { UltraHonkBackend } from '@aztec/bb.js'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const circuitPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../circuits/target/zk_panagram.json'
)

const circuit = JSON.parse(fs.readFileSync(circuitPath, 'utf8'))

export async function generateProof() {
  const inputArray = process.argv.slice(2)

  try {
    const noir = new Noir(circuit)
    const bb = new UltraHonkBackend(circuit.bytecode, { threads: 1 })

    const inputs = {
      // private inputs
      guess_hash: inputArray[0],
      // public inputs
      answer_double_hash: inputArray[1],
      address: inputArray[2],
    }

    const { witness } = await noir.execute(inputs)
    const originalLog = console.log
    console.log = () => {}
    const { proof } = await bb.generateProof(witness, { keccak: true })
    console.log = originalLog
    // ABI encode the proof to return it in a format that can be used in test
    const proofEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['bytes'],
      [proof]
    )

    return proofEncoded
  } catch (error) {
    console.log(error)
    throw error
  }
}

;(async () => {
  generateProof()
    .then((proof) => {
      process.stdout.write(proof)
      process.exit(0)
    })
    .catch((error) => {
      console.log(error)
      process.exit(1)
    })
})()

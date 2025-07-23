import { useState, useEffect } from 'react'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import { abi } from '../abi/abi'
import { PANAGRAM_CONTRACT_ADDRESS } from '../constant'
import { generateProof } from '../utils/generateProof'
import { keccak256, toUtf8Bytes } from 'ethers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input as ShadcnInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const FIELD_MODULUS = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
)

export function uint8ArrayToHex(buffer: Uint8Array): string {
  const hex: string[] = []
  buffer.forEach(function (i) {
    let h = i.toString(16)
    if (h.length % 2) {
      h = '0' + h
    }
    hex.push(h)
  })
  return hex.join('')
}

export default function Input() {
  const { data: hash, isPending, writeContract, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })
  const [logs, setLogs] = useState<string[]>([])
  const [results, setResults] = useState('')
  const { address } = useAccount()

  if (!address) {
    throw new Error(
      'Address is undefined. Please ensure the user is connected.'
    )
  }

  const showLog = (content: string): void => {
    setLogs((prevLogs) => [...prevLogs, content])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLogs([])
    setResults('')

    try {
      const guessInput = (document.getElementById('guess') as HTMLInputElement)
        .value
      const guessHex = keccak256(toUtf8Bytes(guessInput))
      const reducedGuess = BigInt(guessHex) % FIELD_MODULUS
      const guessHash = '0x' + reducedGuess.toString(16).padStart(64, '0')
      const { proof } = await generateProof(guessHash, address, showLog)
      await writeContract({
        address: PANAGRAM_CONTRACT_ADDRESS,
        abi,
        functionName: 'makeGuess',
        args: [`0x${uint8ArrayToHex(proof)}`],
      })
    } catch (error: unknown) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isPending) {
      showLog('Transaction is processing... ⏳')
    }
    if (error) {
      showLog('Oh no! Something went wrong. 😞')
      setResults('Transaction failed.')
    }
    if (isConfirming) {
      showLog('Transaction in progress... ⏳')
    }
    if (isConfirmed) {
      showLog('You got it right! ✅')
      setResults('Transaction succeeded!')
    }
  }, [isPending, error, isConfirming, isConfirmed])

  return (
    <Card className='w-full max-w-md mx-auto bg-[#00C4B4]/10 backdrop-blur-sm border border-[#FF9900] shadow-xl rounded-2xl'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl font-bold text-[#00C4B4] tracking-tight'>
          Guess the Secret Word
        </CardTitle>
      </CardHeader>
      <CardContent className='p-6 space-y-4'>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <ShadcnInput
            type='text'
            id='guess'
            maxLength={9}
            placeholder='Type your guess'
            className='w-full px-4 py-3 text-lg text-gray-100 bg-gray-700/50 border border-[#FF9900]/50 rounded-md focus:ring-2 focus:ring-[#00C4B4] text-center placeholder:text-white'
          />

          <Button
            type='submit'
            id='submit'
            className='w-full py-3 text-lg font-semibold text-white bg-[#FF9900] hover:bg-[#FF9900]/90 rounded-md transition-all duration-200'
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? 'Processing...' : 'Submit Guess'}
          </Button>
        </form>

        {/* Logs and results */}
        <ScrollArea className='h-24 w-full rounded-md border border-[#FF9900]/50 p-3 bg-gray-900/50'>
          {logs.map((log, index) => (
            <div key={index} className='text-sm text-[#00C4B4] mb-2'>
              {log}
            </div>
          ))}
        </ScrollArea>

        {results && (
          <div className='text-center text-[#FF9900] font-semibold'>
            {results}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

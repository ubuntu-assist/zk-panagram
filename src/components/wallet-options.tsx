import { useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return (
    <Card className='w-full max-w-md mx-auto bg-gradient-to-b from-[#00C4B4]/10 to-[#00C4B4]/5 border border-[#FF9900] shadow-xl rounded-2xl'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-[#00C4B4] text-center'>
          Connect Your Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col space-y-3 p-6'>
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className='w-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-white py-3 rounded-md font-semibold transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02]'
            variant='outline'
          >
            {connector.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

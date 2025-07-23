import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })

  return (
    <Card className='w-full max-w-xs mx-auto bg-[#00C4B4]/10 backdrop-blur-sm border border-[#FF9900] shadow-xl rounded-2xl'>
      <CardContent className='flex flex-col items-center space-y-4 p-4'>
        {ensName && (
          <div className='text-lg font-semibold text-[#FF9900]'>{ensName}</div>
        )}
        {address && (
          <div className='text-sm text-[#00C4B4] truncate w-full text-center'>
            {address}
          </div>
        )}
        <Button
          onClick={() => disconnect()}
          className='w-full py-2 text-base font-semibold text-white bg-[#FF9900] hover:bg-[#FF9900]/90 rounded-md transition-all duration-200'
        >
          Disconnect
        </Button>
      </CardContent>
    </Card>
  )
}

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import NFTGallery from './NFTGallery'

export default function NFTGalleryContainer({
  userAddress,
}: {
  userAddress: string
}) {
  return (
    <div className='my-6 px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto flex flex-col items-center'>
      <h2
        className={cn(
          'text-3xl font-semibold text-center mb-6',
          'text-[#00C4B4]'
        )}
      >
        Your NFT Collection
      </h2>

      <div className='grid grid-cols-1 gap-6 justify-center items-center'>
        <Card
          className={cn(
            'p-4 hover:scale-105 transition-all duration-300 flex justify-center text-center',
            'border-[#FF9900] hover:border-[#00C4B4]'
          )}
        >
          <NFTGallery owner={userAddress} token_id={0} />
        </Card>

        <Card
          className={cn(
            'p-4 hover:scale-105 transition-all duration-300 flex justify-center text-center',
            'border-[#FF9900] hover:border-[#00C4B4]'
          )}
        >
          <NFTGallery owner={userAddress} token_id={1} />
        </Card>
      </div>
    </div>
  )
}

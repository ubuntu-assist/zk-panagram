import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Input from './Input'
import PanagramImage from './PanagramImage'
import ConnectWallet from './ConnectWallet'
import NFTGalleryContainer from './NFTGalleryContainer'

function Panagram() {
  const { isConnected, address: userAddress } = useAccount()

  return (
    <div className='min-h-screen py-12 px-4 flex items-center justify-center relative overflow-hidden'>
      {/* Geometric background pattern */}
      <div className='absolute inset-0 bg-[#00C4B4]/5 z-0'>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgwLDE5NiwxODAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
      </div>

      {/* Animated gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-[#00C4B4]/20 via-[#FF9900]/10 to-[#00C4B4]/20 animate-gradient-shift z-0'></div>

      <Card className='w-full max-w-5xl bg-white/90 backdrop-blur-lg border border-[#FF9900]/30 shadow-2xl rounded-3xl relative z-10'>
        <CardHeader className='text-center'>
          <CardTitle className='text-4xl font-bold text-[#00C4B4] tracking-tight'>
            ZK Panagram
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          {/* Connect Wallet */}
          <div className='flex justify-center mb-8'>
            <ConnectWallet />
          </div>

          {isConnected ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Panagram Game */}
              <Card className='bg-[#FF9900]/10 border border-[#FF9900]/20 backdrop-blur-sm relative overflow-hidden'>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMTUzLDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-20"></div>
                <CardContent className='pt-6 flex flex-col items-center space-y-4 relative z-10'>
                  <PanagramImage />
                  <Input />
                </CardContent>
              </Card>

              {/* NFT Gallery */}
              <Card className='bg-[#00C4B4]/10 border border-[#00C4B4]/20 backdrop-blur-sm relative overflow-hidden'>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgwLDE5NiwxODAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-20"></div>
                <CardContent className='pt-6 flex flex-col items-center relative z-10'>
                  {userAddress ? (
                    <NFTGalleryContainer userAddress={userAddress} />
                  ) : (
                    <p className='text-[#00C4B4] text-center'>
                      No address available.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className='text-center text-[#00C4B4] text-lg'>
              Please connect your wallet to start.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Panagram

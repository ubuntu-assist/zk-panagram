import { ANAGRAM } from '../constant'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function PanagramImage() {
  const word = ANAGRAM
  const middleIndex = Math.floor(word.length / 2)
  const letters = word.split('')
  const middleLetter = letters[middleIndex]
  letters.splice(middleIndex, 1)
  const scrambledLetters = letters.sort(() => Math.random() - 0.5)
  scrambledLetters.splice(middleIndex, 0, middleLetter)

  return (
    <Card className='bg-transparent border-none shadow-none'>
      <CardContent className='flex items-center justify-center my-6 p-0'>
        <div className='relative w-72 h-72'>
          {/* Middle letter */}
          <Badge
            className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
              bg-[#00C4B4] text-white w-14 h-14 rounded-full flex items-center justify-center
              text-2xl font-bold hover:bg-[#00C4B4]/80 transition-all duration-200'
          >
            {scrambledLetters[middleIndex]}
          </Badge>

          {/* Surrounding letters in circular layout */}
          {scrambledLetters.map((letter, index) => {
            if (index === middleIndex) return null
            const angle =
              (360 / (scrambledLetters.length - 1)) *
              (index < middleIndex ? index : index - 1)
            const x = 50 + 40 * Math.cos((angle * Math.PI) / 180)
            const y = 50 + 40 * Math.sin((angle * Math.PI) / 180)

            return (
              <Badge
                key={index}
                className='absolute transform -translate-x-1/2 -translate-y-1/2
                  bg-[#FF9900] text-white w-12 h-12 rounded-full flex items-center justify-center
                  text-xl font-semibold hover:bg-[#FF9900]/80 transition-all duration-200'
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {letter}
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default PanagramImage

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'

const TIME_LIMIT = 30 * 60 * 1000  // 30 minutes in ms

const TimerBar = ({ startTime, onTimeUp }) => {
  const [remaining, setRemaining] = useState(TIME_LIMIT)
  const intervalRef = useRef(null)
  const hasExpiredRef = useRef(false)  // prevent calling onTimeUp multiple times

  useEffect(() => {
    if (!startTime) return

    // compute immediately
    const initial = TIME_LIMIT - (Date.now() - startTime)
    setRemaining(Math.max(0, initial))

    // then update every second
    intervalRef.current = setInterval(() => {
      const rem = TIME_LIMIT - (Date.now() - startTime)

      if (rem <= 0) {
        setRemaining(0)
        clearInterval(intervalRef.current)

        // fire the callback once
        if (!hasExpiredRef.current && onTimeUp) {
          hasExpiredRef.current = true
          onTimeUp()
        }
        return
      }

      setRemaining(rem)
    }, 1000)

    return () => clearInterval(intervalRef.current)  // cleanup
  }, [startTime])

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const isLow = remaining < 60000  // under 60 seconds

  return (
    <Badge variant={isLow ? 'destructive' : 'outline'} className="text-base px-4 py-1">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </Badge>
  )
}

export default TimerBar
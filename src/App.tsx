import { CSSProperties, useEffect, useState } from 'react'
import './main.scss'

function App() {
  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className='wrapper'
      style={
        {
          '--vw': `${windowDimensions.width / 100}px`,
          '--vh': `${windowDimensions.height / 100}px`
        } as CSSProperties
      }
    >
      <div className='drag-section'>
        <div className='drag-grid-wrap'>
          <div className='drag-grid'>
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                className='drag-grid-item'
                key={i}
                data-row={Math.floor(i / 3)}
                data-col={i % 3}
                style={{ backgroundColor: `hsl(${i * 20}, 100%, 50%)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

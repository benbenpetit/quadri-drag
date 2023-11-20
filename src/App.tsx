import { CSSProperties, useEffect, useState } from 'react'
import './main.scss'

function App() {
  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  const [dragging, setDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })

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

  useEffect(() => {
    const handleMouseDown = () => setDragging(true)
    const handleMouseUp = () => setDragging(false)

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setDragPosition({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [dragging])

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
          <div
            className='drag-grid'
            style={{
              transform: `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0px)`
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                className='drag-grid-item'
                key={i}
                data-row={Math.floor(i / 3)}
                data-col={i % 3}
                style={{ backgroundColor: `hsl(${i * 40}, 100%, 20%)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

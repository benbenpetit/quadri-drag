import { CSSProperties, useEffect, useRef, useState } from 'react'
import './main.scss'
import clsx from 'clsx'

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t

const App = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  const requestRef = useRef(0)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [offsetCursorPos, setOffsetCursorPos] = useState({ x: 0, y: 0 })
  const [basePos, setBasePos] = useState({ x: 0, y: 0 })
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [lerpMousePos, setLerpMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const { x, y } = e
      setOffsetCursorPos({ x, y })
      setBasePos(dragPos)
      setIsMouseDown(true)
    }
    const handleMouseUp = () => {
      setIsMouseDown(false)
      setDragging(false)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragPos])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        setDragging(true)
      }
      if (dragging && isMouseDown) {
        const newPos = {
          x: basePos.x + e.x - offsetCursorPos.x,
          y: basePos.y + e.y - offsetCursorPos.y
        }

        setMousePos({
          x: Math.min(
            Math.max(-windowDimensions.width, newPos.x),
            windowDimensions.width
          ),
          y: Math.min(
            Math.max(-windowDimensions.height, newPos.y),
            windowDimensions.height
          )
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [dragging, offsetCursorPos, basePos])

  useEffect(() => {
    setDragPos({
      x: lerpMousePos.x,
      y: lerpMousePos.y
    })
  }, [lerpMousePos])

  const handleRaf = () => {
    setLerpMousePos({
      x: lerp(lerpMousePos.x, mousePos.x, 0.1),
      y: lerp(lerpMousePos.y, mousePos.y, 0.1)
    })

    requestRef.current = requestAnimationFrame(handleRaf)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(handleRaf)

    return () => cancelAnimationFrame(requestRef.current)
  }, [lerpMousePos, mousePos])

  return (
    <div
      className={clsx('wrapper', dragging && 'is-dragging')}
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
              transform: `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px)`
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                className='drag-grid-item'
                key={i}
                data-row={Math.floor(i / 3)}
                data-col={i % 3}
                style={{ backgroundColor: `hsl(${i * 40}, 50%, 60%)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

import clsx from 'clsx'
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import './main.scss'

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
  const realCenterPos = useMemo(() => {
    return {
      x: -dragPos.x + windowDimensions.width / 2,
      y: -dragPos.y + windowDimensions.height / 2
    }
  }, [dragPos, windowDimensions])

  const dragToItem = (row: number, col: number) => {
    setMousePos({
      x: -windowDimensions.width * (col - 0.5) + windowDimensions.width / 2,
      y: -windowDimensions.height * (row - 0.5) + windowDimensions.height / 2
    })
  }

  const handleMapItemClick = (row: number, col: number) => {
    dragToItem(row, col)
    console.log(row, col)
  }

  const isInsideItem = (row: number, col: number) => {
    const cleanRealCenterPos = {
      x: realCenterPos.x / windowDimensions.width + 1,
      y: realCenterPos.y / windowDimensions.height + 1
    }

    return (
      cleanRealCenterPos.x > col &&
      cleanRealCenterPos.x < col + 1 &&
      cleanRealCenterPos.y > row &&
      cleanRealCenterPos.y < row + 1
    )
  }

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

  const handleMouseDown = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    setOffsetCursorPos({ x: clientX, y: clientY })
    setBasePos(dragPos)
    setIsMouseDown(true)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false)
      setDragging(false)
    }

    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragPos])

  useEffect(() => {
    setMousePos((prevState) => ({
      x: Math.min(
        Math.max(-windowDimensions.width, prevState.x),
        windowDimensions.width
      ),
      y: Math.min(
        Math.max(-windowDimensions.height, prevState.y),
        windowDimensions.height
      )
    }))
  }, [windowDimensions])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      setDragging(true)
    }

    if (dragging && isMouseDown) {
      const newPos = {
        x: basePos.x + e.clientX - offsetCursorPos.x,
        y: basePos.y + e.clientY - offsetCursorPos.y
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

  useEffect(() => {
    setDragPos({
      x: lerpMousePos.x,
      y: lerpMousePos.y
    })
  }, [lerpMousePos])

  useEffect(() => {
    const handleRaf = () => {
      setLerpMousePos({
        x: lerp(lerpMousePos.x, mousePos.x, 0.1),
        y: lerp(lerpMousePos.y, mousePos.y, 0.1)
      })

      requestRef.current = requestAnimationFrame(handleRaf)
    }

    requestRef.current = requestAnimationFrame(handleRaf)

    return () => cancelAnimationFrame(requestRef.current)
  }, [lerpMousePos, mousePos])

  const computeDragItemComponent = (i: number) => {
    switch (i) {
      case 0:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 1:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 2:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 3:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 4:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 5:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 6:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 7:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 32
            }}
          >
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      case 8:
        return (
          <div>
            <h1>Drag Item {i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus, consequuntur!
            </p>
          </div>
        )
      default:
        return null
    }
  }

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
      <div className='map-grid'>
        <div
          className='map-point'
          style={{
            left: `${
              ((-dragPos.x / windowDimensions.width + 1) / 3 + 1 / 6) * 100
            }%`,
            top: `${
              ((-dragPos.y / windowDimensions.height + 1) / 3 + 1 / 6) * 100
            }%`
          }}
        />
        <table>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 3 }).map((_, j) => {
                  const isInside = isInsideItem(i, j)
                  return (
                    <td
                      className={clsx('map-grid-item', isInside && 'is-inside')}
                      key={j}
                      data-row={i}
                      data-col={j}
                      onClick={() => handleMapItemClick(i, j)}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={clsx('drag-section', dragging && 'is-dragging')}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      >
        <div
          className='drag-grid-wrap'
          style={{
            transform: `translate(-50%, -50%) translate3d(0, 0, 0) scale(${
              dragging ? 0.9 : 1
            })`
          }}
        >
          <div
            className='drag-grid'
            style={{
              transform: `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px)`
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => {
              const row = Math.floor(i / 3)
              const col = Math.floor(i % 3)
              const isInside = isInsideItem(row, col)
              return (
                <div
                  className={clsx('drag-grid-item', isInside && 'is-inside')}
                  key={i}
                  data-row={Math.floor(i / 3)}
                  data-col={i % 3}
                >
                  {computeDragItemComponent(i)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

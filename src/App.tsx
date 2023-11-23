import clsx from 'clsx'
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import './main.scss'

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t

const ROTATES = Array.from({ length: 9 }).map(() => {
  const rotate = Math.floor(Math.random() * 40)
  return rotate - 20
})

const App = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
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
      y: -dragPos.y + windowDimensions.height / 2,
    }
  }, [dragPos, windowDimensions])
  const [isZoomOut, setIsZoomOut] = useState(false)

  const dragToItem = (row: number, col: number) => {
    setMousePos({
      x: -windowDimensions.width * (col - 0.5) + windowDimensions.width / 2,
      y: -windowDimensions.height * (row - 0.5) + windowDimensions.height / 2,
    })
  }

  const handleMapItemClick = (row: number, col: number) => {
    dragToItem(row, col)
    handleZoomOutClick(false, row, col)
  }

  const isInsideItem = (row: number, col: number) => {
    const cleanRealCenterPos = {
      x: realCenterPos.x / windowDimensions.width + 1,
      y: realCenterPos.y / windowDimensions.height + 1,
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
        width: window.innerWidth,
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
      ),
    }))
  }, [windowDimensions])

  const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      if (!dragging) setDragging(true)
      if (isZoomOut) handleZoomOutClick(false)
    }

    if (dragging && isMouseDown) {
      const newPos = {
        x: basePos.x + e.clientX - offsetCursorPos.x,
        y: basePos.y + e.clientY - offsetCursorPos.y,
      }

      setMousePos({
        x: Math.min(
          Math.max(-windowDimensions.width, newPos.x),
          windowDimensions.width
        ),
        y: Math.min(
          Math.max(-windowDimensions.height, newPos.y),
          windowDimensions.height
        ),
      })
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMouseDown, dragging, offsetCursorPos, basePos, windowDimensions])

  useEffect(() => {
    setDragPos({
      x: lerpMousePos.x,
      y: lerpMousePos.y,
    })
  }, [lerpMousePos])

  useEffect(() => {
    const handleRaf = () => {
      setLerpMousePos({
        x: lerp(lerpMousePos.x, mousePos.x, 0.1),
        y: lerp(lerpMousePos.y, mousePos.y, 0.1),
      })

      requestRef.current = requestAnimationFrame(handleRaf)
    }

    requestRef.current = requestAnimationFrame(handleRaf)

    return () => cancelAnimationFrame(requestRef.current)
  }, [lerpMousePos, mousePos])

  const handleZoomOutClick = (bool: boolean, row = 1, col = 1) => {
    setIsZoomOut(bool)
    dragToItem(row, col)
  }

  const getDragRowCol = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const dragItem = target.closest('.drag-grid-item')
    const row = Number(dragItem?.getAttribute('data-row')) ?? 1
    const col = Number(dragItem?.getAttribute('data-col')) ?? 1
    return { row, col }
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY
      const zooming = delta < 0

      if (!isZoomOut && zooming) return

      if (zooming) {
        const { row, col } = getDragRowCol(e)
        handleZoomOutClick(false, row, col)
      } else {
        handleZoomOutClick(true)
      }
    }

    window.addEventListener('wheel', handleWheel)

    return () => window.removeEventListener('wheel', handleWheel)
  }, [isZoomOut])

  const getImageUrl = (x: string) => {
    return new URL(`/src/assets/img/${x}`, import.meta.url).href
  }

  const computeDragItemComponent = (i: number) => {
    switch (i) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 5:
      case 6:
      case 7:
      case 8:
        return (
          <div className="item-container">
            <img
              src={getImageUrl(`${i + 1}.avif`)}
              alt="Samuel Zeller photo"
              draggable={false}
              style={{
                transform: `rotate(${ROTATES[i]}deg)`,
              }}
            />
          </div>
        )
      case 4:
        return (
          <div className="item-container">
            <h1>Samuel Zeller</h1>
            <a href="https://www.samuelzeller.ch/series/" target="_blank">
              visit
            </a>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="wrapper"
      style={
        {
          '--vw': `${windowDimensions.width / 100}px`,
          '--vh': `${windowDimensions.height / 100}px`,
        } as CSSProperties
      }
      zoom-out={String(isZoomOut)}
    >
      <header>
        <div className="unzoom">
          <button onClick={() => handleZoomOutClick(!isZoomOut)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </button>
        </div>
        <div className="map-grid">
          <div
            className="map-point"
            style={{
              left: `${
                ((-dragPos.x / windowDimensions.width + 1) / 3 + 1 / 6) * 100
              }%`,
              top: `${
                ((-dragPos.y / windowDimensions.height + 1) / 3 + 1 / 6) * 100
              }%`,
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
                        className={clsx(
                          'map-grid-item',
                          isInside && 'is-inside'
                        )}
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
      </header>
      <div
        className={clsx('drag-section', dragging && 'is-dragging')}
        onMouseDown={handleMouseDown}
      >
        <div
          className="drag-grid-wrap"
          style={{
            transform: `translate(-50%, -50%) translate3d(0, 0, 0) scale(${
              isZoomOut ? 1 / 3 : dragging ? 0.85 : 1
            })`,
          }}
        >
          <div
            className="drag-grid"
            style={{
              transform: `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px)`,
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
                  onClick={() => {
                    if (isZoomOut) {
                      handleZoomOutClick(false, row, col)
                    }
                  }}
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

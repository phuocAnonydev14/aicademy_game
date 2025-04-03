"use client"

import { useState, useRef, useEffect } from "react"

interface WordSearchGridProps {
  grid: string[][]
  wordPositions: Record<
    string,
    {
      row: number
      col: number
      direction: string
      positions: { row: number; col: number }[]
    }
  >
  foundWords: string[]
  selectedCells: { row: number; col: number }[]
  onCellClick: (row: number, col: number) => void
  onCellDrag: (cells: { row: number; col: number }[]) => void
  selectionColors: Record<string, string>
}

export default function WordSearchGrid({
  grid,
  wordPositions,
  foundWords,
  selectedCells,
  onCellClick,
  onCellDrag,
  selectionColors,
}: WordSearchGridProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null)
  const [currentDragCells, setCurrentDragCells] = useState<{ row: number; col: number }[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const [lastTouchTime, setLastTouchTime] = useState(0)

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !gridRef.current) return

      e.preventDefault() // Prevent scrolling while dragging

      const touch = e.touches[0]
      const element = document.elementFromPoint(touch.clientX, touch.clientY)

      if (element && element.hasAttribute("data-cell")) {
        const cellData = element.getAttribute("data-cell")
        if (cellData) {
          const [row, col] = cellData.split("-").map(Number)
          handleCellEnter(row, col)
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDragging) {
        setIsDragging(false)

        // Check if this was a tap or a drag
        const now = new Date().getTime()
        const touchDuration = now - lastTouchTime

        if (touchDuration < 200 && currentDragCells.length === 1) {
          // This was a quick tap, handle as a click
          const cell = currentDragCells[0]
          onCellClick(cell.row, cell.col)
        } else {
          // This was a drag, update the selection
          onCellDrag(currentDragCells)
        }

        setCurrentDragCells([])
      }
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, onCellDrag, onCellClick, currentDragCells, lastTouchTime])

  // Handle mouse events for desktop
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)

        // If only one cell was selected and it was a quick click, handle as a click
        if (currentDragCells.length === 1) {
          // This was a click, not a drag
          const cell = currentDragCells[0]
          onCellClick(cell.row, cell.col)
        } else {
          // This was a drag, update the selection
          onCellDrag(currentDragCells)
        }

        setCurrentDragCells([])
      }
    }

    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, onCellDrag, onCellClick, currentDragCells])

  const handleCellDown = (row: number, col: number, isTouch = false) => {
    // Start potential drag
    setIsDragging(true)
    setStartCell({ row, col })
    setCurrentDragCells([{ row, col }])

    if (isTouch) {
      setLastTouchTime(new Date().getTime())
    }
  }

  const handleCellEnter = (row: number, col: number) => {
    if (!isDragging || !startCell) return

    // Determine the direction of selection
    const rowDiff = row - startCell.row
    const colDiff = col - startCell.col

    // Only allow straight lines (horizontal, vertical, diagonal)
    if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
      const newSelectedCells = []

      // Calculate step direction
      const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1
      const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1

      // Calculate number of steps
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))

      // Add cells along the line
      for (let i = 0; i <= steps; i++) {
        const cellRow = startCell.row + i * rowStep
        const cellCol = startCell.col + i * colStep

        // Make sure we're within grid bounds
        if (cellRow >= 0 && cellRow < grid.length && cellCol >= 0 && cellCol < grid[0].length) {
          newSelectedCells.push({
            row: cellRow,
            col: cellCol,
          })
        }
      }

      setCurrentDragCells(newSelectedCells)
    }
  }

  const isCellSelected = (row: number, col: number) => {
    return (
      selectedCells.some((cell) => cell.row === row && cell.col === col) ||
      currentDragCells.some((cell) => cell.row === row && cell.col === col)
    )
  }

  const getCellColor = (row: number, col: number) => {
    // Check if this cell is part of a found word
    for (const word of foundWords) {
      const positions = wordPositions[word]?.positions || []
      if (positions.some((pos) => pos.row === row && pos.col === col)) {
        return selectionColors[word] || ""
      }
    }

    // Check if this cell is currently selected
    if (isCellSelected(row, col)) {
      return "bg-gray-200"
    }

    return ""
  }

  if (grid.length === 0) return <div>Loading...</div>

  return (
    <div className="select-none" ref={gridRef}>
      <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-cell={`${rowIndex}-${colIndex}`}
              className={`
                w-full aspect-square flex items-center justify-center 
                text-lg font-bold border border-gray-200 rounded-md
                cursor-pointer select-none transition-colors
                ${getCellColor(rowIndex, colIndex)}
                ${isCellSelected(rowIndex, colIndex) ? "ring-2 ring-gray-500" : ""}
                active:bg-gray-100
              `}
              onMouseDown={() => handleCellDown(rowIndex, colIndex)}
              onMouseEnter={() => handleCellEnter(rowIndex, colIndex)}
              onTouchStart={() => handleCellDown(rowIndex, colIndex, true)}
            >
              {letter}
            </div>
          )),
        )}
      </div>
    </div>
  )
}


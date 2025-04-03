import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react"
import WordSearchGrid from "@/components/game/wordle-ai/word-search-grid"
import WordList from "@/components/game/wordle-ai/word-list"
import GameHeader from "@/components/game/wordle-ai/game-header"
import { generateWordSearch } from "@/libs/word-search-generator"

export const Route = createFileRoute('/game/wordle-ai')({
  component: RouteComponent,
})

function RouteComponent() {
  const [grid, setGrid] = useState<string[][]>([])
  const [words, setWords] = useState<string[]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [wordPositions, setWordPositions] = useState<
    Record<string, { row: number; col: number; direction: string; positions: { row: number; col: number }[] }>
  >({})
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [showInstructions, setShowInstructions] = useState(true)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectionColors, setSelectionColors] = useState<Record<string, string>>({})

  const colors = [
    "bg-blue-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-pink-300",
    "bg-purple-300",
    "bg-orange-300",
    "bg-teal-300",
    "bg-indigo-300",
    "bg-red-300",
  ]

  useEffect(() => {
    startNewGame()
  }, [])

  // Initialize selection colors for found words
  useEffect(() => {
    const newColors: Record<string, string> = {}
    foundWords.forEach((word, index) => {
      newColors[word] = colors[index % colors.length]
    })
    setSelectionColors(newColors)
  }, [foundWords])

  const startNewGame = () => {
    const aiWords = [
      "NEURAL",
      "ROBOTS",
      "TENSOR",
      "VISION",
      "SPEECH",
      "LEARNS",
      "MODELS",
      "AGENTS",
      "VECTOR",
      "PROMPT",
      "AI",
      "ML",
      "DATA",
    ]

    // Select random words for this game (between 6-8 words)
    const numWords = Math.floor(Math.random() * 3) + 6
    const shuffled = [...aiWords].sort(() => 0.5 - Math.random())
    const selectedWords = shuffled.slice(0, numWords)

    // Generate the word search grid
    const { grid, wordPositions } = generateWordSearch(selectedWords, 10, 10)

    setGrid(grid)
    setWords(selectedWords)
    setWordPositions(wordPositions)
    setFoundWords([])
    setSelectedCells([])
    setGameComplete(false)
  }

  // Add a cell to the selection
  const addCellToSelection = (row: number, col: number) => {
    // Check if the cell is already selected
    const isAlreadySelected = selectedCells.some((cell) => cell.row === row && cell.col === col)

    if (isAlreadySelected) {
      // If already selected, remove it
      const newSelectedCells = selectedCells.filter((cell) => !(cell.row === row && cell.col === col))
      setSelectedCells(newSelectedCells)
    } else {
      // If not selected, add it
      setSelectedCells([...selectedCells, { row, col }])
    }
  }

  // Set the selection to a completely new set of cells
  const setSelection = (cells: { row: number; col: number }[]) => {
    setSelectedCells(cells)
  }

  const checkSelection = () => {
    if (selectedCells.length === 0) return

    // Get the word formed by the selected cells
    const selectedWord = selectedCells.map((cell) => grid[cell.row][cell.col]).join("")

    // Also check the reverse of the word
    const reversedWord = selectedWord.split("").reverse().join("")

    // Check if the word exists in our word list
    const foundWord = words.find((word) => word === selectedWord || word === reversedWord)

    if (foundWord && !foundWords.includes(foundWord)) {
      // Word found!
      const newFoundWords = [...foundWords, foundWord]
      setFoundWords(newFoundWords)

      // Store the positions for this word
      setWordPositions({
        ...wordPositions,
        [foundWord]: {
          ...(wordPositions[foundWord] || {}),
          positions: [...selectedCells],
        },
      })

      // Check if all words are found
      if (newFoundWords.length === words.length) {
        setGameComplete(true)
      }
    }

    // Clear selection
    setSelectedCells([])
  }

  const clearSelection = () => {
    setSelectedCells([])
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <GameHeader onInfoClick={() => setShowInstructions(true)} />

      <div className="w-full max-w-md mx-auto mt-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <WordSearchGrid
            grid={grid}
            wordPositions={wordPositions}
            foundWords={foundWords}
            selectedCells={selectedCells}
            onCellClick={addCellToSelection}
            onCellDrag={setSelection}
            selectionColors={selectionColors}
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={checkSelection}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              disabled={selectedCells.length === 0}
            >
              Check Word
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={selectedCells.length === 0}
            >
              Clear
            </button>
          </div>

          <div className="mt-6">
            <WordList words={words} foundWords={foundWords} />
          </div>

          {gameComplete && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-emerald-600 mb-2">Congratulations!</h3>
              <p className="mb-4">You found all the AI-related terms!</p>
              <button
                onClick={startNewGame}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}

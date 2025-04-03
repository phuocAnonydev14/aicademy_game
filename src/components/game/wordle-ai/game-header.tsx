
import { Info } from "lucide-react"

interface GameHeaderProps {
  onInfoClick: () => void
}

export default function GameHeader({ onInfoClick }: GameHeaderProps) {
  return (
    <header className="w-full max-w-md flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold text-gray-800">AI Word Search</h1>
      <button
        onClick={onInfoClick}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Instructions"
      >
        <Info className="h-5 w-5 text-gray-600" />
      </button>
    </header>
  )
}


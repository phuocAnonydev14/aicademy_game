interface WordListProps {
    words: string[]
    foundWords: string[]
  }
  
  export default function WordList({ words, foundWords }: WordListProps) {
    return (
      <div>
        <h3 className="text-lg font-medium mb-2">Find these AI terms:</h3>
        <div className="grid grid-cols-3 gap-2">
          {words.map((word) => (
            <div
              key={word}
              className={`
                px-3 py-1 rounded-md border text-center
                ${
                  foundWords.includes(word)
                    ? "bg-emerald-100 border-emerald-300 line-through text-emerald-700"
                    : "border-gray-300"
                }
              `}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  
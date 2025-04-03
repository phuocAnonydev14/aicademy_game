// Function to generate a word search puzzle
export function generateWordSearch(words: string[], rows: number, cols: number) {
    // Initialize grid with empty spaces
    const grid: string[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(""))
  
    // Track word positions
    const wordPositions: Record<
      string,
      {
        row: number
        col: number
        direction: string
        positions: { row: number; col: number }[]
      }
    > = {}
  
    // Sort words by length (longest first)
    const sortedWords = [...words].sort((a, b) => b.length - a.length)
  
    // Directions: horizontal, vertical, diagonal
    const directions = [
      { rowDir: 0, colDir: 1, name: "horizontal" }, // →
      { rowDir: 1, colDir: 0, name: "vertical" }, // ↓
      { rowDir: 1, colDir: 1, name: "diagonal-down" }, // ↘
      { rowDir: 1, colDir: -1, name: "diagonal-up" }, // ↗
      { rowDir: 0, colDir: -1, name: "horizontal-back" }, // ←
      { rowDir: -1, colDir: 0, name: "vertical-up" }, // ↑
      { rowDir: -1, colDir: -1, name: "diagonal-up-back" }, // ↖
      { rowDir: -1, colDir: 1, name: "diagonal-down-back" }, // ↙
    ]
  
    // Place each word
    for (const word of sortedWords) {
      let placed = false
  
      // Try multiple times to place the word
      for (let attempts = 0; attempts < 100 && !placed; attempts++) {
        // Pick a random direction
        const dirIndex = Math.floor(Math.random() * directions.length)
        const direction = directions[dirIndex]
  
        // Calculate bounds correctly to prevent out-of-bounds access
        let startRowMin = 0
        let startRowMax = rows - 1
        let startColMin = 0
        let startColMax = cols - 1
  
        // Adjust bounds based on word length and direction
        if (direction.rowDir > 0) {
          // Moving down, need to start higher up
          startRowMax = rows - word.length
        } else if (direction.rowDir < 0) {
          // Moving up, need to start lower down
          startRowMin = word.length - 1
        }
  
        if (direction.colDir > 0) {
          // Moving right, need to start more left
          startColMax = cols - word.length
        } else if (direction.colDir < 0) {
          // Moving left, need to start more right
          startColMin = word.length - 1
        }
  
        // Skip if we can't place the word in this direction
        if (startRowMax < startRowMin || startColMax < startColMin) {
          continue
        }
  
        // Pick a random starting position within valid bounds
        const startRow = startRowMin + Math.floor(Math.random() * (startRowMax - startRowMin + 1))
        const startCol = startColMin + Math.floor(Math.random() * (startColMax - startColMin + 1))
  
        // Check if the word can be placed here
        let canPlace = true
        const positions: { row: number; col: number }[] = []
  
        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * direction.rowDir
          const col = startCol + i * direction.colDir
  
          // Double-check bounds to be safe
          if (row < 0 || row >= rows || col < 0 || col >= cols) {
            canPlace = false
            break
          }
  
          positions.push({ row, col })
  
          // Check if the cell is empty or has the same letter
          if (grid[row][col] !== "" && grid[row][col] !== word[i]) {
            canPlace = false
            break
          }
        }
  
        // Place the word if possible
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i * direction.rowDir
            const col = startCol + i * direction.colDir
            grid[row][col] = word[i]
          }
  
          // Record the word's position
          wordPositions[word] = {
            row: startRow,
            col: startCol,
            direction: direction.name,
            positions,
          }
  
          placed = true
        }
      }
  
      // If we couldn't place the word after many attempts, skip it
      if (!placed) {
        console.warn(`Could not place word: ${word}`)
      }
    }
  
    // Fill empty cells with random letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] === "") {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
  
    return { grid, wordPositions }
  }
  
  
"use client"

import { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import { Button } from "@/components/ui/button"
import { Shuffle, RotateCcw, Trophy } from "lucide-react"

export default function WordPhysicsGame() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [targetWord, setTargetWord] = useState("")
  const [message, setMessage] = useState("")

  // Word lists for different levels
  const wordLists = {
    1: ["CAT", "DOG", "SUN", "RUN", "HAT"],
    2: ["PLAY", "JUMP", "SWIM", "BIKE", "GAME"],
    3: ["HAPPY", "BRAVE", "SMART", "QUICK", "FUNNY"],
  }

  // Initialize the physics engine
  useEffect(() => {
    if (!sceneRef.current) return

    // Create engine with mouse control
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.5 },
    })
    engineRef.current = engine

    // Create renderer
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: 500,
        wireframes: false,
        background: "#f0f9ff",
      },
    })
    renderRef.current = render

    // Add mouse control
    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })

    // Keep the mouse in sync with rendering
    render.mouse = mouse

    // Add mouse constraint to world
    Matter.World.add(engine.world, mouseConstraint)

    // Create walls
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: "#94a3b8" },
    }

    const ground = Matter.Bodies.rectangle(
        render.options.width / 2,
        render.options.height,
        render.options.width,
        20,
        wallOptions,
    )
    const leftWall = Matter.Bodies.rectangle(0, render.options.height / 2, 20, render.options.height, wallOptions)
    const rightWall = Matter.Bodies.rectangle(
        render.options.width,
        render.options.height / 2,
        20,
        render.options.height,
        wallOptions,
    )
    const ceiling = Matter.Bodies.rectangle(render.options.width / 2, 0, render.options.width, 20, wallOptions)

    Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling])

    // Start the engine and renderer
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)
    runnerRef.current = runner

    // Add event to keep blocks in bounds
    Matter.Events.on(engine, "afterUpdate", keepBlocksInBounds)

    // Start a new level
    startLevel(level)

    // Handle window resize
    const handleResize = () => {
      if (sceneRef.current && renderRef.current) {
        renderRef.current.options.width = sceneRef.current.clientWidth
        renderRef.current.canvas.width = sceneRef.current.clientWidth
        Matter.Render.setPixelRatio(renderRef.current, window.devicePixelRatio)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)

      // Clean up Matter.js resources
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current)
        renderRef.current.canvas.remove()
        renderRef.current = null
      }

      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current)
        runnerRef.current = null
      }

      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false)
        Matter.Engine.clear(engineRef.current)
        engineRef.current = null
      }
    }
  }, [])

  // Keep blocks within bounds
  const keepBlocksInBounds = () => {
    if (!engineRef.current || !renderRef.current) return

    const bodies = Matter.Composite.allBodies(engineRef.current.world)
    const letterBodies = bodies.filter((body) => !body.isStatic)
    const bounds = {
      min: { x: 30, y: 30 },
      max: {
        x: renderRef.current.options.width - 30,
        y: renderRef.current.options.height - 30,
      },
    }

    letterBodies.forEach((body) => {
      const { x, y } = body.position

      // If block is out of bounds, move it back and reduce velocity
      if (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
        // Calculate new position within bounds
        const newX = Math.max(bounds.min.x, Math.min(x, bounds.max.x))
        const newY = Math.max(bounds.min.y, Math.min(y, bounds.max.y))

        // Set new position and reduce velocity
        Matter.Body.setPosition(body, { x: newX, y: newY })
        Matter.Body.setVelocity(body, {
          x: body.velocity.x * 0.5,
          y: body.velocity.y * 0.5,
        })
      }
    })
  }

  // Start a new level
  const startLevel = (levelNum: number) => {
    if (!engineRef.current || !renderRef.current) return

    // Clear existing bodies except walls
    const bodies = Matter.Composite.allBodies(engineRef.current.world)
    bodies.forEach((body) => {
      if (!body.isStatic) {
        Matter.World.remove(engineRef.current!.world, body)
      }
    })

    // Select a random target word for this level
    const words = wordLists[levelNum as keyof typeof wordLists] || wordLists[1]
    const newTargetWord = words[Math.floor(Math.random() * words.length)]
    setTargetWord(newTargetWord)

    // Create letter blocks for the word (scrambled)
    const letters = newTargetWord.split("").sort(() => Math.random() - 0.5)
    const blockSize = 60
    const startX = (renderRef.current.options.width || 400) / 2 - (letters.length * blockSize) / 2

    letters.forEach((letter, index) => {
      const x = startX + index * blockSize
      const y = 100

      // Create the letter block
      const letterBlock = Matter.Bodies.rectangle(x, y, blockSize - 10, blockSize - 10, {
        restitution: 0.3, // Reduced from 0.6 to make blocks less bouncy
        friction: 0.5, // Increased from 0.1 to add more friction
        frictionAir: 0.03, // Add air friction to slow down movement
        density: 0.1, // Lower density to make blocks lighter
        render: {
          fillStyle: "#3b82f6",
          strokeStyle: "#1e40af",
          lineWidth: 2,
        },

        letter: letter,
      })

      Matter.World.add(engineRef.current!.world, letterBlock)

      // Add text to the canvas after the body is added
      Matter.Events.on(renderRef.current, "afterRender", () => {
        const ctx = renderRef.current!.context as CanvasRenderingContext2D
        const pos = letterBlock.position

        // Only draw if the body exists in the world
        if (letterBlock.id && Matter.Composite.get(engineRef.current!.world, letterBlock.id, "body")) {
          ctx.font = "bold 24px Arial"
          ctx.fillStyle = "#ffffff"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(letter, pos.x, pos.y)
        }
      })
    })

    setMessage(`Arrange the letters to spell "${newTargetWord}"`)
  }

  // Check if the player has arranged the letters correctly
  const checkWord = () => {
    if (!engineRef.current) return

    const bodies = Matter.Composite.allBodies(engineRef.current.world)
    const letterBodies = bodies.filter((body) => !body.isStatic)

    // Sort letter bodies by x position
    letterBodies.sort((a, b) => a.position.x - b.position.x)

    // Get the word formed by the current arrangement
    // @ts-ignore - Accessing custom property from Matter.js body
    const currentWord = letterBodies.map((body) => body.letter).join("")

    if (currentWord === targetWord) {
      // Success!
      setScore((prevScore) => prevScore + level * 100)
      setMessage(`Correct! +${level * 100} points`)

      // Highlight correct letters
      letterBodies.forEach((body) => {
        // @ts-ignore - Modifying render properties
        body.render.fillStyle = "#22c55e"
      })

      // Move to next level after delay
      setTimeout(() => {
        const nextLevel = Math.min(level + 1, 3)
        setLevel(nextLevel)
        startLevel(nextLevel)
      }, 2000)
    } else {
      // Wrong arrangement
      setMessage("Not quite right. Try again!")

      // Shake the letters
      letterBodies.forEach((body) => {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.025, // Reduced from 0.05 to 0.025
          y: -0.025, // Reduced from -0.05 to -0.025
        })
      })
    }
  }

  // Shuffle the letters
  const shuffleLetters = () => {
    if (!engineRef.current) return

    const bodies = Matter.Composite.allBodies(engineRef.current.world)
    const letterBodies = bodies.filter((body) => !body.isStatic)

    letterBodies.forEach((body) => {
      const randomX = Math.random() * 0.05 - 0.025 // Reduced from 0.1 to 0.05
      const randomY = -0.05 // Reduced from -0.1 to -0.05
      Matter.Body.applyForce(body, body.position, { x: randomX, y: randomY })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1) // Reduced from 0.2 to 0.1
    })
  }

  // Reset the current level
  const resetLevel = () => {
    startLevel(level)
  }

  return (
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
        <div className="w-full text-center mb-4">
          <h1 className="text-2xl font-bold mb-2">Word Physics</h1>
          <div className="flex justify-between items-center">
            <div className="bg-primary/10 rounded-lg p-2">
              <span className="font-bold">Level: {level}</span>
            </div>
            <div className="bg-primary/10 rounded-lg p-2">
              <span className="font-bold">Score: {score}</span>
            </div>
          </div>
        </div>

        <div className="w-full mb-4">
          <div className="bg-blue-100 p-3 rounded-lg text-center">
            <p>{message}</p>
          </div>
        </div>

        <div ref={sceneRef} className="w-full h-[500px] border border-gray-300 rounded-lg mb-4 overflow-hidden" />

        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={checkWord} className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Check Word
          </Button>
          <Button onClick={shuffleLetters} variant="outline" className="flex items-center gap-2">
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
          <Button onClick={resetLevel} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p className="text-center">Drag and arrange the letter blocks to form the target word.</p>
          <p className="text-center mt-2">Click and drag the blocks to move them.</p>
        </div>
      </div>
  )
}


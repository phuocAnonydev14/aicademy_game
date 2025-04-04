import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Clock, Volume2, VolumeX, Heart, Trophy } from 'lucide-react';
// Define game concept types
type ConceptType = 'correct' | 'incorrect';

interface Concept {
  id: number;
  text: string;
  type: ConceptType;
  x: number;
  y: number;
  speed: number;
}

interface PowerUp {
  type: 'slow' | 'shield';
  active: boolean;
  duration: number;
  remaining: number;
}

const AI_CONCEPTS_CORRECT = [
  'Neural Networks',
  'Deep Learning',
  'Machine Learning',
  'Supervised Learning',
  'Reinforcement Learning',
  'NLP',
  'Computer Vision',
  'GANs',
  'Transformers',
  'BERT',
  'GPT',
  'LLMs',
  'Diffusion Models',
  'Decision Trees',
  'Clustering',
  'Classification',
  'Regression',
  'LSTMs',
];

const INCORRECT_CONCEPTS = [
  'AI Consciousness',
  'Quantum Thinking',
  'Digital Soul',
  'Binary Learning',
  'Mind Transfer',
  'AI Emotions',
  'Electric Dreams',
  'Singularity Now',
  'Human-Like AI',
  'AI Intuition',
  'Digital DNA',
  'Virtual Neurons',
  'AI Free Will',
  'Self-Aware Code',
  'Memory Injection',
];

export const BubblePopGame: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [sound, setSound] = useState(true);
  const [powerUps, setPowerUps] = useState<{
    slow: PowerUp;
    shield: PowerUp;
  }>({
    slow: { type: 'slow', active: false, duration: 5, remaining: 0 },
    shield: { type: 'shield', active: false, duration: 5, remaining: 0 },
  });
  const [showQuestion, setShowQuestion] = useState(false);
  const [question, setQuestion] = useState({ text: '', options: [], answer: 0 });
  const [failCounter, setFailCounter] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const lastConceptTimeRef = useRef<number>(0);

  // Game questions for when player makes mistakes
  const questions = [
    {
      text: 'What is the main difference between supervised and unsupervised learning?',
      options: [
        'Supervised uses labeled data, unsupervised does not',
        'Supervised is faster, unsupervised is slower',
        'Supervised requires more data',
        'There is no difference',
      ],
      answer: 0,
    },
    {
      text: 'What is a neural network?',
      options: [
        'A computer network with high security',
        "A model inspired by the human brain's structure",
        'A type of database',
        'A visualization tool',
      ],
      answer: 1,
    },
    {
      text: 'What does NLP stand for in AI?',
      options: [
        'New Learning Protocol',
        'Non-Linear Programming',
        'Natural Language Processing',
        'Neural Logic Processing',
      ],
      answer: 2,
    },
  ];

  // Sound effects
  const playSound = (type: 'correct' | 'incorrect' | 'powerup' | 'gameover') => {
    if (!sound) return;

    // In a real implementation, we would have actual sound effects
    console.log(`Playing ${type} sound`);
    // const audio = new Audio(`/sounds/${type}.mp3`);
    // audio.play();
  };

  // Initialize the game
  const startGame = () => {
    setConcepts([]);
    setScore(0);
    setLives(5);
    setLevel(1);
    setGameActive(true);
    setGameOver(false);
    setFailCounter(0);
    setShowQuestion(false);
    setPowerUps({
      slow: { type: 'slow', active: false, duration: 5, remaining: 0 },
      shield: { type: 'shield', active: false, duration: 5, remaining: 0 },
    });
    lastConceptTimeRef.current = Date.now();
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    gameLoop();
  };

  // Main game loop
  const gameLoop = () => {
    const now = Date.now();
    const conceptInterval = Math.max(800 - level * 50, 400); // Decreases with level

    // Create new concept at intervals
    if (now - lastConceptTimeRef.current > conceptInterval) {
      createNewConcept();
      lastConceptTimeRef.current = now;
    }

    // Move concepts
    moveConcepts();

    // Check for game over
    if (!gameOver && gameActive) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // Create a new falling concept
  const createNewConcept = () => {
    if (!gameAreaRef.current || !gameActive || showQuestion) return;

    const width = gameAreaRef.current.clientWidth;
    const isCorrect = Math.random() > 0.4; // 60% chance of correct concept

    // Choose a concept
    const conceptPool = isCorrect ? AI_CONCEPTS_CORRECT : INCORRECT_CONCEPTS;
    const text = conceptPool[Math.floor(Math.random() * conceptPool.length)];

    // Calculate position and speed
    const x = Math.random() * (width - 150) + 75;
    const baseSpeed = 1 + level * 0.2;
    const speed = powerUps.slow.active ? baseSpeed * 0.5 : baseSpeed;

    // Create the new concept
    const newConcept: Concept = {
      id: Date.now(),
      text,
      type: isCorrect ? 'correct' : 'incorrect',
      x,
      y: 0,
      speed,
    };

    setConcepts((prev) => [...prev, newConcept]);

    // 5% chance to spawn a power-up
    if (Math.random() < 0.05 && level > 1) {
      const powerupType = Math.random() > 0.5 ? 'slow' : 'shield';
      //   toast({
      //     title: `${powerupType === 'slow' ? 'Slow Time' : 'Shield'} Available!`,
      //     description: 'Click the power-up button to activate!',
      //     duration: 2000,
      //   });

      // Make power-up available
      setPowerUps((prev) => ({
        ...prev,
        [powerupType]: {
          ...prev[powerupType as keyof typeof prev],
          active: false,
          remaining: prev[powerupType as keyof typeof prev].duration,
        },
      }));
    }
  };

  // Move all concepts down
  const moveConcepts = () => {
    if (!gameAreaRef.current || !gameActive || showQuestion) return;

    const height = gameAreaRef.current.clientHeight;

    setConcepts((prev) => {
      const updated = prev.map((concept) => ({
        ...concept,
        y: concept.y + concept.speed,
      }));

      // Check for concepts that hit the bottom
      const fallen = updated.filter((c) => c.y > height);

      // If correct concepts fall, lose a life
      if (fallen.some((c) => c.type === 'correct') && !powerUps.shield.active) {
        handleMiss();
      }

      // Remove fallen concepts
      return updated.filter((c) => c.y <= height);
    });
  };

  // Handle a miss (correct concept falling off screen)
  const handleMiss = () => {
    playSound('incorrect');
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
        return 0;
      }

      // Increment fail counter
      setFailCounter((f) => {
        const newF = f + 1;
        if (newF >= 3) {
          setShowQuestion(true);
          setQuestion(questions[Math.floor(Math.random() * questions.length)]);
          return 0;
        }
        return newF;
      });

      return newLives;
    });
  };

  // Handle concept tap/click
  const handleConceptClick = (id: number, type: ConceptType) => {
    setConcepts((prev) => prev.filter((c) => c.id !== id));

    if (type === 'correct') {
      // Tapped correct concept
      playSound('correct');
      setScore((prev) => prev + 10 * level);

      // Level up every 100 points
      if (score > 0 && score % 100 === 0) {
        setLevel((prev) => prev + 1);
        // toast({
        //   title: `Level Up! Now Level ${level + 1}`,
        //   description: 'Concepts will fall faster!',
        //   duration: 2000,
        // });
      }
    } else {
      // Tapped incorrect concept
      playSound('incorrect');
      if (!powerUps.shield.active) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            endGame();
            return 0;
          }

          // Increment fail counter
          setFailCounter((f) => {
            const newF = f + 1;
            if (newF >= 3) {
              setShowQuestion(true);
              setQuestion(questions[Math.floor(Math.random() * questions.length)]);
              return 0;
            }
            return newF;
          });

          return newLives;
        });
      } else {
        // toast({
        //   title: 'Shield Protected You!',
        //   description: "You're safe from one mistake.",
        //   duration: 1000,
        // });
      }
    }
  };

  // End the game
  const endGame = () => {
    playSound('gameover');
    setGameActive(false);
    setGameOver(true);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  };

  // Activate a power-up
  const activatePowerUp = (type: 'slow' | 'shield') => {
    if (powerUps[type].remaining <= 0) return;

    playSound('powerup');
    setPowerUps((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        active: true,
      },
    }));

    // toast({
    //   title: `${type === 'slow' ? 'Slow Time' : 'Shield'} Activated!`,
    //   description: `Active for ${powerUps[type].duration} seconds`,
    //   duration: 2000,
    // });
  };

  // Answer the challenge question
  const answerQuestion = (optionIndex: number) => {
    if (optionIndex === question.answer) {
      //   toast({
      //     title: 'Correct Answer!',
      //     description: 'You can continue playing.',
      //     duration: 2000,
      //   });
      setShowQuestion(false);
    } else {
      //   toast({
      //     title: 'Wrong Answer!',
      //     description: 'You lose a life.',
      //     duration: 2000,
      //   });
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          endGame();
          return 0;
        }
        return newLives;
      });
      setShowQuestion(false);
    }
  };

  // Update power-ups timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameActive) {
      interval = setInterval(() => {
        setPowerUps((prev) => {
          const newPowerUps = { ...prev };

          // Update slow time
          if (newPowerUps.slow.active) {
            const remaining = newPowerUps.slow.remaining - 1;
            if (remaining <= 0) {
              newPowerUps.slow.active = false;
              newPowerUps.slow.remaining = 0;
              //   toast({
              //     title: 'Slow Time Expired',
              //     description: 'Concepts will fall at normal speed again.',
              //     duration: 1500,
              //   });
            } else {
              newPowerUps.slow.remaining = remaining;
            }
          }

          // Update shield
          if (newPowerUps.shield.active) {
            const remaining = newPowerUps.shield.remaining - 1;
            if (remaining <= 0) {
              newPowerUps.shield.active = false;
              newPowerUps.shield.remaining = 0;
              //   toast({
              //     title: 'Shield Expired',
              //     description: "You're no longer protected from mistakes.",
              //     duration: 1500,
              //   });
            } else {
              newPowerUps.shield.remaining = remaining;
            }
          }

          return newPowerUps;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameActive]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-gray-800">
        <h1 className="text-2xl font-bold">AI Touch Game</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 /> : <VolumeX />}
          </Button>
        </div>
      </header>

      {/* Game Stats */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <span>{lives}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span>{score}</span>
        </div>
        <div>Level: {level}</div>
      </div>

      {/* Power-ups */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex justify-center gap-4">
        <Button
          variant={powerUps.slow.remaining > 0 ? 'default' : 'outline'}
          disabled={powerUps.slow.active || powerUps.slow.remaining <= 0}
          onClick={() => activatePowerUp('slow')}
          className="flex items-center gap-2"
        >
          <Clock />
          Slow Time
          {powerUps.slow.active && <span>({powerUps.slow.remaining}s)</span>}
        </Button>
        <Button
          variant={powerUps.shield.remaining > 0 ? 'default' : 'outline'}
          disabled={powerUps.shield.active || powerUps.shield.remaining <= 0}
          onClick={() => activatePowerUp('shield')}
          className="flex items-center gap-2"
        >
          <Shield />
          Shield
          {powerUps.shield.active && <span>({powerUps.shield.remaining}s)</span>}
        </Button>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
      >
        {!gameActive && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-4">AI Touch Game</h2>
            <p className="text-center max-w-md mb-6">
              Tap on correct AI concepts as they fall from the top. Avoid incorrect concepts. Miss 5
              correct concepts and it's game over!
            </p>
            <Button size="lg" onClick={startGame}>
              Start Game
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <p className="text-2xl mb-6">Final Score: {score}</p>
            <Button size="lg" onClick={startGame}>
              Play Again
            </Button>
          </div>
        )}

        {gameActive &&
          concepts.map((concept) => (
            <div
              key={concept.id}
              className={`absolute px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                concept.type === 'correct' ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{
                left: concept.x,
                top: concept.y,
                transform: 'translateX(-50%)',
              }}
              onClick={() => handleConceptClick(concept.id, concept.type)}
            >
              {concept.text}
            </div>
          ))}

        {/* Question Challenge Dialog */}
        {showQuestion && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <Card className="max-w-md w-full bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Answer correctly to continue!</h3>
                <p className="mb-6">{question.text}</p>
                <div className="flex flex-col gap-3">
                  {question.options.map((option, index) => (
                    <Button key={index} variant="outline" onClick={() => answerQuestion(index)}>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

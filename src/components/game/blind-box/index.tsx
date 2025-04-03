import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Clock, Award, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Định nghĩa kiểu dữ liệu cho các câu đố
type Puzzle = {
  id: string;
  answer: string;
  category: "model" | "concept" | "tool";
  hints: string[];
  options: string[];
};

export default function BlindBoxGame() {
  // Danh sách các câu đố
  const puzzles: Puzzle[] = [
    {
      id: "gpt4",
      answer: "GPT-4",
      category: "model",
      hints: [
        "Tôi được phát triển bởi OpenAI.",
        "Tôi có thể hiểu và tạo văn bản phức tạp.",
        "Tôi là phiên bản tiếp theo của GPT-3.",
      ],
      options: ["GPT-4", "BERT", "LLaMA", "Claude"],
    },
    {
      id: "diffusion",
      answer: "Stable Diffusion",
      category: "model",
      hints: [
        "Tôi tạo hình ảnh từ mô tả văn bản.",
        "Tôi là mã nguồn mở và có thể chạy trên máy tính cá nhân.",
        "Tên của tôi gợi ý về sự ổn định.",
      ],
      options: ["DALL-E", "Stable Diffusion", "Midjourney", "GAN"],
    },
    {
      id: "transformer",
      answer: "Transformer",
      category: "concept",
      hints: [
        "Tôi là một kiến trúc mạng nơ-ron.",
        "Tôi sử dụng cơ chế self-attention.",
        "Tôi là nền tảng của hầu hết các mô hình ngôn ngữ lớn hiện đại.",
      ],
      options: ["Transformer", "CNN", "RNN", "GAN"],
    },
    {
      id: "finetuning",
      answer: "Fine-tuning",
      category: "concept",
      hints: [
        "Tôi là quá trình điều chỉnh một mô hình đã được huấn luyện trước.",
        "Tôi giúp mô hình thích nghi với nhiệm vụ cụ thể.",
        "Tôi thường sử dụng ít dữ liệu hơn so với huấn luyện từ đầu.",
      ],
      options: [
        "Fine-tuning",
        "Transfer Learning",
        "Prompt Engineering",
        "Reinforcement Learning",
      ],
    },
    {
      id: "embedding",
      answer: "Embedding",
      category: "concept",
      hints: [
        "Tôi biến đổi dữ liệu thành vector số.",
        "Tôi giúp máy tính hiểu ngữ nghĩa của từ và câu.",
        "Tôi là nền tảng cho việc tìm kiếm ngữ nghĩa.",
      ],
      options: ["Embedding", "Tokenization", "Classification", "Clustering"],
    },
    {
      id: "dalle",
      answer: "DALL-E",
      category: "model",
      hints: [
        "Tên của tôi là sự kết hợp của một robot hoạt hình và một nghệ sĩ nổi tiếng.",
        "Tôi được phát triển bởi OpenAI.",
        "Tôi tạo hình ảnh từ mô tả văn bản.",
      ],
      options: ["Midjourney", "DALL-E", "Stable Diffusion", "Imagen"],
    },
    {
      id: "rlhf",
      answer: "RLHF",
      category: "concept",
      hints: [
        "Tôi là một phương pháp huấn luyện mô hình dựa trên phản hồi của con người.",
        "Tôi giúp mô hình tạo ra nội dung an toàn và hữu ích hơn.",
        "Tôi là viết tắt của Reinforcement Learning from Human Feedback.",
      ],
      options: ["RLHF", "PEFT", "RAG", "LoRA"],
    },
    {
      id: "llm",
      answer: "LLM",
      category: "concept",
      hints: [
        "Tôi là viết tắt của Large Language Model.",
        "GPT, LLaMA và Claude đều thuộc loại này.",
        "Tôi có thể hiểu và tạo văn bản giống con người.",
      ],
      options: ["LLM", "CNN", "GAN", "VAE"],
    },
    {
      id: "rag",
      answer: "RAG",
      category: "concept",
      hints: [
        "Tôi kết hợp truy xuất thông tin với mô hình ngôn ngữ.",
        "Tôi giúp mô hình truy cập kiến thức bên ngoài.",
        "Tôi là viết tắt của Retrieval Augmented Generation.",
      ],
      options: ["RAG", "RLHF", "LoRA", "PEFT"],
    },
    {
      id: "midjourney",
      answer: "Midjourney",
      category: "model",
      hints: [
        "Tôi là một công cụ tạo hình ảnh từ văn bản.",
        "Tôi thường được sử dụng thông qua Discord.",
        "Tôi nổi tiếng với khả năng tạo hình ảnh nghệ thuật.",
      ],
      options: ["DALL-E", "Stable Diffusion", "Midjourney", "Imagen"],
    },
  ];

  // State cho trò chơi
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameActive, setGameActive] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Lấy câu đố hiện tại
  const currentPuzzle = puzzles[currentPuzzleIndex];

  // Xáo trộn các lựa chọn khi câu đố thay đổi
  useEffect(() => {
    if (currentPuzzle) {
      const options = [...currentPuzzle.options];
      const shuffled = options.sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  }, [currentPuzzleIndex]); // Only depend on the puzzle index, not the puzzle itself

  // Thiết lập bộ đếm thời gian và gợi ý
  useEffect(() => {
    // Only set up timers when the game is active and we're not showing results
    if (!gameActive || showResult) {
      return;
    }

    // Đặt lại trạng thái
    setTimeLeft(30);
    setRevealedHints(0);
    setSelectedOption(null);
    setIsCorrect(null);

    // Bộ đếm thời gian chính
    const mainTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Hết thời gian
          clearInterval(mainTimer);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bộ đếm thời gian cho gợi ý
    const hintTimer = setInterval(() => {
      setRevealedHints((prev) => {
        if (prev >= 2) {
          clearInterval(hintTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 10000);

    // Cleanup function
    return () => {
      clearInterval(mainTimer);
      clearInterval(hintTimer);
    };
  }, [currentPuzzleIndex, gameActive, showResult]); // Only depend on these values

  // Xử lý khi người chơi chọn một lựa chọn
  const handleOptionSelect = (option: string) => {
    if (selectedOption || showResult) return;

    setSelectedOption(option);
    const correct = option === currentPuzzle.answer;
    setIsCorrect(correct);

    if (correct) {
      // Tính điểm dựa trên số gợi ý đã hiển thị và thời gian còn lại
      const hintBonus = 3 - revealedHints; // Càng ít gợi ý càng nhiều điểm
      const timeBonus = Math.floor(timeLeft / 5); // Thời gian còn lại càng nhiều càng nhiều điểm
      const pointsEarned = 10 + hintBonus * 5 + timeBonus;

      setScore((prev) => prev + pointsEarned);
    }

    // Hiển thị kết quả
    setShowResult(true);

    // Dừng các bộ đếm thời gian
    if (timerRef.current) clearInterval(timerRef.current);
    if (hintTimerRef.current) clearInterval(hintTimerRef.current);
  };

  // Chuyển sang câu đố tiếp theo
  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex((prev) => prev + 1);
      setShowResult(false);
      setGameActive(true);
    } else {
      // Đã hoàn thành tất cả các câu đố
      setGameActive(false);
    }
  };

  // Bắt đầu trò chơi mới
  const restartGame = () => {
    setCurrentPuzzleIndex(0);
    setScore(0);
    setShowResult(false);
    setGameActive(true);
  };

  // Lấy màu cho danh mục
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "model":
        return "bg-blue-500";
      case "concept":
        return "bg-purple-500";
      case "tool":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Lấy biểu tượng cho danh mục
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "model":
        return "🤖";
      case "concept":
        return "💡";
      case "tool":
        return "🔧";
      default:
        return "❓";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Blind Box: Đoán Khái Niệm AI
        </h1>
        <p className="text-gray-600">
          {gameActive
            ? "Đoán khái niệm AI dựa trên các gợi ý được hiển thị mỗi 10 giây!"
            : "Trò chơi kết thúc! Hãy chơi lại để cải thiện điểm số của bạn."}
        </p>
      </div>

      <div className="flex justify-between items-center w-full mb-4">
        <div className="bg-slate-100 rounded-lg p-2 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          <span className="font-bold">Điểm: {score}</span>
        </div>

        <div className="flex items-center bg-slate-100 rounded-lg p-2">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          <span className="font-bold">{timeLeft}s</span>
          <Progress value={(timeLeft / 30) * 100} className="w-20 h-2 ml-2" />
        </div>

        <Button variant="outline" onClick={restartGame}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Chơi lại
        </Button>
      </div>

      {gameActive && currentPuzzle && (
        <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md">
          {/* Phần đầu */}
          <div className="bg-slate-100 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getCategoryColor(
                  currentPuzzle.category
                )}`}
              >
                {getCategoryIcon(currentPuzzle.category)}
              </div>
              <span className="ml-2 font-semibold">
                Câu hỏi {currentPuzzleIndex + 1}/{puzzles.length}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {currentPuzzle.category === "model"
                ? "Mô hình AI"
                : currentPuzzle.category === "concept"
                ? "Khái niệm AI"
                : "Công cụ AI"}
            </div>
          </div>

          {/* Hộp bí ẩn */}
          <div className="p-6 flex flex-col items-center">
            <div className="w-full max-w-md bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 mb-6 relative">
              <div className="absolute top-2 right-2">
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </div>

              <h2 className="text-xl font-bold text-center mb-4">Blind Box</h2>

              {/* Các gợi ý */}
              <div className="space-y-3">
                {currentPuzzle.hints.map((hint, index) => (
                  <AnimatePresence key={`hint-${index}`}>
                    {index <= revealedHints && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-3 rounded-lg shadow-sm"
                      >
                        <p className="text-gray-800">
                          <span className="font-bold text-blue-500">
                            Gợi ý {index + 1}:
                          </span>{" "}
                          {hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}

                {revealedHints < 2 && (
                  <div className="text-center text-gray-500 mt-2">
                    Gợi ý tiếp theo sau {timeLeft % 10 || 10} giây...
                  </div>
                )}
              </div>
            </div>

            {/* Các lựa chọn */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3">
              {shuffledOptions.map((option, index) => (
                <button
                  key={`option-${index}`}
                  className={`p-4 rounded-lg border-2 transition-all text-center
                    ${
                      selectedOption === option
                        ? option === currentPuzzle.answer
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-red-500 bg-red-50 text-red-700"
                        : showResult && option === currentPuzzle.answer
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-blue-500 bg-white"
                    }
                    ${
                      showResult && option !== currentPuzzle.answer
                        ? "opacity-50"
                        : "opacity-100"
                    }
                  `}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Kết quả và nút tiếp theo */}
          {showResult && (
            <div
              className={`p-4 ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              } flex justify-between items-center`}
            >
              <div>
                <p
                  className={`font-bold ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isCorrect
                    ? `Chính xác! ${selectedOption} là đáp án đúng.`
                    : `Sai rồi! Đáp án đúng là ${currentPuzzle.answer}.`}
                </p>
              </div>
              <Button onClick={nextPuzzle}>
                {currentPuzzleIndex < puzzles.length - 1
                  ? "Câu tiếp theo"
                  : "Kết thúc"}
              </Button>
            </div>
          )}
        </div>
      )}

      {!gameActive && (
        <div className="w-full bg-white border border-gray-300 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Trò chơi kết thúc!</h2>
          <p className="text-xl mb-6">
            Điểm số cuối cùng của bạn:{" "}
            <span className="font-bold text-blue-600">{score}</span>
          </p>
          <Button onClick={restartGame} size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Chơi lại
          </Button>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>
          Mỗi 10 giây, một gợi ý mới sẽ được hiển thị. Hãy đoán càng nhanh càng
          tốt để nhận nhiều điểm hơn!
        </p>
        <p className="mt-1">
          Điểm thưởng dựa trên số gợi ý đã sử dụng và thời gian còn lại.
        </p>
      </div>
    </div>
  );
}

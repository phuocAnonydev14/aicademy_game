import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, RefreshCw, Trophy, Info } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho các bước trong quy trình
type WorkflowStep = {
  id: string;
  text: string;
  correctPosition: number;
};

// Định nghĩa kiểu dữ liệu cho câu đố
type Puzzle = {
  id: string;
  title: string;
  result: string;
  resultImage: string;
  steps: WorkflowStep[];
  explanation: string;
};

export default function OrderingGame() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [availableSteps, setAvailableSteps] = useState<WorkflowStep[]>([]);
  const [placedSteps, setPlacedSteps] = useState<(WorkflowStep | null)[]>([]);
  const [draggedStep, setDraggedStep] = useState<WorkflowStep | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  // Refs cho các vị trí thả
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Danh sách các câu đố theo cấp độ
  const puzzles: Record<number, Puzzle[]> = {
    1: [
      {
        id: 'text-gen',
        title: 'Quy trình tạo văn bản AI',
        result: 'Bài viết về lợi ích của trí tuệ nhân tạo trong giáo dục',
        resultImage: '📝',
        steps: [
          { id: 'problem', text: 'Xác định vấn đề', correctPosition: 1 },
          { id: 'prompt', text: 'Viết prompt', correctPosition: 2 },
          { id: 'model', text: 'Chọn mô hình', correctPosition: 3 },
          { id: 'params', text: 'Thiết lập tham số', correctPosition: 4 },
          { id: 'review', text: 'Đánh giá kết quả', correctPosition: 5 },
          { id: 'image', text: 'Xử lý hình ảnh', correctPosition: -1 },
          { id: 'translation', text: 'Dịch nội dung', correctPosition: -1 },
        ],
        explanation:
          'Quy trình tạo văn bản AI bắt đầu từ việc xác định vấn đề cần giải quyết, sau đó viết prompt rõ ràng, chọn mô hình phù hợp (như GPT-4), thiết lập tham số (độ dài, nhiệt độ), và cuối cùng đánh giá và chỉnh sửa kết quả.',
      },
      {
        id: 'image-gen',
        title: 'Quy trình tạo hình ảnh AI',
        result: 'Hình ảnh một con mèo đang ngồi trên bàn làm việc',
        resultImage: '🖼️',
        steps: [
          { id: 'concept', text: 'Lên ý tưởng', correctPosition: 1 },
          { id: 'prompt', text: 'Viết prompt', correctPosition: 2 },
          { id: 'model', text: 'Chọn mô hình', correctPosition: 3 },
          { id: 'style', text: 'Chọn phong cách', correctPosition: 4 },
          { id: 'review', text: 'Đánh giá kết quả', correctPosition: 5 },
          { id: 'video', text: 'Xử lý video', correctPosition: -1 },
          { id: 'audio', text: 'Xử lý âm thanh', correctPosition: -1 },
        ],
        explanation:
          'Quy trình tạo hình ảnh AI bắt đầu từ việc lên ý tưởng rõ ràng, sau đó viết prompt mô tả chi tiết, chọn mô hình phù hợp (như DALL-E, Midjourney), chọn phong cách (như chân thực, hoạt hình), và cuối cùng đánh giá và chọn kết quả phù hợp nhất.',
      },
    ],
    2: [
      {
        id: 'sentiment',
        title: 'Quy trình phân tích cảm xúc',
        result: 'Phân tích cảm xúc từ đánh giá của khách hàng',
        resultImage: '📊',
        steps: [
          { id: 'goal', text: 'Xác định mục tiêu', correctPosition: 1 },
          { id: 'data', text: 'Thu thập dữ liệu', correctPosition: 2 },
          { id: 'preprocessing', text: 'Tiền xử lý dữ liệu', correctPosition: 3 },
          { id: 'model', text: 'Áp dụng mô hình', correctPosition: 4 },
          { id: 'visualization', text: 'Trực quan hóa', correctPosition: 5 },
          { id: 'action', text: 'Đưa ra hành động', correctPosition: 6 },
          { id: 'image', text: 'Nhận dạng hình ảnh', correctPosition: -1 },
          { id: 'translation', text: 'Dịch văn bản', correctPosition: -1 },
        ],
        explanation:
          'Quy trình phân tích cảm xúc bắt đầu từ việc xác định mục tiêu phân tích, thu thập dữ liệu đánh giá, tiền xử lý và làm sạch dữ liệu, áp dụng mô hình phân tích cảm xúc, trực quan hóa kết quả, và cuối cùng đưa ra hành động dựa trên kết quả phân tích.',
      },
      {
        id: 'recommendation',
        title: 'Quy trình xây dựng hệ thống đề xuất',
        result: 'Hệ thống đề xuất sản phẩm cho người dùng',
        resultImage: '🛒',
        steps: [
          { id: 'goal', text: 'Xác định mục tiêu', correctPosition: 1 },
          { id: 'data', text: 'Thu thập dữ liệu', correctPosition: 2 },
          { id: 'preprocessing', text: 'Tiền xử lý dữ liệu', correctPosition: 3 },
          { id: 'model', text: 'Xây dựng mô hình', correctPosition: 4 },
          { id: 'testing', text: 'Kiểm thử mô hình', correctPosition: 5 },
          { id: 'deployment', text: 'Triển khai hệ thống', correctPosition: 6 },
          { id: 'monitoring', text: 'Giám sát và cải tiến', correctPosition: 7 },
          { id: 'translation', text: 'Dịch văn bản', correctPosition: -1 },
          { id: 'speech', text: 'Nhận dạng giọng nói', correctPosition: -1 },
        ],
        explanation:
          'Quy trình xây dựng hệ thống đề xuất bắt đầu từ việc xác định mục tiêu đề xuất, thu thập dữ liệu người dùng và sản phẩm, tiền xử lý dữ liệu, xây dựng mô hình đề xuất, kiểm thử và đánh giá mô hình, triển khai hệ thống, và cuối cùng giám sát và cải tiến liên tục.',
      },
    ],
    3: [
      {
        id: 'chatbot',
        title: 'Quy trình xây dựng chatbot',
        result: 'Chatbot hỗ trợ khách hàng tự động',
        resultImage: '🤖',
        steps: [
          { id: 'requirements', text: 'Phân tích yêu cầu', correctPosition: 1 },
          { id: 'data', text: 'Thu thập dữ liệu', correctPosition: 2 },
          { id: 'design', text: 'Thiết kế luồng hội thoại', correctPosition: 3 },
          { id: 'model', text: 'Lựa chọn mô hình', correctPosition: 4 },
          { id: 'integration', text: 'Tích hợp hệ thống', correctPosition: 5 },
          { id: 'testing', text: 'Kiểm thử và tối ưu', correctPosition: 6 },
          { id: 'deployment', text: 'Triển khai chatbot', correctPosition: 7 },
          { id: 'monitoring', text: 'Giám sát và cải tiến', correctPosition: 8 },
          { id: 'image', text: 'Nhận dạng hình ảnh', correctPosition: -1 },
          { id: 'video', text: 'Xử lý video', correctPosition: -1 },
        ],
        explanation:
          'Quy trình xây dựng chatbot bắt đầu từ việc phân tích yêu cầu, thu thập dữ liệu hội thoại, thiết kế luồng hội thoại, lựa chọn mô hình phù hợp, tích hợp với hệ thống hiện có, kiểm thử và tối ưu hóa, triển khai chatbot, và cuối cùng giám sát và cải tiến liên tục.',
      },
      {
        id: 'ml-pipeline',
        title: 'Quy trình Machine Learning',
        result: 'Hệ thống Machine Learning tự động',
        resultImage: '⚙️',
        steps: [
          { id: 'problem', text: 'Xác định vấn đề', correctPosition: 1 },
          { id: 'data', text: 'Thu thập dữ liệu', correctPosition: 2 },
          { id: 'exploration', text: 'Khám phá dữ liệu', correctPosition: 3 },
          { id: 'feature', text: 'Kỹ thuật đặc trưng', correctPosition: 4 },
          { id: 'model', text: 'Huấn luyện mô hình', correctPosition: 5 },
          { id: 'evaluation', text: 'Đánh giá mô hình', correctPosition: 6 },
          { id: 'deployment', text: 'Triển khai mô hình', correctPosition: 7 },
          { id: 'monitoring', text: 'Giám sát và tái huấn luyện', correctPosition: 8 },
          { id: 'image', text: 'Xử lý hình ảnh', correctPosition: -1 },
          { id: 'speech', text: 'Tổng hợp giọng nói', correctPosition: -1 },
        ],
        explanation:
          'Quy trình Machine Learning bắt đầu từ việc xác định vấn đề kinh doanh, thu thập và chuẩn bị dữ liệu, khám phá và phân tích dữ liệu, kỹ thuật đặc trưng, lựa chọn và huấn luyện mô hình, đánh giá mô hình, triển khai mô hình, và cuối cùng giám sát và tái huấn luyện.',
      },
    ],
  };

  // Khởi tạo trò chơi
  useEffect(() => {
    startLevel(level);
  }, [level]);

  // Bắt đầu cấp độ mới
  const startLevel = (levelNum: number) => {
    // Lấy danh sách câu đố cho cấp độ hiện tại
    const levelPuzzles = puzzles[levelNum] || puzzles[1];

    // Chọn một câu đố ngẫu nhiên
    const randomPuzzle = levelPuzzles[Math.floor(Math.random() * levelPuzzles.length)];

    // Xáo trộn các bước
    const shuffledSteps = [...randomPuzzle.steps].sort(() => Math.random() - 0.5);

    // Tính số lượng vị trí cần thiết (số bước có correctPosition > 0)
    const requiredPositions = randomPuzzle.steps.filter((step) => step.correctPosition > 0).length;

    // Cập nhật câu đố hiện tại
    setCurrentPuzzle(randomPuzzle);
    setAvailableSteps(shuffledSteps);
    setPlacedSteps(Array(requiredPositions).fill(null));

    // Đặt lại trạng thái
    setShowResult(false);
    setMessage(`Kéo các bước vào đúng vị trí để hoàn thành quy trình`);
    setShowExplanation(false);

    // Đặt lại refs cho các vị trí thả
    slotRefs.current = Array(requiredPositions).fill(null);
  };

  // Xử lý khi bắt đầu kéo một bước
  const handleDragStart = (step: WorkflowStep) => {
    setDraggedStep(step);
  };

  // Xử lý khi kết thúc kéo
  const handleDragEnd = () => {
    setDraggedStep(null);
  };

  // Xử lý khi thả một bước vào vị trí
  const handleDrop = (slotIndex: number) => {
    if (!draggedStep) return;

    // Kiểm tra xem bước này đã được đặt ở vị trí khác chưa
    const existingIndex = placedSteps.findIndex((step) => step?.id === draggedStep.id);

    // Tạo bản sao của mảng placedSteps
    const newPlacedSteps = [...placedSteps];

    // Nếu bước này đã được đặt ở vị trí khác, xóa nó khỏi vị trí cũ
    if (existingIndex !== -1) {
      newPlacedSteps[existingIndex] = null;
    }

    // Nếu vị trí mới đã có bước khác, đưa bước đó trở lại danh sách available
    if (newPlacedSteps[slotIndex]) {
      setAvailableSteps((prev) => [...prev, newPlacedSteps[slotIndex]!]);
    }

    // Đặt bước hiện tại vào vị trí mới
    newPlacedSteps[slotIndex] = draggedStep;

    // Cập nhật state
    setPlacedSteps(newPlacedSteps);

    // Xóa bước khỏi danh sách available nếu nó chưa được đặt trước đó
    if (existingIndex === -1) {
      setAvailableSteps((prev) => prev.filter((step) => step.id !== draggedStep.id));
    }
  };

  // Xử lý khi nhấp vào một bước đã đặt để loại bỏ
  const handleRemoveStep = (slotIndex: number) => {
    const step = placedSteps[slotIndex];
    if (!step) return;

    // Đưa bước trở lại danh sách available
    setAvailableSteps((prev) => [...prev, step]);

    // Xóa bước khỏi vị trí
    const newPlacedSteps = [...placedSteps];
    newPlacedSteps[slotIndex] = null;
    setPlacedSteps(newPlacedSteps);
  };

  // Kiểm tra thứ tự
  const checkOrder = () => {
    if (!currentPuzzle) return;

    // Kiểm tra xem tất cả các vị trí đã được điền chưa
    const allFilled = placedSteps.every((step) => step !== null);

    if (!allFilled) {
      setMessage('Vui lòng điền đầy đủ tất cả các vị trí trước khi kiểm tra');
      return;
    }

    // Kiểm tra xem các bước có ở đúng vị trí không
    let correctCount = 0;
    placedSteps.forEach((step, index) => {
      if (step && step.correctPosition === index + 1) {
        correctCount++;
      }
    });

    setShowResult(true);

    if (correctCount === placedSteps.length) {
      // Tất cả đều đúng vị trí
      const pointsEarned = level * 100;
      setScore((prev) => prev + pointsEarned);
      setMessage(`Hoàn hảo! Tất cả các bước đều đúng vị trí. +${pointsEarned} điểm`);
    } else {
      // Còn sai thứ tự
      const percentCorrect = Math.round((correctCount / placedSteps.length) * 100);
      setMessage(
        `Bạn đã đặt đúng ${correctCount}/${placedSteps.length} bước (${percentCorrect}%). Hãy xem giải thích và thử lại!`
      );
    }

    // Hiển thị giải thích
    setShowExplanation(true);
  };

  // Chuyển sang câu đố tiếp theo
  const nextPuzzle = () => {
    // Kiểm tra xem tất cả các bước có đúng vị trí không
    const allCorrect = placedSteps.every(
      (step, index) => step && step.correctPosition === index + 1
    );

    if (allCorrect) {
      // Nếu đã hoàn thành tất cả các câu đố ở cấp độ hiện tại, chuyển sang cấp độ tiếp theo
      if (level < 3) {
        setLevel((prev) => prev + 1);
      } else {
        // Nếu đã ở cấp độ cao nhất, chọn một câu đố ngẫu nhiên
        startLevel(level);
      }
    } else {
      // Nếu trả lời sai, thử lại câu đố hiện tại
      startLevel(level);
    }
  };

  // Đặt lại trò chơi
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    startLevel(1);
  };

  // Đặt lại cấp độ hiện tại
  const resetLevel = () => {
    startLevel(level);
  };

  if (!currentPuzzle) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <div className="w-full text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Thi</h1>
        <div className="flex justify-between items-center">
          <div className="bg-primary/10 rounded-lg p-2">
            <span className="font-bold">Cấp độ: {level}</span>
          </div>
          <div className="bg-primary/10 rounded-lg p-2">
            <span className="font-bold">Điểm: {score}</span>
          </div>
        </div>
      </div>

      <div className="w-full mb-4">
        <div
          className={`p-3 rounded-lg text-center ${
            showResult
              ? placedSteps.every((step, index) => step && step.correctPosition === index + 1)
                ? 'bg-green-100'
                : 'bg-yellow-100'
              : 'bg-blue-100'
          }`}
        >
          <p>{message}</p>
        </div>
      </div>

      {/* Kết quả */}
      <Card className="w-full p-4 mb-6 bg-slate-50 border-2 border-primary">
        <div className="text-center">
          <div className="text-4xl mb-2">{currentPuzzle.resultImage}</div>
          <h2 className="text-xl font-bold">{currentPuzzle.title}</h2>
          <p className="mt-2">{currentPuzzle.result}</p>
        </div>
      </Card>

      {/* Các bước có sẵn */}
      <div className="w-full mb-6">
        <h3 className="font-bold mb-3">Các bước có sẵn:</h3>
        <div className="flex flex-wrap gap-2">
          {availableSteps.map((step) => (
            <div
              key={step.id}
              draggable
              onDragStart={() => handleDragStart(step)}
              onDragEnd={handleDragEnd}
              className="p-2 rounded-lg bg-white border border-gray-300 cursor-grab active:cursor-grabbing"
            >
              {step.text}
            </div>
          ))}
          {availableSteps.length === 0 && (
            <p className="text-gray-500 italic">Tất cả các bước đã được sử dụng</p>
          )}
        </div>
      </div>

      {/* Khu vực thả */}
      <div className="w-full mb-6">
        <h3 className="font-bold mb-3">Sắp xếp các bước theo thứ tự:</h3>
        <div className="space-y-2">
          {placedSteps.map((step, index) => (
            <div
              key={`slot-${index}`}
              ref={(el) => (slotRefs.current[index] = el)}
              className={`p-4 rounded-lg border-2 min-h-[60px] flex items-center justify-center
                ${
                  step
                    ? showResult
                      ? step.correctPosition === index + 1
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-blue-100 border-blue-500'
                    : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-primary');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('border-primary');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-primary');
                handleDrop(index);
              }}
              onClick={() => step && handleRemoveStep(index)}
            >
              {step ? (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
                    {index + 1}. {step.text}
                  </span>
                  {!showResult && <span className="text-xs text-gray-500 ml-2">(Nhấp để xóa)</span>}
                </div>
              ) : (
                <span className="text-gray-400">Kéo bước vào đây</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Giải thích */}
      {showExplanation && (
        <Card className="w-full p-4 mb-6 bg-yellow-50">
          <div className="flex items-center mb-2">
            <Info className="w-5 h-5 mr-2 text-yellow-600" />
            <h3 className="font-bold">Giải thích:</h3>
          </div>
          <p>{currentPuzzle.explanation}</p>
        </Card>
      )}

      {/* Nút điều khiển */}
      <div className="flex gap-3 justify-center">
        {!showResult ? (
          <Button onClick={checkOrder} className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Kiểm tra
          </Button>
        ) : (
          <Button onClick={nextPuzzle} className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Câu tiếp theo
          </Button>
        )}
        <Button onClick={resetLevel} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Làm lại
        </Button>
      </div>
    </div>
  );
}

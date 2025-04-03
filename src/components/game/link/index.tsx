import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, X } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho các mục AI
type AIItem = {
  id: string;
  name: string;
  description: string;
  category: "Text" | "Image" | "Video";
};

type Connection = {
  from: string;
  to: string;
  isCorrect?: boolean;
  linePoints?: { x1: number; y1: number; x2: number; y2: number };
};

export default function ConnectionGame() {
  const leftItems: AIItem[] = [
    {
      id: "gpt4",
      name: "GPT-4",
      description: "Mô hình ngôn ngữ lớn",
      category: "Text",
    },
    {
      id: "dalle",
      name: "DALL-E",
      description: "Tạo hình ảnh từ văn bản",
      category: "Image",
    },
    {
      id: "midjourney",
      name: "Midjourney",
      description: "Tạo hình ảnh nghệ thuật",
      category: "Image",
    },
    {
      id: "bert",
      name: "BERT",
      description: "Hiểu ngữ cảnh văn bản",
      category: "Text",
    },
    {
      id: "runway",
      name: "RunwayML",
      description: "Chỉnh sửa và tạo video",
      category: "Video",
    },
  ];

  // Danh sách các mô tả bên phải (đã xáo trộn)
  const rightItems = [
    {
      id: "text1",
      content:
        "Mô hình ngôn ngữ có thể viết văn bản, trả lời câu hỏi và lập trình",
      correctMatch: "gpt4",
    },
    {
      id: "image1",
      content: "Chuyển đổi mô tả văn bản thành hình ảnh chất lượng cao",
      correctMatch: "dalle",
    },
    {
      id: "image2",
      content: "Tạo hình ảnh với phong cách nghệ thuật đa dạng",
      correctMatch: "midjourney",
    },
    {
      id: "text2",
      content: "Phân tích ngữ nghĩa hai chiều của văn bản",
      correctMatch: "bert",
    },
    {
      id: "video1",
      content: "Công cụ AI để tạo và chỉnh sửa nội dung video",
      correctMatch: "runway",
    },
  ];

  // State cho trò chơi
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeConnection, setActiveConnection] = useState<{
    from: string;
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState(
    "Nhấn giữ và kéo từ mô hình AI sang mô tả phù hợp để tạo kết nối!"
  );

  // Refs cho các phần tử DOM
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Xử lý di chuyển chuột
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && isDragging) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && activeConnection) {
        // Kiểm tra xem chuột có đang ở trên một mục bên phải không
        const rightItemElements = rightItems.map(
          (item) => itemRefs.current[item.id]
        );
        let targetItemId: string | null = null;

        rightItemElements.forEach((element, index) => {
          if (element) {
            const rect = element.getBoundingClientRect();
            if (
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom
            ) {
              targetItemId = rightItems[index].id;
            }
          }
        });

        if (targetItemId) {
          completeConnection(targetItemId);
        }

        setIsDragging(false);
        setActiveConnection(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, activeConnection, rightItems]);

  // Kiểm tra hoàn thành trò chơi
  useEffect(() => {
    if (connections.length === leftItems.length && !gameComplete) {
      const allCorrect = connections.every((conn) => conn.isCorrect);
      if (allCorrect) {
        setGameComplete(true);
        setMessage("Chúc mừng! Bạn đã hoàn thành trò chơi!");
      }
    }
  }, [connections, gameComplete, leftItems.length]);

  // Bắt đầu kết nối từ một mục bên trái
  const startConnection = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định

    if (connections.some((conn) => conn.from === itemId)) {
      // Nếu đã có kết nối, xóa kết nối cũ
      setConnections((prev) => prev.filter((conn) => conn.from !== itemId));
    }

    const itemElement = itemRefs.current[itemId];
    if (itemElement && containerRef.current) {
      const itemRect = itemElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const x = itemRect.right - containerRect.left;
      const y = itemRect.top + itemRect.height / 2 - containerRect.top;

      setActiveConnection({ from: itemId, x, y });
      setIsDragging(true);
    }
  };

  // Hoàn thành kết nối tại một mục bên phải
  const completeConnection = (itemId: string) => {
    if (!activeConnection) return;

    const fromItem = leftItems.find(
      (item) => item.id === activeConnection.from
    );
    const toItem = rightItems.find((item) => item.id === itemId);

    if (fromItem && toItem) {
      const isCorrect = toItem.correctMatch === fromItem.id;

      // Tính toán tọa độ đường kết nối
      const fromElement = itemRefs.current[fromItem.id];
      const toElement = itemRefs.current[itemId];

      if (fromElement && toElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        const linePoints = {
          x1: fromRect.right - containerRect.left,
          y1: fromRect.top + fromRect.height / 2 - containerRect.top,
          x2: toRect.left - containerRect.left,
          y2: toRect.top + toRect.height / 2 - containerRect.top,
        };

        // Thêm kết nối mới
        setConnections((prev) => [
          ...prev.filter(
            (conn) => conn.from !== activeConnection.from && conn.to !== itemId
          ),
          { from: activeConnection.from, to: itemId, isCorrect, linePoints },
        ]);

        // Cập nhật điểm số
        if (isCorrect) {
          setScore((prev) => prev + 10);
          setMessage("Đúng rồi! Kết nối chính xác.");
        } else {
          setMessage("Hmm, kết nối này không chính xác. Hãy thử lại!");
        }
      }
    }
  };

  // Đặt lại trò chơi
  const resetGame = () => {
    setConnections([]);
    setActiveConnection(null);
    setIsDragging(false);
    setScore(0);
    setGameComplete(false);
    setMessage(
      "Nhấn giữ và kéo từ mô hình AI sang mô tả phù hợp để tạo kết nối!"
    );
  };

  // Lấy màu cho danh mục
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Text":
        return "bg-blue-500";
      case "Image":
        return "bg-green-500";
      case "Video":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Lấy màu cho đường kết nối
  const getConnectionColor = (isCorrect: boolean | undefined) => {
    if (isCorrect === undefined) return "#94a3b8";
    return isCorrect ? "#22c55e" : "#ef4444";
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4">
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Trò Chơi Kết Nối AI</h1>
        <p className="text-gray-600">{message}</p>
      </div>

      <div className="flex justify-between items-center w-full mb-4">
        <div className="bg-slate-100 rounded-lg p-2">
          <span className="font-bold">Điểm: {score}</span>
        </div>

        <Button variant="outline" onClick={resetGame}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Chơi lại
        </Button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-slate-50 border border-gray-300 rounded-lg p-6 min-h-[500px]"
      >
        {/* Vẽ các đường kết nối */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Đường kết nối đang kéo */}
          {isDragging && activeConnection && (
            <line
              x1={activeConnection.x}
              y1={activeConnection.y}
              x2={mousePosition.x}
              y2={mousePosition.y}
              stroke="#94a3b8"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          )}

          {/* Các đường kết nối đã hoàn thành */}
          {connections.map(
            (conn, index) =>
              conn.linePoints && (
                <line
                  key={`line-${index}`}
                  x1={conn.linePoints.x1}
                  y1={conn.linePoints.y1}
                  x2={conn.linePoints.x2}
                  y2={conn.linePoints.y2}
                  stroke={getConnectionColor(conn.isCorrect)}
                  strokeWidth="3"
                />
              )
          )}
        </svg>

        <div className="flex justify-between relative z-20">
          {/* Cột bên trái - Các mô hình AI */}
          <div className="w-[45%] space-y-4">
            <h2 className="font-bold text-lg mb-4 text-center">Mô hình AI</h2>
            {leftItems.map((item) => {
              const isConnected = connections.some(
                (conn) => conn.from === item.id
              );
              const connection = connections.find(
                (conn) => conn.from === item.id
              );

              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  className={`p-4 rounded-lg border-2 transition-all
                    ${
                      isConnected
                        ? connection?.isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-blue-500 bg-white"
                    }
                  `}
                  onMouseDown={(e) => startConnection(item.id, e)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(
                        item.category
                      )}`}
                    ></div>
                    <h3 className="font-bold">{item.name}</h3>
                    {isConnected &&
                      (connection?.isCorrect ? (
                        <Check className="ml-auto w-5 h-5 text-green-500" />
                      ) : (
                        <X className="ml-auto w-5 h-5 text-red-500" />
                      ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Cột bên phải - Các mô tả */}
          <div className="w-[45%] space-y-4">
            <h2 className="font-bold text-lg mb-4 text-center">Chức năng</h2>
            {rightItems.map((item) => {
              const isConnected = connections.some(
                (conn) => conn.to === item.id
              );
              const connection = connections.find(
                (conn) => conn.to === item.id
              );

              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  className={`p-4 rounded-lg border-2 transition-all
                    ${
                      isConnected
                        ? connection?.isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : isDragging
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }
                  `}
                >
                  <p>{item.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>
          Nhấn giữ vào một mô hình AI bên trái, sau đó kéo đến mô tả phù hợp bên
          phải để tạo kết nối.
        </p>
        <p className="mt-1">
          Kết nối đúng sẽ hiển thị màu xanh lá, kết nối sai sẽ hiển thị màu đỏ.
        </p>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, setText] = useState<string>(
    "Your premium message goes here..."
  );

  const bgImageUrl =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";

  useEffect(() => {
    generateCard();
  }, [text]);

  const generateCard = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 800;
    const height = 1000;

    canvas.width = width;
    canvas.height = height;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = bgImageUrl;

    image.onload = () => {
      // Draw background image
      ctx.drawImage(image, 0, 0, width, height);

      // Dark transparent overlay (premium effect)
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, 0, width, height);

      // Glass style card background
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(100, 300, 600, 350);

      // Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px serif";
      ctx.textAlign = "center";

      wrapText(ctx, text, width / 2, 480, 520, 60);

      // Sub branding
      ctx.font = "20px sans-serif";
      ctx.fillText("Chitro Studio", width / 2, height - 60);
    };
  };

  const wrapText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void => {
    const words = text.split(" ");
    let line = "";
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }

    lines.push(line);

    const startY = y - (lines.length * lineHeight) / 2;

    lines.forEach((l, i) => {
      context.fillText(l, x, startY + i * lineHeight);
    });
  };

  const downloadImage = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "premium-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Premium Card Generator
      </h1>

      <textarea
        className="w-full max-w-xl h-28 p-4 rounded-xl text-black resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Write your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={downloadImage}
        className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl font-semibold"
      >
        Download Card
      </button>

      <canvas
        ref={canvasRef}
        className="mt-8 w-80 rounded-2xl shadow-2xl"
      />
    </div>
  );
};

export default App;
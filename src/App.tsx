import { useEffect, useRef, useState } from "react";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, setText] = useState<string>(
    ""
  );

  const bgImageUrl = "https://res.cloudinary.com/djpekunve/image/upload/v1770800929/Chitro/chitro_a40kib.jpg";
  const chitroLogoUrl = "https://res.cloudinary.com/djpekunve/image/upload/v1770801565/Chitro/chitro-fb_f1pjur.png"

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

  const bgImage = new Image();
  const logoImage = new Image();

  bgImage.crossOrigin = "anonymous";
  logoImage.crossOrigin = "anonymous";

  bgImage.src = bgImageUrl;
  logoImage.src = chitroLogoUrl;

  Promise.all([
    new Promise((res) => (bgImage.onload = res)),
    new Promise((res) => (logoImage.onload = res)),
  ]).then(() => {
    ctx.drawImage(bgImage, 0, 0, width, height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, width, height);

    const logoWidth = 100;
    const logoHeight = 100;

    ctx.drawImage(
      logoImage,
      width - logoWidth - 40,
      40,                  
      logoWidth,
      logoHeight
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "35px serif";
    ctx.textAlign = "center";

    wrapText(ctx, text, width / 2, 480, 700, 70);

    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#E8EE2F";
    ctx.fillText("—চিত্র—", width / 2, height - 60);
  });
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
    link.download = "chitro.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-white">
      <textarea
        className="w-full max-w-xl h-28 p-4 rounded-xl border border-indigo-500 text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Write your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={downloadImage}
        className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-md font-medium"
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
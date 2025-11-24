import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScanTypeSelector from "./ScanTypeSelector";

interface CameraScannerProps {
  onBack: () => void;
  onScanSuccess: (
    studentId: string,
    type: "ingreso" | "salida"
  ) => Promise<void> | boolean;
}

const CameraScanner = ({ onBack, onScanSuccess }: CameraScannerProps) => {
  const [scanType, setScanType] = useState<"ingreso" | "salida">("ingreso");
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scannerControls = useRef<IScannerControls | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const lastScannedRef = useRef<{ code: string; ts: number } | null>(null);

  const scanTypeRef = useRef<"ingreso" | "salida">(scanType);

  scanTypeRef.current = scanType;

  // 🔵 DIBUJAR EL CUADRO VERDE
  const drawBoundingBox = (points: any[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || points.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Asegurar tamaño del canvas == tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    // Borrar el cuadro después de 300ms
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 300);
  };

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    const callback = async (result: any, err: any, ctrl: IScannerControls) => {
      if (result) {
        const code = result.getText();
        const now = Date.now();
        const last = lastScannedRef.current;

        // Evitar duplicados por 5s
        if (last && last.code === code && now - last.ts < 5000) return;

        lastScannedRef.current = { code, ts: now };

        // Dibujar recuadro verde
        const points = result.getResultPoints();
        if (points) drawBoundingBox(points);

        const type = scanTypeRef.current;
        await onScanSuccess(code, type);

        // Pausar el escaneo
        ctrl.stop();
        scannerControls.current = ctrl;

        // Reanudar en 3s
        resumeTimeoutRef.current = window.setTimeout(async () => {
          await reader.decodeFromVideoDevice(
            undefined,
            videoRef.current!,
            callback
          );
        }, 3000);

        return;
      }

      if (err) {
        const msg = err.message?.toLowerCase() || "";
        const isNormalError =
          err.name?.toLowerCase().includes("notfound") ||
          err.name?.toLowerCase().includes("checksum") ||
          err.name?.toLowerCase().includes("format") ||
          msg.includes("no multiformat readers") ||
          msg.includes("checksum") ||
          msg.includes("not found") ||
          msg.includes("format exception");

        if (isNormalError) {
          return;
        }
        setError("Ocurrió un problema con el escáner: " + err.message);
      }
    };

    const start = async () => {
      try {
        setError("");

        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          callback
        );

        scannerControls.current = controls;
        setIsScanning(true);
      } catch (e) {
        console.error(e);
        setError("No se pudo acceder a la cámara. Verifica permisos.");
      }
    };

    start();

    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      scannerControls.current?.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <Button onClick={onBack} variant="ghost" className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Escaneo con Cámara
          </h2>

          <ScanTypeSelector value={scanType} onChange={setScanType} />

          {error ? (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="space-y-4 relative">
              {/* Contenedor con video + canvas encima */}
              <div style={{ position: "relative", width: "100%" }}>
                <video
                  ref={videoRef}
                  className="mx-auto rounded-lg shadow-elevated"
                  style={{ width: "100%", maxWidth: "400px" }}
                  autoPlay
                  muted
                  playsInline
                />

                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {isScanning && (
                <p className="text-center text-sm text-muted-foreground animate-pulse">
                  Apunta la cámara al código QR...
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CameraScanner;

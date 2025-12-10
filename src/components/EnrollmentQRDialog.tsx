import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, MessageCircle } from "lucide-react";
import type { Enrollment } from "@/hooks/useEnrollments";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface EnrollmentQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: Enrollment | null;
}

export function EnrollmentQRDialog({
  open,
  onOpenChange,
  enrollment,
}: EnrollmentQRDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!enrollment) return null;

  const qrData = `${enrollment.student.dni}-${enrollment.idTipoMatricula}`;

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`matricula_${enrollment.student.dni}.pdf`);
  };

  const handleShareWhatsApp = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const message = encodeURIComponent(
      `Matrícula registrada:\n` +
        `Alumno: ${enrollment.student.nombre} ${enrollment.student.apellidoPaterno} ${enrollment.student.apellidoMaterno}\n` +
        `DNI: ${enrollment.student.dni}\n` +
        `Taller: ${enrollment.workshop.name}\n` +
        `Código QR: ${qrData}`
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Generado</DialogTitle>
        </DialogHeader>

        <div ref={contentRef} className="bg-white p-6 space-y-4">
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold text-primary">
              I.E. Nuestra Institución
            </h2>
            <p className="text-sm text-muted-foreground">
              Constancia de Matrícula
            </p>
          </div>

          <div className="flex justify-center py-4">
            <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg">
              <QRCodeSVG
                value={qrData}
                size={180}
                level="H"
                includeMargin
                className="mx-auto"
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">DNI:</span>
              <span>{enrollment.student.dni}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Nombre:</span>
              <span>{enrollment.student.nombre}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Apellidos:</span>
              <span>
                {enrollment.student.apellidoPaterno}{" "}
                {enrollment.student.apellidoMaterno}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Taller:</span>
              <span>{enrollment.workshop.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Horario:</span>
              <span>{enrollment.horario}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Tipo:</span>
              <span>{enrollment.idTipoMatricula}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="w-4 h-4" />
            Descargar
          </Button>
          <Button
            variant="outline"
            onClick={handleShareWhatsApp}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Salir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

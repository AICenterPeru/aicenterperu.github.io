import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Search } from "lucide-react";
import { useEnrollments, type Enrollment } from "@/hooks/useEnrollments";
import { EnrollmentQRDialog } from "@/components/EnrollmentQRDialog";
import { toast } from "sonner";

const EnrollmentPage = () => {
  const {
    addEnrollment,
    getWorkshops,
    getSchedulesByWorkshop,
    getEnrollmentTypes,
  } = useEnrollments();

  const [studentDni, setStudentDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");

  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedTipoMatricula, setSelectedTipoMatricula] = useState("");

  const [guardianDni, setGuardianDni] = useState("");
  const [guardianNombre, setGuardianNombre] = useState("");
  const [guardianApellidos, setGuardianApellidos] = useState("");
  const [guardianCelular, setGuardianCelular] = useState("");
  const [guardianCelular2, setGuardianCelular2] = useState("");
  const [guardianCorreo, setGuardianCorreo] = useState("");

  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [createdEnrollment, setCreatedEnrollment] = useState<Enrollment | null>(
    null
  );

  const workshops = getWorkshops();
  const schedules = selectedWorkshop
    ? getSchedulesByWorkshop(selectedWorkshop)
    : [];
  const enrollmentTypes = getEnrollmentTypes();

  const selectedWorkshopData = workshops.find((w) => w.id === selectedWorkshop);

  const handleSearchStudent = () => {
    // Simulación de búsqueda - en producción conectar a API
    if (studentDni === "12345678") {
      setNombre("GARCÍA");
      setApellidoPaterno("PÉREZ");
      setApellidoMaterno("LÓPEZ");
      toast.success("Alumno encontrado");
    } else if (studentDni) {
      toast.info("DNI no encontrado, ingrese los datos manualmente");
    }
  };

  const handleClear = () => {
    setStudentDni("");
    setNombre("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setSelectedWorkshop("");
    setSelectedSchedule("");
    setSelectedTipoMatricula("");
    setGuardianDni("");
    setGuardianNombre("");
    setGuardianApellidos("");
    setGuardianCelular("");
    setGuardianCelular2("");
    setGuardianCorreo("");
  };

  const handleSave = () => {
    if (
      !studentDni ||
      !nombre ||
      !apellidoPaterno ||
      !selectedWorkshop ||
      !selectedSchedule ||
      !selectedTipoMatricula
    ) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    const schedule = schedules.find((s) => s.id === selectedSchedule);
    const workshop = workshops.find((w) => w.id === selectedWorkshop);

    if (!schedule || !workshop) return;

    const enrollment = addEnrollment({
      idTipoMatricula: selectedTipoMatricula,
      student: {
        dni: studentDni,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
      },
      guardian: {
        dni: guardianDni,
        nombre: guardianNombre,
        apellidos: guardianApellidos,
        celular: guardianCelular,
        celular2: guardianCelular2,
        correo: guardianCorreo,
      },
      workshop,
      scheduleId: selectedSchedule,
      horario: `${schedule.horario} - Turno ${schedule.turno}`,
    });

    setCreatedEnrollment(enrollment);
    setQrDialogOpen(true);
    toast.success("Matrícula registrada exitosamente");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">Matrícula Talleres</h2>
        </div>

        <div className="grid gap-6">
          {/* Datos del Alumno */}
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="studentDni">DNI</Label>
                <Input
                  id="studentDni"
                  value={studentDni}
                  onChange={(e) => setStudentDni(e.target.value)}
                  placeholder="Ingrese DNI"
                  maxLength={8}
                />
              </div>
              <Button onClick={handleSearchStudent} className="gap-2">
                <Search className="w-4 h-4" />
                Buscar
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div>
                <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
                <Input
                  id="apellidoPaterno"
                  value={apellidoPaterno}
                  onChange={(e) => setApellidoPaterno(e.target.value)}
                  placeholder="Apellido Paterno"
                />
              </div>
              <div>
                <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                <Input
                  id="apellidoMaterno"
                  value={apellidoMaterno}
                  onChange={(e) => setApellidoMaterno(e.target.value)}
                  placeholder="Apellido Materno"
                />
              </div>
            </div>
          </div>

          {/* Taller y Tipo */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Taller</Label>
              <Select
                value={selectedWorkshop}
                onValueChange={(val) => {
                  setSelectedWorkshop(val);
                  setSelectedSchedule("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione taller" />
                </SelectTrigger>
                <SelectContent>
                  {workshops.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Matrícula</Label>
              <Select
                value={selectedTipoMatricula}
                onValueChange={setSelectedTipoMatricula}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  {enrollmentTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Costo</Label>
              <Input
                value={selectedWorkshopData?.cost || ""}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          {/* Tabla de Horarios */}
          {selectedWorkshop && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary">
                    <TableHead className="text-primary-foreground">
                      Horario
                    </TableHead>
                    <TableHead className="text-primary-foreground">
                      Turno
                    </TableHead>
                    <TableHead className="text-primary-foreground">
                      Disponibles
                    </TableHead>
                    <TableHead className="text-primary-foreground">
                      Seleccionar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.horario}</TableCell>
                      <TableCell>{schedule.turno}</TableCell>
                      <TableCell>{schedule.disponibles}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedSchedule === schedule.id}
                          onCheckedChange={(checked) =>
                            setSelectedSchedule(checked ? schedule.id : "")
                          }
                          disabled={schedule.disponibles === 0}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Datos del Apoderado */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Apoderado</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianDni">DNI</Label>
                <Input
                  id="guardianDni"
                  value={guardianDni}
                  onChange={(e) => setGuardianDni(e.target.value)}
                  maxLength={8}
                />
              </div>
              <div>
                <Label htmlFor="guardianNombre">Nombre</Label>
                <Input
                  id="guardianNombre"
                  value={guardianNombre}
                  onChange={(e) => setGuardianNombre(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guardianApellidos">Apellidos</Label>
                <Input
                  id="guardianApellidos"
                  value={guardianApellidos}
                  onChange={(e) => setGuardianApellidos(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guardianCelular">Celular</Label>
                <Input
                  id="guardianCelular"
                  value={guardianCelular}
                  onChange={(e) => setGuardianCelular(e.target.value)}
                  maxLength={9}
                />
              </div>
              <div>
                <Label htmlFor="guardianCelular2">Celular 2</Label>
                <Input
                  id="guardianCelular2"
                  value={guardianCelular2}
                  onChange={(e) => setGuardianCelular2(e.target.value)}
                  maxLength={9}
                />
              </div>
              <div>
                <Label htmlFor="guardianCorreo">Correo</Label>
                <Input
                  id="guardianCorreo"
                  type="email"
                  value={guardianCorreo}
                  onChange={(e) => setGuardianCorreo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={handleSave}>Guardar</Button>
            <Button variant="outline" onClick={handleClear}>
              Cancelar
            </Button>
          </div>
        </div>
      </Card>

      <EnrollmentQRDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        enrollment={createdEnrollment}
      />
    </div>
  );
};

export default EnrollmentPage;

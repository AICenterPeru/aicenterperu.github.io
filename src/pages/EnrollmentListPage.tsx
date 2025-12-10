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
import { ClipboardList, Search } from "lucide-react";
import { useEnrollments, type Enrollment } from "@/hooks/useEnrollments";

const EnrollmentListPage = () => {
  const { enrollments, getEnrollmentTypes, searchEnrollments } =
    useEnrollments();

  const [filterDni, setFilterDni] = useState("");
  const [filterNombre, setFilterNombre] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filteredResults, setFilteredResults] =
    useState<Enrollment[]>(enrollments);

  const enrollmentTypes = getEnrollmentTypes();

  const handleSearch = () => {
    const results = searchEnrollments({
      dni: filterDni || undefined,
      nombreCompleto: filterNombre || undefined,
      idTipoMatricula: filterTipo === "all" ? undefined : filterTipo,
    });
    setFilteredResults(results);
  };

  const handleClearFilters = () => {
    setFilterDni("");
    setFilterNombre("");
    setFilterTipo("all");
    setFilteredResults(enrollments);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">Bandeja de Matrículas</h2>
        </div>

        {/* Filtros */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <div>
            <Label htmlFor="filterDni">DNI</Label>
            <Input
              id="filterDni"
              value={filterDni}
              onChange={(e) => setFilterDni(e.target.value)}
              placeholder="Buscar por DNI"
              maxLength={8}
            />
          </div>
          <div>
            <Label htmlFor="filterNombre">Nombre y Apellido</Label>
            <Input
              id="filterNombre"
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
              placeholder="Buscar por nombre"
            />
          </div>
          <div>
            <Label>Tipo de Matrícula</Label>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {enrollmentTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpiar
            </Button>
          </div>
        </div>

        {/* Tabla de Resultados */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary">
                <TableHead className="text-primary-foreground">DNI</TableHead>
                <TableHead className="text-primary-foreground">
                  Nombre Completo
                </TableHead>
                <TableHead className="text-primary-foreground">
                  Tipo de Matrícula
                </TableHead>
                <TableHead className="text-primary-foreground">
                  Taller
                </TableHead>
                <TableHead className="text-primary-foreground">
                  Horario
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No se encontraron matrículas
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.student.dni}</TableCell>
                    <TableCell>
                      {enrollment.student.nombre}{" "}
                      {enrollment.student.apellidoPaterno}{" "}
                      {enrollment.student.apellidoMaterno}
                    </TableCell>
                    <TableCell>{enrollment.idTipoMatricula}</TableCell>
                    <TableCell>{enrollment.workshop.name}</TableCell>
                    <TableCell>{enrollment.horario}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Total: {filteredResults.length} matrícula(s)
        </div>
      </Card>
    </div>
  );
};

export default EnrollmentListPage;

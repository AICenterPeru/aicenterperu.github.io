import { useState, useEffect } from "react";

export interface Workshop {
  id: string;
  name: string;
  cost: number;
}

export interface Schedule {
  id: string;
  horario: string;
  turno: number;
  disponibles: number;
  workshopId: string;
}

export interface Guardian {
  dni: string;
  nombre: string;
  apellidos: string;
  celular: string;
  celular2: string;
  correo: string;
}

export interface Student {
  dni: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

export interface Enrollment {
  id: string;
  idTipoMatricula: string;
  student: Student;
  guardian: Guardian;
  workshop: Workshop;
  scheduleId: string;
  horario: string;
  createdAt: string;
}

export interface EnrollmentType {
  id: string;
  name: string;
}

const STORAGE_KEY = "enrollments";

const WORKSHOPS: Workshop[] = [
  { id: "1", name: "PISCINA", cost: 350 },
  { id: "2", name: "FÚTBOL", cost: 250 },
  { id: "3", name: "BÁSQUET", cost: 200 },
  { id: "4", name: "VÓLEY", cost: 200 },
  { id: "5", name: "AJEDREZ", cost: 150 },
];

const SCHEDULES: Schedule[] = [
  { id: "1", horario: "L-M-M", turno: 1, disponibles: 23, workshopId: "1" },
  { id: "2", horario: "S-D", turno: 1, disponibles: 22, workshopId: "1" },
  { id: "3", horario: "L-M-M", turno: 2, disponibles: 11, workshopId: "1" },
  { id: "4", horario: "S-D", turno: 2, disponibles: 0, workshopId: "1" },
  { id: "5", horario: "L-M-V", turno: 1, disponibles: 15, workshopId: "2" },
  { id: "6", horario: "M-J-S", turno: 2, disponibles: 20, workshopId: "2" },
];

const ENROLLMENT_TYPES: EnrollmentType[] = [
  { id: "TALLER", name: "Taller" },
  { id: "REGULAR", name: "Regular" },
  { id: "VACACIONAL", name: "Vacacional" },
];

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments));
  }, [enrollments]);

  const addEnrollment = (enrollment: Omit<Enrollment, "id" | "createdAt">) => {
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEnrollments((prev) => [...prev, newEnrollment]);
    return newEnrollment;
  };

  const getWorkshops = () => WORKSHOPS;
  
  const getSchedulesByWorkshop = (workshopId: string) => 
    SCHEDULES.filter((s) => s.workshopId === workshopId);

  const getEnrollmentTypes = () => ENROLLMENT_TYPES;

  const searchEnrollments = (filters: {
    dni?: string;
    nombreCompleto?: string;
    idTipoMatricula?: string;
  }) => {
    return enrollments.filter((enrollment) => {
      const matchDni = !filters.dni || enrollment.student.dni.includes(filters.dni);
      const fullName = `${enrollment.student.nombre} ${enrollment.student.apellidoPaterno} ${enrollment.student.apellidoMaterno}`.toLowerCase();
      const matchNombre = !filters.nombreCompleto || fullName.includes(filters.nombreCompleto.toLowerCase());
      const matchTipo = !filters.idTipoMatricula || enrollment.idTipoMatricula === filters.idTipoMatricula;
      return matchDni && matchNombre && matchTipo;
    });
  };

  return {
    enrollments,
    addEnrollment,
    getWorkshops,
    getSchedulesByWorkshop,
    getEnrollmentTypes,
    searchEnrollments,
  };
}
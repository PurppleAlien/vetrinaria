export const SPECIES_LABELS: Record<string, string> = {
  dog: 'Perro',
  cat: 'Gato',
  rabbit: 'Conejo',
  bird: 'Ave',
  reptile: 'Reptil',
  other: 'Otro',
};

export const GENDER_LABELS: Record<string, string> = {
  male: 'Macho',
  female: 'Hembra',
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  checked_in: 'Check-In',
  in_exam: 'En consulta',
  checked_out: 'Check-Out',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

export const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  consultation: 'Consulta general',
  vaccination: 'Vacunación',
  surgery: 'Cirugía',
  emergency: 'Urgencia',
  grooming: 'Estética',
  boarding: 'Hospitalización',
  follow_up: 'Seguimiento',
  other: 'Otro',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  veterinarian: 'Veterinario',
  technician: 'Técnico',
  receptionist: 'Recepcionista',
};

export const TOOTH_STATUS_LABELS: Record<string, string> = {
  healthy: 'Sano',
  fractured: 'Fracturado',
  missing: 'Ausente',
  worn: 'Desgastado',
  calculus: 'Cálculo/Sarro',
  gingivitis: 'Gingivitis',
  mobility: 'Movilidad',
  retained_deciduous: 'Retenido',
  root_remnant: 'Resto radicular',
  caries: 'Caries',
  pulp_exposure: 'Exposición pulpar',
  other: 'Otro',
};

export const TOOTH_STATUS_COLORS: Record<string, string> = {
  healthy: 'bg-green-500 hover:bg-green-600',
  fractured: 'bg-red-500 hover:bg-red-600',
  missing: 'bg-gray-400 hover:bg-gray-500',
  worn: 'bg-orange-400 hover:bg-orange-500',
  calculus: 'bg-yellow-500 hover:bg-yellow-600',
  gingivitis: 'bg-pink-400 hover:bg-pink-500',
  mobility: 'bg-purple-500 hover:bg-purple-600',
  retained_deciduous: 'bg-blue-400 hover:bg-blue-500',
  root_remnant: 'bg-gray-700 hover:bg-gray-800',
  caries: 'bg-amber-800 hover:bg-amber-900',
  pulp_exposure: 'bg-red-700 hover:bg-red-800',
  other: 'bg-black hover:bg-gray-900',
};

export const TOOTH_NAMES: Record<number, string> = {
  101: 'I1', 102: 'I2', 103: 'I3', 104: 'C', 105: 'P1', 106: 'P2', 107: 'P3', 108: 'P4', 109: 'M1', 110: 'M2',
  201: 'I1', 202: 'I2', 203: 'I3', 204: 'C', 205: 'P1', 206: 'P2', 207: 'P3', 208: 'P4', 209: 'M1', 210: 'M2',
  301: 'I1', 302: 'I2', 303: 'I3', 304: 'C', 305: 'P1', 306: 'P2', 307: 'P3', 308: 'P4', 309: 'M1', 310: 'M2', 311: 'M3',
  401: 'I1', 402: 'I2', 403: 'I3', 404: 'C', 405: 'P1', 406: 'P2', 407: 'P3', 408: 'P4', 409: 'M1', 410: 'M2', 411: 'M3',
};

export const DOG_TEETH = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411];

export const CAT_TEETH = [101, 102, 103, 104, 106, 107, 108, 109, 201, 202, 203, 204, 206, 207, 208, 209, 301, 302, 303, 304, 305, 306, 307, 401, 402, 403, 404, 405, 406, 407];

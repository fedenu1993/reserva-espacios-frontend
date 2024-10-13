export interface Reserva {
  id?: number;           // ID único de la reserva (opcional)
  nombre: string;        // Nombre de la reserva 
  espacio_id: number;   // ID del espacio reservado
  user_id: number;      // ID del usuario que realiza la reserva
  fecha: string;        // Fecha de la reserva (formato "YYYY-MM-DD")
  hora_inicio: string;  // Hora de inicio de la reserva (formato "HH:mm")
  hora_fin: string;     // Hora de fin de la reserva (formato "HH:mm")
  created_at?: string;  // Fecha y hora de creación de la reserva (opcional)
  updated_at?: string;  // Fecha y hora de última actualización de la reserva (opcional)
}

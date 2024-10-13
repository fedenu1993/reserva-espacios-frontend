export interface Espacio {
  id: number;                  // El ID único del espacio
  nombre: string;              // Nombre del espacio
  capacidad: number;           // Capacidad máxima del espacio
  disponible: boolean;         // Si el espacio está disponible o no
  imagen: string;              // Puede venir el nombre del archivo o el base64
  descripcion?: string;        // (Opcional) Descripción del espacio
  fechaCreacion?: Date;        // (Opcional) Fecha de creación
  fechaActualizacion?: Date;   // (Opcional) Última fecha de actualización
}
export interface User {
  id: number;                     // ID del usuario
  name: string;                   // Nombre del usuario
  email: string;                  // Correo electrónico
  password?: string;              // Contraseña (opcional al recibir datos)
  role: 'user' | 'admin';         // Rol del usuario
  email_verified_at?: Date;       // Fecha de verificación del correo
  created_at: Date;               // Fecha de creación del usuario
  updated_at: Date;               // Fecha de última actualización
}
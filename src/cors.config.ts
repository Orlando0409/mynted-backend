// CORS compartido por la API HTTP (main.ts) y el gateway de socket.io: la
// sesión viaja en cookies httpOnly, así que ambos necesitan credentials.
import { ConfigService } from '@nestjs/config';

export const CORS_OPTIONS = {
  origin: this.configService.get<string>('CORS');
  credentials: true,
};

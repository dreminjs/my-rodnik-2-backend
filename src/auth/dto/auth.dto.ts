import { createZodDto } from 'nestjs-zod';
import { AuthDtoSchema } from './auth.schema';

export class AuthDto extends createZodDto(AuthDtoSchema) {}

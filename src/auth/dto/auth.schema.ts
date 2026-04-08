import z from 'zod';

export const AuthDtoSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  password: z.string(),
});

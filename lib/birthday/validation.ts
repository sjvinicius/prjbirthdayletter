import { z } from 'zod'

export const MAX_PHOTO_BYTES = 3 * 1024 * 1024

export const birthdayEnvelopeSchema = z.object({
  name: z.string().trim().min(1, 'Escreva seu nome.').max(60, 'Use até 60 caracteres no nome.'),
  message: z
    .string()
    .trim()
    .min(2, 'Escreva uma mensagem um pouquinho maior.')
    .max(500, 'A mensagem pode ter até 500 caracteres.'),
})
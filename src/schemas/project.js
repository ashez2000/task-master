import { z } from 'zod'

export const newProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
})

import { z } from 'zod';

export const acceptingMessageAchema = z.object({
    acceptMessage: z.boolean()
})
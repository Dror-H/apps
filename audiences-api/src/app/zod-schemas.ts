import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const SocialProviderSchema = z.enum(['facebook']);

const AdAccountZ = z.object({
  id: z.string(),
  name: z.string().optional().nullable(),
  provider: z
    .lazy(() => SocialProviderSchema)
    .optional()
    .nullable(),
  status: z.string().optional().nullable(),
  businessProfilePicture: z.string().optional().nullable(),
  synchronized: z.boolean().optional().nullable(),
  createdAt: z.date().optional(),
  currency: z.string().optional(),
  minDailyBudget: z.number().optional(),
  businessCity: z.string().optional().nullable(),
  businessName: z.string().optional().nullable(),
  businessCountryCode: z.string().optional().nullable(),
  businessZip: z.string().optional().nullable(),
  businessId: z.string().optional().nullable(),
  campaignId: z.string().optional().nullable(),
  adsetId: z.string().optional().nullable(),
});

const billing = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    zipCode: z.string().or(z.number()),
    country: z.string(),
    vatNumber: z.string(),
    type: z.enum(['private', 'company'] as const),
    companyName: z.string(),
  })
  .partial();

export const UserZ = z
  .object({
    id: z.string(),
    adAccounts: z.array(AdAccountZ),
    email: z.string(),
    phone: z.string(),
    name: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    profilePicture: z.string().optional(),
    emailVerified: z.boolean().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    stripeSubscriptionId: z.string().optional(),
    billing,
  })
  .strict();

export class MeDTO extends createZodDto(UserZ.omit({ updatedAt: true }).extend({ lastLogin: z.date() })) {}
export class UserDTO extends createZodDto(UserZ) {}
export class UpdateUserDTO extends createZodDto(
  UserZ.partial({
    name: true,
    profilePicture: true,
    emailVerified: true,
    firstName: true,
    lastName: true,
    phone: true,
    billing: true,
  }).omit({
    id: true,
    adAccounts: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  }),
) {}

const createSubscriptionZ = z.object({ coupon: z.string().optional() });
export class CreateSubscriptionDTO extends createZodDto(createSubscriptionZ) {}

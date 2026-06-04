import { z } from "zod";

export const nearbyPlacesQuerySchema = z.object({
  types: z
    .union([
      z.enum(["bar", "night_club", "restaurant", "cafe"]),
      z.array(z.enum(["bar", "night_club", "restaurant", "cafe"])),
    ])
    .default("bar")
    .transform((value) => (Array.isArray(value) ? value : [value])),

  lat: z.coerce
    .number()
    .min(-90, "Minimum latitude is -90")
    .max(90, "Maximum latitude is 90")
    .default(-23.4205),

  lng: z.coerce
    .number()
    .min(-180, "Minimum longitude is -180")
    .max(180, "Maximum longitude is 180")
    .default(-51.9333),

  radius: z.coerce
    .number()
    .int("Radius must be an integer.")
    .positive("Radius must be greater than zero.")
    .max(20000, "The maximum permitted radius is 20,000 meters.")
    .default(5000),
});

export type NearbyPlacesQuery = z.infer<typeof nearbyPlacesQuerySchema>;
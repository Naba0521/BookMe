import { z } from "zod";

// Reusable schedule schema
const dayScheduleSchema = z.object({
  open: z.string(),
  close: z.string(),
  closed: z.boolean(),
});

//
// STEP 1
//
export const step1Schema = z.object({
  email: z.string().email("Зөв имэйл хаяг оруулна уу"),
  password: z.string().min(8, "Нууц үг дор хаяж 8 тэмдэгт байх ёстой"),
  confirmPassword: z.string(),
  companyName: z.string().min(2, "Компаний нэр дор хаяж 2 тэмдэгт байх ёстой"),
});

//
// STEP 2
//
export const step2Schema = z.object({
  description: z.string().optional(),
  phone: z.string().min(8, "Утасны дугаар дор хаяж 8 тэмдэгт байх ёстой"),
  experience: z.string().min(1, "Ажилласан жилээ оруулна уу"),
  clientNumber: z.string().min(1, "Үйлчлүүлэгчдийн тоог оруулна уу"),
});

//
// STEP 3
//
export const step3Schema = z.object({
  openingHours: z.object({
    monday: dayScheduleSchema,
    tuesday: dayScheduleSchema,
    wednesday: dayScheduleSchema,
    thursday: dayScheduleSchema,
    friday: dayScheduleSchema,
    saturday: dayScheduleSchema,
    sunday: dayScheduleSchema,
  }),
  lunchBreak: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

//
// STEP 4
//
export const step4Schema = z.object({
  logo: z.string().optional(),
  website: z.string().optional(),
  aboutUsImage: z.string().optional(),
  backGroundImage: z.string().optional(),
});

export const step5Schema = z.object({
  address: z.string().min(5, "Хаяг дор хаяж 5 тэмдэгт байх ёстой"),
  city: z.string().min(2, "Хотын нэр дор хаяж 2 тэмдэгт байх ёстой"),
  lat: z.number().optional(), // ✅ Add this
  lng: z.number().optional(), // ✅ Add this
});

//
// Merge all into one schema for full form validation
//
export const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema) // ← include this line
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });

//
// Types
//
export type Step1SchemaType = z.infer<typeof step1Schema>;
export type Step2SchemaType = z.infer<typeof step2Schema>;
export type Step3SchemaType = z.infer<typeof step3Schema>;
export type Step4SchemaType = z.infer<typeof step4Schema>;
export type Step5SchemaType = z.infer<typeof step5Schema>;

export type FullSchemaType = z.infer<typeof fullSchema>;

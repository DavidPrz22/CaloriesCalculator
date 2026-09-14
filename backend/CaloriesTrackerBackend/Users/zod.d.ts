import z from "zod";
export declare const UserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type UserSchemaType = z.infer<typeof UserSchema>;
//# sourceMappingURL=zod.d.ts.map
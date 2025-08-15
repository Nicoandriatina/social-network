// // lib/auth/verifyAuth.ts
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export type UserType = "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR";
// export type UserRole = "SIMPLE" | "ADMIN" | "SUPERADMIN";

// export type JWTPayload = {
//   userId: string;
//   role?: UserRole;
//   type?: UserType;
//   iat?: number;
//   exp?: number;
// };

// /**
//  * Lit le cookie "token" et vérifie le JWT.
//  * - Renvoie le payload si OK
//  * - Lance des erreurs "NO_TOKEN" / "BAD_TOKEN" sinon
//  */
// export async function verifyAuth(): Promise<JWTPayload> {
//   const cookieStore = await cookies(); // Next 15: dynamic API => await
//   const token = cookieStore.get("token")?.value;
//   if (!token) throw new Error("NO_TOKEN");

//   try {
//     return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
//   } catch {
//     throw new Error("BAD_TOKEN");
//   }
// }

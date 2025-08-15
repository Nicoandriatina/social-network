
// // lib/hooks/useCurrentUser.ts
// import { useEffect, useState } from "react";

// type UserDTO = {
//   id: string;
//   email: string;
//   nom: string | null;
//   avatarUrl: string | null;
//   role: "SIMPLE" | "ADMIN" | "SUPERADMIN";
//   typeProfil: "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR" | null;
//   etablissement: { id: string; nom: string; type: string; adresse: string | null } | null;
//   isProfileComplete: boolean;
// };

// export function useCurrentUser() {
//   const [user, setUser] = useState<UserDTO | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const ac = new AbortController();

//     (async () => {
//       try {
//         const res = await fetch("/api/user/me", {
//           credentials: "include",
//           signal: ac.signal,
//         });

//         if (!res.ok) {
//           setUser(null);
//           return;
//         }

//         const ct = res.headers.get("content-type") || "";
//         if (!ct.includes("application/json")) {
//           setUser(null);
//           return;
//         }

//         const data: UserDTO = await res.json();
//         setUser(data);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => ac.abort();
//   }, []);

//   return { user, loading };
// }

// lib/hooks/useCurrentUser.ts
import { useEffect, useState } from "react";

export type FrontUser = {
  id: string;
  nom: string;
  email?: string;
  role: "SIMPLE" | "ADMIN" | "SUPERADMIN";
  typeProfil: "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR";
  avatar?: string | null;
  telephone?: string | null;
  etablissement?: {
    id: string;
    nom: string;
    type: string;
    adresse: string;
    niveau?: string | null;
    isPublic?: boolean | null;
  } | null;
  enseignant?: { id: string; matiere?: string | null; valideParEtab?: boolean } | null;
  donateur?: { id: string; organisation?: string | null } | null;
};

export function useCurrentUser() {
  const [user, setUser] = useState<FrontUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/user/me", {
           cache: "no-store",
           credentials:"include",
           });
        if (!res.ok) throw new Error("unauthorized");
        const data = await res.json();
        if (alive) setUser(data.user as FrontUser);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { user, loading };
}

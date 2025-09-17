
// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState, useEffect } from "react";
// import * as z from "zod";
// import StepSelector from "@/components/StepSelector";
// import ProfileSelector from "@/components/ProfileSelector";
// import BasicInfoFields from "@/components/BasicInfoFields";
// import AvatarUpload from "@/components/AvatarUpload";
// import EtablissementFields from "@/components/EtablissementFields";
// import EnseignantFields from "@/components/EnseignantFields";
// import DonateurFields from "@/components/DonateurFields";

// const baseFields = z.object({
//   password: z.string().min(8),
//   fullName: z.string().min(3),
//   phone: z.string().min(10),
//   email: z.string().email(),
// });

// const etablissementFields = z.object({
//   adminType: z.string(),
//   level: z.string(),
//   studentCount: z.string(),
//   foundedYear: z.string(),
// });

// const enseignantFields = z.object({
//   school: z.string(),
//   position: z.string(),
//   experience: z.string(),
//   degree: z.string(),
// });

// const donateurFields = z.object({
//   donorType: z.string(),
//   sector: z.string(),
// });

// const formSchema = z.discriminatedUnion("profileType", [
//   z.object({ profileType: z.literal("etablissement") }).merge(baseFields).merge(etablissementFields),
//   z.object({ profileType: z.literal("enseignant") }).merge(baseFields).merge(enseignantFields),
//   z.object({ profileType: z.literal("donateur") }).merge(baseFields).merge(donateurFields),
// ]);

// export default function RegisterPage() {
//   const [profileType, setProfileType] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset
//   } = useForm({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//   });

//   const onSubmit = async (data: any) => {
//     console.log("📥 onSubmit déclenché");
//     console.log("📦 Inscription soumise:", data);
//     const payload: any = {
//       email: data.email,
//       password: data.password,
//       fullName: data.fullName,
//       telephone: data.phone,
//       type: data.profileType?.toUpperCase(),
//     };

//     if (data.profileType === "etablissement") {
//       payload.etablissement = {
//         nom: data.fullName,
//         type: data.adminType.toUpperCase(),
//         niveau: data.level.toUpperCase(),
//         adresse: "",
//         anneeCreation: parseInt(data.foundedYear),
//         nbEleves: parseInt(data.studentCount)
//       };
//     }
//     if (data.profileType === "enseignant") {
//       payload.enseignant = {
//         school: data.school,
//         position: data.position,
//         experience: data.experience,
//         degree: data.degree
//       };
//     }
//     if (data.profileType === "donateur") {
//       payload.donateur = {
//         donorType: data.donorType,
//         sector: data.sector
//       };
//     }

//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Erreur lors de la création du compte");

//       const result = await res.json();
//       alert("✅ Compte créé ! ID: " + result.userId);
//       reset();
//       setProfileType(null);
//     } catch (err: any) {
//       alert("❌ " + err.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 animate-fade-in">
//       <StepSelector current={profileType ? 1 : 0} />
//       <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
//         Rejoignez notre communauté
//       </h2>

//       <ProfileSelector selected={profileType} onSelect={setProfileType} />

//       {Object.keys(errors).length > 0 && (
//   <>
//     {console.log("🎯 Erreurs du formulaire :", errors)}
//     <p className="text-red-500 text-center font-semibold">
//       Veuillez corriger les champs du formulaire
//     </p>
//   </>
// )}



//       <form
//         onSubmit={(e) => {
//           if (!profileType) {
//             alert("Veuillez choisir un type de profil");
//             return;
//           }
//           handleSubmit(onSubmit)(e);
//         }}
//         className="space-y-6"
//       >
//         <BasicInfoFields register={register} errors={errors} />

//         {profileType === "etablissement" && <EtablissementFields register={register} errors={errors} />}
//         {profileType === "enseignant" && <EnseignantFields register={register} errors={errors} />}
//         {profileType === "donateur" && <DonateurFields register={register} errors={errors} />}

//         <AvatarUpload />

//         <input type="hidden" value={profileType || ""} {...register("profileType")} />

//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg shadow-md transition"
//           >
//             🚀 Créer mon compte
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import * as z from "zod";
import StepSelector from "@/components/RegisterComponent/StepSelector";
import ProfileSelector from "@/components/RegisterComponent/ProfileSelector";
import BasicInfoFields from "@/components/RegisterComponent/BasicInfoFields";
import AvatarUpload from "@/components/RegisterComponent/AvatarUpload";
import EtablissementFields from "@/components/RegisterComponent/EtablissementFields";
import EnseignantFields from "@/components/RegisterComponent/EnseignantFields";
import DonateurFields from "@/components/RegisterComponent/DonateurFields";
import { useRouter } from "next/navigation";

const baseFields = z.object({
  password: z.string().min(8, "Mot de passe trop court"),
  fullName: z.string().min(3, "Nom complet requis"),
  phone: z.string().min(10, "Téléphone invalide"),
  email: z.string().email("Email invalide"),
});

const etablissementFields = z.object({
  adminType: z.string(),
  level: z.string(),
  studentCount: z.coerce.number().min(1, "Nombre d'élèves requis"),
  foundedYear: z.coerce.number().min(1900, "Année invalide"),
});

const enseignantFields = z.object({
  school: z.string(),
  position: z.string(),
  experience: z.string(),
  degree: z.string(),
});

const donateurFields = z.object({
  donorType: z.string(),
  sector: z.string(),
});

const formSchema = z.discriminatedUnion("profileType", [
  z.object({ profileType: z.literal("etablissement") }).merge(baseFields).merge(etablissementFields),
  z.object({ profileType: z.literal("enseignant") }).merge(baseFields).merge(enseignantFields),
  z.object({ profileType: z.literal("donateur") }).merge(baseFields).merge(donateurFields),
]);

export default function RegisterPage() {
  const [profileType, setProfileType] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (profileType) {
      setValue("profileType", profileType);
    }
  }, [profileType, setValue]);

  const onSubmit = async (data: any) => {
    console.log("📦 Données soumises:", data);
    const payload: any = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      telephone: data.phone,
      type: data.profileType?.toUpperCase(),
    };

    if (data.profileType === "etablissement") {
      payload.etablissement = {
        nom: data.fullName,
        type: data.adminType.toUpperCase(),
        niveau: data.level.toUpperCase(),
        adresse: "",
        anneeCreation: data.foundedYear,
        nbEleves: data.studentCount,
      };
    }
    if (data.profileType === "enseignant") {
      payload.enseignant = {
        school: data.school,
        position: data.position,
        experience: data.experience,
        degree: data.degree,
      };
    }
    if (data.profileType === "donateur") {
      payload.donateur = {
        donorType: data.donorType,
        sector: data.sector,
      };
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de la création du compte");

      const result = await res.json();
      alert("✅ Compte créé ! ID: " + result.userId);
      reset();
      setProfileType(null);
      router.push("/login")
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 animate-fade-in">
      <StepSelector current={profileType ? 1 : 0} />
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Rejoignez notre communauté
      </h2>

      <ProfileSelector selected={profileType} onSelect={setProfileType} />

      {Object.keys(errors).length > 0 && (
        <>
          {console.log("🎯 Erreurs du formulaire :", errors)}
          <p className="text-red-500 text-center font-semibold">
            Veuillez corriger les champs du formulaire
          </p>
        </>
      )}

      <form
        onSubmit={(e) => {
          if (!profileType) {
            alert("Veuillez choisir un type de profil");
            return;
          }
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-6"
      >
        <BasicInfoFields register={register} errors={errors} />

        {profileType === "etablissement" && (
          <EtablissementFields register={register} errors={errors} />
        )}
        {profileType === "enseignant" && (
          <EnseignantFields register={register} errors={errors} />
        )}
        {profileType === "donateur" && (
          <DonateurFields register={register} errors={errors} />
        )}

        <AvatarUpload />

        <div className="text-center">
          <button
            type="submit"
            className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg shadow-md transition"
          >
            🚀 Créer mon compte
          </button>
        </div>
      </form>
    </div>
  );
}

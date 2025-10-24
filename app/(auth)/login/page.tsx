
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z.string().min(3, "Identifiant requis"),
  password: z.string().min(6, "Mot de passe requis"),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
  setLoading(true);
  setLoginError("");
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const ct = res.headers.get("content-type") || "";
    if (!res.ok) {
      // essaie d'extraire un message JSON, sinon texte brut
      let msg = "Échec de la connexion";
      if (ct.includes("application/json")) {
        const j = await res.json().catch(() => null);
        msg = (j && (j.error || j.message)) || msg;
      } else {
        const t = await res.text().catch(() => "");
        if (t) msg = t.slice(0, 200);
      }
      throw new Error(msg);
    }

    // OK: si JSON, on peut l’ignorer et naviguer
    if (ct.includes("application/json")) {
      await res.json().catch(() => null);
    }
    router.replace("/dashboard");
  } catch (err: any) {
    setLoginError(err?.message || "Identifiants invalides");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 p-4">
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-10 shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-teal-400 to-indigo-400" />

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-red-400 to-teal-400 text-white font-bold text-xl flex items-center justify-center shadow-md">
              MSN
            </div>
            <h1 className="text-xl font-bold text-gray-800">Mada Social Network</h1>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Bon retour !</h2>
          <p className="text-sm text-gray-600">Connectez-vous à votre compte pour accéder à votre tableau de bord</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Nom d'utilisateur ou Email</label>
            <input
              type="text"
              className={`form-input w-full px-4 py-3 border-2 rounded-xl bg-white text-sm transition-all focus:outline-none focus:border-indigo-500 ${errors.username ? "border-red-500" : "border-gray-200"}`}
              placeholder="Saisissez votre nom d'utilisateur"
              {...register("username")}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">⚠️ {errors.username.message}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              className={`form-input w-full px-4 py-3 border-2 rounded-xl bg-white text-sm transition-all focus:outline-none focus:border-indigo-500 ${errors.password ? "border-red-500" : "border-gray-200"}`}
              placeholder="Saisissez votre mot de passe"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className=" cursor-pointer absolute right-4 top-9 text-xl text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && <p className="text-xs text-red-500 mt-1">⚠️ {errors.password.message}</p>}
          </div>

          {loginError && <p className="text-sm text-red-500 font-semibold text-center">❌ {loginError}</p>}

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-indigo-500" />
              <span className="text-gray-600">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-indigo-600 hover:underline font-medium">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            className=" cursor-pointer btn-submit w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition relative overflow-hidden"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className=" loading-spinner border-white border-t-2 border-2 rounded-full w-5 h-5 animate-spin "></span>
                Connexion...
              </div>
            ) : (
              <>🚀 Se connecter</>
            )}
          </button>

          <div className="divider"><span className="px-4 text-sm text-gray-500">ou continuez avec</span></div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => alert("Connexion Google non encore disponible")}
              className="cursor-pointer social-btn flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-700 hover:border-blue-500 hover:text-blue-500"
            >🌐 Google</button>
            <button
              type="button"
              onClick={() => alert("Connexion Facebook non encore disponible")}
              className=" cursor-pointer social-btn flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-700 hover:border-blue-700 hover:text-blue-700"
            >📘 Facebook</button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-6 border-t pt-4">
            Vous n'avez pas encore de compte ?
            <a href="/signup" className="text-indigo-600 font-semibold hover:underline ml-1">Créer un compte gratuitement</a>
          </div>
        </form>
      </div>
    </div>
  );
}


// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   User, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   LogIn, 
//   Loader2, 
//   AlertCircle,
//   CheckCircle2,
//   Chrome,
//   Facebook,
//   Shield
// } from "lucide-react";

// const schema = z.object({
//   username: z.string().min(3, "Identifiant requis"),
//   password: z.string().min(6, "Mot de passe requis"),
// });

// export default function LoginPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loginError, setLoginError] = useState("");
//   const [loginSuccess, setLoginSuccess] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = async (data: z.infer<typeof schema>) => {
//     setLoading(true);
//     setLoginError("");
//     setLoginSuccess(false);
    
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const contentType = res.headers.get("content-type") || "";
      
//       if (!res.ok) {
//         let errorMessage = "Échec de la connexion";
        
//         if (contentType.includes("application/json")) {
//           const errorData = await res.json().catch(() => null);
//           errorMessage = errorData?.error || errorData?.message || errorMessage;
//         } else {
//           const textError = await res.text().catch(() => "");
//           if (textError) errorMessage = textError.slice(0, 200);
//         }
        
//         throw new Error(errorMessage);
//       }

//       // Récupérer la réponse JSON
//       if (contentType.includes("application/json")) {
//         const result = await res.json();
        
//         // Afficher un message de succès
//         setLoginSuccess(true);
        
//         // Redirection conditionnelle selon le rôle
//         if (result.user?.role === "SUPERADMIN") {
//           console.log("✅ Super Admin détecté, redirection vers /admin");
          
//           // Afficher un message spécial pour Super Admin
//           setTimeout(() => {
//             router.replace("/admin");
//           }, 1000);
//         } else {
//           // Redirection normale vers dashboard
//           setTimeout(() => {
//             router.replace(result.redirectTo || "/dashboard");
//           }, 1000);
//         }
        
//         return;
//       }
      
//       // Fallback si pas de JSON
//       router.replace("/dashboard");
      
//     } catch (err: any) {
//       setLoginError(err?.message || "Identifiants invalides");
//       setLoginSuccess(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-700"></div>
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Main Card */}
//         <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl relative overflow-hidden animate-fade-in">
//           {/* Top gradient bar */}
//           <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-teal-400 to-indigo-500" />

//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-400 to-teal-400 text-white font-bold text-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
//                 MSN
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-800">Mada Social Network</h1>
//                 <p className="text-xs text-gray-500">Plateforme éducative</p>
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
//               Bon retour !
//             </h2>
//             <p className="text-sm text-gray-600">
//               Connectez-vous pour accéder à votre espace
//             </p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* Username Field */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                 <User className="w-4 h-4 text-gray-500" />
//                 Nom d'utilisateur ou Email
//               </label>
//               <input
//                 type="text"
//                 className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                   errors.username ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 placeholder="Saisissez votre identifiant"
//                 disabled={loading || loginSuccess}
//                 {...register("username")}
//               />
//               {errors.username && (
//                 <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   {errors.username.message}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div className="relative">
//               <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                 <Lock className="w-4 h-4 text-gray-500" />
//                 Mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     errors.password ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
//                   }`}
//                   placeholder="Saisissez votre mot de passe"
//                   disabled={loading || loginSuccess}
//                   {...register("password")}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
//                   aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//                   disabled={loading || loginSuccess}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Login Success */}
//             {loginSuccess && (
//               <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2 animate-fade-in">
//                 <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                 <div className="text-sm text-green-800">
//                   <p className="font-medium">Connexion réussie !</p>
//                   <p className="mt-1 flex items-center gap-1">
//                     <Shield className="w-3 h-3" />
//                     Redirection en cours...
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Login Error */}
//             {loginError && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-shake">
//                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//                 <div className="text-sm text-red-800">
//                   <p className="font-medium">Erreur de connexion</p>
//                   <p className="mt-1">{loginError}</p>
//                 </div>
//               </div>
//             )}

//             {/* Remember me & Forgot password */}
//             <div className="flex justify-between items-center text-sm pt-2">
//               <label className="flex items-center gap-2 cursor-pointer group">
//                 <input 
//                   type="checkbox" 
//                   className="w-4 h-4 accent-indigo-600 cursor-pointer"
//                   disabled={loading || loginSuccess}
//                 />
//                 <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
//                   Se souvenir de moi
//                 </span>
//               </label>
//               <a 
//                 href="#" 
//                 className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
//               >
//                 Mot de passe oublié ?
//               </a>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
//               disabled={loading || loginSuccess}
//             >
//               {loginSuccess ? (
//                 <>
//                   <CheckCircle2 className="w-5 h-5 animate-bounce" />
//                   <span>Connexion réussie !</span>
//                 </>
//               ) : loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   <span>Connexion en cours...</span>
//                 </>
//               ) : (
//                 <>
//                   <LogIn className="w-5 h-5" />
//                   <span>Se connecter</span>
//                 </>
//               )}
//             </button>

//             {/* Divider */}
//             <div className="relative flex items-center my-6">
//               <div className="flex-grow border-t border-gray-200"></div>
//               <span className="flex-shrink mx-4 text-sm text-gray-500 font-medium">
//                 ou continuez avec
//               </span>
//               <div className="flex-grow border-t border-gray-200"></div>
//             </div>

//             {/* Social Login Buttons */}
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => alert("Connexion Google non encore disponible")}
//                 className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={loading || loginSuccess}
//               >
//                 <Chrome className="w-5 h-5" />
//                 <span className="text-sm">Google</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => alert("Connexion Facebook non encore disponible")}
//                 className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 hover:border-blue-700 hover:bg-blue-50 hover:text-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={loading || loginSuccess}
//               >
//                 <Facebook className="w-5 h-5" />
//                 <span className="text-sm">Facebook</span>
//               </button>
//             </div>

//             {/* Sign up link */}
//             <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-100">
//               <p>
//                 Vous n'avez pas encore de compte ?{" "}
//                 <a 
//                   href="/signup" 
//                   className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors inline-flex items-center gap-1"
//                 >
//                   Créer un compte gratuitement
//                   <CheckCircle2 className="w-4 h-4" />
//                 </a>
//               </p>
//             </div>
//           </form>
//         </div>

//         {/* Footer text */}
//         <div className="text-center mt-6 text-sm text-white opacity-90">
//           <p>© 2024 Mada Social Network - Tous droits réservés</p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Chrome,
  Facebook,
  Shield,
  Mail,
  Phone
} from "lucide-react";

const schema = z.object({
  username: z.string().min(3, "Email ou téléphone requis"),
  password: z.string().min(6, "Mot de passe requis (minimum 6 caractères)"),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [inputType, setInputType] = useState<"email" | "phone" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Détecter automatiquement le type d'input
  const usernameValue = watch("username");
  
  const detectInputType = (value: string) => {
    if (!value) return null;
    
    // Vérifier si c'est un email
    if (value.includes("@")) {
      return "email";
    }
    
    // Vérifier si c'est un numéro (contient uniquement des chiffres, espaces, +, -)
    if (/^[\d\s+\-()]+$/.test(value)) {
      return "phone";
    }
    
    return null;
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    setLoginError("");
    setLoginSuccess(false);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get("content-type") || "";
      
      if (!res.ok) {
        let errorMessage = "Échec de la connexion";
        
        if (contentType.includes("application/json")) {
          const errorData = await res.json().catch(() => null);
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } else {
          const textError = await res.text().catch(() => "");
          if (textError) errorMessage = textError.slice(0, 200);
        }
        
        throw new Error(errorMessage);
      }

      if (contentType.includes("application/json")) {
        const result = await res.json();
        setLoginSuccess(true);
        
        if (result.user?.role === "SUPERADMIN") {
          setTimeout(() => {
            router.replace("/admin");
          }, 1000);
        } else {
          setTimeout(() => {
            router.replace(result.redirectTo || "/dashboard");
          }, 1000);
        }
        
        return;
      }
      
      router.replace("/dashboard");
      
    } catch (err: any) {
      setLoginError(err?.message || "Identifiants invalides");
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le type d'input détecté
  useState(() => {
    if (usernameValue) {
      setInputType(detectInputType(usernameValue));
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-teal-400 to-indigo-500" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-400 to-teal-400 text-white font-bold text-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                MSN
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mada Social Network</h1>
                <p className="text-xs text-gray-500">Plateforme éducative</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Bon retour !
            </h2>
            <p className="text-sm text-gray-600">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username/Email/Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                {inputType === "email" ? (
                  <Mail className="w-4 h-4 text-indigo-500" />
                ) : inputType === "phone" ? (
                  <Phone className="w-4 h-4 text-green-500" />
                ) : (
                  <User className="w-4 h-4 text-gray-500" />
                )}
                Email ou Téléphone
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full px-4 py-3 pr-10 border-2 rounded-xl bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.username ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="exemple@email.com ou +261 34 12 345 67"
                  disabled={loading || loginSuccess}
                  {...register("username", {
                    onChange: (e) => {
                      setInputType(detectInputType(e.target.value));
                    }
                  })}
                />
                {/* Indicateur visuel du type détecté */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {inputType === "email" && (
                    <Mail className="w-5 h-5 text-indigo-400" />
                  )}
                  {inputType === "phone" && (
                    <Phone className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </div>
              {errors.username && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.username.message}
                </p>
              )}
              {/* Info bulle */}
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Vous pouvez utiliser votre email ou numéro de téléphone
              </p>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.password ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Saisissez votre mot de passe"
                  disabled={loading || loginSuccess}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  disabled={loading || loginSuccess}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Success */}
            {loginSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Connexion réussie !</p>
                  <p className="mt-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Redirection en cours...
                  </p>
                </div>
              </div>
            )}

            {/* Login Error */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Erreur de connexion</p>
                  <p className="mt-1">{loginError}</p>
                </div>
              </div>
            )}

            {/* Remember me & Forgot password */}
            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  disabled={loading || loginSuccess}
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <a 
                href="#" 
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              disabled={loading || loginSuccess}
            >
              {loginSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  <span>Connexion réussie !</span>
                </>
              ) : loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-sm text-gray-500 font-medium">
                ou continuez avec
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("Connexion Google non encore disponible")}
                className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || loginSuccess}
              >
                <Chrome className="w-5 h-5" />
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Connexion Facebook non encore disponible")}
                className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 hover:border-blue-700 hover:bg-blue-50 hover:text-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || loginSuccess}
              >
                <Facebook className="w-5 h-5" />
                <span className="text-sm">Facebook</span>
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-100">
              <p>
                Vous n'avez pas encore de compte ?{" "}
                <a 
                  href="/signup" 
                  className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors inline-flex items-center gap-1"
                >
                  Créer un compte gratuitement
                  <CheckCircle2 className="w-4 h-4" />
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer text */}
        <div className="text-center mt-6 text-sm text-white opacity-90">
          <p>© 2024 Mada Social Network - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}
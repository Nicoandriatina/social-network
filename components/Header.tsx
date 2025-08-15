// components/Header.tsx
export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl px-8 py-4 mt-4 flex items-center justify-between sticky top-4 z-50">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-400 to-teal-400 text-white font-bold text-xl flex items-center justify-center shadow-md">
          MSN
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Mada Social Network</h1>
          <p className="text-sm text-gray-500">Connectons l'Éducation Malgache</p>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <select className="border border-indigo-200 bg-indigo-50 text-indigo-600 font-semibold rounded-lg px-4 py-2 text-sm">
          <option value="fr">Français</option>
          <option value="mg">Malagasy</option>
          <option value="en">English</option>
        </select>
        <a href="/login" className="btn bg-white text-indigo-600 font-semibold border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition text-sm">Se connecter</a>
        <a href="/signup" className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition text-sm">S'inscrire</a>
      </div>
    </header>
  );
}

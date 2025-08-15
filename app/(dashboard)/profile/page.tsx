import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="max-w-4xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue {user.nom} ({user.role})
      </h1>

      {user.role === 'SUPERADMIN' && (
        <div className="p-4 bg-blue-100 rounded shadow">
          <h2 className="text-xl font-semibold">Zone Superadmin</h2>
          <p>Gérez les utilisateurs, dons et établissements.</p>
        </div>
      )}

      {user.role === 'ADMIN' && (
        <div className="p-4 bg-green-100 rounded shadow">
          <h2 className="text-xl font-semibold">Zone Administrateur Établissement</h2>
          <p>Gérez vos enseignants et vos projets.</p>
        </div>
      )}

      {user.role === 'SIMPLE' && (
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold">Espace Utilisateur</h2>
          <p>Consultez vos projets ou vos dons.</p>
        </div>
      )}
    </main>
  );
}

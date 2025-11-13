// app/projects/[id]/page.tsx

import ProjectDetailsClient from "./ProjectDetailsClient";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  
  // Validation et debug
  if (!resolvedParams?.id) {
    console.error('❌ No project ID provided');
    return <div>Erreur : ID de projet manquant</div>;
  }

  console.log('✅ Server - Rendering project:', resolvedParams.id);
  
  return <ProjectDetailsClient projectId={resolvedParams.id} />;
}
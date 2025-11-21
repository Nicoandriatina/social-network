// app/projects/[id]/edit/page.tsx
import ProjectEditClient from './ProjectEditClient';

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    console.error('❌ No project ID provided for edit');
    return <div>Erreur : ID de projet manquant</div>;
  }

  console.log('✅ Server - Editing project:', resolvedParams.id);
  
  return <ProjectEditClient projectId={resolvedParams.id} />;
}
// app/api/projects/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// GET - Récupérer un projet par ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            email: true
          }
        },
        etablissement: {
          select: {
            id: true,
            nom: true,
            type: true,
            niveau: true,
            adresse: true
          }
        },
        dons: {
          include: {
            donateur: {
              select: {
                id: true,
                fullName: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            dons: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un projet
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();

    // Vérifier que le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { auteur: true }
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier les permissions (seul l'auteur ou un admin peut modifier)
    const userId = formData.get('userId');
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || (existingProject.auteurId !== userId && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Extraction des données à mettre à jour
    const updateData = {
      titre: formData.get('title') || existingProject.titre,
      description: formData.get('description') || existingProject.description,
      categorie: formData.get('category')?.toUpperCase() || existingProject.categorie,
      dateDebut: formData.get('startDate') ? new Date(formData.get('startDate')) : existingProject.dateDebut,
      dateFin: formData.get('endDate') ? new Date(formData.get('endDate')) : existingProject.dateFin
    };

    // Traitement des nouvelles photos si fournies
    const photoFiles = formData.getAll('photos');
    if (photoFiles.length > 0 && photoFiles[0].size > 0) {
      // Supprimer les anciennes photos
      for (const oldPhoto of existingProject.photos) {
        try {
          const oldPhotoPath = path.join(process.cwd(), 'public', oldPhoto);
          await unlink(oldPhotoPath);
        } catch (error) {
          console.log('Erreur lors de la suppression de l\'ancienne photo:', error);
        }
      }

      // Ajouter les nouvelles photos
      const newPhotos = [];
      const uploadDir = path.join(process.cwd(), 'public/uploads/projects');
      
      for (const file of photoFiles) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
          const filePath = path.join(uploadDir, fileName);
          
          await writeFile(filePath, buffer);
          newPhotos.push(`/uploads/projects/${fileName}`);
        }
      }
      
      updateData.photos = newPhotos;
    }

    // Mettre à jour le projet
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        },
        etablissement: {
          select: {
            id: true,
            nom: true,
            type: true,
            niveau: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Projet mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un projet
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Vérifier que le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { 
        auteur: true,
        dons: true 
      }
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || (existingProject.auteurId !== userId && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Vérifier s'il y a des dons associés
    if (existingProject.dons.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Impossible de supprimer un projet qui a reçu des dons' },
        { status: 400 }
      );
    }

    // Supprimer les photos du serveur
    for (const photo of existingProject.photos) {
      try {
        const photoPath = path.join(process.cwd(), 'public', photo);
        await unlink(photoPath);
      } catch (error) {
        console.log('Erreur lors de la suppression de la photo:', error);
      }
    }

    // Supprimer le projet
    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Projet supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
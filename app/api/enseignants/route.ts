// app/api/etablissements/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer tous les établissements
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const niveau = searchParams.get('niveau');
    const search = searchParams.get('search');

    const where = {};
    
    if (type) {
      where.type = type.toUpperCase();
    }
    
    if (niveau) {
      where.niveau = niveau.toUpperCase();
    }
    
    if (search) {
      where.nom = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const etablissements = await prisma.etablissement.findMany({
      where,
      select: {
        id: true,
        nom: true,
        type: true,
        niveau: true,
        adresse: true,
        _count: {
          select: {
            membres: true,
            projects: true
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: etablissements
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des établissements:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
// app/api/admin/donations/transactions/route.ts
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/middleware/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");

    const skip = (page - 1) * limit;

    // Filtres
    const where: any = {
      type: "MONETAIRE",
      montant: { not: null }
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      where.montant = {};
      if (minAmount) where.montant.gte = parseFloat(minAmount);
      if (maxAmount) where.montant.lte = parseFloat(maxAmount);
    }

    // Récupérer les transactions
    const [transactions, totalCount, summary] = await Promise.all([
      prisma.don.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          donateur: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatar: true
            }
          },
          project: {
            select: {
              id: true,
              titre: true,
              reference: true,
              etablissement: {
                select: {
                  id: true,
                  nom: true
                }
              }
            }
          },
          beneficiaireEtab: {
            select: {
              id: true,
              nom: true
            }
          },
          beneficiairePersonnel: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      }),
      prisma.don.count({ where }),
      prisma.don.aggregate({
        where,
        _sum: { montant: true },
        _avg: { montant: true },
        _max: { montant: true },
        _min: { montant: true }
      })
    ]);

    // Formater les transactions
    const formattedTransactions = transactions.map(t => {
      // Déterminer le type de destinataire
      let recipientType = "unknown";
      let recipientName = "Non spécifié";
      let recipientId = null;

      if (t.project) {
        recipientType = "project";
        recipientName = t.project.titre;
        recipientId = t.project.id;
        if (t.project.etablissement) {
          recipientName += ` (${t.project.etablissement.nom})`;
        }
      } else if (t.beneficiaireEtab) {
        recipientType = "school";
        recipientName = t.beneficiaireEtab.nom;
        recipientId = t.beneficiaireEtab.id;
      } else if (t.beneficiairePersonnel) {
        recipientType = "user";
        recipientName = t.beneficiairePersonnel.fullName;
        recipientId = t.beneficiairePersonnel.id;
      }

      return {
        id: t.id,
        reference: t.reference,
        date: t.createdAt,
        amount: t.montant,
        status: t.statut,
        donor: {
          id: t.donateur.id,
          name: t.donateur.fullName,
          email: t.donateur.email,
          avatar: t.donateur.avatar
        },
        recipient: {
          type: recipientType,
          id: recipientId,
          name: recipientName
        },
        libelle: t.libelle,
        description: t.description
      };
    });

    // Grouper par mois pour visualisation
    let monthlyQuery = `
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        SUM(montant)::float as total_amount,
        COUNT(*)::bigint as transaction_count
      FROM "Don"
      WHERE type = 'MONETAIRE' 
        AND montant IS NOT NULL
    `;

    if (startDate) {
      monthlyQuery += ` AND "createdAt" >= '${startDate}'`;
    }
    if (endDate) {
      monthlyQuery += ` AND "createdAt" <= '${endDate}'`;
    }

    monthlyQuery += `
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `;

    const monthlyData = await prisma.$queryRawUnsafe<Array<{
      month: string;
      total_amount: number;
      transaction_count: bigint;
    }>>(monthlyQuery);

    // Top donateurs
    const topDonors = await prisma.user.findMany({
      where: {
        type: "DONATEUR",
        donsFaits: {
          some: {
            type: "MONETAIRE",
            montant: { not: null },
            ...(startDate && { createdAt: { gte: new Date(startDate) } })
          }
        }
      },
      select: {
        id: true,
        fullName: true,
        avatar: true,
        donsFaits: {
          where: {
            type: "MONETAIRE",
            montant: { not: null },
            ...(startDate && { createdAt: { gte: new Date(startDate) } })
          },
          select: {
            montant: true
          }
        }
      },
      take: 10
    });

    const topDonorsFormatted = topDonors.map(d => ({
      id: d.id,
      name: d.fullName,
      avatar: d.avatar,
      totalAmount: d.donsFaits.reduce((sum, don) => sum + (don.montant || 0), 0),
      transactionCount: d.donsFaits.length
    })).sort((a, b) => b.totalAmount - a.totalAmount);

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount
        },
        summary: {
          totalAmount: summary._sum.montant || 0,
          averageAmount: summary._avg.montant || 0,
          maxAmount: summary._max.montant || 0,
          minAmount: summary._min.montant || 0,
          transactionCount: totalCount
        },
        monthlyData: monthlyData.map(m => ({
          month: m.month,
          totalAmount: m.total_amount,
          transactionCount: Number(m.transaction_count)
        })),
        topDonors: topDonorsFormatted
      }
    });

  } catch (error) {
    console.error("❌ Erreur API Transactions:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des transactions"
      },
      { status: 500 }
    );
  }
}
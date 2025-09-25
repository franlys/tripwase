import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  AuthenticatedRequest,
  ApiResponse,
  TripStats
} from '../types';

const prisma = new PrismaClient();

export const getTripStats = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<TripStats>>
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    // CORRECCIÓN: usar 'trip' (singular) no 'trips' (plural)
    const trips = await prisma.trip.findMany({
      where: {
        userId: req.user.id,
        isArchived: false
      },
      include: {
        destination: true  // CORRECCIÓN: 'destination' (singular) según el schema
      }
    });

    const byStatus = trips.reduce((acc: Record<string, number>, trip: any) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // CORRECCIÓN: usar budgetTotal en lugar de budget
    const totalBudget = trips.reduce((sum: number, trip: any) => sum + (trip.budgetTotal || 0), 0);
    
    // CORRECCIÓN: obtener nombres de destinos del campo 'destination' (singular)
    const allDestinations = trips.map((trip: any) => trip.destination?.name).filter(Boolean);
    const destinations = [...new Set(allDestinations)] as string[];
    
    const now = new Date();
    const upcomingTrips = trips.filter((trip: any) => 
      new Date(trip.startDate) > now && trip.status !== 'CANCELLED'
    ).length;

    const stats: TripStats = {
      total: trips.length,
      byStatus,
      totalBudget,
      averageBudget: trips.length > 0 ? totalBudget / trips.length : 0,
      destinations,
      upcomingTrips,
      completedTrips: byStatus['COMPLETED'] || 0
    };

    res.json({
      success: true,
      data: stats,
      message: 'Estadísticas obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Get trip stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
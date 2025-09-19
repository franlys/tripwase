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

    const trips = await prisma.trip.findMany({
      where: {
        userId: req.user.id,
        isArchived: false
      },
      include: {
        destination: true
      }
    });

    const byStatus = trips.reduce((acc: Record<string, number>, trip: any) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalBudget = trips.reduce((sum: number, trip: any) => sum + trip.budgetTotal, 0);
    
    // Corregir el tipado de destinations
    const destinations = [...new Set(trips.map((trip: any) => trip.destination.name as string))] as string[];
    
    const now = new Date();
    const upcomingTrips = trips.filter((trip: any) => 
      trip.startDate > now && trip.status !== 'CANCELLED'
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
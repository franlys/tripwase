"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripStats = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTripStats = async (req, res) => {
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
        const byStatus = trips.reduce((acc, trip) => {
            acc[trip.status] = (acc[trip.status] || 0) + 1;
            return acc;
        }, {});
        const totalBudget = trips.reduce((sum, trip) => sum + trip.budgetTotal, 0);
        // Corregir el tipado de destinations
        const destinations = [...new Set(trips.map((trip) => trip.destination.name))];
        const now = new Date();
        const upcomingTrips = trips.filter((trip) => trip.startDate > now && trip.status !== 'CANCELLED').length;
        const stats = {
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
    }
    catch (error) {
        console.error('Get trip stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getTripStats = getTripStats;
//# sourceMappingURL=tripController.js.map
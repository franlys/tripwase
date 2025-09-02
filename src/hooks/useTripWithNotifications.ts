import { useCallback } from 'react';
import { useTrip } from './useTrip';
import { useNotifications } from '../contexts/NotificationContext';
import type { Destination, Trip } from '../contexts/TripContext';

export const useTripWithNotifications = () => {
  const tripContext = useTrip();
  const { success, error: notifyError, warning, info } = useNotifications();

  const startTripPlanningWithNotification = useCallback((destination: Destination) => {
    tripContext.startTripPlanning(destination);
    success('Viaje creado', `Viaje a ${destination.name} creado automáticamente`, 4000);
  }, [tripContext.startTripPlanning, success]);

  const updateTripDetailsWithNotification = useCallback((updates: Partial<Trip>) => {
    tripContext.updateTripDetails(updates);
    info('Viaje actualizado', 'Cambios guardados automáticamente', 2000);
  }, [tripContext.updateTripDetails, info]);

  const deleteTriplWithNotification = useCallback((tripId: string) => {
    const tripToDelete = tripContext.trips.find(t => t.id === tripId);
    tripContext.deleteTrip(tripId);
    if (tripToDelete) {
      success('Viaje eliminado', `"${tripToDelete.name}" eliminado`, 4000);
    }
  }, [tripContext.deleteTrip, tripContext.trips, success]);

  const addToFavoritesWithNotification = useCallback((destination: Destination) => {
    if (tripContext.isFavorite(destination.id)) {
      warning('Ya en favoritos', `${destination.name} ya está en favoritos`, 3000);
      return;
    }
    tripContext.addToFavorites(destination);
    success('Agregado a favoritos', `${destination.name} agregado a favoritos`, 3000);
  }, [tripContext.addToFavorites, tripContext.isFavorite, warning, success]);

  return {
    ...tripContext,
    startTripPlanning: startTripPlanningWithNotification,
    updateTripDetails: updateTripDetailsWithNotification,
    deleteTrip: deleteTriplWithNotification,
    addToFavorites: addToFavoritesWithNotification,
  };
};

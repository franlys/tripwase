// src/pages/DashboardPage.tsx - Dashboard mejorado con viajes guardados - CORREGIDO
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../contexts/TripContext';
import { ROUTES } from '../routes/routes.config';
import { 
  Calendar, MapPin, Users, TrendingUp, Plane, DollarSign, Clock, 
  Eye, Trash2, Edit, CreditCard, Check, AlertCircle, Star,
  Plus, Filter, Search
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { trips, getTripsStats, deleteTrip } = useTrip();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = getTripsStats();

  // ✅ CORRECCIÓN 1: Filtrar viajes por estado y término de búsqueda
  const filteredTrips = trips.filter(trip => {
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    // ✅ CORREGIDO: trip.destination es objeto, acceder a .name
    const matchesSearch = trip.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      deleteTrip(tripId);
    }
  };

  const handleViewTrip = (tripId: string) => {
    // Navegar a una vista detallada del viaje
    navigate(`/trip/${tripId}`);
  };

  const handleProceedToPayment = (tripId: string) => {
    navigate(`/checkout/${tripId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Planificando' },
      completed: { color: 'bg-green-100 text-green-800', icon: Check, label: 'Completado' },
      paid: { color: 'bg-blue-100 text-blue-800', icon: CreditCard, label: 'Pagado' },
      confirmed: { color: 'bg-purple-100 text-purple-800', icon: Check, label: 'Confirmado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-page">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Bienvenido a tu centro de control de viajes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Viajes Totales</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Plane className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Viajes Completados</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <Check className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Destinos Únicos</p>
                <p className="text-3xl font-bold">{stats.destinationsCount}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Ahorro Total</p>
                <p className="text-3xl font-bold">${stats.totalSavings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link 
            to={ROUTES.PLANNER.path}
            className="action-card group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Nuevo Viaje</h3>
                <p className="text-sm text-gray-600">Planifica tu próxima aventura</p>
              </div>
            </div>
          </Link>

          <Link 
            to={ROUTES.SEARCH.path}
            className="action-card group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-green-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Explorar Destinos</h3>
                <p className="text-sm text-gray-600">Descubre nuevos lugares</p>
              </div>
            </div>
          </Link>

          <Link 
            to={ROUTES.COMPARISON.path}
            className="action-card group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-orange-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Comparar Planes</h3>
                <p className="text-sm text-gray-600">Encuentra la mejor opción</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Trips Section */}
        <div className="trips-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Viajes</h2>
            
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar viajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="planning">Planificando</option>
                <option value="completed">Completados</option>
                <option value="paid">Pagados</option>
                <option value="confirmed">Confirmados</option>
              </select>
            </div>
          </div>

          {/* Trips Grid */}
          {filteredTrips.length === 0 ? (
            <div className="empty-state text-center py-16">
              {trips.length === 0 ? (
                <>
                  <Plane className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    ¡Empieza tu primera aventura!
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Aún no tienes viajes guardados. Crea tu primer itinerario y comienza a explorar el mundo.
                  </p>
                  <Link 
                    to={ROUTES.PLANNER.path}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Planificar Mi Primer Viaje</span>
                  </Link>
                </>
              ) : (
                <>
                  <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No se encontraron viajes
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="trip-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Card Header */}
                  <div className="card-header bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg truncate">{trip.name}</h3>
                      {getStatusBadge(trip.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-blue-100">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        {/* ✅ CORRECCIÓN 2: trip.destination es objeto, acceder a .name */}
                        <span>{trip.destination.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.duration} días</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Fechas</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Costo Total</p>
                        <p className="font-bold text-lg text-green-600">
                          {/* ✅ CORRECCIÓN 4: Validar totalCost opcional */}
                          ${trip.totalCost?.toLocaleString() || trip.budget.total.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="trip-details grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Viajeros</p>
                        {/* ✅ CORRECCIÓN 3: trip.travelers es objeto, sumar adults + children */}
                        <p className="font-medium">{trip.travelers.adults + trip.travelers.children} persona(s)</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Plan</p>
                        {/* ✅ CORRECCIÓN 5: Validar selectedPlan opcional */}
                        <p className="font-medium capitalize">{trip.selectedPlan?.tier || 'Sin plan'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Origen</p>
                        <p className="font-medium">{trip.origin.city}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Actividades</p>
                        <p className="font-medium">{trip.itinerary.reduce((sum, day) => sum + day.activities.length, 0)}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons flex space-x-2">
                      <button
                        onClick={() => handleViewTrip(trip.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver</span>
                      </button>

                      {trip.status === 'planning' && (
                        <button
                          onClick={() => handleProceedToPayment(trip.id)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pagar</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Footer - Additional Info */}
                  <div className="card-footer px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Creado: {formatDate(trip.createdAt)}</span>
                      {/* ✅ CORRECCIÓN 6: Validar selectedPlan y savings opcionales */}
                      {trip.selectedPlan?.savings && trip.selectedPlan.savings > 0 && (
                        <span className="text-green-600 font-medium">
                          Ahorro: ${trip.selectedPlan.savings.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
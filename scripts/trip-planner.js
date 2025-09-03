#!/usr/bin/env node

// scripts/trip-planner.js - TripWase Trip Planner CLI (Destinos expandidos)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const TRIPS_FILE = path.join(DATA_DIR, 'trips.json');

class TripPlanner {
  constructor() {
    this.loadTrips();
  }

  loadTrips() {
    try {
      if (fs.existsSync(TRIPS_FILE)) {
        this.trips = JSON.parse(fs.readFileSync(TRIPS_FILE, 'utf8'));
      } else {
        this.trips = [];
        this.saveTrips();
      }
    } catch (error) {
      console.error('? Error cargando viajes:', error.message);
      this.trips = [];
    }
  }

  saveTrips() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(TRIPS_FILE, JSON.stringify(this.trips, null, 2));
      console.log('? Viajes guardados correctamente');
    } catch (error) {
      console.error('? Error guardando viajes:', error.message);
    }
  }

  createTrip(name, destination, startDate, endDate, budget = 1000) {
    const trip = {
      id: `trip_${Date.now()}`,
      name,
      destination: {
        name: destination,
        country: this.getCountryByDestination(destination),
        currency: this.getCurrencyByDestination(destination)
      },
      dates: { startDate, endDate },
      travelers: { adults: 2, children: 0 },
      budget: { 
        total: parseFloat(budget), 
        spent: 0, 
        currency: this.getCurrencyByDestination(destination)
      },
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dayPlans: [],
      selectedTemplates: []
    };

    this.trips.push(trip);
    this.saveTrips();

    console.log(`\n? Viaje creado: "${name}"`);
    console.log(`?? ID: ${trip.id}`);
    console.log(`?? Destino: ${destination}, ${trip.destination.country}`);
    console.log(`?? Fechas: ${startDate} ? ${endDate}`);
    console.log(`?? Presupuesto: ${budget} ${trip.destination.currency}`);
    console.log(`?? País: ${trip.destination.country}`);

    return trip.id;
  }

  getCountryByDestination(destination) {
    const countries = {
      madrid: 'España',
      barcelona: 'España',
      paris: 'Francia',
      rome: 'Italia',
      london: 'Reino Unido',
      amsterdam: 'Países Bajos',
      lisbon: 'Portugal'
    };
    return countries[destination.toLowerCase()] || 'Desconocido';
  }

  getCurrencyByDestination(destination) {
    const currencies = {
      madrid: 'EUR',
      barcelona: 'EUR',
      paris: 'EUR',
      rome: 'EUR',
      london: 'GBP',
      amsterdam: 'EUR',
      lisbon: 'EUR'
    };
    return currencies[destination.toLowerCase()] || 'EUR';
  }

  listDestinations() {
    console.log('\n?? DESTINOS DISPONIBLES PARA CREAR VIAJES\n');
    
    const destinations = [
      { city: 'madrid', country: 'España', currency: 'EUR', flag: '????' },
      { city: 'barcelona', country: 'España', currency: 'EUR', flag: '????' },
      { city: 'paris', country: 'Francia', currency: 'EUR', flag: '????' },
      { city: 'rome', country: 'Italia', currency: 'EUR', flag: '????' },
      { city: 'london', country: 'Reino Unido', currency: 'GBP', flag: '????' },
      { city: 'amsterdam', country: 'Países Bajos', currency: 'EUR', flag: '????' },
      { city: 'lisbon', country: 'Portugal', currency: 'EUR', flag: '????' }
    ];

    destinations.forEach((dest, index) => {
      console.log(`${index + 1}. ${dest.city.toUpperCase()} ${dest.flag}`);
      console.log(`   ?? País: ${dest.country}`);
      console.log(`   ?? Moneda: ${dest.currency}`);
      console.log('');
    });

    console.log('?? Para crear un viaje usa:');
    console.log('   node scripts/trip-planner.js create "Nombre" <destino> YYYY-MM-DD YYYY-MM-DD [presupuesto]');
  }

  listTrips() {
    console.log('\n?? VIAJES CREADOS\n');

    if (this.trips.length === 0) {
      console.log('? No hay viajes creados');
      console.log('?? Usa: node scripts/trip-planner.js create "Nombre" destino 2025-09-15 2025-09-18 1000');
      console.log('?? Ver destinos: node scripts/trip-planner.js list-destinations');
      return;
    }

    // Agrupar por país
    const tripsByCountry = {};
    this.trips.forEach(trip => {
      const country = trip.destination.country;
      if (!tripsByCountry[country]) {
        tripsByCountry[country] = [];
      }
      tripsByCountry[country].push(trip);
    });

    Object.entries(tripsByCountry).forEach(([country, countryTrips]) => {
      console.log(`?? ${country.toUpperCase()}:`);
      countryTrips.forEach((trip, index) => {
        console.log(`   ${index + 1}. ${trip.name} (${trip.id})`);
        console.log(`      ?? ${trip.destination.name}`);
        console.log(`      ?? ${trip.dates.startDate} ? ${trip.dates.endDate}`);
        console.log(`      ?? ${trip.budget.spent}/${trip.budget.total} ${trip.destination.currency || 'EUR'}`);
        console.log(`      ?? ${trip.selectedTemplates.length} templates • ?? ${trip.dayPlans.length} días planificados`);
        console.log(`      ?? Estado: ${trip.status}`);
        console.log('');
      });
    });

    console.log(`?? TOTAL: ${this.trips.length} viajes en ${Object.keys(tripsByCountry).length} países`);
  }

  showTrip(tripId) {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) {
      console.error('? Viaje no encontrado');
      console.log('?? Viajes disponibles:');
      this.trips.forEach(t => console.log(`   - ${t.id}: ${t.name}`));
      return;
    }

    const currency = trip.destination.currency || 'EUR';

    console.log(`\n?? ${trip.name.toUpperCase()}\n`);
    console.log(`?? ID: ${trip.id}`);
    console.log(`?? Destino: ${trip.destination.name}, ${trip.destination.country}`);
    console.log(`?? Fechas: ${trip.dates.startDate} ? ${trip.dates.endDate}`);
    console.log(`?? Viajeros: ${trip.travelers.adults} adultos, ${trip.travelers.children} niños`);
    console.log(`?? Presupuesto: ${trip.budget.spent}/${trip.budget.total} ${currency}`);
    console.log(`?? Estado: ${trip.status}`);

    if (trip.selectedTemplates.length > 0) {
      console.log(`\n?? Templates aplicados: ${trip.selectedTemplates.join(', ')}`);
    }

    if (trip.dayPlans.length === 0) {
      console.log('\n? No hay días planificados');
      console.log('?? Aplica un template o añade actividades manualmente');
      console.log(`   node scripts/activity-manager.js list-templates ${trip.destination.name}`);
      console.log(`   node scripts/activity-manager.js apply-template <template-id> ${trip.id}`);
      return;
    }

    console.log(`\n?? ITINERARIO (${trip.dayPlans.length} días):\n`);

    trip.dayPlans.forEach(dayPlan => {
      const dayDate = new Date(dayPlan.date);
      const dayName = dayDate.toLocaleDateString('es-ES', { weekday: 'long' });
      
      console.log(`?? DÍA ${dayPlan.dayNumber} - ${dayName} (${dayPlan.date})`);
      console.log(`?? Costo del día: ${dayPlan.totalCost} ${currency}`);
      
      if (dayPlan.activities.length === 0) {
        console.log('   ? Sin actividades planificadas');
      } else {
        dayPlan.activities.forEach((activity, index) => {
          const timeIcon = this.getTimeIcon(activity.timeOfDay);
          console.log(`   ${index + 1}. ${timeIcon} ${activity.name}`);
          console.log(`      ?? ${activity.description}`);
          console.log(`      ?? ${activity.location}`);
          console.log(`      ? ${activity.duration}h`);
          console.log(`      ?? ${activity.cost === 0 ? 'Gratis' : activity.cost + ' ' + currency}`);
          if (activity.tags && activity.tags.length > 0) {
            console.log(`      ???  ${activity.tags.join(', ')}`);
          }
          console.log('');
        });
      }
      console.log('-'.repeat(50));
    });

    // Resumen final
    const totalActivities = trip.dayPlans.reduce((sum, day) => sum + day.activities.length, 0);
    const totalCost = trip.dayPlans.reduce((sum, day) => sum + day.totalCost, 0);
    const avgCostPerDay = totalActivities > 0 ? totalCost / trip.dayPlans.length : 0;
    const budgetUsed = ((totalCost / trip.budget.total) * 100);

    console.log(`\n?? RESUMEN DEL VIAJE:`);
    console.log(`?? Actividades totales: ${totalActivities}`);
    console.log(`?? Costo total estimado: ${totalCost} ${currency}`);
    console.log(`?? Promedio por día: ${avgCostPerDay.toFixed(2)} ${currency}`);
    console.log(`?? Presupuesto usado: ${budgetUsed.toFixed(1)}%`);
    
    if (budgetUsed > 90) {
      console.log(`??  Advertencia: Te acercas al límite del presupuesto`);
    } else if (budgetUsed < 50) {
      console.log(`?? Puedes añadir más actividades dentro del presupuesto`);
    }
  }

  getTimeIcon(timeOfDay) {
    const icons = {
      morning: '??',
      afternoon: '??',
      evening: '??',
      night: '??',
      flexible: '?'
    };
    return icons[timeOfDay] || '?';
  }

  deleteTrip(tripId) {
    const tripIndex = this.trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
      console.error('? Viaje no encontrado');
      return;
    }

    const deletedTrip = this.trips[tripIndex];
    this.trips.splice(tripIndex, 1);
    this.saveTrips();

    console.log(`? Viaje "${deletedTrip.name}" eliminado correctamente`);
  }

  exportTrip(tripId, format = 'txt') {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) {
      console.error('? Viaje no encontrado');
      return;
    }

    const fileName = `trip_${trip.destination.name}_${trip.id}_${Date.now()}.${format}`;
    const filePath = path.join(DATA_DIR, fileName);
    const currency = trip.destination.currency || 'EUR';

    let content = '';

    if (format === 'json') {
      content = JSON.stringify(trip, null, 2);
    } else {
      // Formato texto mejorado
      content = `?? ${trip.name.toUpperCase()}\n`;
      content += `${'='.repeat(50)}\n\n`;
      content += `?? Destino: ${trip.destination.name}, ${trip.destination.country}\n`;
      content += `?? Fechas: ${trip.dates.startDate} ? ${trip.dates.endDate}\n`;
      content += `?? Viajeros: ${trip.travelers.adults} adultos, ${trip.travelers.children} niños\n`;
      content += `?? Presupuesto: ${trip.budget.total} ${currency}\n`;
      content += `?? Estado: ${trip.status}\n\n`;

      if (trip.selectedTemplates.length > 0) {
        content += `?? Templates aplicados: ${trip.selectedTemplates.join(', ')}\n\n`;
      }

      if (trip.dayPlans.length > 0) {
        content += `?? ITINERARIO DETALLADO\n`;
        content += `${'-'.repeat(30)}\n\n`;

        trip.dayPlans.forEach(dayPlan => {
          const dayDate = new Date(dayPlan.date);
          const dayName = dayDate.toLocaleDateString('es-ES', { weekday: 'long' });
          
          content += `?? DÍA ${dayPlan.dayNumber} - ${dayName} (${dayPlan.date})\n`;
          content += `?? Costo del día: ${dayPlan.totalCost} ${currency}\n\n`;
          
          if (dayPlan.activities.length > 0) {
            dayPlan.activities.forEach((activity, index) => {
              content += `${index + 1}. ${activity.name}\n`;
              content += `   ?? ${activity.description}\n`;
              content += `   ?? ${activity.location}\n`;
              content += `   ? Duración: ${activity.duration} horas\n`;
              content += `   ?? Momento: ${this.getTimeOfDayText(activity.timeOfDay)}\n`;
              content += `   ?? Costo: ${activity.cost === 0 ? 'Gratis' : activity.cost + ' ' + currency}\n`;
              if (activity.tags && activity.tags.length > 0) {
                content += `   ???  Tags: ${activity.tags.join(', ')}\n`;
              }
              content += '\n';
            });
          } else {
            content += '   ? Sin actividades planificadas\n\n';
          }
          
          content += `${'-'.repeat(40)}\n\n`;
        });

        const totalCost = trip.dayPlans.reduce((sum, day) => sum + day.totalCost, 0);
        const totalActivities = trip.dayPlans.reduce((sum, day) => sum + day.activities.length, 0);
        
        content += `?? RESUMEN FINAL\n`;
        content += `${'-'.repeat(20)}\n`;
        content += `?? Total de actividades: ${totalActivities}\n`;
        content += `?? Costo total estimado: ${totalCost} ${currency}\n`;
        content += `?? Presupuesto usado: ${((totalCost / trip.budget.total) * 100).toFixed(1)}%\n`;
        content += `?? Promedio por día: ${(totalCost / trip.dayPlans.length).toFixed(2)} ${currency}\n\n`;
      } else {
        content += 'No hay actividades planificadas.\n';
        content += 'Usa templates o añade actividades manualmente.\n\n';
      }

      content += `Generado por TripWase CLI el ${new Date().toLocaleDateString('es-ES')}\n`;
    }

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`? Viaje exportado a: ${filePath}`);
      console.log(`?? Formato: ${format.toUpperCase()}`);
      console.log(`?? Tamaño: ${Math.round(content.length / 1024 * 100) / 100} KB`);
    } catch (error) {
      console.error('? Error exportando viaje:', error.message);
    }
  }

  getTimeOfDayText(timeOfDay) {
    const times = {
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      night: 'Noche tardía',
      flexible: 'Flexible'
    };
    return times[timeOfDay] || 'No especificado';
  }

  showTripStats() {
    console.log('\n?? ESTADÍSTICAS DE VIAJES\n');

    if (this.trips.length === 0) {
      console.log('? No hay viajes para analizar');
      return;
    }

    // Estadísticas generales
    const totalTrips = this.trips.length;
    const countries = [...new Set(this.trips.map(t => t.destination.country))];
    const cities = [...new Set(this.trips.map(t => t.destination.name))];
    
    console.log(`?? Total de viajes: ${totalTrips}`);
    console.log(`?? Países visitados: ${countries.length}`);
    console.log(`???  Ciudades: ${cities.length}`);

    // Top destinos
    const destinationCounts = {};
    this.trips.forEach(trip => {
      const dest = trip.destination.name;
      destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
    });

    console.log('\n?? TOP DESTINOS:');
    Object.entries(destinationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([dest, count]) => {
        console.log(`   ${dest}: ${count} viajes`);
      });

    // Estadísticas de presupuesto
    const budgets = this.trips.map(t => t.budget.total);
    const avgBudget = budgets.reduce((a, b) => a + b, 0) / budgets.length;
    const maxBudget = Math.max(...budgets);
    const minBudget = Math.min(...budgets);

    console.log('\n?? PRESUPUESTOS:');
    console.log(`   Promedio: ${avgBudget.toFixed(2)} EUR`);
    console.log(`   Máximo: ${maxBudget} EUR`);
    console.log(`   Mínimo: ${minBudget} EUR`);

    // Estados de viajes
    const statusCounts = {};
    this.trips.forEach(trip => {
      const status = trip.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    console.log('\n?? ESTADOS:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} viajes`);
    });
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const planner = new TripPlanner();

  switch (command) {
    case 'create':
      if (args.length < 5) {
        console.error('? Uso: node scripts/trip-planner.js create "Nombre" destino fecha-inicio fecha-fin [presupuesto]');
        console.error('?? Ejemplo: node scripts/trip-planner.js create "Mi viaje a Roma" rome 2025-09-15 2025-09-18 800');
        console.log('\n?? Destinos disponibles: madrid, barcelona, paris, rome, london, amsterdam, lisbon');
        process.exit(1);
      }
      planner.createTrip(args[1], args[2], args[3], args[4], args[5]);
      break;

    case 'list-destinations':
      planner.listDestinations();
      break;

    case 'list':
      planner.listTrips();
      break;

    case 'show':
      if (!args[1]) {
        console.error('? Uso: node scripts/trip-planner.js show <trip-id>');
        process.exit(1);
      }
      planner.showTrip(args[1]);
      break;

    case 'delete':
      if (!args[1]) {
        console.error('? Uso: node scripts/trip-planner.js delete <trip-id>');
        process.exit(1);
      }
      planner.deleteTrip(args[1]);
      break;

    case 'export':
      if (!args[1]) {
        console.error('? Uso: node scripts/trip-planner.js export <trip-id> [formato]');
        process.exit(1);
      }
      planner.exportTrip(args[1], args[2] || 'txt');
      break;

    case 'stats':
      planner.showTripStats();
      break;

    case 'help':
    default:
      console.log(`
?? TripWase - Trip Planner CLI (Destinos Expandidos)

COMANDOS DISPONIBLES:

?? Gestión de Destinos:
   node scripts/trip-planner.js list-destinations

?? Crear viaje:
   node scripts/trip-planner.js create "Nombre" destino fecha-inicio fecha-fin [presupuesto]

?? Gestión de Viajes:
   node scripts/trip-planner.js list
   node scripts/trip-planner.js show <trip-id>
   node scripts/trip-planner.js delete <trip-id>

?? Exportación:
   node scripts/trip-planner.js export <trip-id> [txt|json]

?? Estadísticas:
   node scripts/trip-planner.js stats

? Ayuda:
   node scripts/trip-planner.js help

DESTINOS DISPONIBLES:
   ???? madrid, barcelona (España)
   ???? paris (Francia)  
   ???? rome (Italia)
   ???? london (Reino Unido)
   ???? amsterdam (Países Bajos)
   ???? lisbon (Portugal)

EJEMPLOS:
   node scripts/trip-planner.js create "Roma Imperial" rome 2025-10-01 2025-10-04 900
   node scripts/trip-planner.js create "Londres Real" london 2025-11-15 2025-11-18 1200
   node scripts/trip-planner.js list
   node scripts/trip-planner.js show trip_1725123456789
   node scripts/trip-planner.js stats
      `);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = TripPlanner;

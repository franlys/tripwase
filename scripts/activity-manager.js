#!/usr/bin/env node

// scripts/activity-manager.js - TripWase Templates CLI (Destinos expandidos)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const TEMPLATES_FILE = path.join(DATA_DIR, 'activity-templates.json');
const TRIPS_FILE = path.join(DATA_DIR, 'trips.json');

// Crear directorio de datos si no existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Datos expandidos con múltiples destinos
const EXPANDED_TEMPLATES = {
  categories: [
    { id: 'culture', name: 'Cultura', icon: '???', color: '#8B5A2B' },
    { id: 'food', name: 'Gastronomía', icon: '???', color: '#FF6B6B' },
    { id: 'nature', name: 'Naturaleza', icon: '??', color: '#4ECDC4' },
    { id: 'adventure', name: 'Aventura', icon: '??', color: '#45B7D1' },
    { id: 'relaxation', name: 'Relajación', icon: '??', color: '#96CEB4' },
    { id: 'art', name: 'Arte', icon: '??', color: '#F39C12' },
    { id: 'nightlife', name: 'Vida Nocturna', icon: '??', color: '#FFEAA7' },
    { id: 'shopping', name: 'Compras', icon: '???', color: '#DDA0DD' },
    { id: 'history', name: 'Historia', icon: '??', color: '#8E44AD' }
  ],
  activities: {
    madrid: [
      {
        id: 'madrid_prado',
        name: 'Museo del Prado',
        description: 'Visita al museo de arte más importante de España',
        category: 'culture',
        duration: 3,
        cost: 15,
        location: 'Paseo del Prado',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['museo', 'arte', 'clásico']
      },
      {
        id: 'madrid_retiro',
        name: 'Parque del Retiro',
        description: 'Paseo relajante por el pulmón verde de Madrid',
        category: 'nature',
        duration: 2,
        cost: 0,
        location: 'Parque del Retiro',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['parque', 'gratis', 'relajante']
      },
      {
        id: 'madrid_tapas',
        name: 'Ruta de Tapas por Malasaña',
        description: 'Experiencia gastronómica auténtica madrileña',
        category: 'food',
        duration: 4,
        cost: 35,
        location: 'Barrio de Malasaña',
        timeOfDay: 'evening',
        difficulty: 'easy',
        tags: ['tapas', 'local', 'gastronomía']
      },
      {
        id: 'madrid_palacio',
        name: 'Palacio Real',
        description: 'Visita guiada al palacio real más grande de Europa',
        category: 'culture',
        duration: 2,
        cost: 13,
        location: 'Plaza de Oriente',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['palacio', 'historia', 'realeza']
      },
      {
        id: 'madrid_reina_sofia',
        name: 'Museo Reina Sofía',
        description: 'Arte contemporáneo español e internacional',
        category: 'art',
        duration: 2.5,
        cost: 12,
        location: 'Atocha',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['museo', 'arte moderno', 'Picasso']
      },
      {
        id: 'madrid_flamenco',
        name: 'Espectáculo de Flamenco',
        description: 'Auténtico tablao flamenco con cena',
        category: 'nightlife',
        duration: 3,
        cost: 55,
        location: 'Corral de la Morería',
        timeOfDay: 'night',
        difficulty: 'easy',
        tags: ['flamenco', 'tradicional', 'cena']
      }
    ],
    barcelona: [
      {
        id: 'barcelona_sagrada',
        name: 'Sagrada Familia',
        description: 'Icónica basílica de Gaudí, Patrimonio de la Humanidad',
        category: 'culture',
        duration: 2,
        cost: 26,
        location: 'Eixample',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['Gaudí', 'arquitectura', 'UNESCO']
      },
      {
        id: 'barcelona_park_guell',
        name: 'Park Güell',
        description: 'Parque público con mosaicos únicos de Gaudí',
        category: 'art',
        duration: 2.5,
        cost: 10,
        location: 'Gràcia',
        timeOfDay: 'afternoon',
        difficulty: 'moderate',
        tags: ['Gaudí', 'mosaicos', 'vistas']
      },
      {
        id: 'barcelona_boqueria',
        name: 'Mercado de La Boquería',
        description: 'Mercado tradicional con productos frescos y tapas',
        category: 'food',
        duration: 1.5,
        cost: 20,
        location: 'Las Ramblas',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['mercado', 'local', 'productos frescos']
      },
      {
        id: 'barcelona_beach',
        name: 'Playa de Barceloneta',
        description: 'Relajación en la playa urbana más famosa',
        category: 'relaxation',
        duration: 3,
        cost: 5,
        location: 'Barceloneta',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['playa', 'sol', 'relajante']
      },
      {
        id: 'barcelona_gothic',
        name: 'Barrio Gótico',
        description: 'Paseo por el casco histórico medieval',
        category: 'history',
        duration: 2,
        cost: 0,
        location: 'Ciutat Vella',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['medieval', 'gratis', 'historia']
      }
    ],
    paris: [
      {
        id: 'paris_louvre',
        name: 'Museo del Louvre',
        description: 'El museo más visitado del mundo',
        category: 'culture',
        duration: 4,
        cost: 17,
        location: 'Palais du Louvre',
        timeOfDay: 'morning',
        difficulty: 'moderate',
        tags: ['museo', 'Mona Lisa', 'historia']
      },
      {
        id: 'paris_eiffel',
        name: 'Torre Eiffel',
        description: 'Símbolo icónico de París con vistas panorámicas',
        category: 'culture',
        duration: 2,
        cost: 29,
        location: 'Champ de Mars',
        timeOfDay: 'evening',
        difficulty: 'easy',
        tags: ['icónico', 'vistas', 'romántico']
      },
      {
        id: 'paris_seine',
        name: 'Crucero por el Sena',
        description: 'Vista única de París desde el río',
        category: 'relaxation',
        duration: 1.5,
        cost: 15,
        location: 'Río Sena',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['crucero', 'romántico', 'vistas']
      },
      {
        id: 'paris_montmartre',
        name: 'Barrio de Montmartre',
        description: 'Bohemio barrio de artistas con el Sacré-Cœur',
        category: 'art',
        duration: 3,
        cost: 8,
        location: 'Montmartre',
        timeOfDay: 'morning',
        difficulty: 'moderate',
        tags: ['artistas', 'bohemio', 'Sacré-Cœur']
      },
      {
        id: 'paris_champs',
        name: 'Campos Elíseos y Arco del Triunfo',
        description: 'La avenida más famosa del mundo',
        category: 'shopping',
        duration: 2,
        cost: 13,
        location: 'Champs-Élysées',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['compras', 'lujo', 'histórico']
      }
    ],
    rome: [
      {
        id: 'rome_colosseum',
        name: 'Coliseo Romano',
        description: 'Anfiteatro más famoso del mundo antiguo',
        category: 'history',
        duration: 2.5,
        cost: 16,
        location: 'Centro de Roma',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['gladiadores', 'historia', 'UNESCO']
      },
      {
        id: 'rome_vatican',
        name: 'Ciudad del Vaticano',
        description: 'Capilla Sixtina y Basílica de San Pedro',
        category: 'culture',
        duration: 4,
        cost: 20,
        location: 'Vaticano',
        timeOfDay: 'morning',
        difficulty: 'moderate',
        tags: ['religioso', 'arte', 'Michelangelo']
      },
      {
        id: 'rome_trevi',
        name: 'Fontana di Trevi',
        description: 'La fuente más famosa del mundo',
        category: 'culture',
        duration: 1,
        cost: 0,
        location: 'Centro histórico',
        timeOfDay: 'evening',
        difficulty: 'easy',
        tags: ['fontana', 'gratis', 'romántico']
      },
      {
        id: 'rome_pasta_class',
        name: 'Clase de Pasta Italiana',
        description: 'Aprende a hacer pasta auténtica italiana',
        category: 'food',
        duration: 3,
        cost: 65,
        location: 'Trastevere',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['cocina', 'auténtico', 'interactivo']
      },
      {
        id: 'rome_pantheon',
        name: 'Panteón Romano',
        description: 'Mejor conservado edificio de la Roma Antigua',
        category: 'history',
        duration: 1.5,
        cost: 5,
        location: 'Centro de Roma',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['romano', 'arquitectura', 'historia']
      }
    ],
    london: [
      {
        id: 'london_tower',
        name: 'Torre de Londres',
        description: 'Fortaleza histórica y hogar de las Joyas de la Corona',
        category: 'history',
        duration: 3,
        cost: 30,
        location: 'Tower Hill',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['real', 'historia', 'joyas']
      },
      {
        id: 'london_british_museum',
        name: 'Museo Británico',
        description: 'Una de las colecciones más importantes del mundo',
        category: 'culture',
        duration: 3.5,
        cost: 0,
        location: 'Bloomsbury',
        timeOfDay: 'afternoon',
        difficulty: 'moderate',
        tags: ['museo', 'gratis', 'mundial']
      },
      {
        id: 'london_big_ben',
        name: 'Big Ben y Parlamento',
        description: 'Iconos de Londres junto al Támesis',
        category: 'culture',
        duration: 1.5,
        cost: 0,
        location: 'Westminster',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['icónico', 'gratis', 'parlamentario']
      },
      {
        id: 'london_tea_time',
        name: 'Afternoon Tea Tradicional',
        description: 'Experiencia típica británica con scones y té',
        category: 'food',
        duration: 2,
        cost: 45,
        location: 'Mayfair',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['té', 'tradicional', 'elegante']
      },
      {
        id: 'london_camden',
        name: 'Camden Market',
        description: 'Mercado alternativo con comida y música',
        category: 'shopping',
        duration: 2.5,
        cost: 15,
        location: 'Camden',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['alternativo', 'música', 'diverso']
      }
    ],
    amsterdam: [
      {
        id: 'amsterdam_anne_frank',
        name: 'Casa de Ana Frank',
        description: 'Museo conmemorativo de la historia del Holocausto',
        category: 'history',
        duration: 2,
        cost: 14,
        location: 'Prinsengracht',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['historia', 'memorial', 'educativo']
      },
      {
        id: 'amsterdam_canals',
        name: 'Crucero por los Canales',
        description: 'Recorrido por los famosos canales de Ámsterdam',
        category: 'relaxation',
        duration: 1.5,
        cost: 18,
        location: 'Canales centrales',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['canales', 'relajante', 'pintoresco']
      },
      {
        id: 'amsterdam_rijksmuseum',
        name: 'Rijksmuseum',
        description: 'Arte holandés desde la Edad Media',
        category: 'art',
        duration: 3,
        cost: 20,
        location: 'Museumplein',
        timeOfDay: 'morning',
        difficulty: 'moderate',
        tags: ['Rembrandt', 'Vermeer', 'holandés']
      },
      {
        id: 'amsterdam_bikes',
        name: 'Tour en Bicicleta',
        description: 'Explora la ciudad como un local auténtico',
        category: 'adventure',
        duration: 3,
        cost: 25,
        location: 'Centro de la ciudad',
        timeOfDay: 'morning',
        difficulty: 'moderate',
        tags: ['bicicleta', 'local', 'activo']
      },
      {
        id: 'amsterdam_jordaan',
        name: 'Barrio de Jordaan',
        description: 'Encantador barrio con cafés y tiendas vintage',
        category: 'culture',
        duration: 2,
        cost: 10,
        location: 'Jordaan',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['barrio', 'vintage', 'local']
      }
    ],
    lisbon: [
      {
        id: 'lisbon_tram28',
        name: 'Tranvía 28',
        description: 'Recorrido icónico por los barrios históricos',
        category: 'culture',
        duration: 2,
        cost: 3,
        location: 'Varios barrios',
        timeOfDay: 'morning',
        difficulty: 'easy',
        tags: ['tranvía', 'histórico', 'barato']
      },
      {
        id: 'lisbon_belem_tower',
        name: 'Torre de Belém',
        description: 'Fortificación del siglo XVI, Patrimonio Mundial',
        category: 'history',
        duration: 1.5,
        cost: 6,
        location: 'Belém',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['fortificación', 'UNESCO', 'marítimo']
      },
      {
        id: 'lisbon_pasteis',
        name: 'Pastéis de Nata en Belém',
        description: 'Los originales pasteles de nata portugueses',
        category: 'food',
        duration: 1,
        cost: 8,
        location: 'Belém',
        timeOfDay: 'afternoon',
        difficulty: 'easy',
        tags: ['dulce', 'tradicional', 'auténtico']
      },
      {
        id: 'lisbon_fado',
        name: 'Espectáculo de Fado',
        description: 'Música tradicional portuguesa con cena',
        category: 'nightlife',
        duration: 3,
        cost: 40,
        location: 'Alfama',
        timeOfDay: 'night',
        difficulty: 'easy',
        tags: ['fado', 'música', 'tradicional']
      },
      {
        id: 'lisbon_alfama',
        name: 'Barrio de Alfama',
        description: 'Laberinto de calles medievales y miradores',
        category: 'culture',
        duration: 2.5,
        cost: 0,
        location: 'Alfama',
        timeOfDay: 'morning',
        difficulty: 'moderate',
        tags: ['medieval', 'gratis', 'miradores']
      }
    ]
  },
  templates: [
    // Templates existentes
    {
      id: 'madrid_cultural_classic',
      name: 'Madrid Cultural Clásico',
      description: 'Descubre lo mejor del arte y la cultura madrileña',
      destinationIds: ['madrid'],
      activityIds: ['madrid_prado', 'madrid_palacio', 'madrid_reina_sofia'],
      estimatedDays: 2,
      totalCost: 40,
      difficulty: 'easy',
      tags: ['cultura', 'museos', 'arte'],
      popularity: 9.2
    },
    {
      id: 'madrid_foodie',
      name: 'Experiencia Gastronómica Madrid',
      description: 'Sabores auténticos de la capital española',
      destinationIds: ['madrid'],
      activityIds: ['madrid_tapas', 'madrid_flamenco'],
      estimatedDays: 1,
      totalCost: 90,
      difficulty: 'easy',
      tags: ['gastronomía', 'tapas', 'flamenco'],
      popularity: 8.8
    },
    {
      id: 'barcelona_gaudi_route',
      name: 'Ruta Gaudí Completa',
      description: 'Arquitectura modernista única en el mundo',
      destinationIds: ['barcelona'],
      activityIds: ['barcelona_sagrada', 'barcelona_park_guell'],
      estimatedDays: 1,
      totalCost: 36,
      difficulty: 'moderate',
      tags: ['Gaudí', 'arquitectura', 'modernismo'],
      popularity: 9.5
    },
    {
      id: 'barcelona_beach_city',
      name: 'Barcelona Playa y Ciudad',
      description: 'Combina cultura urbana con relajación en la playa',
      destinationIds: ['barcelona'],
      activityIds: ['barcelona_beach', 'barcelona_boqueria', 'barcelona_gothic'],
      estimatedDays: 2,
      totalCost: 25,
      difficulty: 'easy',
      tags: ['playa', 'historia', 'local'],
      popularity: 8.7
    },
    // Nuevos templates para nuevos destinos
    {
      id: 'paris_essential',
      name: 'París Esencial',
      description: 'Los imprescindibles de la Ciudad de la Luz',
      destinationIds: ['paris'],
      activityIds: ['paris_louvre', 'paris_eiffel', 'paris_montmartre'],
      estimatedDays: 2,
      totalCost: 54,
      difficulty: 'moderate',
      tags: ['esencial', 'icónico', 'cultura'],
      popularity: 9.8
    },
    {
      id: 'paris_romantic',
      name: 'París Romántico',
      description: 'Perfecta escapada romántica para parejas',
      destinationIds: ['paris'],
      activityIds: ['paris_seine', 'paris_eiffel', 'paris_champs'],
      estimatedDays: 2,
      totalCost: 57,
      difficulty: 'easy',
      tags: ['romántico', 'parejas', 'lujo'],
      popularity: 9.3
    },
    {
      id: 'rome_ancient',
      name: 'Roma Antigua',
      description: 'Viaje en el tiempo por la Roma Imperial',
      destinationIds: ['rome'],
      activityIds: ['rome_colosseum', 'rome_pantheon', 'rome_trevi'],
      estimatedDays: 2,
      totalCost: 21,
      difficulty: 'easy',
      tags: ['historia', 'antiguo', 'imperial'],
      popularity: 9.4
    },
    {
      id: 'rome_foodie',
      name: 'Roma Gastronómica',
      description: 'Sabores auténticos de la cocina italiana',
      destinationIds: ['rome'],
      activityIds: ['rome_pasta_class', 'rome_trevi'],
      estimatedDays: 1,
      totalCost: 65,
      difficulty: 'easy',
      tags: ['gastronomía', 'pasta', 'auténtico'],
      popularity: 8.9
    },
    {
      id: 'london_royal',
      name: 'Londres Real',
      description: 'Historia real y tradiciones británicas',
      destinationIds: ['london'],
      activityIds: ['london_tower', 'london_big_ben', 'london_tea_time'],
      estimatedDays: 2,
      totalCost: 75,
      difficulty: 'easy',
      tags: ['real', 'tradición', 'historia'],
      popularity: 9.1
    },
    {
      id: 'london_cultural',
      name: 'Londres Cultural',
      description: 'Museos mundiales y cultura alternativa',
      destinationIds: ['london'],
      activityIds: ['london_british_museum', 'london_camden'],
      estimatedDays: 1,
      totalCost: 15,
      difficulty: 'moderate',
      tags: ['museos', 'cultura', 'alternativo'],
      popularity: 8.6
    },
    {
      id: 'amsterdam_classic',
      name: 'Ámsterdam Clásico',
      description: 'Canales, arte y historia holandesa',
      destinationIds: ['amsterdam'],
      activityIds: ['amsterdam_canals', 'amsterdam_rijksmuseum', 'amsterdam_anne_frank'],
      estimatedDays: 2,
      totalCost: 52,
      difficulty: 'easy',
      tags: ['canales', 'arte', 'historia'],
      popularity: 9.0
    },
    {
      id: 'amsterdam_active',
      name: 'Ámsterdam Activo',
      description: 'Explora la ciudad en bicicleta como un local',
      destinationIds: ['amsterdam'],
      activityIds: ['amsterdam_bikes', 'amsterdam_jordaan'],
      estimatedDays: 1,
      totalCost: 35,
      difficulty: 'moderate',
      tags: ['bicicleta', 'local', 'activo'],
      popularity: 8.4
    },
    {
      id: 'lisbon_classic',
      name: 'Lisboa Clásica',
      description: 'Tranvías, torres y tradiciones portuguesas',
      destinationIds: ['lisbon'],
      activityIds: ['lisbon_tram28', 'lisbon_belem_tower', 'lisbon_pasteis'],
      estimatedDays: 1,
      totalCost: 17,
      difficulty: 'easy',
      tags: ['tranvía', 'tradición', 'económico'],
      popularity: 8.8
    },
    {
      id: 'lisbon_authentic',
      name: 'Lisboa Auténtica',
      description: 'Fado, barrios históricos y sabores locales',
      destinationIds: ['lisbon'],
      activityIds: ['lisbon_fado', 'lisbon_alfama'],
      estimatedDays: 1,
      totalCost: 40,
      difficulty: 'moderate',
      tags: ['fado', 'auténtico', 'barrios'],
      popularity: 8.5
    }
  ]
};

class ActivityManager {
  constructor() {
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(TEMPLATES_FILE)) {
        const existingData = JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8'));
        // Combinar datos existentes con nuevos destinos
        this.data = {
          categories: EXPANDED_TEMPLATES.categories,
          activities: { ...existingData.activities, ...EXPANDED_TEMPLATES.activities },
          templates: [...(existingData.templates || []), ...EXPANDED_TEMPLATES.templates]
        };
        // Eliminar duplicados de templates
        const uniqueTemplates = [];
        const templateIds = new Set();
        this.data.templates.forEach(template => {
          if (!templateIds.has(template.id)) {
            templateIds.add(template.id);
            uniqueTemplates.push(template);
          }
        });
        this.data.templates = uniqueTemplates;
      } else {
        this.data = EXPANDED_TEMPLATES;
      }
      this.saveData();
    } catch (error) {
      console.error('? Error cargando datos:', error.message);
      this.data = EXPANDED_TEMPLATES;
    }
  }

  saveData() {
    try {
      fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(this.data, null, 2));
      console.log('? Datos guardados correctamente');
    } catch (error) {
      console.error('? Error guardando datos:', error.message);
    }
  }

  listDestinations() {
    console.log('\n?? DESTINOS DISPONIBLES\n');
    
    const destinations = Object.keys(this.data.activities);
    const countries = {
      madrid: 'España ????',
      barcelona: 'España ????', 
      paris: 'Francia ????',
      rome: 'Italia ????',
      london: 'Reino Unido ????',
      amsterdam: 'Países Bajos ????',
      lisbon: 'Portugal ????'
    };

    destinations.forEach((dest, index) => {
      const activities = this.data.activities[dest];
      const templates = this.data.templates.filter(t => t.destinationIds.includes(dest));
      
      console.log(`${index + 1}. ${dest.toUpperCase()} (${countries[dest] || 'Unknown'})`);
      console.log(`   ?? ${activities.length} actividades disponibles`);
      console.log(`   ?? ${templates.length} templates predefinidos`);
      console.log(`   ?? Precio promedio: ${Math.round(activities.reduce((sum, a) => sum + a.cost, 0) / activities.length)} EUR`);
      console.log('');
    });

    console.log(`?? TOTAL: ${destinations.length} destinos, ${Object.values(this.data.activities).flat().length} actividades, ${this.data.templates.length} templates`);
  }

  getDestinationInfo(destination) {
    if (!this.data.activities[destination]) {
      console.error(`? Destino "${destination}" no encontrado`);
      console.log('?? Destinos disponibles:');
      Object.keys(this.data.activities).forEach(dest => console.log(`   - ${dest}`));
      return;
    }

    const activities = this.data.activities[destination];
    const templates = this.data.templates.filter(t => t.destinationIds.includes(destination));
    
    console.log(`\n?? INFORMACIÓN DE ${destination.toUpperCase()}\n`);
    
    // Estadísticas generales
    const totalCost = activities.reduce((sum, a) => sum + a.cost, 0);
    const avgCost = Math.round(totalCost / activities.length);
    const categoriesUsed = [...new Set(activities.map(a => a.category))];
    
    console.log(`?? Estadísticas:`);
    console.log(`   ?? ${activities.length} actividades`);
    console.log(`   ?? ${templates.length} templates`);
    console.log(`   ?? Costo promedio: ${avgCost} EUR`);
    console.log(`   ?? ${categoriesUsed.length} categorías representadas`);
    console.log('');

    // Templates disponibles
    console.log(`?? Templates para ${destination}:`);
    templates.forEach((template, index) => {
      console.log(`   ${index + 1}. ${template.name} (${template.totalCost} EUR, ${template.estimatedDays} días)`);
      console.log(`      ${template.description}`);
    });
    console.log('');

    // Actividades por categoría
    console.log(`?? Actividades por categoría:`);
    categoriesUsed.forEach(categoryId => {
      const categoryActivities = activities.filter(a => a.category === categoryId);
      const category = this.data.categories.find(c => c.id === categoryId);
      console.log(`   ${category?.icon || '?'} ${category?.name || categoryId}: ${categoryActivities.length} actividades`);
    });
  }

  listTemplates(destination = null) {
    console.log('\n?? TEMPLATES DISPONIBLES\n');
    
    const templates = destination 
      ? this.data.templates.filter(t => t.destinationIds.includes(destination))
      : this.data.templates;

    if (templates.length === 0) {
      console.log('? No hay templates disponibles' + (destination ? ` para ${destination}` : ''));
      return;
    }

    // Agrupar por destino
    const templatesByDestination = {};
    templates.forEach(template => {
      template.destinationIds.forEach(dest => {
        if (!templatesByDestination[dest]) {
          templatesByDestination[dest] = [];
        }
        templatesByDestination[dest].push(template);
      });
    });

    Object.entries(templatesByDestination).forEach(([dest, destTemplates]) => {
      console.log(`?? ${dest.toUpperCase()}:`);
      destTemplates.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.name}`);
        console.log(`      ?? ${template.description}`);
        console.log(`      ?? ${template.totalCost} EUR • ?? ${template.estimatedDays} días • ? ${template.popularity}/10`);
        console.log(`      ?? ${template.id}`);
        console.log('');
      });
    });
  }

  listActivities(destination = null, category = null) {
    console.log('\n?? ACTIVIDADES DISPONIBLES\n');

    let activities = [];
    if (destination && this.data.activities[destination]) {
      activities = this.data.activities[destination];
    } else {
      activities = Object.values(this.data.activities).flat();
    }

    if (category) {
      activities = activities.filter(a => a.category === category);
    }

    if (activities.length === 0) {
      console.log('? No hay actividades disponibles con esos filtros');
      return;
    }

    const categoryMap = {};
    this.data.categories.forEach(cat => {
      categoryMap[cat.id] = cat;
    });

    activities.forEach((activity, index) => {
      const cat = categoryMap[activity.category] || { name: activity.category, icon: '?' };
      console.log(`${index + 1}. ${activity.name} ${cat.icon}`);
      console.log(`   ?? ${activity.description}`);
      console.log(`   ?? ${activity.location}`);
      console.log(`   ? ${activity.duration}h - ${activity.timeOfDay}`);
      console.log(`   ?? ${activity.cost === 0 ? 'Gratis' : activity.cost + ' EUR'}`);
      console.log(`   ???  ${activity.tags.join(', ')}`);
      console.log(`   ?? ID: ${activity.id}`);
      console.log('');
    });
  }

  listCategories() {
    console.log('\n?? CATEGORÍAS DISPONIBLES\n');
    this.data.categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.icon} ${category.name} (${category.id})`);
    });
    console.log('');
  }

  applyTemplate(templateId, tripId) {
    const template = this.data.templates.find(t => t.id === templateId);
    if (!template) {
      console.error('? Template no encontrado');
      console.log('?? Templates disponibles:');
      this.data.templates.forEach(t => console.log(`   - ${t.id}`));
      return;
    }

    console.log(`\n?? Aplicando template: ${template.name}\n`);

    // Cargar trips existentes
    let trips = [];
    if (fs.existsSync(TRIPS_FILE)) {
      try {
        trips = JSON.parse(fs.readFileSync(TRIPS_FILE, 'utf8'));
      } catch (error) {
        console.error('? Error leyendo viajes:', error.message);
        return;
      }
    }

    let trip = trips.find(t => t.id === tripId);
    if (!trip) {
      console.error('? Viaje no encontrado');
      console.log('?? Viajes disponibles:');
      trips.forEach(t => console.log(`   - ${t.id}: ${t.name}`));
      return;
    }

    // Obtener actividades del template
    const activities = [];
    template.activityIds.forEach(activityId => {
      Object.values(this.data.activities).forEach(destActivities => {
        const activity = destActivities.find(a => a.id === activityId);
        if (activity) activities.push(activity);
      });
    });

    if (activities.length === 0) {
      console.error('? No se encontraron actividades para el template');
      return;
    }

    // Crear day plans
    const startDate = new Date(trip.dates.startDate);
    const dayPlans = [];

    for (let day = 1; day <= template.estimatedDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (day - 1));

      const activitiesPerDay = Math.ceil(activities.length / template.estimatedDays);
      const startIndex = (day - 1) * activitiesPerDay;
      const endIndex = Math.min(startIndex + activitiesPerDay, activities.length);
      const activitiesForDay = activities.slice(startIndex, endIndex);

      const dayTotalCost = activitiesForDay.reduce((sum, activity) => sum + activity.cost, 0);

      dayPlans.push({
        dayNumber: day,
        date: currentDate.toISOString().split('T')[0],
        activities: activitiesForDay,
        totalCost: dayTotalCost
      });
    }

    // Actualizar trip
    trip.dayPlans = dayPlans;
    trip.selectedTemplates = trip.selectedTemplates || [];
    if (!trip.selectedTemplates.includes(templateId)) {
      trip.selectedTemplates.push(templateId);
    }
    trip.updatedAt = new Date().toISOString();

    // Guardar trips
    try {
      fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2));
      console.log('? Template aplicado correctamente');
      console.log(`?? ${dayPlans.length} días planificados`);
      console.log(`?? ${activities.length} actividades añadidas`);
      console.log(`?? Costo total: ${template.totalCost} EUR`);
    } catch (error) {
      console.error('? Error guardando viaje:', error.message);
    }
  }

  showStats() {
    console.log('\n?? ESTADÍSTICAS DEL SISTEMA\n');

    const totalActivities = Object.values(this.data.activities)
      .reduce((sum, activities) => sum + activities.length, 0);

    const totalDestinations = Object.keys(this.data.activities).length;
    const totalTemplates = this.data.templates.length;
    const totalCategories = this.data.categories.length;

    console.log(`?? Actividades totales: ${totalActivities}`);
    console.log(`?? Destinos: ${totalDestinations}`);
    console.log(`?? Templates: ${totalTemplates}`);
    console.log(`?? Categorías: ${totalCategories}`);

    console.log('\n?? TOP DESTINOS POR ACTIVIDADES:');
    Object.entries(this.data.activities)
      .sort(([,a], [,b]) => b.length - a.length)
      .forEach(([dest, activities]) => {
        console.log(`   ${dest}: ${activities.length} actividades`);
      });

    console.log('\n? TOP TEMPLATES POR POPULARIDAD:');
    this.data.templates
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .forEach(template => {
        console.log(`   ${template.name}: ${template.popularity}/10 (${template.destinationIds.join(', ')})`);
      });

    console.log('\n?? ESTADÍSTICAS POR CATEGORÍA:');
    this.data.categories.forEach(category => {
      const activitiesInCategory = Object.values(this.data.activities)
        .flat()
        .filter(a => a.category === category.id).length;
      console.log(`   ${category.icon} ${category.name}: ${activitiesInCategory} actividades`);
    });
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const manager = new ActivityManager();

  switch (command) {
    case 'list-destinations':
      manager.listDestinations();
      break;

    case 'destination-info':
      if (!args[1]) {
        console.error('? Uso: node scripts/activity-manager.js destination-info <destino>');
        process.exit(1);
      }
      manager.getDestinationInfo(args[1]);
      break;

    case 'list-templates':
      manager.listTemplates(args[1]);
      break;

    case 'list-activities':
      manager.listActivities(args[1], args[2]);
      break;

    case 'list-categories':
      manager.listCategories();
      break;

    case 'apply-template':
      if (!args[1] || !args[2]) {
        console.error('? Uso: node scripts/activity-manager.js apply-template <template-id> <trip-id>');
        process.exit(1);
      }
      manager.applyTemplate(args[1], args[2]);
      break;

    case 'stats':
      manager.showStats();
      break;

    case 'help':
    default:
      console.log(`
?? TripWase - Activity Templates Manager (Destinos Expandidos)

COMANDOS DISPONIBLES:

?? Explorar Destinos:
   node scripts/activity-manager.js list-destinations
   node scripts/activity-manager.js destination-info <destino>

?? Gestión de Templates:
   node scripts/activity-manager.js list-templates [destino]
   node scripts/activity-manager.js apply-template <template-id> <trip-id>

?? Actividades:
   node scripts/activity-manager.js list-activities [destino] [categoria]
   node scripts/activity-manager.js list-categories

?? Información del Sistema:
   node scripts/activity-manager.js stats

? Ayuda:
   node scripts/activity-manager.js help

DESTINOS DISPONIBLES:
   madrid, barcelona, paris, rome, london, amsterdam, lisbon

EJEMPLOS:
   node scripts/activity-manager.js list-destinations
   node scripts/activity-manager.js destination-info rome
   node scripts/activity-manager.js list-templates london
   node scripts/activity-manager.js list-activities amsterdam culture
   node scripts/activity-manager.js apply-template paris_essential trip_123
      `);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = ActivityManager;

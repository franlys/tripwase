// src/data/touristAttractions.ts
import { TouristAttractions } from '../types';

export const TOURIST_ATTRACTIONS: TouristAttractions = {
  'DO': {
    'punta_cana': {
      region: 'Punta Cana y Este',
      attractions: [
        {
          name: 'Playa Bávaro',
          type: 'Playa',
          description: 'Una de las mejores playas del mundo con arena blanca y aguas cristalinas',
          timeNeeded: '4 horas',
          distance: '5 min del centro',
          highlights: ['Deportes acuáticos', 'Restaurantes frente al mar', 'Atardeceres espectaculares'],
          coordinates: { lat: 18.6838, lng: -68.3715 }
        },
        {
          name: 'Hoyo Azul',
          type: 'Cenote Natural',
          description: 'Laguna de agua dulce de color turquesa rodeada de vegetación tropical',
          timeNeeded: '3 horas',
          distance: '45 min',
          highlights: ['Senderismo', 'Natación', 'Fotografía'],
          coordinates: { lat: 18.5731, lng: -68.4069 }
        },
        {
          name: 'Isla Saona',
          type: 'Excursión',
          description: 'Paraíso tropical con playas vírgenes y aguas cristalinas',
          timeNeeded: 'Día completo',
          distance: '2 horas en catamarán',
          highlights: ['Snorkel', 'Almuerzo en la playa', 'Piscinas naturales'],
          coordinates: { lat: 18.1833, lng: -68.7333 }
        },
        {
          name: 'Altos de Chavón',
          type: 'Villa Cultural',
          description: 'Réplica de una villa mediterránea del siglo XVI con anfiteatro',
          timeNeeded: '3 horas',
          distance: '1.5 horas',
          highlights: ['Arquitectura colonial', 'Artesanías', 'Vistas panorámicas'],
          coordinates: { lat: 18.4172, lng: -68.9053 }
        }
      ]
    },
    'santo_domingo': {
      region: 'Santo Domingo y Sur',
      attractions: [
        {
          name: 'Zona Colonial',
          type: 'Patrimonio UNESCO',
          description: 'Primera ciudad europea del Nuevo Mundo con arquitectura colonial',
          timeNeeded: '6 horas',
          distance: 'Centro de la ciudad',
          highlights: ['Catedral Primada', 'Alcázar de Colón', 'Calle Las Damas'],
          coordinates: { lat: 18.4733, lng: -69.8849 }
        },
        {
          name: 'Faro a Colón',
          type: 'Monumento',
          description: 'Imponente monumento en forma de cruz que alberga los restos de Cristóbal Colón',
          timeNeeded: '2 horas',
          distance: '20 min del centro',
          highlights: ['Museos', 'Láser nocturno', 'Historia'],
          coordinates: { lat: 18.4814, lng: -69.8597 }
        },
        {
          name: 'Cueva de los Tres Ojos',
          type: 'Atracción Natural',
          description: 'Sistema de cavernas con lagos subterráneos de agua dulce',
          timeNeeded: '2 horas',
          distance: '15 min del centro',
          highlights: ['Lagos subterráneos', 'Formaciones calcáreas', 'Botes'],
          coordinates: { lat: 18.4731, lng: -69.8711 }
        }
      ]
    }
  },
  'CO': {
    'cartagena': {
      region: 'Cartagena y Costa Caribe',
      attractions: [
        {
          name: 'Ciudad Amurallada',
          type: 'Patrimonio UNESCO',
          description: 'Centro histórico colonial con murallas del siglo XVI',
          timeNeeded: '6 horas',
          distance: 'Centro histórico',
          highlights: ['Murallas', 'Plazas coloniales', 'Arquitectura barroca'],
          coordinates: { lat: 10.4236, lng: -75.5478 }
        },
        {
          name: 'Castillo San Felipe de Barajas',
          type: 'Fortaleza Histórica',
          description: 'Fortaleza española más grande de América',
          timeNeeded: '3 horas',
          distance: '10 min del centro',
          highlights: ['Túneles', 'Historia militar', 'Vista panorámica'],
          coordinates: { lat: 10.4217, lng: -75.5428 }
        },
        {
          name: 'Islas del Rosario',
          type: 'Excursión Marina',
          description: 'Archipiélago de coral con aguas cristalinas',
          timeNeeded: 'Día completo',
          distance: '1 hora en lancha',
          highlights: ['Snorkel', 'Playa Azul', 'Acuario natural'],
          coordinates: { lat: 10.1667, lng: -75.7500 }
        }
      ]
    }
  }
};
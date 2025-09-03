// src/data/touristAttractions.ts
import { TouristAttractions } from '../types';

export const TOURIST_ATTRACTIONS: TouristAttractions = {
  'DO': {
    'punta_cana': {
      region: 'Punta Cana y Este',
      attractions: [
        {
          name: 'Playa B�varo',
          type: 'Playa',
          description: 'Una de las mejores playas del mundo con arena blanca y aguas cristalinas',
          timeNeeded: '4 horas',
          distance: '5 min del centro',
          highlights: ['Deportes acu�ticos', 'Restaurantes frente al mar', 'Atardeceres espectaculares'],
          coordinates: { lat: 18.6838, lng: -68.3715 }
        },
        {
          name: 'Hoyo Azul',
          type: 'Cenote Natural',
          description: 'Laguna de agua dulce de color turquesa rodeada de vegetaci�n tropical',
          timeNeeded: '3 horas',
          distance: '45 min',
          highlights: ['Senderismo', 'Nataci�n', 'Fotograf�a'],
          coordinates: { lat: 18.5731, lng: -68.4069 }
        },
        {
          name: 'Isla Saona',
          type: 'Excursi�n',
          description: 'Para�so tropical con playas v�rgenes y aguas cristalinas',
          timeNeeded: 'D�a completo',
          distance: '2 horas en catamaran',
          highlights: ['Snorkel', 'Almuerzo en la playa', 'Piscinas naturales'],
          coordinates: { lat: 18.1833, lng: -68.7333 }
        },
        {
          name: 'Altos de Chav�n',
          type: 'Villa Cultural',
          description: 'R�plica de una villa mediterr�nea del siglo XVI con anfiteatro',
          timeNeeded: '3 horas',
          distance: '1.5 horas',
          highlights: ['Arquitectura colonial', 'Artesan�as', 'Vistas panor�micas'],
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
          highlights: ['Catedral Primada', 'Alc�zar de Col�n', 'Calle Las Damas'],
          coordinates: { lat: 18.4733, lng: -69.8849 }
        },
        {
          name: 'Faro a Col�n',
          type: 'Monumento',
          description: 'Imponente monumento en forma de cruz que alberga los restos de Crist�bal Col�n',
          timeNeeded: '2 horas',
          distance: '20 min del centro',
          highlights: ['Museos', 'L�ser nocturno', 'Historia'],
          coordinates: { lat: 18.4814, lng: -69.8597 }
        },
        {
          name: 'Cueva de los Tres Ojos',
          type: 'Atracci�n Natural',
          description: 'Sistema de cavernas con lagos subterr�neos de agua dulce',
          timeNeeded: '2 horas',
          distance: '15 min del centro',
          highlights: ['Lagos subterr�neos', 'Formaciones calc�reas', 'Botes'],
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
          description: 'Centro hist�rico colonial con murallas del siglo XVI',
          timeNeeded: '6 horas',
          distance: 'Centro hist�rico',
          highlights: ['Murallas', 'Plazas coloniales', 'Arquitectura barroca'],
          coordinates: { lat: 10.4236, lng: -75.5478 }
        },
        {
          name: 'Castillo San Felipe de Barajas',
          type: 'Fortaleza Hist�rica',
          description: 'Fortaleza espa�ola m�s grande de Am�rica',
          timeNeeded: '3 horas',
          distance: '10 min del centro',
          highlights: ['T�neles', 'Historia militar', 'Vista panor�mica'],
          coordinates: { lat: 10.4217, lng: -75.5428 }
        },
        {
          name: 'Islas del Rosario',
          type: 'Excursi�n Marina',
          description: 'Archipi�lago de coral con aguas cristalinas',
          timeNeeded: 'D�a completo',
          distance: '1 hora en lancha',
          highlights: ['Snorkel', 'Playa Azul', 'Acuario natural'],
          coordinates: { lat: 10.1667, lng: -75.7500 }
        }
      ]
    }
  }
};

const makePlace = (name, search = name) => ({
  name,
  map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${search}, Córdoba, España`)}`,
});

export const itinerary = [
  {
    day: 'Día 1',
    period: 'Mañana',
    area: 'Judería y Mezquita-Catedral',
    icon: '☀️',
    places: [
      makePlace('Mezquita-Catedral', 'Mezquita-Catedral de Córdoba'),
      makePlace('Calleja de las Flores'),
      makePlace('Calleja del Pañuelo'),
      makePlace('Zoco Municipal', 'Zoco Municipal de Córdoba'),
      makePlace('Sinagoga', 'Sinagoga de Córdoba'),
    ],
  },
  {
    day: 'Día 1',
    period: 'Tarde',
    area: 'Muralla, callejas y ribera',
    icon: '🌇',
    places: [
      makePlace('Calleja del Salmorejo Cordobés'),
      makePlace('Calleja de la Luna'),
      makePlace('Calle de la Muralla o Cairuán', 'Calle Cairuán Córdoba'),
      makePlace('Puerta del Puente'),
      makePlace('Puente Romano', 'Puente Romano de Córdoba'),
      makePlace('Torre de la Calahorra'),
      makePlace('Ribera del Guadalquivir', 'Ribera del Guadalquivir Córdoba'),
    ],
  },
  {
    day: 'Día 2',
    period: 'Mañana',
    area: 'Centro y barrio de Santa Marina',
    icon: '☀️',
    places: [
      makePlace('Plaza de las Tendillas'),
      makePlace('Cuesta del Bailío'),
      makePlace('Palacio de Viana'),
      makePlace('Patios y plazas de Santa Marina', 'Patios y plazas barrio de Santa Marina Córdoba'),
      makePlace('Iglesia de San Lorenzo'),
      makePlace('Calleja de los Arquillos'),
    ],
  },
  {
    day: 'Día 2',
    period: 'Tarde',
    area: 'Corredera, jardín y San Basilio',
    icon: '🌇',
    places: [
      makePlace('Plaza de la Corredera'),
      makePlace('Templo Romano', 'Templo Romano de Córdoba'),
      makePlace('Jardín Botánico', 'Real Jardín Botánico de Córdoba IMGEMA'),
      makePlace('Caballerizas Reales'),
      makePlace('Barrio de San Basilio'),
    ],
  },
];

export const tickets = [
  {
    kind: 'IDA',
    date: 'Martes, 13 de octubre de 2026',
    departure: 'Madrid-Puerta de Atocha',
    departureTime: '15:00',
    arrival: 'Córdoba-Julio Anguita',
    arrivalTime: '17:01',
    train: 'AVLO · Tren 02156',
    file: '/billetes/billete-ida-madrid-cordoba-13-octubre.pdf',
    filename: 'billete-ida-madrid-cordoba-13-octubre.pdf',
  },
  {
    kind: 'VUELTA',
    date: 'Sábado, 17 de octubre de 2026',
    departure: 'Córdoba-Julio Anguita',
    departureTime: '18:20',
    arrival: 'Madrid-Puerta de Atocha',
    arrivalTime: '20:14',
    train: 'OUIGO · Tren 06577',
    file: '/billetes/billete-vuelta-cordoba-madrid-17-octubre.pdf',
    filename: 'billete-vuelta-cordoba-madrid-17-octubre.pdf',
  },
];

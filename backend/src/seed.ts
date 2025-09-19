import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  console.log('👥 Creating demo users...');
  
  const hashedPassword = await bcrypt.hash('demo123', 12);
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@tripwase.com' },
    update: {},
    create: {
      email: 'demo@tripwase.com',
      name: 'Usuario Demo',
      password: hashedPassword,
      role: 'USER',
      lastLogin: new Date(),
      preferences: {
        create: {
          currency: 'USD',
          language: 'ES',
          notifications: true
        }
      }
    },
    include: {
      preferences: true
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tripwase.com' },
    update: {},
    create: {
      email: 'admin@tripwase.com',
      name: 'Admin TripWase',
      password: hashedAdminPassword,
      role: 'ADMIN',
      lastLogin: new Date(),
      preferences: {
        create: {
          currency: 'USD',
          language: 'ES',
          notifications: true
        }
      }
    },
    include: {
      preferences: true
    }
  });

  console.log(`✅ Created user: ${demoUser.email}`);
  console.log(`✅ Created admin: ${adminUser.email}`);

  console.log('🌍 Creating destinations...');

  const destinations = [
    {
      name: 'París',
      country: 'Francia',
      description: 'La ciudad del amor y la luz, famosa por la Torre Eiffel y sus museos.',
      averagePrice: 150,
      popularityScore: 9,
      categories: JSON.stringify(['cultura', 'gastronomía', 'romance', 'arte']),
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52',
      averageTemp: 15,
      climate: 'Templado oceánico',
      bestMonths: JSON.stringify(['Abril', 'Mayo', 'Junio', 'Septiembre', 'Octubre'])
    },
    {
      name: 'Tokyo',
      country: 'Japón',
      description: 'Moderna metrópoli que combina tradición con tecnología.',
      averagePrice: 120,
      popularityScore: 8,
      categories: JSON.stringify(['cultura', 'tecnología', 'gastronomía']),
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
      averageTemp: 16,
      climate: 'Subtropical húmedo',
      bestMonths: JSON.stringify(['Marzo', 'Abril', 'Mayo', 'Octubre'])
    },
    {
      name: 'Punta Cana',
      country: 'República Dominicana',
      description: 'Paraíso tropical con playas y resorts todo incluido.',
      averagePrice: 90,
      popularityScore: 7,
      categories: JSON.stringify(['playa', 'relajación', 'deportes']),
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
      averageTemp: 26,
      climate: 'Tropical',
      bestMonths: JSON.stringify(['Diciembre', 'Enero', 'Febrero', 'Marzo'])
    }
  ];

  const createdDestinations = [];
  for (const dest of destinations) {
    const destination = await prisma.destination.upsert({
      where: { 
        name_country: {
          name: dest.name,
          country: dest.country
        }
      },
      update: {},
      create: dest
    });
    createdDestinations.push(destination);
    console.log(`✅ Created destination: ${destination.name}, ${destination.country}`);
  }

  console.log('✈️ Creating demo trips...');

  const parisTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Escapada Romántica a París',
      description: 'Un viaje romántico de 5 días por la ciudad del amor',
      destinationId: createdDestinations.find(d => d.name === 'París')!.id,
      originCity: 'Santo Domingo',
      originCountry: 'República Dominicana',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-20'),
      duration: 5,
      adultsCount: 2,
      childrenCount: 0,
      budgetTotal: 3500,
      budgetUsed: 1200,
      currency: 'USD',
      interests: JSON.stringify(['cultura', 'gastronomía', 'romance']),
      travelStyle: 'romántico',
      totalCost: 3500,
      status: 'PLANNING'
    }
  });

  console.log(`✅ Created trip: ${parisTrip.name}`);

  console.log('🔔 Creating demo notifications...');

  const notifications = [
    {
      userId: demoUser.id,
      type: 'SUCCESS',
      title: '¡Bienvenido a TripWase!',
      message: 'Tu cuenta ha sido creada exitosamente. ¡Comienza a planificar tu próximo viaje!',
      read: false
    },
    {
      userId: demoUser.id,
      type: 'INFO',
      title: 'Viaje a París confirmado',
      message: 'Tu viaje "Escapada Romántica a París" está listo.',
      read: false
    }
  ];

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
  }

  console.log(`✅ Created ${notifications.length} demo notifications`);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('==========================================');
  console.log(`👥 Users created: 2`);
  console.log(`🌍 Destinations created: ${createdDestinations.length}`);
  console.log(`✈️ Trips created: 1`);
  console.log(`🔔 Notifications created: ${notifications.length}`);
  console.log('==========================================');
  console.log('\n📝 Demo Credentials:');
  console.log('User: demo@tripwase.com / demo123');
  console.log('Admin: admin@tripwase.com / admin123');
  console.log('\n🚀 You can now start the server and test the API!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
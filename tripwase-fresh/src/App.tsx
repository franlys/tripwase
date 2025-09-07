// =====================================================
// INSTRUCCIONES DE IMPLEMENTACIÓN
// =====================================================

/*
ESTRUCTURA DE TU PROYECTO ACTUAL:
src/
├── App.tsx (o App.jsx - ESTE ARCHIVO SE REEMPLAZA)
├── index.css (MANTENER - agregar estilos)
├── main.tsx (MANTENER como está)
└── ...

PASOS A SEGUIR:

1. REEMPLAZA tu src/App.tsx con el código de abajo
2. AGREGA los estilos CSS a tu src/index.css
3. CREA estas carpetas y archivos (OPCIONAL - para mejor organización):
   src/
   ├── components/
   │   ├── Header.tsx
   │   ├── Hero.tsx
   │   ├── Categories.tsx
   │   ├── TripForm.tsx
   │   └── Footer.tsx
   └── types/
       └── index.ts
*/

// =====================================================
// 1. TIPOS TYPESCRIPT (Crear: src/types/index.ts)
// =====================================================

export interface TripFormData {
  origin: string;
  destination: string;
  departure: string;
  return: string;
  travelers: string;
  budget: string;
}

export interface CategoryData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// =====================================================
// 2. APP.TSX PRINCIPAL (Reemplazar: src/App.tsx)
// =====================================================

import React, { useState, useEffect } from 'react';
import './styles/design-system.css';; // Aquí van todos los estilos

// Datos estáticos
const categories: CategoryData[] = [
  {
    id: 'beach',
    icon: '🏖️',
    title: 'Playa y Relax',
    description: 'Escápate a paraísos tropicales, disfruta de arenas blancas y aguas cristalinas. Perfecto para desconectar y recargar energías.'
  },
  {
    id: 'adventure',
    icon: '🏔️',
    title: 'Aventura y Naturaleza',
    description: 'Explora montañas, bosques y paisajes increíbles. Senderismo, escalada y experiencias al aire libre te esperan.'
  },
  {
    id: 'cultural',
    icon: '🏛️',
    title: 'Cultural e Histórico',
    description: 'Sumérgete en la historia, arte y tradiciones locales. Museos, sitios arqueológicos y experiencias culturales únicas.'
  },
  {
    id: 'gastronomy',
    icon: '🍴',
    title: 'Gastronomía',
    description: 'Descubre sabores auténticos, mercados locales y restaurantes únicos. Un viaje para tus sentidos y paladar.'
  },
  {
    id: 'urban',
    icon: '🌃',
    title: 'Vida Urbana',
    description: 'Vive la energía de las grandes ciudades. Shopping, vida nocturna, arquitectura moderna y experiencias cosmopolitas.'
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧‍👦',
    title: 'Familiar',
    description: 'Diversión para toda la familia. Parques temáticos, actividades para niños y experiencias que todos disfrutarán.'
  }
];

// Componente Header
const Header: React.FC = () => (
  <header className="header">
    <div className="container">
      <div className="header-content flex-between">
        <a href="#" className="logo">TripWase</a>
        <nav>
          <ul className="nav-list">
            <li><a href="#" className="nav-link">Inicio</a></li>
            <li><a href="#" className="nav-link">Destinos</a></li>
            <li><a href="#" className="nav-link">Planes</a></li>
            <li><a href="#" className="nav-link">Contacto</a></li>
            <li><a href="#" className="btn btn-primary">Iniciar Sesión</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

// Componente Hero
const Hero: React.FC = () => (
  <section className="hero">
    <div className="container">
      <div className="hero-content animate-fade-in">
        <h1 className="hero-title heading-1">
          Planifica tu viaje perfecto con{' '}
          <span style={{ color: 'var(--tripwase-primary)' }}>TripWase</span>
        </h1>
        <p className="hero-subtitle">
          Descubre experiencias únicas, crea itinerarios personalizados y vive aventuras inolvidables. Tu próximo destino te está esperando.
        </p>
        <div className="hero-cta">
          <a href="#generator" className="btn btn-primary btn-large">
            ✈️ Comenzar a planificar
          </a>
          <p className="text-small" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Más de 10,000 viajeros confían en nosotros
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Componente Categories
const Categories: React.FC = () => (
  <section className="section categories-section">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title heading-2">¿Qué tipo de experiencia buscas?</h2>
        <p className="section-subtitle text-large">
          Elige tu estilo de viaje y déjanos crear el itinerario perfecto para ti
        </p>
      </div>
      
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={category.id} className="card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="card-icon">{category.icon}</div>
            <h3 className="card-title heading-4">{category.title}</h3>
            <p className="card-description">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Componente TripForm
const TripForm: React.FC = () => {
  const [formData, setFormData] = useState<TripFormData>({
    origin: '',
    destination: '',
    departure: '',
    return: '',
    travelers: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aquí se conectará con el backend
      console.log('Datos del formulario:', formData);
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert('¡Viaje generado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section" id="generator">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title heading-2">Genera tu viaje perfecto</h2>
          <p className="section-subtitle text-large">
            Completa la información y recibe recomendaciones personalizadas al instante
          </p>
        </div>
        
        <div className="form-section">
          <form className="trip-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">¿Desde dónde viajas?</label>
                <select 
                  name="origin"
                  className="form-input form-select" 
                  value={formData.origin}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona tu ciudad</option>
                  <option value="santo-domingo">Santo Domingo, RD</option>
                  <option value="santiago">Santiago, RD</option>
                  <option value="puerto-plata">Puerto Plata, RD</option>
                  <option value="la-romana">La Romana, RD</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">¿A dónde quieres ir?</label>
                <input 
                  type="text" 
                  name="destination"
                  className="form-input" 
                  placeholder="Ej: París, Francia"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Fecha de salida</label>
                <input 
                  type="date" 
                  name="departure"
                  className="form-input"
                  value={formData.departure}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Fecha de regreso</label>
                <input 
                  type="date" 
                  name="return"
                  className="form-input"
                  value={formData.return}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Número de viajeros</label>
                <select 
                  name="travelers"
                  className="form-input form-select"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5+">5+ personas</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Presupuesto (RD$)</label>
                <select 
                  name="budget"
                  className="form-input form-select"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona rango</option>
                  <option value="25000-50000">RD$ 25,000 - 50,000</option>
                  <option value="50000-100000">RD$ 50,000 - 100,000</option>
                  <option value="100000-200000">RD$ 100,000 - 200,000</option>
                  <option value="200000+">RD$ 200,000+</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Generando tu viaje...' : '🚀 Generar mi viaje perfecto'}
              </button>
              <p className="text-small mt-md" style={{ color: 'var(--neutral-500)' }}>
                Recibirás recomendaciones personalizadas en segundos
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// Componente Footer
const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>TripWase</h4>
          <p className="text-base">Tu compañero de viajes para explorar el mundo de manera inteligente y personalizada.</p>
        </div>
        
        <div className="footer-section">
          <h4>Servicios</h4>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Planificación de viajes</a></li>
            <li><a href="#" className="footer-link">Recomendaciones personalizadas</a></li>
            <li><a href="#" className="footer-link">Guías de destinos</a></li>
            <li><a href="#" className="footer-link">Soporte 24/7</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Compañía</h4>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Sobre nosotros</a></li>
            <li><a href="#" className="footer-link">Contacto</a></li>
            <li><a href="#" className="footer-link">Términos de uso</a></li>
            <li><a href="#" className="footer-link">Privacidad</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Síguenos</h4>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Facebook</a></li>
            <li><a href="#" className="footer-link">Instagram</a></li>
            <li><a href="#" className="footer-link">Twitter</a></li>
            <li><a href="#" className="footer-link">YouTube</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 TripWase. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

// Componente principal App
const App: React.FC = () => {
  useEffect(() => {
    // Animaciones on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observar cards para animaciones
    document.querySelectorAll('.card').forEach(card => {
      const element = card as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.6s ease-out';
      observer.observe(element);
    });

    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Header />
      <Hero />
      <Categories />
      <TripForm />
      <Footer />
    </div>
  );
};

export default App;
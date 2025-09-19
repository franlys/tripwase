export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Almacenar toasts activos
let toastContainer: HTMLDivElement | null = null;
let activeToasts: Map<string, HTMLDivElement> = new Map();

// Crear contenedor de toasts si no existe
function getToastContainer(): HTMLDivElement {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

// Función principal para mostrar toast
export function showToast(
  message: string, 
  type: ToastType = 'info', 
  duration: number = 3000
): string {
  const id = Date.now().toString();
  const container = getToastContainer();
  
  // Crear elemento del toast
  const toastElement = document.createElement('div');
  toastElement.className = `
    min-w-[300px] p-4 rounded-lg shadow-lg transform transition-all duration-300
    ${type === 'success' ? 'bg-green-500 text-white' : ''}
    ${type === 'error' ? 'bg-red-500 text-white' : ''}
    ${type === 'warning' ? 'bg-yellow-500 text-white' : ''}
    ${type === 'info' ? 'bg-blue-500 text-white' : ''}
  `;
  
  toastElement.innerHTML = `
    <div class="flex items-center justify-between">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:opacity-75">
        ×
      </button>
    </div>
  `;
  
  // Añadir al contenedor
  container.appendChild(toastElement);
  activeToasts.set(id, toastElement);
  
  // Animar entrada
  setTimeout(() => {
    toastElement.style.opacity = '1';
  }, 10);
  
  // Auto-eliminar después del duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
  
  return id;
}

// Función para eliminar un toast específico
export function removeToast(id: string): void {
  const toastElement = activeToasts.get(id);
  if (toastElement) {
    toastElement.style.opacity = '0';
    setTimeout(() => {
      toastElement.remove();
      activeToasts.delete(id);
    }, 300);
  }
}

// Función para limpiar todos los toasts
export function clearAllToasts(): void {
  activeToasts.forEach((_, id) => removeToast(id));
}

// ============================================
// 4. src/data/categories.ts
// ============================================
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  popular?: boolean;
  activities?: string[];
}

export const categories: Category[] = [
  {
    id: 'beach',
    name: 'Playa y Sol',
    icon: '🏖️',
    description: 'Destinos costeros con playas paradisíacas',
    popular: true,
    activities: ['Natación', 'Surf', 'Buceo', 'Snorkel', 'Volleyball']
  },
  {
    id: 'mountain',
    name: 'Montaña',
    icon: '⛰️',
    description: 'Aventuras en las alturas y paisajes montañosos',
    popular: true,
    activities: ['Senderismo', 'Escalada', 'Camping', 'Mountain Bike']
  },
  {
    id: 'city',
    name: 'Ciudad',
    icon: '🏙️',
    description: 'Explora grandes ciudades y su cultura urbana',
    popular: true,
    activities: ['Museos', 'Shopping', 'Gastronomía', 'Vida nocturna']
  },
  {
    id: 'adventure',
    name: 'Aventura',
    icon: '🎯',
    description: 'Experiencias extremas y adrenalina pura',
    activities: ['Rafting', 'Parapente', 'Bungee', 'Zip-line']
  },
  {
    id: 'cultural',
    name: 'Cultural',
    icon: '🏛️',
    description: 'Historia, arte y tradiciones locales',
    activities: ['Tours históricos', 'Galerías', 'Teatro', 'Festivales']
  },
  {
    id: 'nature',
    name: 'Naturaleza',
    icon: '🌿',
    description: 'Conecta con la naturaleza y vida silvestre',
    activities: ['Safari', 'Observación de aves', 'Parques nacionales']
  },
  {
    id: 'romantic',
    name: 'Romántico',
    icon: '💑',
    description: 'Escapadas perfectas para parejas',
    activities: ['Cenas románticas', 'Spa', 'Paseos', 'Atardeceres']
  },
  {
    id: 'family',
    name: 'Familiar',
    icon: '👨‍👩‍👧‍👦',
    description: 'Diversión para toda la familia',
    activities: ['Parques temáticos', 'Zoológicos', 'Acuarios', 'Playas']
  },
  {
    id: 'luxury',
    name: 'Lujo',
    icon: '💎',
    description: 'Experiencias exclusivas y premium',
    activities: ['Resorts 5 estrellas', 'Yates', 'Golf', 'Spa premium']
  },
  {
    id: 'budget',
    name: 'Económico',
    icon: '💰',
    description: 'Viajes increíbles con presupuesto ajustado',
    activities: ['Hostales', 'Street food', 'Transporte público', 'Free tours']
  },
  {
    id: 'cruise',
    name: 'Crucero',
    icon: '🚢',
    description: 'Navega por los mejores destinos',
    activities: ['Shows', 'Casino', 'Piscinas', 'Excursiones en puerto']
  },
  {
    id: 'wellness',
    name: 'Bienestar',
    icon: '🧘',
    description: 'Relájate y renueva tu energía',
    activities: ['Yoga', 'Meditación', 'Spa', 'Retiros']
  }
];
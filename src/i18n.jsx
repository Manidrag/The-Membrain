import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App name
      membrain: "MemBrain",
      
      // Navigation
      dashboard: "Dashboard",
      createNote: "Create Note",
      allNotes: "All Notes",
      search: "Search",
      insights: "Insights",
      
      // Settings
      language: "Language",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      settings: "Settings",
      
      // Actions
      logout: "Logout",
      "view-note": "View Note",
      "edit-note": "Edit Note",
      "delete-note": "Delete Note",
      "save-note": "Save Note",
      semanticSearch: "Semantic Search",
      "create-new": "Create New",
      "search-notes": "Search Notes",
      
      // Messages
      welcome: "Welcome",
      "welcome-back": "Welcome back",
      "no-notes": "No notes available.",
      "note-created": "Note created successfully",
      "note-updated": "Note updated successfully",
      "note-deleted": "Note deleted successfully",
      "confirm-delete": "Are you sure you want to delete this note?",
      "search-placeholder": "Search your notes...",
      "loading": "Loading...",
      "error": "An error occurred",
      "offline": "You are offline",
      "try-again": "Try Again",
      "all-your-notes": "All Your Notes",
      "search-note": "Search Note",
      "notes": "Notes",
     
    }
  },
  es: {
    translation: {
      // App name
      membrain: "MemBrain",
      
      // Navigation
      dashboard: "Tablero",
      createNote: "Crear Nota",
      allNotes: "Todas las Notas",
      search: "Buscar",
      insights: "Perspectivas",
      
      // Settings
      language: "Idioma",
      lightMode: "Modo Claro",
      darkMode: "Modo Oscuro",
      settings: "Configuración",
      
      // Actions
      logout: "Cerrar Sesión",
      "view-note": "Ver Nota",
      "edit-note": "Editar Nota",
      "delete-note": "Eliminar Nota",
      "save-note": "Guardar Nota",
      semanticSearch: "Búsqueda Semántica",
      "create-new": "Crear Nuevo",
      "search-notes": "Buscar Notas",
      
      // Messages
      welcome: "Bienvenido",
      "welcome-back": "Bienvenido de nuevo",
      "no-notes": "No hay notas disponibles",
      "note-created": "Nota creada exitosamente",
      "note-updated": "Nota actualizada exitosamente",
      "note-deleted": "Nota eliminada exitosamente",
      "confirm-delete": "¿Estás seguro de que quieres eliminar esta nota?",
      "search-placeholder": "Busca tus notas...",
      "loading": "Cargando...",
      "error": "Ocurrió un error",
      "offline": "Estás sin conexión",
      "try-again": "Intentar de nuevo",

      "all-your-notes": "Todas Tus Notas",
      "search-note": "Buscar Nota",
      "notes": "Notas",
    
      
    }
  },
  hi: {
    translation: {
      // App name
      membrain: "मेमब्रेन",
      
      // Navigation
      dashboard: "डैशबोर्ड",
      createNote: "नोट बनाएं",
      allNotes: "सभी नोट्स",
      search: "खोजें",
      insights: "अंतर्दृष्टि",
      
      // Settings
      language: "भाषा",
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड",
      settings: "सेटिंग्स",
      
      // Actions
      logout: "लॉग आउट",
      "view-note": "नोट देखें",
      "edit-note": "नोट संपादित करें",
      "delete-note": "नोट हटाएं",
      "save-note": "नोट सहेजें",
      semanticSearch: "सिमैंटिक खोज",
      "create-new": "नया बनाएं",
      "search-notes": "नोट्स खोजें",
      
      // Messages
      welcome: "स्वागत है",
      "welcome-back": "पुनः स्वागत है",
      "no-notes": "कोई नोट उपलब्ध नहीं है",
      "note-created": "नोट सफलतापूर्वक बनाया गया",
      "note-updated": "नोट सफलतापूर्वक अपडेट किया गया",
      "note-deleted": "नोट सफलतापूर्वक हटाया गया",
      "confirm-delete": "क्या आप वाकई इस नोट को हटाना चाहते हैं?",
      "search-placeholder": "अपने नोट्स खोजें...",
      "loading": "लोड हो रहा है...",
      "error": "एक त्रुटि हुई",
      "offline": "आप ऑफ़लाइन हैं",
      "try-again": "पुनः प्रयास करें",
     
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    debug: process.env.NODE_ENV === 'development',
    react: {
      useSuspense: false, // Disable suspense
      wait: true // Wait for translations before rendering
    }
  });

export default i18n;
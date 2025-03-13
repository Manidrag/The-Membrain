import { useTheme } from './css/ThemeProvider';

const SharedBackground = () => {
  const { theme } = useTheme();
  const LINK=import.meta.env.VITE_API_URL;

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className={`absolute inset-0 bg-size-200 animate-gradientMove ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900'
          : 'bg-gradient-to-br from-white via-purple-50/30 to-white'
      }`} />

      {/* Animated shapes */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-floating ${
          theme === 'dark'
            ? 'bg-purple-500/10'
            : 'bg-purple-200/20'
        }`} />
        
        <div className={`absolute top-1/3 right-1/4 w-72 h-72 rounded-full animate-glow ${
          theme === 'dark'
            ? 'bg-blue-500/10'
            : 'bg-blue-200/20'
        }`} />

        <div className={`absolute bottom-1/4 left-1/3 w-80 h-80 animate-wave ${
          theme === 'dark'
            ? 'bg-gradient-radial from-pink-500/10 to-transparent'
            : 'bg-gradient-radial from-pink-200/20 to-transparent'
        }`} />
      </div>

      {/* Grid overlay */}
      <div className={`absolute inset-0 ${
        theme === 'dark' ? 'opacity-10' : 'opacity-5'
      }`}>
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* Noise texture overlay */}
      <div className={`absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-soft-light`}>
        <div className="h-full w-full bg-[url('/noise.png')] bg-repeat" />
      </div>
    </div>
  );
};

export default SharedBackground;
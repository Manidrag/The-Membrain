import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

const GalaxyBackground = () => {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div 
          className={`absolute inset-0 transition-colors duration-500 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' 
              : 'bg-gradient-to-br from-blue-50 via-purple-50/20 to-blue-50'
          }`}
        />

        {/* Animated stars */}
        <div className="absolute inset-0 opacity-70">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                theme === 'dark' ? 'bg-white' : 'bg-purple-500'
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Interactive gradient overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${
              theme === 'dark' 
                ? 'rgba(124, 58, 237, 0.5)' 
                : 'rgba(139, 92, 246, 0.2)'
            } 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0 bg-repeat bg-noise" />
      </div>
    </>
  );
};

export default GalaxyBackground;
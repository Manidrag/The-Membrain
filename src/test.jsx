import React from 'react';

const AnimationTest = () => {
  return (
    <div className="p-8 space-y-4">
      <div className="animate-fadeIn bg-blue-500 p-4 text-white">
        Fade In Animation
      </div>
      
      <div className="animate-scaleIn bg-green-500 p-4 text-white">
        Scale In Animation
      </div>
      
      <div className="relative">
        <div className="animate-blob bg-purple-500 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="animate-blob animation-delay-2000 bg-yellow-500 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-70 absolute top-0 -left-4"></div>
        <div className="animate-blob animation-delay-4000 bg-pink-500 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-70 absolute -top-4 left-8"></div>
      </div>
    </div>
  );
};

export default AnimationTest;
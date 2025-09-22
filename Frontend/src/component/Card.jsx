import React, { useContext, useRef } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ Image, name, role }) => {
  const {
    frontendImage,
    backendImage,
    selectedImage,
    setSelectedImage,
    setFrontendImage,
    setBackendImage,
  } = useContext(userDataContext);

  const cardRef = useRef(null);

  // 3D tilt effect with mouse movement
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse X inside card
    const y = e.clientY - rect.top;  // mouse Y inside card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 6; // tilt sensitivity
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div
      ref={cardRef}
      className={`relative w-64 h-80 rounded-2xl overflow-hidden shadow-lg 
      ${selectedImage === Image 
        ? "border-4 border-yellow-400 shadow-yellow-400/50" 
        : "border border-transparent"} 
      transition-all duration-300 ease-out cursor-pointer group animate-float`}
      onClick={() => {
        setSelectedImage(Image);
        setFrontendImage(null);
        setBackendImage(null);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <img
        src={Image}
        alt={name}
        className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-500"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>

      {/* Bottom info box */}
      <div className="absolute bottom-0 w-full px-5 py-4 bg-black/40 backdrop-blur-md">
        <h2 className="text-xl font-extrabold text-yellow-300 tracking-wide drop-shadow-md group-hover:scale-105 transition-transform">
          {name}
        </h2>
        <p className="text-sm text-gray-200 italic">{role}</p>
      </div>
    </div>
  );
};

export default Card;

import React, { useContext, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import Card from "../component/Card";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import image7 from "../assets/image7.png";
import image8 from "../assets/image8.png";
import image9 from "../assets/image9.jpg";
import { LuImageUp } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const Customize = () => {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#151528] to-[#101820] flex flex-col items-center py-14 px-6 overflow-hidden">
      
      {/* Back button */}
      <FaArrowLeft 
        className="absolute top-[30px] left-[30px] text-white w-[28px] h-[28px] cursor-pointer hover:scale-110 hover:text-yellow-300 transition-all" 
        onClick={() => navigate("/")}
      />

      {/* Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 -right-32 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-200"></div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 mb-16 tracking-[4px] drop-shadow-2xl hover:scale-105 transition-all">
        ⚓ Straw Hat Pirates
      </h1>

      {/* Grid of Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 place-items-center z-10">
        <Card Image={image1} name="Luffy" role="Captain" />
        <Card Image={image2} name="Zoro" role="Swordsman" />
        <Card Image={image3} name="Nami" role="Navigator" />
        <Card Image={image4} name="Sanji" role="Cook" />
        <Card Image={image5} name="Brook" role="Musician" />
        <Card Image={image6} name="Franky" role="Shipwright" />
        <Card Image={image7} name="Chopper" role="Doctor" />
        <Card Image={image8} name="Boa Hancock" role="Pirate Empress" />
        <Card Image={image9} name="Robin" role="Archaeologist" />

        {/* Upload Image Card */}
        <div
          className={`relative w-64 h-80 rounded-2xl border-2 border-dashed flex justify-center items-center backdrop-blur-md bg-white/5 shadow-lg hover:shadow-yellow-300/40 hover:scale-105 transition-all duration-300 cursor-pointer group 
          ${selectedImage === "input" ? "border-yellow-400 shadow-lg shadow-yellow-400/50" : "border-white/30"}`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <div className="flex flex-col items-center gap-3 text-gray-300 group-hover:text-yellow-300 transition">
              <LuImageUp className="w-10 h-10" />
              <span className="text-sm font-semibold">Upload Your Own</span>
            </div>
          )}
          {frontendImage && (
            <img src={frontendImage} alt="custom" className="h-full w-full object-cover rounded-2xl" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {/* Next Button */}
      {selectedImage && (
        <button
          className="mt-12 px-10 py-3 text-lg font-bold rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black shadow-lg shadow-yellow-400/40 hover:scale-110 transition-all animate-pulse"
          onClick={() => navigate("/customize2")}
        >
          Next ➜
        </button>
      )}
    </div>
  );
};

export default Customize;

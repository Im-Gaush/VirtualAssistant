import React, { useContext, useState } from "react";
import bg from "../assets/one.png";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setError(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <form
        className="relative z-10 w-[90%] max-w-[420px] bg-gradient-to-b from-[#0f0f1a]/90 to-[#1b1b2f]/90 
                   backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl 
                   shadow-cyan-500/20 flex flex-col items-center justify-center gap-6 px-8 py-10 animate-fadeIn"
        onSubmit={handleSignUp}
      >
        {/* Title */}
        <h1 className="text-white text-3xl font-bold mb-4 text-center tracking-wide">
          Create Account
          <br />
          <span className="text-cyan-400">Virtual Assistant</span>
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full h-[55px] outline-none border border-cyan-400/40 bg-transparent 
                     text-white placeholder-gray-400 px-5 rounded-xl 
                     focus:border-cyan-400 focus:shadow-[0_0_15px_#00ffff70] transition-all"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full h-[55px] outline-none border border-cyan-400/40 bg-transparent 
                     text-white placeholder-gray-400 px-5 rounded-xl 
                     focus:border-cyan-400 focus:shadow-[0_0_15px_#00ffff70] transition-all"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        {/* Password */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-[55px] outline-none border border-cyan-400/40 bg-transparent 
                       text-white placeholder-gray-400 px-5 rounded-xl 
                       focus:border-cyan-400 focus:shadow-[0_0_15px_#00ffff70] transition-all"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <IoEyeOffOutline
              className="absolute top-[15px] right-4 text-gray-300 hover:text-cyan-400 cursor-pointer w-6 h-6"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEyeOutline
              className="absolute top-[15px] right-4 text-gray-300 hover:text-cyan-400 cursor-pointer w-6 h-6"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {/* Error */}
        {error.length > 0 && (
          <p className="text-red-400 text-sm font-medium">*{error}</p>
        )}

        {/* Button */}
        <button
          className="w-full h-[55px] mt-4 text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 
                     rounded-xl hover:from-cyan-400 hover:to-blue-500 
                     shadow-[0_0_15px_#00ffff70] hover:shadow-[0_0_25px_#00ffffa0] transition-all"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {/* Link */}
        <p className="text-gray-300 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer hover:underline"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

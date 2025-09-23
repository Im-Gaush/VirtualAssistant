import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/Voice.gif";
import userImg from "../assets/Hero.gif";
const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/user/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const startRecognition = () => {
    if (!recognitionRef.current && !isRecognizingRef.current) return;
    try {
      recognitionRef.current.start();
      console.log("Recognition request start");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Recognition Error", error);
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find((v) => v.lang === "hi-IN");

      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      isSpeakingRef.current = true;
      utterance.onend = () => {
        setAiText("");
        isSpeakingRef.current = false;
        // ✅ Restart recognition after speaking
        setTimeout(() => {
          if (recognitionRef.current && !isRecognizingRef.current) {
            try {
              recognitionRef.current.start();
              console.log("Recognition restarted after speaking");
            } catch (error) {
              console.error("Restart error:", error);
            }
          }
        }, 800);
      };

      synth.cancel(); // Cancel anything queued
      synth.speak(utterance);
    };

    if (synth.getVoices().length === 0) {
      // Voices not loaded yet, wait
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
      };
    } else {
      setVoiceAndSpeak();
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
    }
    if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }
    if (type === "instagram_open") {
      window.open("https://www.instagram.com/", "_blank");
    }
    if (type === "facebook_open") {
      window.open("https://www.facebook.com/", "_blank");
    }
    if (type === "weather_show") {
      window.open("https://www.google.com/search?q=weather", "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          userInput
        )}`,
        "_blank"
      );
    }

    if (type === "whatsapp_open") {
      window.open("https://web.whatsapp.com/", "_blank");
    }
    if (type === "spotify_open") {
      window.open("https://open.spotify.com/", "_blank");
    }
    if (type === "spotify_search") {
      window.open(
        `https://open.spotify.com/search/${encodeURIComponent(userInput)}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeOut = setTimeout(() => {
      if (isMounted && !recognitionRef.current && !isRecognizingRef.current) {
        try {
          recognitionRef.current.start();
          console.log("Recognition request start");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Recognition Error", error);
          }
        }
      }
    }, 1000);

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition request started");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("start error", error);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("Recognition Start");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition Ended");
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted ");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error("start error", error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.log("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error("start error", error);
              }
            }
          }
        }, 1000);
      } else if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(safeRecognition, 3000);
      }
    };

    recognition.onresult = async (e) => {
      const lastResult = e.results[e.results.length - 1];
      const transcript = lastResult[0].transcript.trim();
      console.log("heard:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        const data = await getGeminiResponse(transcript);
        console.log(data);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    safeRecognition();

    return () => {
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
    };
  }, []);

  return (
   <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex flex-col items-center py-6 px-4 sm:py-10 sm:px-6 overflow-hidden gap-6">

  {/* 🌌 Floating data stream particles */}
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <span
        key={i}
        className="absolute w-1 h-2 bg-cyan-400 rounded-full opacity-70 animate-pulse"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 3}s`,
        }}
      />
    ))}
  </div>

  {/* 🚀 Action Buttons (Top Bar) */}
  <div className="w-full flex justify-end gap-2 sm:gap-4 px-2 sm:px-6">
    <button
      className="px-4 py-2 sm:px-6 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm sm:text-base font-bold shadow-lg hover:scale-105 transition-all"
      onClick={handleLogout}
    >
      Log Out
    </button>
    <button
      className="px-4 py-2 sm:px-6 sm:py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm sm:text-base font-bold shadow-lg hover:scale-105 transition-all"
      onClick={() => navigate("/customize")}
    >
      Create Assistant
    </button>
  </div>

  {/* 🤖 AI Assistant Card */}
  <div className="relative w-56 h-72 sm:w-72 sm:h-96 md:w-80 md:h-[26rem] rounded-3xl overflow-hidden shadow-2xl border border-cyan-400/40 flex justify-center items-center mt-6">
    {/* Glowing Aura */}
    <div className="absolute w-full h-full rounded-3xl bg-cyan-400/20 blur-3xl animate-pulse -z-10"></div>

    <img
      src={userData?.assistantImage || userImg}
      alt="Assistant"
      className="w-full h-full object-cover rounded-3xl shadow-lg transition-transform duration-700 hover:scale-105"
    />

    {/* Glass overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 rounded-3xl"></div>
  </div>

  {/* Assistant Name */}
  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-400 drop-shadow-lg text-center">
    I'm {userData?.assistantName || "Aurora"}
  </h1>

  {/* 👁 AI / User animation */}
  <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 flex justify-center items-center">
    {!aiText ? (
      <img src={userImg} alt="User idle" className="w-full h-full object-contain animate-bounce" />
    ) : (
      <img src={aiImg} alt="AI speaking" className="w-full h-full object-contain animate-pulse" />
    )}
  </div>

  {/* 💬 Speech Bubble */}
  {(userText || aiText) && (
    <div
      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl shadow-lg max-w-[90%] sm:max-w-[70%] text-white font-semibold text-sm sm:text-base
        ${userText ? "self-end bg-gray-800/80" : "self-start bg-cyan-400/20 text-cyan-200"}`}
    >
      {userText || aiText}
    </div>
  )}
</div>

  );
};

export default Home;

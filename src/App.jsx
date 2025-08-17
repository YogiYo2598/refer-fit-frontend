import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import GetReferredPage from "./pages/GetReferredPage";
import BecomeReferrerPage from "./pages/BecomeReferrer";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ProtectedRoute from './routes/protectedRoutes';


export default function HomePage() {
  const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google", link: "https://careers.google.com" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", alt: "Microsoft", link: "https://careers.microsoft.com" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", alt: "Amazon", link: "https://www.amazon.jobs" },
    { src: "/logos/meta.png", alt: "Meta", link: "https://www.metacareers.com" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", alt: "Apple", link: "https://jobs.apple.com" },
    { src: "/logos/infosys.jpg", alt: "Infosys", link: "https://www.infosys.com/careers" },
    { src: "/logos/arm.png", alt: "TCS", link: "https://www.tcs.com/careers" },
    { src: "/logos/accenture.png", alt: "Accenture", link: "https://www.accenture.com/us-en/careers" },
    { src: "/logos/cisco.png", alt: "Cognizant", link: "https://careers.cognizant.com" },
    { src: "/logos/hp.png", alt: "Capgemini", link: "https://www.capgemini.com/careers" }
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-50">
            {/* Header */}
            <header className="w-full flex items-center justify-between sm:justify-center px-4 py-4 border-b shadow-sm">
              {/* Logo + App Name (aligned left on mobile, centered on sm and up) */}
              <div className="flex items-center">
                <img src="/logos/refer_fit.png" alt="Refer Fit" className="h-10 w-10 sm:h-12 sm:w-12 mr-2" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-blue-700">REFER FIT</h1>
              </div>

              {/* Login Button - only shown on mobile in top right */}
              <div className="sm:absolute sm:right-4">
                <Link to="/login">
                  <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                    Login
                  </button>
                </Link>
              </div>
            </header>

            {/* Intro message */}
            <section className="w-full flex items-center justify-center px-4 py-10 text-center">
              <div className="w-full max-w-5xl text-gray-800 text-2xl font-medium space-y-2">
                {/* <p className="text-5xl font-bold">Get referrals from employees at top companies no LinkedIn cold DMs required</p> */}
                <p  className="text-5xl font-bold">A smart way to get job referrals</p>
                <p className="text-base text-gray-500">Say goodbye to cold messaging and waiting — we connect you to referrers and keep them nudged until your referral goes through</p>
                <p className="text-base text-gray-700"> powered by a <b>real network</b> and <b>WhatsApp automation</b></p>
                {/* <p className="text-base text-gray-500">Referrals done right — with automatic WhatsApp nudges to keep things on track</p> */}
                {/* <p className="text-base text-gray-500">Referrals without the hassle — tracked, nudged, and done for you</p> */}
                {/* <p className="text-base"> We handle WhatsApp follow-ups with referrers to keep your application moving</p> */}
              </div>
            </section>

            {/* Main content */}
            <main className="flex-grow flex flex-col items-center px-4 mt-4">
              <div className="w-full max-w-md flex flex-col gap-6 sm:gap-4">
                <Link to="/get-referred">
                  <button className="w-full bg-blue-100 text-blue-800 text-xl font-semibold py-4 rounded-xl shadow hover:bg-blue-200 transition">
                    GET REFERRED
                  </button>
                </Link>
                <Link to="/become-a-referrer">
                  <button className="w-full bg-green-100 text-green-800 text-xl font-semibold py-4 rounded-xl shadow hover:bg-green-200 transition">
                    BECOME A REFERRER
                  </button>
                </Link>
              </div>
            </main>

            {/* Company logos infinite slider */}
            <section className="w-full bg-white py-10 px-4 mt-10 overflow-hidden">
              <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">Top IT Companies</h2>
              <div className="relative w-full">
                <div className="animate-slide flex whitespace-nowrap gap-12 hover:[animation-play-state:paused]">
                  {[...logos, ...logos].map((logo, index) => (
                    <a
                      key={index}
                      href={logo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform duration-300 transform hover:scale-110 flex-shrink-0 px-4"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-12 w-auto max-w-[120px] object-contain"
                      />
                    </a>
                  ))}
                </div>
              </div>
              <style>{`
                @keyframes slide {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-slide {
                  animation: slide 32s linear infinite;
                }
              `}</style>
            </section>

            <footer className="bg-white text-center  text-sm text-gray-600">
              {/* <p className="mb-2">© {new Date().getFullYear()} Refer Fit. All rights reserved.</p>
              <div className="flex justify-center gap-4">
                <a href="/terms" className="hover:underline">Terms</a>
                <a href="/privacy" className="hover:underline">Privacy</a>
                <a href="/contact" className="hover:underline">Contact</a>
              </div> */}

              <p className="mb-2">© {new Date().getFullYear()} Refer.Fit. All rights reserved.</p>

              <div className="flex justify-center gap-4 mb-2">
                <a href="/terms" className="hover:underline">Terms</a>
                <a href="/privacy" className="hover:underline">Privacy</a>
                <a href="/contact" className="hover:underline">Contact</a>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                  <i className="fab fa-twitter"></i> {/* FontAwesome */}
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </footer>
          </div>
        } />
        {/* Placeholder routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/get-referred" element={<GetReferredPage />} />
        <Route path="/become-a-referrer" element={<BecomeReferrerPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

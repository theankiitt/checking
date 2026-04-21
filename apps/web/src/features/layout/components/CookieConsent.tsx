'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import { manrope } from '@/app/fonts';

// Cookie helper functions
const COOKIE_NAME = 'gharsamma-cookie-consent';
const COOKIE_EXPIRY_DAYS = 365; // 1 year

function setCookieConsent(value: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
  document.cookie = `${COOKIE_NAME}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookieConsent(): string | null {
  if (typeof document === 'undefined') return null;
  
  const name = `${COOKIE_NAME}=`;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }
  
  return null;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const cookieConsent = getCookieConsent();

    if (!cookieConsent) {
      // Show after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent('accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookieConsent('declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Store a temporary dismissal (will show again after page refresh)
    setCookieConsent('dismissed');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[10002]"
        >
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-[calc(100vw-32px)] md:w-[400px] lg:w-[450px] max-w-md overflow-hidden">
            {/* Decorative gradient bar at top */}
            <div className="h-1.5 bg-gradient-to-r from-[#EB6426] via-[#FB923C] to-[#EB6426]" />

            <div className="p-5 md:p-6">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EB6426]/10 to-[#FB923C]/10 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-[#EB6426]" />
                  </div>
                </div>

                {/* Text Content */}
                <div className={`flex-1 pr-6 ${manrope.className}`}>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    We use cookies to enhance your experience and analyze our traffic.{' '}
                    <Link
                      href="/privacy-policy"
                      className="text-[#EB6426] hover:text-[#d65a1f] underline font-medium transition-colors"
                    >
                      Learn more
                    </Link>
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDecline}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 border border-gray-200"
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAccept}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#EB6426] to-[#FB923C] hover:from-[#d65a1f] hover:to-[#EB6426] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

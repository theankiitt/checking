"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { manrope } from "@/app/fonts";

const FOOTER_LINKS = {
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com", icon: FaFacebookF },
  { name: "Instagram", href: "https://www.instagram.com", icon: FaInstagram },
  { name: "TikTok", href: "https://www.tiktok.com", icon: FaTiktok },
];

const CONTACT_INFO = {
  address: "Kathmandu, Nepal",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+977 123 456 7890",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "gharsamma6@gmail.com",
};

function SocialLinks() {
  return (
    <div className="space-y-4">
      <h3 className={`text-white font-bold text-lg ${manrope.className}`}>
        Follow Us
      </h3>
      <div className="flex gap-3">
        {SOCIAL_LINKS.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon className="w-5 h-5 text-white" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-4">
      <h3 className={`text-white font-bold text-lg ${manrope.className}`}>
        Contact Us
      </h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-300">{CONTACT_INFO.address}</span>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            {CONTACT_INFO.phone}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            {CONTACT_INFO.email}
          </a>
        </li>
      </ul>
    </div>
  );
}

function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-white/10 bg-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-sm text-gray-400 ${manrope.className}`}>
            © {currentYear} GharSamma. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#262626] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/main.png"
                alt="GharSamma"
                width={120}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
                style={{ width: "auto", height: "40px" }}
                priority
              />
            </Link>
            <p className="text-md text-white text-justify leading-relaxed max-w-sm">
              Authentic Nepali handicrafts, traditional foods, and cultural products. 
              We deliver the rich heritage of Nepal directly to your doorstep worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ContactInfo />
            <SocialLinks />
          </div>
        </div>
      </div>

      <FooterBottom />
    </footer>
  );
}

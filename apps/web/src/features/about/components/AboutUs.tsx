'use client';

import { manrope } from '@/app/fonts';
import { Heart, Award, Users, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <section className="py-6 md:py-12 tracking-tight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 ${manrope.className} mb-3`}>
            About GharSamma
          </h2>
          <div className="w-42 h-1 bg-[#EB6426] mx-auto"></div>
        </div>

        {/* Two Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 mb-8">
          {/* Left - Title */}
          <div className="lg:col-span-2">
            <h3 className={`text-2xl md:text-3xl font-semibold text-gray-900 ${manrope.className} leading-tight`}>
              Bringing Authentic Nepali Heritage to Your Home
            </h3>
          </div>

          {/* Right - Details */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-gray-600 leading-relaxed text-lg md:text-xl text-justify ">
              At GharSamma, we are passionate about preserving and sharing the rich cultural heritage
              of Nepal with the world. Our name, which means "everything for home" in Nepali, reflects
              our commitment to providing authentic, traditional products that add warmth and meaning
              to your household.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg  md:text-xl text-justify ">
              From handcrafted items made by skilled artisans to traditional puja samagri, from
              aromatic herbs to beautiful jewelry, we carefully curate each product to ensure it
              represents the true essence of Nepali craftsmanship and tradition.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 py-4 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-12 h-12  rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-[#EB6426]" />
            </div>
            <h4 className={`text-base font-semibold text-gray-900 ${manrope.className} mb-1`}>
              Authentic Products
            </h4>
            <p className="text-xs text-gray-600 font-inter">
              Handpicked items directly from local artisans and traditional makers
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-[#EB6426]" />
            </div>
            <h4 className={`text-base font-semibold text-gray-900 ${manrope.className} mb-1`}>
              Quality Assured
            </h4>
            <p className="text-xs text-gray-600 font-inter">
              Each product meets our high standards for quality and authenticity
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-12 h-12  rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-[#EB6426]" />
            </div>
            <h4 className={`text-base font-semibold text-gray-900 ${manrope.className} mb-1`}>
              Supporting Artisans
            </h4>
            <p className="text-xs text-gray-600 font-inter">
              Empowering local communities and preserving traditional craftsmanship
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className="w-12 h-12  rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-[#EB6426]" />
            </div>
            <h4 className={`text-base font-semibold text-gray-900 ${manrope.className} mb-1`}>
              Global Reach
            </h4>
            <p className="text-xs text-gray-600 font-inter">
              Delivering Nepali heritage to customers around the world
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
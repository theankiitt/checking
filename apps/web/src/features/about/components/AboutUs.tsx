'use client';

import { manrope } from '@/app/fonts';
import { Heart, Award, Users, Globe, Sparkles, Mountain } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <section className="py-6 md:py-12 tracking-tight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 ${manrope.className} mb-4`}>
            About <span className="text-[#EB6426]">GharSamma</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Preserving Nepal's rich cultural heritage and bringing authentic traditional products to homes worldwide
          </p>
        </div>

        {/* Two Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-20">
          {/* Left - Title */}
          <div className="flex flex-col justify-center">
            <h3 className={`text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 ${manrope.className} leading-tight`}>
              Bringing Authentic Nepali Heritage to Your Home
            </h3>
        
          </div>

          {/* Right - Text Content */}
          <div className="flex flex-col justify-center space-y-6">
            <p className="leading-relaxed text-lg">
              <span className="text-gray-900">
                At GharSamma, we are passionate about preserving and sharing the rich cultural heritage
                of Nepal with the world. Our name, which means "everything for home" in Nepali, reflects
                our commitment to providing authentic, traditional products that add warmth and meaning
              </span>
              <span className="text-gray-800">
                to your household. From handcrafted items made by skilled artisans to traditional puja samagri, from
                aromatic herbs to beautiful jewelry, we carefully curate each product to ensure it
                represents the true essence of Nepali craftsmanship and tradition.
              </span>
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#EB6426] text-white rounded-lg hover:bg-orange-700 transition-colors font-medium w-fit"
            >
              Explore Our Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-5">
          <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 ${manrope.className} mb-3`}>
            Why Choose Us
          </h3>
          <p className="text-gray-500 max-w-xl mx-auto">
            We are committed to delivering the best of Nepal's cultural heritage
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EB6426] transition-colors duration-300">
              <Heart className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className={`text-lg font-semibold text-gray-900 ${manrope.className} mb-2`}>
              Authentic Products
            </h4>
            <p className="text-sm text-gray-500">
              Handpicked items directly from local artisans and traditional makers
            </p>
          </div>

          <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EB6426] transition-colors duration-300">
              <Award className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className={`text-lg font-semibold text-gray-900 ${manrope.className} mb-2`}>
              Quality Assured
            </h4>
            <p className="text-sm text-gray-500">
              Each product meets our high standards for quality and authenticity
            </p>
          </div>

          <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 transition-all duration-300">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EB6426] transition-colors duration-300">
              <Users className="w-6 h-6 text-[#EB6426] group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className={`text-lg font-semibold text-gray-900 ${manrope.className} mb-2`}>
              Supporting Artisans
            </h4>
            <p className="text-sm text-gray-500">
              Empowering local communities and preserving traditional craftsmanship
            </p>
          </div>

          <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 transition-all duration-300">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EB6426] transition-colors duration-300">
              <Globe className="w-6 h-6 text-[#EB6426] group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className={`text-lg font-semibold text-gray-900 ${manrope.className} mb-2`}>
              Global Reach
            </h4>
            <p className="text-sm text-gray-500">
              Delivering Nepali heritage to customers around the world
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

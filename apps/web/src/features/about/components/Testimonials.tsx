'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { manrope } from '@/app/fonts';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Kathmandu, Nepal',
    rating: 5,
    comment: 'Amazing quality! The traditional products are authentic and the packaging was excellent. Highly recommend for anyone looking for authentic Nepali items.',
  },
  {
    id: 2,
    name: 'Raj Khadka',
    location: 'Pokhara, Nepal',
    rating: 5,
    comment: 'Fast delivery and great customer service. The handcrafted items exceeded my expectations. Will definitely order again!',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    rating: 5,
    comment: 'Beautiful products that remind me of my visit to Nepal. The attention to detail in each item is remarkable. Love my purchase!',
  },
  {
    id: 4,
    name: 'Mohammed Ali',
    location: 'Dubai, UAE',
    rating: 5,
    comment: 'Excellent shopping experience! The website is easy to navigate and the product quality is outstanding. Shipping was fast too.',
  },
  {
    id: 5,
    name: 'Emma Williams',
    location: 'London, UK',
    rating: 5,
    comment: 'I found everything I needed for my home puja setup. Genuine products and great prices. Thank you for bringing Nepali culture to my home!',
  },
  {
    id: 6,
    name: 'David Chen',
    location: 'Sydney, Australia',
    rating: 5,
    comment: 'Wonderful collection of traditional items. The jewelry pieces are stunning and the food products taste authentic. Highly satisfied!',
  }
];

const initials = (name: string) => name.split(' ').map(n => n[0]).join('');

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-6">
            <Quote className="w-4 h-4 text-[#EB6426]" />
            <span className={`text-sm font-medium text-[#EB6426] ${manrope.className}`}>Testimonials</span>
          </div>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 ${manrope.className} mb-4`}>
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover why thousands of customers trust GharSamma for authentic Nepali products
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 leading-relaxed mb-6">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EB6426] to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {initials(testimonial.name)}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold text-gray-900 ${manrope.className}`}>
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold text-[#EB6426] ${manrope.className} mb-2`}>
              10K+
            </div>
            <div className="text-gray-500 text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold text-[#EB6426] ${manrope.className} mb-2`}>
              5K+
            </div>
            <div className="text-gray-500 text-sm">Products Sold</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold text-[#EB6426] ${manrope.className} mb-2`}>
              4.9★
            </div>
            <div className="text-gray-500 text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl md:text-5xl font-bold text-[#EB6426] ${manrope.className} mb-2`}>
              50+
            </div>
            <div className="text-gray-500 text-sm">Countries Served</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

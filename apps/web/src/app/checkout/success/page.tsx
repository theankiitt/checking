'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Home, MessageCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-[#EB6426]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#EB6426]" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Thanks for Your Inquiry!
          </h1>
          
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Our sales team will contact you shortly on WhatsApp to discuss your requirements and provide a personalized quote.
          </p>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 flex items-center gap-3 max-w-sm mx-auto">
            <MessageCircle className="w-5 h-5 text-[#EB6426] flex-shrink-0" />
            <p className="text-sm text-orange-800 text-left">
              We typically respond within 24 hours. Keep an eye on your WhatsApp!
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-[#EB6426] text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-[#d55a21] transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full border border-gray-200 text-gray-600 py-3.5 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

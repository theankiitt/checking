"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { text } from "stream/consumers";
import { manrope } from "@/app/fonts";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  loading?: boolean;
}

export default function FAQSection({ faqs, loading }: FAQSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-1" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white  overflow-hidden">
      {/* Accordion Header - Clickable Title */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between  lg:p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          <h2 className={`${manrope.className} text-lg lg:text-xl font-bold text-gray-900`}>
           View Frequently Asked Questions
          </h2>
         
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="border-t border-gray-200 divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 lg:p-6">
              <h3 className="text-sm font-semibold text-orange-600 mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

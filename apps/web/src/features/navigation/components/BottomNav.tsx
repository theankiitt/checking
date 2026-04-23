'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ShoppingCart, Grid2x2, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { manrope } from '@/app/fonts';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export default function BottomNav() {
  const pathname = usePathname();
  const { cartItemCount } = useCart();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/categories', label: 'Categories', icon: Grid2x2 },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartItemCount },
  ];

  return (
    <nav
      className={`w-screen max-w-screen fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-3xl flex items-stretch gap-1.5 p-1.5">
        {/* Static Logo Button - Left Side (30% width) */}
        <div className="w-[30%] flex flex-col items-center justify-center py-2 bg-gradient-to-r from-[#EB6426] to-[#F97316] rounded-lg">
          <div className="relative w-full h-8 px-2">
            <Image
              src="/gharsamma-logo.png"
              alt="Gharsamma"
              fill
              width={100}
              height={32}
              className="object-contain brightness-0 invert "
            />
          </div>
        </div>

        {/* Navigation Items (70% width) */}
        <div className="flex-1 flex items-stretch bg-gray-50 rounded-xl">
          {items.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center py-1 text-xs"
              >
                <div className="relative flex items-center justify-center w-7 h-7">
                  <Icon className={`w-6 h-6 ${active ? 'text-[#EB6426]' : 'text-gray-600'}`} />
                  {typeof badge === 'number' && badge > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-[#EB6426] text-white rounded-xl px-1.5 py-0.5">
                      {badge}
                    </span>
                  )}
                </div>
                <span className={`mt-0.5 text-sm  ${active ? 'text-[#EB6426] font-bold' : 'text-gray-800 font-bold'}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { Home, ShoppingCart, Grid2x2, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { manrope } from '@/app/fonts';
import { useCart } from '@/contexts/CartContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { cartItemCount } = useCart();

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/categories', label: 'Categories', icon: Grid2x2 },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartItemCount },
  ];

  return (
    <nav className="w-screen max-w-screen fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden">
      <div className="mx-auto max-w-3xl flex items-stretch gap-1.5 p-1.5">
        {/* Static For You Button - Left Side (30% width) */}
        <div className="w-[30%] flex flex-col items-center justify-center py-1 bg-gradient-to-r from-[#EB6426] to-[#F97316] rounded-lg">
          <div className="flex items-center justify-center w-6 h-6">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="mt-0.5 text-sm font-bold text-white">For You</span>
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
                    <span className="absolute -top-1 -right-1 text-[10px] bg-[#622A1F] text-white rounded-xl px-1.5 py-0.5">
                      {badge}
                    </span>
                  )}
                </div>
                <span className={`mt-0.5 text-sm ${manrope.className} ${active ? 'text-[#EB6426] font-bold' : 'text-gray-600 font-bold'}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

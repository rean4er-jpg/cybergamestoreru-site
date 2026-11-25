import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

export type AppRoute =
  | 'home'
  | 'catalog'
  | 'delivery'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contacts';

interface HeaderProps {
  activeRoute: AppRoute;
  cartCount: number;
  onNavigate: (route: AppRoute, sectionId?: string) => void;
  onSelectPlatform: (platform: 'all' | 'xbox' | 'ps') => void;
  onOpenCart: () => void;
}

export function Header({
  activeRoute,
  cartCount,
  onNavigate,
  onSelectPlatform,
  onOpenCart,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (route: AppRoute, platform?: 'all' | 'xbox' | 'ps') => {
    setMobileMenuOpen(false);
    if (platform) {
      onSelectPlatform(platform);
    }
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-black text-white border-b border-neutral-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home', 'all');
          }}
          className="text-xl font-bold tracking-tight text-white hover:text-[#52c44c] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#52c44c] focus-visible:outline-offset-4 rounded-sm"
        >
          CyberGameStore
        </a>

        {/* Zone 2: 5 concise single-line nav links matching original menu */}
        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-200"
        >
          <a
            href="#xbox"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('catalog', 'xbox');
            }}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#52c44c] hover:underline underline-offset-4"
          >
            Игры Xbox
          </a>
          <a
            href="#playstation"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('catalog', 'ps');
            }}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#52c44c] hover:underline underline-offset-4"
          >
            Игры PlayStation
          </a>
          <a
            href="#delivery"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('delivery');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#52c44c] hover:underline underline-offset-4 ${
              activeRoute === 'delivery' ? 'text-[#52c44c] underline' : ''
            }`}
          >
            Оплата и доставка
          </a>
          <a
            href="#contacts"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('contacts');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#52c44c] hover:underline underline-offset-4 ${
              activeRoute === 'contacts' ? 'text-[#52c44c] underline' : ''
            }`}
          >
            Контакты
          </a>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('about');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#52c44c] hover:underline underline-offset-4 ${
              activeRoute === 'about' || activeRoute === 'privacy' || activeRoute === 'terms'
                ? 'text-[#52c44c] underline'
                : ''
            }`}
          >
            О магазине
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2} />
            <span className="tabular-nums">Корзина{cartCount > 0 ? ` (${cartCount})` : ''}</span>
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-700 text-white hover:bg-neutral-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <nav
          aria-label="Мобильное меню"
          className="md:hidden border-t border-neutral-800 bg-black px-4 py-3 flex flex-col gap-1"
        >
          <button
            type="button"
            onClick={() => handleLinkClick('catalog', 'xbox')}
            className="text-left px-3 py-2.5 text-sm font-medium text-neutral-100 rounded-lg hover:bg-neutral-900 cursor-pointer"
          >
            Игры Xbox
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('catalog', 'ps')}
            className="text-left px-3 py-2.5 text-sm font-medium text-neutral-100 rounded-lg hover:bg-neutral-900 cursor-pointer"
          >
            Игры PlayStation
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('delivery')}
            className="text-left px-3 py-2.5 text-sm font-medium text-neutral-100 rounded-lg hover:bg-neutral-900 cursor-pointer"
          >
            Оплата и доставка
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('contacts')}
            className="text-left px-3 py-2.5 text-sm font-medium text-neutral-100 rounded-lg hover:bg-neutral-900 cursor-pointer"
          >
            Контакты
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('about')}
            className="text-left px-3 py-2.5 text-sm font-medium text-neutral-100 rounded-lg hover:bg-neutral-900 cursor-pointer"
          >
            О магазине и документы
          </button>
        </nav>
      )}
    </header>
  );
}

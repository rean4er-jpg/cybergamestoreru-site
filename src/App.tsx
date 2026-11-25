import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Search,
  ShoppingBag,
  Star,
} from 'lucide-react';
import {
  FAQ_ITEMS,
  STORE_PRODUCTS,
  type PlatformFilter,
  type ProductVariant,
  type StoreProduct,
} from './data/storeData';
import { Header, type AppRoute } from './components/Header';
import { ResilientImage } from './components/ResilientImage';
import { ProductModal } from './components/ProductModal';
import { LegalViews } from './components/LegalViews';
import { CartDrawer, type CartItem } from './components/CartDrawer';
import { PaymentModal, type OrderReceipt } from './components/PaymentModal';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [activeProduct, setActiveProduct] = useState<StoreProduct | null>(null);

  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedTitle, setLastAddedTitle] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const token = params.get('token');
    if (!orderId || !token) return;

    fetch(`/api/orders/${encodeURIComponent(orderId)}?token=${encodeURIComponent(token)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((order: OrderReceipt | null) => {
        if (order) {
          setActiveOrder({ ...order, accessToken: token });
          if (order.status === 'paid') {
            setCartItems([]);
          }
        }
      })
      .catch(() => {
        // Ignore network error on return URL sync
      })
      .finally(() => {
        window.history.replaceState({}, '', window.location.pathname);
      });
  }, []);

  const handleNavigate = (nextRoute: AppRoute, sectionId?: string) => {
    setRoute(nextRoute);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product: StoreProduct, variant: ProductVariant) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
    setLastAddedTitle(`${product.title} — ${variant.label}`);
    setCartOpen(true);
  };

  const handleUpdateQty = (variantId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.variant.id === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (variantId: string) => {
    setCartItems((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = STORE_PRODUCTS.filter((product) => {
      const matchesFilter =
        platformFilter === 'all' ||
        (platformFilter === 'ps' && product.platformGroup === 'ps') ||
        (platformFilter === 'xbox' && product.platformGroup === 'xbox');

      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.genre.toLowerCase().includes(query) ||
        product.platformLabel.toLowerCase().includes(query);

      return matchesFilter && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort(
        (a, b) =>
          Math.min(...a.variants.map((v) => v.priceRub)) -
          Math.min(...b.variants.map((v) => v.priceRub))
      );
    }
    if (sortBy === 'price-desc') {
      return [...list].sort(
        (a, b) =>
          Math.min(...b.variants.map((v) => v.priceRub)) -
          Math.min(...a.variants.map((v) => v.priceRub))
      );
    }
    return list;
  }, [platformFilter, searchQuery, sortBy]);

  const filterTabs: { id: PlatformFilter; label: string }[] = [
    { id: 'all', label: 'Все игры' },
    { id: 'xbox', label: 'Игры Xbox' },
    { id: 'ps', label: 'Игры PlayStation' },
  ];

  const renderTrustBadgeCard = () => (
    <div className="bg-[#373737] text-white rounded-lg p-4 border border-neutral-700 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-sm tracking-tight">CyberGameStore</span>
        <span className="text-xs font-mono text-[#52c44c] font-semibold tabular-nums">
          5.00 / 5
        </span>
      </div>
      <div className="flex items-center gap-1" aria-label="Рейтинг 5 из 5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
        <span className="text-xs text-neutral-300 ml-1.5 tabular-nums">1 484 отзыва</span>
      </div>
      <p className="text-xs text-neutral-300 leading-relaxed">
        Игры для Xbox и PlayStation на турецкие аккаунты · Официальная покупка
      </p>
    </div>
  );

  const renderCatalogWithSidebar = (standalone: boolean) => (
    <section
      id="catalog-section"
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              {standalone ? (
                <h1 className="text-2xl sm:text-3xl font-bold italic text-neutral-900">
                  {platformFilter === 'xbox'
                    ? 'Игры для Xbox (Турция)'
                    : platformFilter === 'ps'
                      ? 'Игры для PlayStation (Турция)'
                      : 'Каталог игр: Xbox и PlayStation'}
                </h1>
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold italic text-neutral-900">
                  Популярное:
                </h2>
              )}
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Только официальная покупка на турецкие аккаунты без аренды профилей
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Сортировка игр"
              className="px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none focus:border-[#52c44c] cursor-pointer w-fit"
            >
              <option value="featured">По популярности</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </div>

          {/* Mobile / Quick Platform Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-200/70 rounded-lg w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPlatformFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  platformFilter === tab.id
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center space-y-3">
              <p className="text-base font-semibold text-neutral-900">
                По вашему запросу ничего не найдено
              </p>
              <p className="text-sm text-neutral-500">
                Попробуйте сбросить фильтр платформы или изменить поисковую фразу.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPlatformFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#52c44c] rounded-lg hover:bg-[#44ad3f] transition-colors cursor-pointer"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const defaultVariant = product.variants[0];
                return (
                  <article
                    key={product.id}
                    className="group bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#52c44c]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                      <button
                        type="button"
                        onClick={() => setActiveProduct(product)}
                        className="w-full h-full block text-left cursor-pointer"
                      >
                        <ResilientImage
                          src={product.image}
                          alt={product.title}
                          title={product.title}
                          fallbackTone={product.fallbackTone}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </button>
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[11px] font-bold text-black bg-[#52c44c] rounded-md tabular-nums">
                        Скидка -{defaultVariant.discountPercent}%
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between gap-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <span>{product.platformLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>Турция</span>
                        </div>

                        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug">
                          <button
                            type="button"
                            onClick={() => setActiveProduct(product)}
                            className="text-left hover:text-[#52c44c] transition-colors cursor-pointer"
                          >
                            {product.title}
                          </button>
                        </h3>

                        <div
                          className="flex items-center gap-0.5 pt-0.5"
                          aria-label={`Оценка ${product.rating.toFixed(2)} из 5`}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs text-neutral-500 ml-1.5 tabular-nums">
                            {product.rating.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs text-neutral-400 line-through block tabular-nums">
                            {defaultVariant.oldPriceRub.toLocaleString('ru-RU')} ₽
                          </span>
                          <span className="font-mono text-base font-bold text-neutral-900 tabular-nums">
                            {defaultVariant.priceRub.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(product, defaultVariant)}
                          aria-label={`Добавить ${product.title} в корзину`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>В корзину</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar matching #secondary in original theme (3 cols) */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
          {/* Search box */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-bold italic text-neutral-900">Поиск по сайту</div>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Найти игру..."
                aria-label="Поиск товаров"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#e5e5e5]/70 border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:bg-white focus:border-[#52c44c]"
              />
            </div>
          </div>

          {/* Categories Widget */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-bold italic text-neutral-900 pb-2 border-b border-neutral-100">
              Категории товаров
            </div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setPlatformFilter('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                    platformFilter === 'all'
                      ? 'bg-[#52c44c]/15 text-neutral-900 font-semibold'
                      : 'text-neutral-700 hover:text-[#52c44c]'
                  }`}
                >
                  Все игры (Турция)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setPlatformFilter('xbox')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                    platformFilter === 'xbox'
                      ? 'bg-[#52c44c]/15 text-neutral-900 font-semibold'
                      : 'text-neutral-700 hover:text-[#52c44c]'
                  }`}
                >
                  Игры Xbox
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setPlatformFilter('ps')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                    platformFilter === 'ps'
                      ? 'bg-[#52c44c]/15 text-neutral-900 font-semibold'
                      : 'text-neutral-700 hover:text-[#52c44c]'
                  }`}
                >
                  Игры PlayStation
                </button>
              </li>
              <li className="pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleNavigate('delivery')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-neutral-700 hover:text-[#52c44c] cursor-pointer"
                >
                  Оплата и доставка
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('contacts')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-neutral-700 hover:text-[#52c44c] cursor-pointer"
                >
                  Контакты
                </button>
              </li>
            </ul>
          </div>

          {/* Store Rating Badge */}
          {renderTrustBadgeCard()}

          {/* Quick Telegram Support */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-2.5">
            <div className="text-sm font-bold italic text-neutral-900">Связь в Telegram</div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Поможем с выбором игры или созданием турецкого аккаунта.
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs font-semibold">
              <a
                href="https://t.me/GyberGameStore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3.5 py-2 text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-md transition-colors"
              >
                Написать менеджеру (@GyberGameStore)
              </a>
              <a
                href="https://t.me/cyber_game_store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3.5 py-2 text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
              >
                Канал скидок (@cyber_game_store)
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8] text-[#1a1a1a]">
      <Header
        activeRoute={route}
        cartCount={cartCount}
        onNavigate={handleNavigate}
        onSelectPlatform={(platform) => setPlatformFilter(platform)}
        onOpenCart={() => setCartOpen(true)}
      />

      {lastAddedTitle && !cartOpen && (
        <div className="bg-[#141414] text-white text-xs py-2 px-4 text-center border-b border-neutral-800">
          <span className="text-neutral-300">Добавлено в корзину: {lastAddedTitle}.</span>{' '}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="text-[#52c44c] underline font-semibold ml-1 hover:text-white cursor-pointer"
          >
            Открыть корзину
          </button>
        </div>
      )}

      {route === 'home' && (
        <main className="flex-1">
          {/* Compact Storefront Intro Banner (Black & Green brand bar) */}
          <section className="bg-[#111111] text-white border-b border-neutral-800">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#52c44c]">
                  Xbox Series X|S · PlayStation 5 / PS4 · Турецкие аккаунты
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold italic text-white leading-tight">
                  Игры для Xbox и PlayStation по выгодным ценам
                </h1>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Официальная покупка игр в турецком магазине на ваш личный аккаунт за 5–15 минут.
                  Запускайте игры и получайте достижения на основном российском профиле.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNavigate('delivery')}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Оплата и доставка
                </button>
                <a
                  href="https://t.me/GyberGameStore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-sm font-semibold text-white border border-neutral-700 hover:border-[#52c44c] hover:text-[#52c44c] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Написать в Telegram
                </a>
              </div>
            </div>
          </section>

          {/* Main 2-column Storefront + Right Sidebar */}
          {renderCatalogWithSidebar(false)}

          {/* How It Works + FAQ Section */}
          <section className="bg-white border-t border-neutral-200 py-12 sm:py-14">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#F5F6F8] border border-neutral-200 rounded-lg p-5 space-y-2">
                  <div className="font-mono text-xs font-semibold text-[#52c44c]">01. Выбор</div>
                  <h2 className="text-lg font-bold italic text-neutral-900">
                    Выберите игру на турецкий аккаунт
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Добавьте игру для PlayStation или Xbox в корзину. Если турецкого профиля ещё
                    нет — бесплатно поможем зарегистрировать его на вашу почту.
                  </p>
                </div>

                <div className="bg-[#F5F6F8] border border-neutral-200 rounded-lg p-5 space-y-2">
                  <div className="font-mono text-xs font-semibold text-[#52c44c]">02. Оплата</div>
                  <h2 className="text-lg font-bold italic text-neutral-900">
                    Официальная покупка за 5–15 минут
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Менеджер покупает игру напрямую в турецком PlayStation Store или Microsoft Store
                    на ваш личный аккаунт без аренды и общих профилей.
                  </p>
                </div>

                <div className="bg-[#F5F6F8] border border-neutral-200 rounded-lg p-5 space-y-2">
                  <div className="font-mono text-xs font-semibold text-[#52c44c]">03. Игра</div>
                  <h2 className="text-lg font-bold italic text-neutral-900">
                    Запуск с основного профиля
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Включите общий доступ на консоли и запускайте купленные игры со своего
                    основного российского аккаунта с сохранением всех достижений.
                  </p>
                </div>
              </div>

              <div id="faq-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <h2 className="text-2xl font-bold italic text-neutral-900">
                    Вопросы покупателей
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Подробно отвечаем на частые вопросы о покупке игр на турецкие аккаунты Xbox и
                    PlayStation.
                  </p>
                  <a
                    href="https://t.me/GyberGameStore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#52c44c] hover:underline"
                  >
                    <span>Написать в Telegram (@GyberGameStore)</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="lg:col-span-8 divide-y divide-neutral-200 border border-neutral-200 rounded-lg overflow-hidden bg-white">
                  {FAQ_ITEMS.map((item) => {
                    const isOpen = openFaqId === item.id;
                    return (
                      <div key={item.id}>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          <span className="text-sm sm:text-base font-semibold text-neutral-900">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {route === 'catalog' && <main className="flex-1">{renderCatalogWithSidebar(true)}</main>}

      {(route === 'delivery' ||
        route === 'about' ||
        route === 'privacy' ||
        route === 'terms' ||
        route === 'contacts') && (
        <div className="flex-1">
          <LegalViews route={route} onNavigate={handleNavigate} />
        </div>
      )}

      {/* Original Black 4-Column CyberGameStore Footer */}
      <footer className="bg-black text-white border-t border-neutral-800 mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-10 border-b border-neutral-800">
            {/* Col 1: Trust Badge */}
            <div className="space-y-3">
              <div className="text-sm font-bold italic text-white">В наличии игры</div>
              {renderTrustBadgeCard()}
            </div>

            {/* Col 3: Customer links */}
            <div className="space-y-3">
              <div className="text-sm font-bold italic text-white">Покупателю</div>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className="hover:text-[#52c44c] transition-colors cursor-pointer"
                  >
                    Домашняя страница
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('delivery')}
                    className="hover:text-[#52c44c] transition-colors cursor-pointer"
                  >
                    Оплата и доставка
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('privacy')}
                    className="hover:text-[#52c44c] transition-colors cursor-pointer"
                  >
                    Политика конфиденциальности
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('terms')}
                    className="hover:text-[#52c44c] transition-colors cursor-pointer"
                  >
                    Правовая информация
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.avito.ru/user/4593425aa2be258d60d2767c806a7cbd/profile?src=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#52c44c] transition-colors"
                  >
                    Отзывы на Avito
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.wildberries.ru/seller/624826"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#52c44c] transition-colors"
                  >
                    Отзывы на Wildberries
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Contacts & Legal details */}
            <div className="space-y-2.5 text-sm text-neutral-300">
              <div className="text-sm font-bold italic text-white">Контакты</div>
              <div>
                <a
                  href="mailto:info@cybergamestore.ru"
                  className="hover:text-[#52c44c] transition-colors"
                >
                  info@cybergamestore.ru
                </a>
              </div>
              <div>
                Менеджер Telegram:{' '}
                <a
                  href="https://t.me/GyberGameStore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#52c44c] hover:underline"
                >
                  @GyberGameStore
                </a>
              </div>
              <div>
                Канал скидок:{' '}
                <a
                  href="https://t.me/cyber_game_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#52c44c] hover:underline"
                >
                  @cyber_game_store
                </a>
              </div>
              <div>
                VK:{' '}
                <a
                  href="https://vk.com/cyber_game_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#52c44c] transition-colors"
                >
                  vk.com/cyber_game_store
                </a>
              </div>
              <div className="font-mono text-xs text-neutral-300">
                Телефон:{' '}
                <a href="tel:+79969249761" className="hover:text-[#52c44c] transition-colors">
                  +7 (996) 924-97-61
                </a>
              </div>
              <div className="text-xs text-neutral-400 pt-1">
                ИНН 245731461374 · ОГРНИП 322774600008543
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <div>© 2026 CyberGameStore (cybergamestore.ru)</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2 py-0.5 rounded-sm bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                Т-Банк Эквайринг
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                СБП
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                Мир
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                Visa / Mastercard
              </span>
            </div>
          </div>
        </div>
      </footer>

      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onOpenPaymentModal={(order) => setActiveOrder(order)}
      />

      <PaymentModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        onOrderUpdated={(updated) => {
          setActiveOrder(updated);
          if (updated.status === 'paid') {
            setCartItems([]);
          }
        }}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Star, X } from 'lucide-react';
import type { ProductVariant, StoreProduct } from '../data/storeData';
import { ResilientImage } from './ResilientImage';

interface ProductModalProps {
  product: StoreProduct | null;
  onClose: () => void;
  onAddToCart: (product: StoreProduct, variant: ProductVariant) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'activation'>('overview');

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
      setActiveTab('overview');
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white sm:rounded-xl border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-black text-white">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
            <span>{product.platformLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.genre}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#52c44c]">Турецкий аккаунт</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть карточку игры"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 space-y-5">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200">
                <ResilientImage
                  src={product.image}
                  alt={product.title}
                  title={product.title}
                  fallbackTone={product.fallbackTone}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg w-fit mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Описание и язык
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('activation')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'activation'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Как проходит покупка
                  </button>
                </div>

                {activeTab === 'overview' ? (
                  <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
                    <p>{product.fullDescription}</p>
                    <div className="pt-2 border-t border-neutral-200 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-neutral-500 block">Язык и субтитры</span>
                        <span className="font-semibold text-neutral-900">{product.language}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Оценка покупателей</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {product.rating.toFixed(2)} / 5
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ol className="space-y-2.5 text-sm text-neutral-700 list-decimal list-inside">
                    {product.activationSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>

            <div className="md:col-span-6 bg-neutral-50 border border-neutral-200 rounded-lg p-6 space-y-5">
              <div>
                <h2
                  id="pdp-title"
                  className="text-2xl font-bold italic text-neutral-900 leading-tight"
                >
                  {product.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                  Выберите издание (регион аккаунта: Турция)
                </span>
                <div className="space-y-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#52c44c] ring-1 ring-[#52c44c]'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div>
                          <span className="text-sm font-semibold text-neutral-900 block">
                            {variant.label}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {variant.editionNote} · Скидка -{variant.discountPercent}%
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs text-neutral-400 line-through block tabular-nums">
                            {variant.oldPriceRub.toLocaleString('ru-RU')} ₽
                          </span>
                          <span className="font-mono text-sm font-bold text-neutral-900 tabular-nums">
                            {variant.priceRub.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-neutral-500 block">Цена со скидкой</span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-2xl font-bold text-neutral-900 tabular-nums">
                      {selectedVariant.priceRub.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="font-mono text-sm text-neutral-400 line-through tabular-nums">
                      {selectedVariant.oldPriceRub.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-[#52c44c]" />
                  <span>{selectedVariant.inStock ? 'В наличии' : 'Под заказ'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, selectedVariant);
                  onClose();
                }}
                className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#52c44c] focus-visible:outline-offset-2"
              >
                В корзину
              </button>

              <div className="flex items-start gap-2.5 text-xs text-neutral-600 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#52c44c] shrink-0 mt-0.5" />
                <span>
                  Официальная покупка на ваш личный турецкий аккаунт. Если профиля ещё нет —
                  бесплатно поможем создать на вашу почту.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

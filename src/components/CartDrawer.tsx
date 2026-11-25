import { useEffect, useState, type FormEvent } from 'react';
import {
  CreditCard,
  ExternalLink,
  Loader2,
  Minus,
  Plus,
  QrCode,
  RefreshCw,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import type { ProductVariant, StoreProduct } from '../data/storeData';
import {
  isTrustedPaymentUrl,
  type OrderReceipt,
  type PaymentMethodId,
} from './PaymentModal';

export interface CartItem {
  product: StoreProduct;
  variant: ProductVariant;
  quantity: number;
}

interface PaymentConfigResponse {
  activeProvider: 'tbank' | 'sandbox';
  providerLabel: string;
  isSandbox: boolean;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onClearCart: () => void;
  onOpenPaymentModal: (order: OrderReceipt) => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenPaymentModal,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [accountStatus, setAccountStatus] = useState('Есть свой турецкий аккаунт');
  const [turkAccountEmail, setTurkAccountEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('sbp');

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfigResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingLiveOrder, setPendingLiveOrder] = useState<OrderReceipt | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    if (!isOpen || paymentConfig) return;
    let active = true;
    fetch('/api/payments/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PaymentConfigResponse | null) => {
        if (active && data) setPaymentConfig(data);
      })
      .catch(() => {
        // Fallback silently if config endpoint is temporarily unreachable
      });
    return () => {
      active = false;
    };
  }, [isOpen, paymentConfig]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.variant.priceRub * item.quantity, 0);

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customerName.trim() || !contact.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            quantity: item.quantity,
          })),
          customerName: customerName.trim(),
          contact: contact.trim(),
          accountStatus,
          turkAccountEmail: turkAccountEmail.trim() || undefined,
          paymentMethod,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        mode?: 'sandbox' | 'live';
        provider?: OrderReceipt['provider'];
        orderId?: string;
        accessToken?: string;
        amountRub?: number;
        paymentMethod?: PaymentMethodId;
        confirmationUrl?: string;
        sbpQrPayload?: string;
        items?: OrderReceipt['items'];
      };

      if (!response.ok || !data.orderId || !data.accessToken) {
        setErrorMessage(data.error || 'Не удалось создать платёж. Попробуйте ещё раз.');
        return;
      }

      const createdOrder: OrderReceipt = {
        id: data.orderId,
        accessToken: data.accessToken,
        status: 'pending',
        provider: data.provider || 'sandbox',
        paymentMethod: data.paymentMethod || paymentMethod,
        amountRub: data.amountRub ?? subtotal,
        items: data.items || [],
        customerName: customerName.trim(),
        accountStatus,
        confirmationUrl: data.confirmationUrl,
        sbpQrPayload: data.sbpQrPayload,
        createdAt: new Date().toISOString(),
      };

      if (data.mode === 'sandbox') {
        onClose();
        onOpenPaymentModal(createdOrder);
      } else {
        setPendingLiveOrder(createdOrder);
      }
    } catch {
      setErrorMessage(
        'Ошибка соединения с сервером оплаты. Попробуйте позже или напишите в Telegram.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckLiveOrderStatus = async () => {
    if (!pendingLiveOrder?.accessToken || checkingStatus) return;
    setCheckingStatus(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(pendingLiveOrder.id)}?token=${encodeURIComponent(pendingLiveOrder.accessToken)}`
      );
      const data = (await res.json()) as OrderReceipt & { error?: string };
      if (!res.ok) {
        setErrorMessage(data.error || 'Не удалось проверить статус заказа.');
        return;
      }
      const updated = { ...data, accessToken: pendingLiveOrder.accessToken };
      setPendingLiveOrder(updated);
      if (updated.status === 'paid') {
        onClearCart();
        setPendingLiveOrder(null);
        onClose();
        onOpenPaymentModal(updated);
      }
    } catch {
      setErrorMessage('Не удалось связаться с сервером для проверки оплаты.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const methods: {
    id: PaymentMethodId;
    label: string;
    sublabel: string;
    icon: typeof QrCode;
  }[] = [
    { id: 'sbp', label: 'СБП (QR / Банк)', sublabel: 'Без комиссии через Т-Банк', icon: QrCode },
    { id: 'card', label: 'Банковская карта', sublabel: 'Мир, Visa, Mastercard (РФ)', icon: CreditCard },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Корзина заказа"
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full border-l border-neutral-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#52c44c]" />
            <h2 className="text-xl font-bold italic">Корзина</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setPendingLiveOrder(null);
              setErrorMessage(null);
              onClose();
            }}
            aria-label="Закрыть корзину"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {pendingLiveOrder ? (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <div className="text-xs font-mono text-neutral-500">Заказ #{pendingLiveOrder.id}</div>
                <h3 className="text-lg font-bold italic text-neutral-900 mt-0.5">
                  Счёт Т-Банк на {pendingLiveOrder.amountRub.toLocaleString('ru-RU')} ₽ готов
                </h3>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Откройте платёжную форму Т-Банк Эквайринг для оплаты картой или по СБП. После
                оплаты нажмите «Проверить статус».
              </p>

              {isTrustedPaymentUrl(pendingLiveOrder.sbpQrPayload) && (
                <a
                  href={pendingLiveOrder.sbpQrPayload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-lg transition-colors"
                >
                  <span>Оплатить по СБП ({pendingLiveOrder.amountRub.toLocaleString('ru-RU')} ₽)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {isTrustedPaymentUrl(pendingLiveOrder.confirmationUrl) && (
                <a
                  href={pendingLiveOrder.confirmationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg transition-colors ${
                    isTrustedPaymentUrl(pendingLiveOrder.sbpQrPayload)
                      ? 'text-white bg-black hover:bg-neutral-800'
                      : 'text-white bg-[#52c44c] hover:bg-[#44ad3f]'
                  }`}
                >
                  <span>
                    Перейти на форму оплаты Т-Банк (
                    {pendingLiveOrder.amountRub.toLocaleString('ru-RU')} ₽)
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={handleCheckLiveOrderStatus}
                disabled={checkingStatus}
                className="w-full py-2.5 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-neutral-800 bg-neutral-200 hover:bg-neutral-300 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${checkingStatus ? 'animate-spin' : ''}`} />
                <span>{checkingStatus ? 'Проверяем оплату...' : 'Я оплатил — проверить статус'}</span>
              </button>

              {pendingLiveOrder.status === 'pending' && (
                <div className="text-xs text-neutral-500 text-center">
                  Текущий статус: ожидает оплаты в Т-Банке
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="button"
                onClick={() => setPendingLiveOrder(null)}
                className="w-full py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                Изменить способ оплаты или состав заказа
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" strokeWidth={1.5} />
              <p className="text-base font-semibold text-neutral-900">Корзина пока пуста</p>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                Выберите игру для PlayStation или Xbox на турецкий аккаунт, чтобы оформить заказ.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="divide-y divide-neutral-200">
                {items.map((item) => (
                  <div key={item.variant.id} className="py-4 first:pt-0 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-neutral-500">{item.product.platformLabel}</div>
                        <div className="text-sm font-semibold text-neutral-900">
                          {item.product.title}
                        </div>
                        <div className="text-xs text-neutral-600 mt-0.5">{item.variant.label}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.variant.id)}
                        aria-label={`Удалить ${item.product.title}`}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.variant.id, -1)}
                          aria-label="Уменьшить количество"
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold tabular-nums text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.variant.id, 1)}
                          aria-label="Увеличить количество"
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-neutral-900 tabular-nums">
                        {(item.variant.priceRub * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCheckout} className="pt-5 border-t border-neutral-200 space-y-3.5">
                <h3 className="text-sm font-semibold italic text-neutral-900">
                  Оформление на турецкий аккаунт
                </h3>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-[#52c44c]"
                />
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Telegram (@username) или Email"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-[#52c44c]"
                />
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(e.target.value)}
                  aria-label="Наличие турецкого аккаунта"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg bg-white text-neutral-700 focus:outline-none focus:border-[#52c44c]"
                >
                  <option value="Есть свой турецкий аккаунт">Есть свой турецкий аккаунт</option>
                  <option value="Нужно помочь создать турецкий аккаунт">
                    Нужно помочь создать турецкий аккаунт
                  </option>
                </select>
                {accountStatus === 'Есть свой турецкий аккаунт' && (
                  <input
                    type="text"
                    value={turkAccountEmail}
                    onChange={(e) => setTurkAccountEmail(e.target.value)}
                    placeholder="Почта турецкого аккаунта (необязательно)"
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-[#52c44c]"
                  />
                )}

                <div className="pt-1 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span>Способ оплаты</span>
                    {paymentConfig && (
                      <span className="text-[11px] font-normal text-neutral-500">
                        {paymentConfig.isSandbox
                          ? 'Т-Банк (тестовый режим)'
                          : paymentConfig.providerLabel}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {methods.map((method) => {
                      const Icon = method.icon;
                      const selected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                            selected
                              ? 'border-[#52c44c] bg-[#52c44c]/10 text-neutral-900'
                              : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 mb-1.5 ${
                              selected ? 'text-[#52c44c]' : 'text-neutral-500'
                            }`}
                          />
                          <div className="text-xs font-semibold leading-tight">{method.label}</div>
                          <div className="text-[10px] text-neutral-500 leading-tight mt-0.5">
                            {method.sublabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-base font-bold text-neutral-900">
                  <span>Итого к оплате</span>
                  <span className="font-mono tabular-nums">
                    {subtotal.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {isSubmitting
                      ? 'Создаём счёт в Т-Банке...'
                      : `Оплатить (${subtotal.toLocaleString('ru-RU')} ₽)`}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

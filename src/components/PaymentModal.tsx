import { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  ExternalLink,
  QrCode,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';

export type PaymentMethodId = 'sbp' | 'card';

export interface OrderReceiptItem {
  productId: string;
  variantId: string;
  title: string;
  platformLabel: string;
  variantLabel: string;
  unitPriceRub: number;
  quantity: number;
}

export interface OrderReceipt {
  id: string;
  accessToken?: string;
  status: 'pending' | 'paid' | 'cancelled';
  provider: 'tbank' | 'sandbox';
  paymentMethod: PaymentMethodId;
  amountRub: number;
  items: OrderReceiptItem[];
  customerName: string;
  accountStatus: string;
  confirmationUrl?: string;
  sbpQrPayload?: string;
  createdAt: string;
  paidAt?: string;
}

interface PaymentModalProps {
  order: OrderReceipt | null;
  onClose: () => void;
  onOrderUpdated: (updated: OrderReceipt) => void;
}

export function isTrustedPaymentUrl(rawUrl?: string): boolean {
  if (!rawUrl) return false;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'tinkoff.ru' ||
      host.endsWith('.tinkoff.ru') ||
      host === 'tbank.ru' ||
      host.endsWith('.tbank.ru') ||
      host === 'linksecurepayment.com' ||
      host.endsWith('.linksecurepayment.com') ||
      host === 'qr.nspk.ru'
    );
  } catch {
    return false;
  }
}

export function PaymentModal({ order, onClose, onOrderUpdated }: PaymentModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!order) return null;

  const handleSandboxAction = async (action: 'confirm' | 'cancel') => {
    if (!order.accessToken) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/payments/sandbox/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          accessToken: order.accessToken,
          action,
        }),
      });
      const data = (await response.json()) as OrderReceipt & { error?: string };
      if (!response.ok) {
        setErrorMessage(data.error || 'Не удалось обработать платёж.');
        return;
      }
      onOrderUpdated({ ...data, accessToken: order.accessToken });
    } catch {
      setErrorMessage('Ошибка соединения с сервером. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const telegramMessage = encodeURIComponent(
    `Здравствуйте! Оплатил заказ ${order.id} на сумму ${order.amountRub} ₽.\nИгры: ${order.items
      .map((i) => `${i.title} (${i.quantity} шт.)`)
      .join(', ')}.\nАккаунт: ${order.accountStatus}`
  );

  const methodTitle =
    order.paymentMethod === 'sbp'
      ? 'Система быстрых платежей (СБП)'
      : 'Банковская карта (Мир / Visa / Mastercard)';

  const MethodIcon = order.paymentMethod === 'sbp' ? QrCode : CreditCard;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Оплата заказа ${order.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl border border-neutral-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#52c44c]" />
            <div>
              <div className="text-base font-bold italic">Оплата заказа #{order.id}</div>
              <div className="text-[11px] text-neutral-400">
                Т-Банк Эквайринг · CyberGameStore
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно оплаты"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {order.status === 'paid' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#52c44c]/10 border border-[#52c44c]/30">
                <CheckCircle2 className="w-6 h-6 text-[#52c44c] shrink-0 mt-0.5" />
                <div>
                  <div className="text-base font-bold text-neutral-900">
                    Оплата прошла успешно!
                  </div>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                    Заказ{' '}
                    <span className="font-mono font-semibold text-neutral-900">{order.id}</span>{' '}
                    оплачен. Нажмите кнопку ниже, чтобы сразу передать номер заказа менеджеру в
                    Telegram — оформление игры занимает 5–15 минут.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Состав заказа</span>
                  <span>{order.accountStatus}</span>
                </div>
                <div className="divide-y divide-neutral-200">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="py-2 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-medium text-neutral-900">{item.title}</div>
                        <div className="text-xs text-neutral-500">
                          {item.variantLabel} × {item.quantity}
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-neutral-900 tabular-nums shrink-0">
                        {(item.unitPriceRub * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between font-bold text-neutral-900">
                  <span>Оплачено</span>
                  <span className="font-mono text-base tabular-nums">
                    {order.amountRub.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <a
                href={`https://t.me/GyberGameStore?text=${telegramMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-lg transition-colors"
              >
                <span>Отправить заказ менеджеру (@GyberGameStore)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              >
                Вернуться в магазин
              </button>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-base font-bold text-neutral-900">Платёж отменён</div>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                    Оплата по заказу {order.id} не была завершена. Вы можете вернуться в корзину и
                    попробовать снова или написать менеджеру в Telegram.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          )}

          {order.status === 'pending' && order.provider === 'sandbox' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold">Тестовый режим терминала:</span> добавьте{' '}
                <code className="font-mono">TBANK_TERMINAL_KEY</code> и{' '}
                <code className="font-mono">TBANK_PASSWORD</code> в настройках окружения, чтобы
                открывалась реальная форма оплаты Т-Банка.
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 space-y-3 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <MethodIcon className="w-4 h-4 text-[#52c44c]" />
                    <span>{methodTitle}</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-neutral-900 tabular-nums">
                    {order.amountRub.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                {order.paymentMethod === 'sbp' ? (
                  <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0">
                      <QrCode className="w-12 h-12 text-[#52c44c]" />
                    </div>
                    <div className="text-xs text-neutral-600 leading-relaxed">
                      <div className="font-semibold text-neutral-900 mb-1">
                        Тестовый QR-код СБП (Т-Банк)
                      </div>
                      Получатель: ИП CyberGameStore (ИНН 245731461374). Нажмите «Подтвердить
                      тестовую оплату», чтобы завершить демо-платёж.
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-lg p-3.5 text-xs text-neutral-600 space-y-1">
                    <div className="font-semibold text-neutral-900">
                      Тестовая карта Мир •••• 4400 (Т-Банк Эквайринг)
                    </div>
                    <div>
                      После ввода ключей терминала здесь откроется защищённая платёжная форма
                      Т-Банка.
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSandboxAction('confirm')}
                  className="flex-1 py-3 px-5 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                >
                  {submitting
                    ? 'Проверка платежа...'
                    : `Подтвердить тестовую оплату (${order.amountRub.toLocaleString('ru-RU')} ₽)`}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSandboxAction('cancel')}
                  className="py-3 px-4 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                >
                  Отменить
                </button>
              </div>
            </div>
          )}

          {order.status === 'pending' && order.provider === 'tbank' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2 text-sm text-neutral-700">
                <div className="font-semibold text-neutral-900">
                  Ожидаем подтверждение оплаты от Т-Банка
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Если вы ещё не завершили оплату на странице Т-Банк Эквайринг, перейдите по
                  ссылке ниже.
                </p>
              </div>
              {isTrustedPaymentUrl(order.sbpQrPayload) && (
                <a
                  href={order.sbpQrPayload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-lg transition-colors"
                >
                  <span>Оплатить через СБП</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {isTrustedPaymentUrl(order.confirmationUrl) && (
                <a
                  href={order.confirmationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <span>Открыть платёжную форму Т-Банк</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

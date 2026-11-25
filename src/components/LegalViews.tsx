import { Mail, MessageSquare, Phone } from 'lucide-react';
import type { AppRoute } from './Header';

interface LegalViewsProps {
  route: 'delivery' | 'about' | 'privacy' | 'terms' | 'contacts';
  onNavigate: (route: AppRoute) => void;
}

export function LegalViews({ route, onNavigate }: LegalViewsProps) {
  const tabs: { id: 'delivery' | 'about' | 'privacy' | 'terms' | 'contacts'; label: string }[] = [
    { id: 'delivery', label: 'Оплата и доставка' },
    { id: 'about', label: 'О магазине' },
    { id: 'privacy', label: 'Политика конфиденциальности' },
    { id: 'terms', label: 'Правовая информация' },
    { id: 'contacts', label: 'Контакты' },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-center gap-1 p-1 bg-neutral-200/70 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              route === tab.id
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {route === 'delivery' && (
        <article className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-10 max-w-4xl space-y-6">
          <div className="text-xs font-medium text-neutral-500">
            Условия оформления · CyberGameStore
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold italic text-neutral-900">
            Оплата и доставка
          </h1>
          <p className="text-base text-neutral-700 leading-relaxed">
            Все игры в магазине CyberGameStore оформляются официально в турецком PlayStation Store
            или Microsoft Xbox Store на ваш личный турецкий аккаунт. Мы не продаём общие аккаунты
            или «аренду».
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-[#52c44c]">01. Оформление</div>
              <h2 className="text-lg font-bold italic text-neutral-900">Выбор игры</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Добавьте нужную игру и издание в корзину, укажите Telegram или Email. Если турецкого
                аккаунта ещё нет, мы бесплатно создадим его на вашу почту.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-[#52c44c]">02. Оплата</div>
              <h2 className="text-lg font-bold italic text-neutral-900">Онлайн-оплата и сроки</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Принимаем оплату онлайн через Т-Банк Эквайринг: СБП и банковские карты Мир / Visa /
                Mastercard. Покупка игры на турецкий аккаунт занимает 5–15 минут (ежедневно с 10:00
                до 23:00 МСК).
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-[#52c44c]">03. Запуск</div>
              <h2 className="text-lg font-bold italic text-neutral-900">Основной профиль</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                После установки игры включите общий доступ на консоли — вы сможете играть, сохранять
                прогресс и получать трофеи на своём основном российском аккаунте.
              </p>
            </div>
          </div>
        </article>
      )}

      {route === 'about' && (
        <article className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-10 max-w-4xl space-y-6">
          <div className="text-xs font-medium text-neutral-500">
            О магазине · CyberGameStore
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold italic text-neutral-900">
            О магазине CyberGameStore
          </h1>
          <p className="text-base text-neutral-700 leading-relaxed">
            CyberGameStore (cybergamestore.ru) — интернет-магазин цифровых игр для консолей
            PlayStation и Xbox на турецкие аккаунты. С 2022 года мы помогаем игрокам из России
            официально приобретать новинки и хиты по выгодным ценам.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-200">
            <div className="space-y-2">
              <h2 className="text-xl font-bold italic text-neutral-900">
                1 484+ подтверждённых отзыва
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Средняя оценка магазина составляет 5.00 из 5. Наши отзывы и витрины также доступны на
                Wildberries и Avito.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold italic text-neutral-900">
                Реквизиты продавца
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                ИНН 245731461374 · ОГРНИП 322774600008543 · Телефон: +7 (996) 924-97-61 · Почта:
                info@cybergamestore.ru
              </p>
            </div>
          </div>
        </article>
      )}

      {route === 'privacy' && (
        <article className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-10 max-w-4xl space-y-6">
          <div className="text-xs font-medium text-neutral-500">
            Актуальная редакция · cybergamestore.ru
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold italic text-neutral-900">
            Политика конфиденциальности и использования файлов Cookie
          </h1>

          <section className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <h2 className="text-xl font-bold italic text-neutral-900">
              1. Какие данные мы собираем
            </h2>
            <p>
              При оформлении заказа на сайте cybergamestore.ru пользователь добровольно передаёт имя,
              контактный адрес электронной почты или идентификатор мессенджера (Telegram) и
              информацию о платформе (Xbox или PlayStation), необходимую исключительно для
              выполнения заказа и технической поддержки.
            </p>
          </section>

          <section className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <h2 className="text-xl font-bold italic text-neutral-900">
              2. Файлы Cookie и рекламные сервисы Google AdSense
            </h2>
            <p>
              На сайте могут использоваться технические файлы cookie для сохранения корзины, а также
              рекламные и аналитические технологии сторонних поставщиков, включая Google AdSense.
            </p>
            <p>
              Компания Google и её партнёры используют файлы cookie (включая файл cookie DoubleClick
              DART) для показа объявлений пользователям на основе их посещений данного и других
              сайтов. Пользователи могут отключить персонализированную рекламу в настройках Google
              Ads Settings или через настройки файлов cookie в браузере.
            </p>
          </section>

          <section className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <h2 className="text-xl font-bold italic text-neutral-900">
              3. Контакты по вопросам данных
            </h2>
            <p>
              По всем вопросам обработки или удаления персональных данных обращайтесь на электронную
              почту info@cybergamestore.ru или по телефону +7 (996) 924-97-61.
            </p>
          </section>
        </article>
      )}

      {route === 'terms' && (
        <article className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-10 max-w-4xl space-y-6">
          <div className="text-xs font-medium text-neutral-500">
            Правовая информация и публичная оферта
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold italic text-neutral-900">
            Правовая информация и правила возврата
          </h1>

          <section className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <h2 className="text-xl font-bold italic text-neutral-900">
              1. Общие положения
            </h2>
            <p>
              Продавец: ИП (ИНН 245731461374, ОГРНИП 322774600008543). Сайт cybergamestore.ru
              осуществляет приём заявок на официальное приобретение цифровых игр для консолей Xbox и
              PlayStation на турецкие аккаунты пользователей.
            </p>
          </section>

          <section className="space-y-3 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <h2 className="text-xl font-bold italic text-neutral-900">
              2. Условия возврата
            </h2>
            <p>
              Покупатель вправе отказаться от заказа и получить полный возврат средств в любой
              момент до фактического проведения покупки игры в турецком магазине на учётную запись.
              При технической ошибке со стороны сервиса возврат 100% суммы производится в течение 24
              часов.
            </p>
          </section>
        </article>
      )}

      {route === 'contacts' && (
        <article className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-10 max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold italic text-neutral-900">Контакты и связь</h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Появились вопросы? Напишите нашему менеджеру в Telegram — поможем подобрать игру,
              проверить наличие русского языка и настроить турецкий аккаунт.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://t.me/GyberGameStore"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-sm font-semibold text-white bg-[#52c44c] hover:bg-[#44ad3f] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Написать в Telegram (@GyberGameStore)
            </a>
            <a
              href="https://t.me/cyber_game_store"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Канал скидок (@cyber_game_store)
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-200 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#52c44c] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 block">Электронная почта</span>
                <a
                  href="mailto:info@cybergamestore.ru"
                  className="text-neutral-600 hover:text-[#52c44c] hover:underline"
                >
                  info@cybergamestore.ru
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#52c44c] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 block">Телефон</span>
                <a
                  href="tel:+79969249761"
                  className="text-neutral-600 font-mono hover:text-[#52c44c] hover:underline"
                >
                  +7 (996) 924-97-61
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-[#52c44c] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 block">ВКонтакте</span>
                <a
                  href="https://vk.com/cyber_game_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-600 hover:text-[#52c44c] hover:underline"
                >
                  vk.com/cyber_game_store
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
            ИНН 245731461374 · ОГРНИП 322774600008543
          </div>
        </article>
      )}
    </main>
  );
}

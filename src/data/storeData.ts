export type PlatformFilter = 'all' | 'xbox' | 'ps';

export interface ProductVariant {
  id: string;
  label: string;
  editionNote: string;
  oldPriceRub: number;
  priceRub: number;
  discountPercent: number;
  deliveryNote: string;
  inStock: boolean;
}

export interface StoreProduct {
  id: string;
  slug: string;
  title: string;
  platformLabel: string;
  platformGroup: 'ps' | 'xbox';
  genre: string;
  releaseYear: string;
  language: string;
  rating: number;
  image: string;
  fallbackTone: string;
  shortDescription: string;
  fullDescription: string;
  activationSteps: string[];
  variants: ProductVariant[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'rdr2-ultimate-xbox',
    slug: 'red-dead-redemption-2-ultimate-edition-xbox',
    title: 'Red Dead Redemption 2: Ultimate Edition [Xbox]',
    platformLabel: 'Xbox Series X|S / Xbox One',
    platformGroup: 'xbox',
    genre: 'Приключения · Открытый мир',
    releaseYear: '2024',
    language: 'Русские субтитры и интерфейс',
    rating: 5.0,
    image: '/src/assets/images/catalog_ps_action_1795245737849.jpg',
    fallbackTone: 'from-zinc-900 to-stone-800',
    shortDescription:
      'Максимальное издание вестерна Rockstar Games с бонусами для сюжета и Red Dead Online на турецкий аккаунт Xbox.',
    fullDescription:
      'Red Dead Redemption 2: Ultimate Edition включает полный сюжетный режим про банду Ван дер Линде, дополнительные задания ограблений и материалы для сетевого режима. Оформляется официально на ваш личный турецкий аккаунт Xbox.',
    activationSteps: [
      'При оформлении заказа укажите данные вашего турецкого аккаунта Xbox или выберите бесплатную помощь с регистрацией нового профиля.',
      'Мы официально оплачиваем игру в турецком Microsoft Store и подтверждаем покупку.',
      'Назначьте турецкий профиль домашней консолью на Xbox и запускайте игру со своего основного российского аккаунта.',
    ],
    variants: [
      {
        id: 'rdr2-ult-xbox-tr',
        label: 'Ultimate Edition · Турецкий аккаунт',
        editionNote: 'Полное издание со всеми бонусами',
        oldPriceRub: 6890,
        priceRub: 1999,
        discountPercent: 71,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'gta5-xbox-series',
    slug: 'gta-5-xbox-series',
    title: 'GTA 5 для Xbox Series X|S [Xbox]',
    platformLabel: 'Xbox Series X|S',
    platformGroup: 'xbox',
    genre: 'Экшен · Открытый мир',
    releaseYear: '2024',
    language: 'Русские субтитры и интерфейс',
    rating: 5.0,
    image: '/src/assets/images/catalog_xbox_racing_1795245738055.jpg',
    fallbackTone: 'from-slate-900 to-zinc-800',
    shortDescription:
      'Обновлённая версия Grand Theft Auto V для нового поколения консолей с 60 FPS и трассировкой лучей на турецкий аккаунт.',
    fullDescription:
      'Улучшенное издание GTA V для Xbox Series X|S с ускоренными загрузками, повышенной детализацией и доступом к GTA Online. Покупается официально на турецкий аккаунт Microsoft без аренды общих профилей.',
    activationSteps: [
      'Оформите заказ в корзине и оставьте контакт (Telegram или Email).',
      'Менеджер оформит игру на ваш турецкий аккаунт Xbox в официальном сторе.',
      'Скачайте игру на консоль и играйте с вашего основного профиля.',
    ],
    variants: [
      {
        id: 'gta5-xsx-tr',
        label: 'Xbox Series X|S Edition · Турецкий аккаунт',
        editionNote: 'Сюжетный режим + GTA Online',
        oldPriceRub: 6990,
        priceRub: 1990,
        discountPercent: 72,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'forza-horizon-5-xbox',
    slug: 'forza-horizon-5-xbox',
    title: 'Forza Horizon 5: Standard Edition [Xbox]',
    platformLabel: 'Xbox Series X|S / Xbox One',
    platformGroup: 'xbox',
    genre: 'Гонки · Открытый мир',
    releaseYear: '2024',
    language: 'Русские субтитры и интерфейс',
    rating: 5.0,
    image: '/src/assets/images/catalog_xbox_racing_1795245738055.jpg',
    fallbackTone: 'from-stone-800 to-slate-900',
    shortDescription:
      'Главный автофестиваль на просторах Мексики с сотнями лицензированных машин и динамической сменой сезонов.',
    fullDescription:
      'Forza Horizon 5 предлагает огромный открытый мир, кооперативные заезды и поддержку 4K / 60 FPS на Xbox Series X. Покупка оформляется официально в турецком Microsoft Store на ваш аккаунт.',
    activationSteps: [
      'Выберите издание игры и добавьте товар в корзину.',
      'Мы покупаем игру на ваш турецкий аккаунт Xbox (или помогаем создать личный турецкий профиль).',
      'Загрузите игру и соревнуйтесь с друзьями с вашего основного аккаунта.',
    ],
    variants: [
      {
        id: 'fh5-std-tr',
        label: 'Standard Edition · Турецкий аккаунт',
        editionNote: 'Базовая версия для Xbox Series X|S и One',
        oldPriceRub: 9990,
        priceRub: 3790,
        discountPercent: 62,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
      {
        id: 'fh5-prem-tr',
        label: 'Premium Edition · Турецкий аккаунт',
        editionNote: 'Игра + VIP + Car Pass + Hot Wheels + Rally Adventure',
        oldPriceRub: 12990,
        priceRub: 5490,
        discountPercent: 58,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'elden-ring-ps-xbox',
    slug: 'elden-ring-ps5-turkey',
    title: 'Elden Ring [PlayStation 5 / PS4]',
    platformLabel: 'PlayStation 5 / PS4',
    platformGroup: 'ps',
    genre: 'Action RPG · Открытый мир',
    releaseYear: '2024',
    language: 'Русские субтитры (Турция)',
    rating: 5.0,
    image: '/src/assets/images/catalog_ps_action_1795245737849.jpg',
    fallbackTone: 'from-slate-900 to-zinc-800',
    shortDescription:
      'Ролевой экшен от FromSoftware и Джорджа Мартина с покупкой напрямую в турецком PlayStation Store.',
    fullDescription:
      'Исследуйте Междуземье, сражайтесь с полубогами и настраивайте уникальный билд персонажа. Игра официально приобретается в турецком PlayStation Store на ваш личный турецкий профиль PSN.',
    activationSteps: [
      'Укажите данные турецкого аккаунта PSN или отметьте в корзине, что требуется регистрация нового аккаунта.',
      'Менеджер проведёт официальную оплату в турецком PS Store и вышлет чек.',
      'Включите «Общий доступ к консоли» и играйте со своего основного российского аккаунта.',
    ],
    variants: [
      {
        id: 'elden-ps-std',
        label: 'Standard Edition · Турецкий аккаунт',
        editionNote: 'Версии для PS4 и PS5',
        oldPriceRub: 9990,
        priceRub: 4690,
        discountPercent: 53,
        deliveryNote: 'Покупка в турецком PS Store · 10–15 мин',
        inStock: true,
      },
      {
        id: 'elden-ps-sote',
        label: 'Shadow of the Erdtree Edition · Турецкий аккаунт',
        editionNote: 'Полная игра + дополнение Shadow of the Erdtree',
        oldPriceRub: 11990,
        priceRub: 6490,
        discountPercent: 46,
        deliveryNote: 'Покупка в турецком PS Store · 10–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'cyberpunk-2077-xbox',
    slug: 'cyberpunk-2077-xbox',
    title: 'Cyberpunk 2077 для Xbox [Xbox]',
    platformLabel: 'Xbox Series X|S / Xbox One',
    platformGroup: 'xbox',
    genre: 'RPG · Киберпанк',
    releaseYear: '2024',
    language: 'Русская озвучка (база) и субтитры',
    rating: 5.0,
    image: '/src/assets/images/catalog_coop_scifi_1795245737517.jpg',
    fallbackTone: 'from-slate-900 to-zinc-900',
    shortDescription:
      'Масштабная ролевая игра в Найт-Сити с патчем нового поколения на турецкий профиль Xbox.',
    fullDescription:
      'Полностью переработанная система прокачки, трассировка лучей на Xbox Series X|S и опциональное расширение Phantom Liberty. Покупается официально на ваш турецкий аккаунт Microsoft.',
    activationSteps: [
      'Выберите базовую версию или Ultimate Edition с дополнением Phantom Liberty.',
      'Мы оформляем игру на ваш турецкий аккаунт Xbox в течение 5–15 минут.',
      'Загружайте игру и запускайте её с любого профиля на вашей домашней консоли.',
    ],
    variants: [
      {
        id: 'cp2077-std',
        label: 'Standard Edition · Турецкий аккаунт',
        editionNote: 'Базовая игра для Xbox',
        oldPriceRub: 6000,
        priceRub: 3490,
        discountPercent: 42,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
      {
        id: 'cp2077-ult',
        label: 'Ultimate Edition · Турецкий аккаунт',
        editionNote: 'Игра + дополнение Phantom Liberty',
        oldPriceRub: 8490,
        priceRub: 4490,
        discountPercent: 47,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'mafia-trilogy-xbox',
    slug: 'mafia-trilogy-xbox',
    title: 'Mafia Trilogy [Xbox]',
    platformLabel: 'Xbox Series X|S / Xbox One',
    platformGroup: 'xbox',
    genre: 'Экшен · Криминальная сага',
    releaseYear: '2024',
    language: 'Полная русская локализация (в 1 и 2 частях)',
    rating: 5.0,
    image: '/src/assets/images/catalog_ps_action_1795245737849.jpg',
    fallbackTone: 'from-zinc-900 to-slate-900',
    shortDescription:
      'Три культовые части криминальной саги, включая полный ремейк первой Mafia: Definitive Edition.',
    fullDescription:
      'Сборник включает Mafia: Definitive Edition, Mafia II: Definitive Edition и Mafia III: Definitive Edition со всеми дополнениями. Оформляется официально на ваш турецкий профиль Xbox.',
    activationSteps: [
      'Оформите заказ через корзину.',
      'Мы приобретаем трилогию на ваш турецкий аккаунт Microsoft.',
      'Скачайте любую из трёх игр на консоль и играйте с основного профиля.',
    ],
    variants: [
      {
        id: 'mafia-trilogy-tr',
        label: 'Trilogy Bundle · Турецкий аккаунт',
        editionNote: 'Все 3 части серии со всеми DLC',
        oldPriceRub: 5490,
        priceRub: 2490,
        discountPercent: 55,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'helldivers-2-ps5',
    slug: 'helldivers-2-ps5',
    title: 'Helldivers 2 [PlayStation 5]',
    platformLabel: 'PlayStation 5',
    platformGroup: 'ps',
    genre: 'Кооперативный шутер · PvE',
    releaseYear: '2025',
    language: 'Русские субтитры и интерфейс',
    rating: 5.0,
    image: '/src/assets/images/catalog_coop_scifi_1795245737517.jpg',
    fallbackTone: 'from-slate-900 to-zinc-800',
    shortDescription:
      'Командный тактический экшен до 4 игроков с динамическими кампаниями на турецкий аккаунт PS5.',
    fullDescription:
      'Сражайтесь за Супер-Землю в отряде из четырёх бойцов на PlayStation 5 с поддержкой кроссплея. Покупается официально в турецком PlayStation Store на ваш личный профиль.',
    activationSteps: [
      'Оформите заказ и укажите контакт для связи.',
      'Менеджер оплачивает игру в турецком PS Store на ваш аккаунт.',
      'Активируйте общий доступ на PS5 и играйте со своего основного аккаунта.',
    ],
    variants: [
      {
        id: 'hd2-ps5-std',
        label: 'Standard Edition · Турецкий аккаунт',
        editionNote: 'Полная версия для PS5',
        oldPriceRub: 5490,
        priceRub: 3290,
        discountPercent: 40,
        deliveryNote: 'Покупка в турецком PS Store · 10–15 мин',
        inStock: true,
      },
      {
        id: 'hd2-ps5-sc',
        label: 'Super Citizen Edition · Турецкий аккаунт',
        editionNote: 'Игра + набор брони + премиум-боевой пропуск',
        oldPriceRub: 6990,
        priceRub: 4390,
        discountPercent: 37,
        deliveryNote: 'Покупка в турецком PS Store · 10–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'skyrim-anniversary-xbox',
    slug: 'skyrim-anniversary-edition-xbox',
    title: 'The Elder Scrolls V: Skyrim Anniversary Edition [Xbox]',
    platformLabel: 'Xbox Series X|S / Xbox One',
    platformGroup: 'xbox',
    genre: 'RPG · Фэнтези',
    releaseYear: '2024',
    language: 'Русская озвучка и субтитры',
    rating: 5.0,
    image: '/src/assets/images/catalog_ps_action_1795245737849.jpg',
    fallbackTone: 'from-zinc-800 to-slate-900',
    shortDescription:
      'Юбилейное издание культовой RPG с тремя крупными дополнениями и сотнями предметов Creation Club.',
    fullDescription:
      'Включает оригинальный Skyrim Special Edition, дополнения Dawnguard, Hearthfire и Dragonborn, а также расширенный набор заданий, подземелий, брони и механик. Оформляется на ваш турецкий аккаунт Xbox.',
    activationSteps: [
      'Добавьте игру в корзину и оставьте контакт.',
      'Мы оформим игру в турецком Microsoft Store на ваш аккаунт.',
      'Загрузите игру на консоль и продолжайте играть на своём профиле.',
    ],
    variants: [
      {
        id: 'skyrim-ae-tr',
        label: 'Anniversary Edition · Турецкий аккаунт',
        editionNote: 'Полное юбилейное издание для Xbox',
        oldPriceRub: 5390,
        priceRub: 2790,
        discountPercent: 48,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'ac-valhalla-complete-xbox',
    slug: 'assassins-creed-valhalla-complete-edition-xbox',
    title: "Assassin's Creed Valhalla Complete Edition [Xbox]",
    platformLabel: 'Xbox Series X|S / Xbox One',
    platformGroup: 'xbox',
    genre: 'Экшен RPG · Исторический сеттинг',
    releaseYear: '2024',
    language: 'Полная русская локализация',
    rating: 5.0,
    image: '/src/assets/images/catalog_ps_action_1795245737849.jpg',
    fallbackTone: 'from-slate-800 to-zinc-900',
    shortDescription:
      'Самое полное издание истории викинга Эйвора со всеми сюжетными расширениями, включая «Заря Рагнарёка».',
    fullDescription:
      'Издание объединяет базовую игру, сезонный абонемент («Гнев друидов» и «Осада Парижа») и крупное дополнение Dawn of Ragnarök. Оформляется официально на турецкий аккаунт Xbox.',
    activationSteps: [
      'Оформите заказ в корзине.',
      'Мы купим игру на ваш турецкий аккаунт Microsoft Store.',
      'Включите домашнюю консоль и играйте со своего основного профиля.',
    ],
    variants: [
      {
        id: 'acv-comp-tr',
        label: 'Complete Edition · Турецкий аккаунт',
        editionNote: 'Игра + Season Pass + Заря Рагнарёка',
        oldPriceRub: 5290,
        priceRub: 3290,
        discountPercent: 38,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'minecraft-xbox',
    slug: 'minecraft-xbox',
    title: 'Minecraft [Xbox]',
    platformLabel: 'Xbox Series X|S / Xbox One',
    platformGroup: 'xbox',
    genre: 'Песочница · Выживание',
    releaseYear: '2024',
    language: 'Полный русский перевод',
    rating: 5.0,
    image: '/src/assets/images/catalog_coop_scifi_1795245737517.jpg',
    fallbackTone: 'from-zinc-900 to-slate-800',
    shortDescription:
      'Классическая строительная песочница с кроссплеем, разделённым экраном и регулярными обновлениями на турецкий аккаунт.',
    fullDescription:
      'Создавайте собственные миры, играйте по сети с друзьями на разных устройствах или на одном экране телевизора. Покупка оформляется официально в турецком магазине на ваш аккаунт.',
    activationSteps: [
      'Добавьте товар в корзину.',
      'Менеджер оформит игру на ваш турецкий профиль Xbox.',
      'Установите игру на приставку и играйте с основного аккаунта.',
    ],
    variants: [
      {
        id: 'mc-xbox-tr',
        label: 'Standard Edition · Турецкий аккаунт',
        editionNote: 'Версия для консолей Xbox',
        oldPriceRub: 4000,
        priceRub: 1990,
        discountPercent: 50,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'hogwarts-legacy-ps5',
    slug: 'hogwarts-legacy-ps5',
    title: 'Hogwarts Legacy / Хогвартс Наследие [PlayStation 5]',
    platformLabel: 'PlayStation 5 / PS4',
    platformGroup: 'ps',
    genre: 'Action RPG · Фэнтези',
    releaseYear: '2024',
    language: 'Русские субтитры и интерфейс',
    rating: 5.0,
    image: '/src/assets/images/catalog_ps_action_1795245737849.jpg',
    fallbackTone: 'from-slate-900 to-zinc-800',
    shortDescription:
      'Ролевое приключение с открытым миром во вселенной волшебников на ваш турецкий аккаунт PlayStation.',
    fullDescription:
      'Исследуйте Хогвартс XIX века, варите зелья, изучайте заклинания и приручайте фантастических зверей. Официальная покупка в турецком PlayStation Store.',
    activationSteps: [
      'Выберите издание для PS4 или PS5.',
      'Мы приобретаем игру напрямую в турецком PS Store на ваш профиль.',
      'Скачайте игру и запускайте её со своего основного российского аккаунта.',
    ],
    variants: [
      {
        id: 'hl-ps5-std',
        label: 'Standard Edition (PS5) · Турецкий аккаунт',
        editionNote: 'Версия для PlayStation 5',
        oldPriceRub: 9990,
        priceRub: 3890,
        discountPercent: 61,
        deliveryNote: 'Покупка в турецком PS Store · 10–15 мин',
        inStock: true,
      },
      {
        id: 'hl-ps5-deluxe',
        label: 'Digital Deluxe Edition · Турецкий аккаунт',
        editionNote: 'Версии для PS4 + PS5 и набор тёмных искусств',
        oldPriceRub: 11290,
        priceRub: 4590,
        discountPercent: 59,
        deliveryNote: 'Покупка в турецком PS Store · 10–15 мин',
        inStock: true,
      },
    ],
  },
  {
    id: 'nfs-unbound-xbox',
    slug: 'need-for-speed-unbound-xbox',
    title: 'NFS Need for Speed Unbound для Xbox Series [Xbox]',
    platformLabel: 'Xbox Series X|S',
    platformGroup: 'xbox',
    genre: 'Гонки · Стритрейсинг',
    releaseYear: '2024',
    language: 'Русские субтитры и интерфейс',
    rating: 5.0,
    image: '/src/assets/images/catalog_xbox_racing_1795245738055.jpg',
    fallbackTone: 'from-zinc-900 to-stone-900',
    shortDescription:
      'Динамичные уличные гонки от Criterion Games в 4K / 60 FPS для Xbox Series X|S на турецкий аккаунт.',
    fullDescription:
      'Тюнингуйте автомобили, участвуйте в ночных заездах и уходите от погони в Лейкшоре. Оформляется официально на ваш турецкий профиль Xbox.',
    activationSteps: [
      'Оформите заказ через корзину.',
      'Менеджер купит игру на ваш турецкий аккаунт Xbox.',
      'Загрузите игру на консоль и запускайте её с любого профиля.',
    ],
    variants: [
      {
        id: 'nfs-unbound-tr',
        label: 'Standard Edition · Турецкий аккаунт',
        editionNote: 'Версия для Xbox Series X|S',
        oldPriceRub: 9990,
        priceRub: 4790,
        discountPercent: 52,
        deliveryNote: 'Оформление на турецкий Xbox · 5–15 мин',
        inStock: true,
      },
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-delivery',
    question: 'Как быстро игра появляется на моём турецком аккаунте?',
    answer:
      'Оформление покупки в турецком PlayStation Store или Xbox Store занимает от 5 до 15 минут в рабочее время поддержки (ежедневно с 10:00 до 23:00 МСК). После оплаты вы получаете подтверждение и сразу ставите игру на загрузку.',
  },
  {
    id: 'faq-new-account',
    question: 'Что делать, если у меня ещё нет турецкого аккаунта Xbox или PlayStation?',
    answer:
      'При оформлении заказа отметьте в корзине пункт «Нужно помочь создать турецкий аккаунт». Мы бесплатно зарегистрируем личный турецкий профиль на вашу электронную почту, включим защиту и купим на него выбранную игру.',
  },
  {
    id: 'faq-russian-profile',
    question: 'Смогу ли я играть и получать достижения на своём основном российском аккаунте?',
    answer:
      'Да. После загрузки игры с турецкого аккаунта включите функцию «Общий доступ к консоли» (на PS4/PS5) или сделайте турецкий профиль «Домашней консолью» (на Xbox). После этого запускайте игру с основного российского профиля — все трофеи и сохранения останутся на нём.',
  },
  {
    id: 'faq-safety',
    question: 'Вы продаёте общие аккаунты или это официальная покупка?',
    answer:
      'Мы не продаём общие аккаунты («П1/П2») и не сдаём игры в аренду. Каждая игра покупается официально в турецком магазине Microsoft или Sony исключительно на ваш личный турецкий профиль.',
  },
  {
    id: 'faq-refund',
    question: 'Какие условия возврата действуют на заказ?',
    answer:
      'Вы можете отказаться от заказа и получить 100% возврат средств в любой момент до фактической оплаты игры в турецком магазине на ваш аккаунт.',
  },
];

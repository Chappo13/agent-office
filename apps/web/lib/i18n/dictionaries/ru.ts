export const ru = {
  meta: {
    title: "AI Офис",
  },
  brand: {
    prefix: "AI",
    name: "Офис",
    mark: "А",
  },
  nav: {
    office: "Офис",
    tasks: "Задачи",
    tasksBadge: "3",
    activity: "Активность",
    artifacts: "Артефакты",
  },
  sidebar: {
    coordinatorLabel: "Координатор",
    coordinatorName: "Алиса",
    coordinatorRole: "Координатор · онлайн",
    teamLabel: "Команда · 2 агента",
    bobName: "Боб",
    bobRole: "Ресёрчер · думает",
    hireName: "Нанять агента",
    hireRole: "выбрать роль",
    settings: "Настройки",
    support: "Поддержка",
    userName: "Сергио",
    userRole: "Владелец · без плана",
    creditsLabel: "Кредиты в этом месяце",
    creditsValue: "80",
  },
  topbar: {
    teamSwitch: "Команда «Запуск»",
    onlinePill: "2 агента онлайн",
    tier: "⚡ Баланс · дёшево",
    langRu: "РУ",
    langEn: "EN",
  },
  office: {
    caption: "Офис · изометрия",
    hintPrefix: "Клик по агенту → личный чат. Финальный сгенерированный арт офиса появится на шаге",
    hintStep: "A7",
    agentA: "Алиса",
    agentB: "Боб",
    tooltipOpenChat: "Открыть чат",
  },
  chat: {
    title: "Координатор",
    subtitle: "сюда приходят все задачи",
    userMessage:
      "Собери 5 конкурентов в нашей нише и коротко по каждому — чем сильны.",
    userWho: "Вы · только что",
    aliceMessage:
      "Разбила на подзадачи: Боб ищет и профилирует конкурентов, я свожу в таблицу. Первые результаты через пару минут.",
    aliceWho: "Алиса · Координатор",
    bobTyping: "ищет в вебе…",
    bobWho: "Боб · Ресёрчер",
    tones: {
      neutral: "Нейтральный",
      friendly: "Дружелюбный",
      formal: "Формальный",
    },
    chips: {
      hints: "Подсказки координатора",
      refocus: "Рефокус",
      constraint: "Новое ограничение",
      status: "Статус",
    },
    composerPlaceholder: "Напишите Координатору или выбранному агенту…",
    modelLabel: "Модель:",
    modelTier: "⚡ Баланс",
    send: "Отправить",
  },
};

export type Dictionary = typeof ru;

# OperonForge — Portfolio Site

Одностраничный landing для бренда OperonForge: сайты, системы заявок, автоматизация и цифровые решения для бизнеса.

## Стек

- React + Vite
- Tailwind CSS v4
- Framer Motion
- Lucide Icons

## Запуск

```bash
npm install
npm run dev
```

Сборка для продакшена:

```bash
npm run build
npm run preview
```

## Структура

```
src/
  components/
    Header.jsx
    Hero.jsx
    PainPoints.jsx
    Services.jsx
    Portfolio.jsx
    Process.jsx
    WhyUs.jsx
    Concepts.jsx
    CTA.jsx
    Footer.jsx
  assets/
    logo-symbol.png
    logo-text.png
    hero-system-bg.png
```

## Контакты

Замените placeholder-ссылки в `CTA.jsx` и `Footer.jsx`:

- Telegram: `https://t.me/operonforge`
- Email: `hello@operonforge.com`

Форма заявки отправляет через `mailto:` — позже можно подключить Supabase или Telegram Bot API.

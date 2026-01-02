import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe2, Sparkles, ShieldCheck, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

const telegramLink = "https://t.me"; // TODO: replace with real bot link

const ua = {
  heroBadge: "AI‑трекер витрат у Telegram для звичайних людей",
  heroTitle: "Тримай гроші під контролем за кілька хвилин на день",
  heroSubtitle:
    "Просто записуй витрати, а ШІ сам збирає статистику, показує, куди зникають гроші, і допомагає не вилітати з бюджету.",
  heroCtaPrimary: "Відкрити в Telegram",
  heroCtaSecondary: "Подивитись можливості",
  heroNote: "Жодних таблиць в Excel • Усе працює прямо в Telegram",
  featuresTitle: "Що ти отримуєш з першого дня",
  features: [
    {
      icon: <Sparkles className="text-primary" />,
      title: "Розумний аналіз витрат",
      text: "Додай кілька днів витрат — і ШІ покаже, на що йде найбільше грошей, де ти переплачуєш і як це змінити без жорсткої економії.",
    },
    {
      icon: <BarChart3 className="text-income" />,
      title: "Графіки, які все пояснюють за 3 секунди",
      text: "Доходи, витрати та баланс по днях і місяцях. Чітко видно, коли ти виходиш у плюс, а коли «горить» бюджет.",
    },
    {
      icon: <ShieldCheck className="text-accent-foreground" />,
      title: "Фінанси без складних термінів",
      text: "Інтерфейс українською, продуманий для телефону. Ніяких «дебет/кредит» — тільки зрозумілі категорії та суми.",
    },
  ],
  screenshotsTitle: "Як виглядає всередині",
  screenshotsSubtitle: "Баланс, останні операції, аналітика і регулярні платежі — все в одному місці.",
  faqTitle: "Питання та відповіді",
  faq: [
    {
      q: "Це окремий застосунок чи бот?",
      a: "Це Telegram‑застосунок: відкриваєш його у Telegram і одразу ведеш свої фінанси.",
    },
    {
      q: "Навіщо тут ШІ?",
      a: "ШІ допомагає аналізувати витрати, бачити динаміку і дає підказки, де ти системно переплачуєш.",
    },
    {
      q: "Чи складно розібратися?",
      a: "Ні. Інтерфейс як у звичайного мобільного застосунку: категорії, суми, графіки — все зрозуміло з першого екрану.",
    },
    {
      q: "Чи буде преміум?",
      a: "Так. Плануються сімейний бюджет, сканер чеків та голосове додавання витрат.",
    },
  ],
  langLabel: "Українська",
};

const en = {
  heroBadge: "AI‑powered money tracker in Telegram",
  heroTitle: "Stay in control of your money in a few minutes a day",
  heroSubtitle:
    "Simply log your expenses and AI will group them, show where your money really goes and how not to break your budget.",
  heroCtaPrimary: "Open in Telegram",
  heroCtaSecondary: "See how it works",
  heroNote: "No spreadsheets • Everything lives inside Telegram",
  featuresTitle: "What you get from day one",
  features: [
    {
      icon: <Sparkles className="text-primary" />,
      title: "Smart spending insights",
      text: "After a few days of tracking AI shows your top spending categories, hidden leaks and realistic ways to save.",
    },
    {
      icon: <BarChart3 className="text-income" />,
      title: "Charts that tell the story",
      text: "Income, expenses and balance by day and month. You instantly see when you are in the green or burning cash.",
    },
    {
      icon: <ShieldCheck className="text-accent-foreground" />,
      title: "Friendly, not financial‑jargon heavy",
      text: "Mobile‑first interface in Ukrainian. No accounting terms — just clear categories, amounts and trends.",
    },
  ],
  screenshotsTitle: "What it looks like inside",
  screenshotsSubtitle: "Balance, recent operations, analytics and recurring payments — all in one place.",
  faqTitle: "FAQ",
  faq: [
    {
      q: "Is it an app or a bot?",
      a: "It’s a Telegram application: you open it inside Telegram and manage your finances there.",
    },
    {
      q: "Why do you need AI here?",
      a: "AI helps you understand your spending habits, see dynamics and spot where you overspend regularly.",
    },
    {
      q: "Is it hard to use?",
      a: "No. The interface feels like a modern mobile finance app — categories, amounts and charts are easy to read.",
    },
    {
      q: "Will there be premium features?",
      a: "Yes. Family budget, receipt scanner and voice input are planned as premium features.",
    },
  ],
  langLabel: "English",
};

const LandingPage = () => {
  const [lang, setLang] = useState<"ua" | "en">("ua");
  const t = lang === "ua" ? ua : en;

  useEffect(() => {
    const title = t.heroTitle;
    const description = t.heroSubtitle;
    const url = window.location.href;
    const origin = window.location.origin;
    const ogImage = `${origin}/favicon.ico`;

    document.title = title;

    const upsertMeta = (key: "name" | "property", keyValue: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[${key}="${keyValue}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(key, keyValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", ogImage);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);

    let canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };

    let faqScript = document.getElementById("landing-faq-schema") as HTMLScriptElement | null;
    if (!faqScript) {
      faqScript = document.createElement("script");
      faqScript.id = "landing-faq-schema";
      faqScript.type = "application/ld+json";
      document.head.appendChild(faqScript);
    }
    faqScript.text = JSON.stringify(faqSchema);
  }, [t]);

  const handleOpenTelegram = () => {
    window.open(telegramLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <BarChart3 className="text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">My Finances</span>
              <span className="font-semibold text-sm">AI Finance Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
              <Globe2 className="size-3" />
              <button
                type="button"
                onClick={() => setLang("ua")}
                className={`px-2 py-0.5 rounded-full transition-colors text-xs ${
                  lang === "ua" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                UA
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded-full transition-colors text-xs ${
                  lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                EN
              </button>
            </div>
            <Button size="sm" onClick={handleOpenTelegram}>
              {t.heroCtaPrimary}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10 space-y-16">
        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              <span>{t.heroBadge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gradient max-w-xl">
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={handleOpenTelegram} className="gradient-primary text-primary-foreground glow-primary">
                {t.heroCtaPrimary}
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="ghost" className="text-muted-foreground">
                {t.heroCtaSecondary}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3 text-income" />
              <span>{t.heroNote}</span>
            </div>
          </div>
          <div className="grid gap-3 max-w-md mx-auto w-full">
            {/* Balance card */}
            <div className="glass-card rounded-3xl border-balance glow-balance p-4 sm:p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-1">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-2xl bg-income-light flex items-center justify-center glow-income">
                    <BarChart3 className="size-4 text-income" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium">{lang === "ua" ? "Баланс" : "Balance"}</span>
                    <span className="text-[11px]">
                      {lang === "ua" ? "листопад 2025 р." : "November 2025"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-income">
                +41 528<span className="text-sm align-top ml-1">{lang === "ua" ? "грн" : "UAH"}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ua"
                  ? "Це сума, яка залишиться після всіх запланованих витрат цього місяця."
                  : "This is what’s left after all planned expenses this month."}
              </p>
            </div>

            {/* Income / Expense cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-2xl p-3 flex flex-col justify-between glow-income">
                <p className="text-xs text-muted-foreground mb-1">
                  {lang === "ua" ? "Доходи" : "Income"}
                </p>
                <p className="text-lg sm:text-xl font-semibold text-income">
                  +84 648<span className="text-[11px] ml-1">{lang === "ua" ? "грн" : "UAH"}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {lang === "ua" ? "зарплата, підробіток, фриланс" : "salary, side gigs, freelance"}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-3 flex flex-col justify-between glow-expense">
                <p className="text-xs text-muted-foreground mb-1">
                  {lang === "ua" ? "Витрати" : "Expenses"}
                </p>
                <p className="text-lg sm:text-xl font-semibold text-destructive">
                  -43 120<span className="text-[11px] ml-1">{lang === "ua" ? "грн" : "UAH"}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {lang === "ua" ? "житло, їжа, підписки, таксі" : "housing, food, subscriptions, taxi"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <div className="flex flex-col gap-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">{t.featuresTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {t.features.map((feature) => (
              <article
                key={feature.title}
                className="glass-card rounded-2xl p-5 flex flex-col gap-3 h-full"
              >
                <div className="size-9 rounded-xl bg-secondary flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Inside preview built with blocks */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {lang === "ua" ? "Що ти бачиш усередині" : "What you see inside"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "ua"
                ? "Баланс, останні операції, динаміка й регулярні платежі — як на справжній фінансовій панелі."
                : "Balance, recent operations, dynamics and recurring payments — like a real personal finance cockpit."}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 items-stretch">
            {/* Last operations */}
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-3 lg:col-span-1 hover-scale">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-income-light flex items-center justify-center">
                    <BarChart3 className="size-4 text-income" />
                  </div>
                  <span className="font-medium">
                    {lang === "ua" ? "Останні операції" : "Recent operations"}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-[11px] flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">17:55</span>
                    <span>{lang === "ua" ? "аптека" : "pharmacy"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-1 300 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">14:30</span>
                    <span>{lang === "ua" ? "підробіток" : "side job"}</span>
                  </div>
                  <span className="font-semibold text-income">+3 000 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">20:45</span>
                    <span>{lang === "ua" ? "розваги" : "entertainment"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-1 600 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
              </div>
              <button className="mt-2 text-xs text-primary text-left">
                {lang === "ua" ? "Вся історія" : "Full history"} →
              </button>
            </article>

            {/* Bars chart - looks like your example */}
            <article className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 lg:col-span-1 hover-scale border border-border/60">
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-income-light flex items-center justify-center">
                    <BarChart3 className="size-4 text-income" />
                  </div>
                  <span className="font-medium">
                    {lang === "ua" ? "Динаміка по днях (стовпчики)" : "Daily dynamics (bars)"}
                  </span>
                </div>
              </div>
              <div className="space-y-3 animate-fade-in">
                {/* Simple bar chart, like on your screenshot, with premium animation */}
                <div className="h-28 flex items-end gap-1 mt-1 group">
                  {[
                    { day: 1, height: 100, positive: true },
                    { day: 2, height: 18, positive: true },
                    { day: 3, height: 16, positive: true },
                    { day: 5, height: 20, positive: true },
                    { day: 6, height: 55, positive: false },
                    { day: 8, height: 24, positive: true },
                    { day: 10, height: 18, positive: true },
                    { day: 15, height: 14, positive: false },
                    { day: 18, height: 16, positive: true },
                    { day: 22, height: 14, positive: false },
                    { day: 26, height: 15, positive: true },
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col justify-end">
                      <div
                        className={`${bar.positive ? "bg-income" : "bg-destructive"} rounded-t-full transition-transform duration-200 ease-out group-hover:scale-y-105 hover:opacity-100`}
                        style={{ height: `${bar.height}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                  {[1, 2, 3, 5, 6, 8, 10, 15, 18, 22, 26].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
            </article>

            {/* Line chart - like separate block on screenshot */}
            <article className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 lg:col-span-1 hover-scale">
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-income-light flex items-center justify-center">
                    <BarChart3 className="size-4 text-income" />
                  </div>
                  <span className="font-medium">
                    {lang === "ua" ? "Динаміка (лінії)" : "Dynamics (lines)"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <button className="px-2 py-0.5 rounded-full bg-secondary/80">
                    {lang === "ua" ? "Місяць" : "Month"}
                  </button>
                  <button className="px-2 py-0.5 rounded-full bg-secondary/40">
                    {lang === "ua" ? "Рік" : "Year"}
                  </button>
                </div>
              </div>
              <div className="relative h-24 rounded-xl bg-gradient-to-b from-background/10 to-background/40 overflow-hidden animate-fade-in">
                <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full opacity-80">
                  {/* Income line */}
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-income"
                    points="0,35 10,30 20,25 35,22 50,18 65,15 80,12 100,10"
                  />
                  {/* Expense line */}
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-destructive"
                    points="0,36 10,34 20,32 35,30 50,28 65,27 80,26 100,25"
                  />
                </svg>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ua"
                  ? "Зелена лінія — накопичений залишок, червона — витрати. Чим далі вони одна від одної, тим спокійніше за гроші."
                  : "Green line is your accumulated balance, red is expenses. The further they are apart, the safer your money."}
              </p>
            </article>

            {/* Regular incomes / expenses */}
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-3 lg:col-span-1 hover-scale">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  {lang === "ua" ? "Регулярні доходи" : "Recurring income"}
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>{lang === "ua" ? "Бонуси" : "Bonuses"}</span>
                    <span className="text-muted-foreground">29 {lang === "ua" ? "число місяця" : "day of month"}</span>
                  </div>
                  <span className="font-semibold text-income">+17 659 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>{lang === "ua" ? "Реклама" : "Ads"}</span>
                    <span className="text-muted-foreground">24 {lang === "ua" ? "число місяця" : "day of month"}</span>
                  </div>
                  <span className="font-semibold text-income">+34 989 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
              </div>
            </article>

            <article className="glass-card rounded-2xl p-4 flex flex-col gap-3 lg:col-span-1 hover-scale">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  {lang === "ua" ? "Регулярні витрати" : "Recurring expenses"}
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>{lang === "ua" ? "квартира" : "apartment"}</span>
                    <span className="text-muted-foreground">23 {lang === "ua" ? "число місяця" : "day of month"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-9 500 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>{lang === "ua" ? "оренда ШІ сервера" : "AI server rent"}</span>
                    <span className="text-muted-foreground">31 {lang === "ua" ? "число місяця" : "day of month"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-4 300 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>{lang === "ua" ? "бургер" : "burger"}</span>
                    <span className="text-muted-foreground">24 {lang === "ua" ? "число місяця" : "day of month"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-120 {lang === "ua" ? "грн" : "UAH"}</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Who is this for & pains */}
        <section className="space-y-8">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {lang === "ua" ? "Для кого ця програма" : "Who this app is for"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "ua"
                ? "Бот для тих, хто втомився жити від зарплати до зарплати й хоче нарешті відчути контроль, а не провину за кожну витрачену гривню."
                : "A bot for people tired of living paycheck to paycheck who want control and peace of mind instead of guilt over every purchase."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Зайняті айтішники" : "Busy tech people"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua"
                  ? "Працюєш по 10+ годин, а гроші розчиняються. Бот збирає всі доходи та витрати в одну картинку й показує, скільки в тебе реально вільних грошей після обов'язкових платежів."
                  : "You work 10+ hour days yet money evaporates. The bot gathers all income and spending into one picture and shows how much is truly free after mandatory bills."}
              </p>
            </article>
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Фрилансери та самозайняті" : "Freelancers"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua"
                  ? "Сьогодні є замовлення — завтра тиша. Бот рахує, які витрати ти можеш собі дозволити при різних доходах і яка мінімальна сума дає тобі спокій на місяць."
                  : "One month is packed, the next is empty. The app calculates what expenses you can safely afford at different income levels and what minimum keeps you calm for the month."}
              </p>
            </article>
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Пари та сім’ї" : "Couples & families"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua"
                  ? "Спільні покупки, кредити, діти, поїздки. Бот показує, скільки ваша сім'я реально тягне, щоб ви планували відпустки й великі цілі без сварок про гроші."
                  : "Shared purchases, loans, kids, trips. The bot shows what your family can truly afford so you can plan vacations and big goals without constant money fights."}
              </p>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Твої болі" : "Your pains"}
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>{lang === "ua" ? "В кінці місяця карта в нулі, а ти не можеш згадати, на що пішли гроші." : "At the end of the month your card is empty and you can't remember where it all went."}</li>
                <li>{lang === "ua" ? "Живеш у постійному фоні тривоги: а раптом не вистачить на оренду, кредит чи підписки?" : "Background anxiety all the time: what if there isn't enough for rent, loans or subscriptions?"}</li>
                <li>{lang === "ua" ? "Пробував таблиці й застосунки, але кидав, бо це займає пів вечора й не дає швидкої відповіді 'я можу собі це дозволити?'." : "You tried spreadsheets and apps but quit because they eat your evenings and still don't answer fast if you can afford something."}</li>
              </ul>
            </article>
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Як бот це вирішує" : "How the bot fixes this"}
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>{lang === "ua" ? "Щодня рахує: скільки вже зайшло грошей, скільки ти витратив і який реальний залишок до кінця місяця." : "Every day it counts how much came in, how much you spent, and what your real buffer is until month end."}</li>
                <li>{lang === "ua" ? "Попереджає про регулярні платежі заздалегідь і показує, чи витримає їх твій баланс без боргів." : "Warns you about upcoming recurring payments and shows if your balance can handle them without going into debt."}</li>
                <li>{lang === "ua" ? "AI розбирає твої витрати по поличках і дає конкретні підказки: де можна зменшити, щоб ти відчув різницю вже в наступному місяці." : "AI breaks your spending down and gives concrete tips where to cut so you feel the difference as soon as next month."}</li>
              </ul>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">{t.faqTitle}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {t.faq.map((item) => (
              <article
                key={item.q}
                className="glass-card rounded-2xl p-4 flex flex-col gap-2"
              >
                <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {item.q}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10">
          <div className="glass-card rounded-3xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-semibold">
                {lang === "ua" ? "Почни вести свої фінанси сьогодні" : "Start owning your finances today"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {lang === "ua"
                  ? "Відкрий застосунок у Telegram, додай перші витрати — і вже за тиждень побачиш, куди реально йдуть гроші."
                  : "Open the app in Telegram, add your first expenses — and in a week you’ll clearly see where your money goes."}
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleOpenTelegram}
              className="gradient-primary text-primary-foreground glow-primary min-w-[220px]"
            >
              {t.heroCtaPrimary}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-4 text-xs text-muted-foreground">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} My Finances</span>
          <span className="flex items-center gap-1">
            <Sparkles className="size-3" />
            {lang === "ua"
              ? "Створено як перший український AI‑фінансовий Telegram‑стартап"
              : "Built as a Ukrainian AI‑powered finance startup inside Telegram"}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

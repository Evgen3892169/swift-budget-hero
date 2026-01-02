import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe2, Sparkles, ShieldCheck, BarChart3, ArrowRight, CheckCircle2, Users, ReceiptText, Mic } from "lucide-react";
const telegramLink = "https://t.me"; // TODO: replace with real bot link

const ua = {
  heroBadge: "AI‑трекер витрат у Telegram для звичайних людей",
  heroTitle: "Перестань зливати гроші непомітно — керуй ними кожен день",
  heroSubtitle: "Записуй витрати у Telegram, а ШІ сам збирає аналітику, показує, куди тече найбільше грошей, і дає прості кроки, як залишатися в плюсах.",
  heroCtaPrimary: "Запустити бота в Telegram",
  heroCtaSecondary: "Побачити, як це працює",
  heroNote: "Без Excel і фінансової освіти • Усе працює прямо в Telegram",
  featuresTitle: "Що конкретно дає тобі бот з першого тижня",
  features: [{
    icon: <Sparkles className="text-primary" />,
    title: "AI, який говорить людською мовою",
    text: "Декілька днів витрат — і ШІ вже показує, де ти зливаєш гроші, які категорії тягнуть бюджет вниз і що можна прибрати без відчуття 'жити впроголодь'."
  }, {
    icon: <BarChart3 className="text-income" />,
    title: "Графіки, що одразу показують, ти в плюсах чи мінусах",
    text: "Доходи, витрати та баланс по днях і місяцях. Жодних складних термінів — тільки зрозумілі стовпчики та лінії, як на скрінах нижче."
  }, {
    icon: <ShieldCheck className="text-accent-foreground" />,
    title: "Фінанси, які не страшно відкривати",
    text: "Інтерфейс українською, продуманий під телефон. Все виглядає як звичайний чат і мобільний застосунок — без 'дебет/кредит' і нудних таблиць."
  }],
  screenshotsTitle: "Як виглядає твій фінансовий день усередині",
  screenshotsSubtitle: "Баланс, останні операції, аналітика, регулярні платежі та AI‑коментарі в одному Telegram‑застосунку.",
  faqTitle: "Часті запитання перед стартом",
  faq: [{
    q: "Це окремий застосунок чи бот?",
    a: "Це Telegram‑застосунок: відкриваєш його у Telegram і одразу ведеш свої фінанси."
  }, {
    q: "Навіщо тут ШІ?",
    a: "ШІ допомагає аналізувати витрати, бачити динаміку і дає підказки, де ти системно переплачуєш."
  }, {
    q: "Чи складно розібратися?",
    a: "Ні. Інтерфейс як у звичайного мобільного застосунку: категорії, суми, графіки — все зрозуміло з першого екрану."
  }, {
    q: "Чи буде преміум?",
    a: "Так. Плануються сімейний бюджет, сканер чеків та голосове додавання витрат."
  }],
  langLabel: "Українська"
};
const en = {
  heroBadge: "AI‑powered money tracker in Telegram",
  heroTitle: "Stop leaking money silently — take control every day",
  heroSubtitle: "Log expenses in Telegram and let AI turn them into clear insights: where most of your money flows and what to tweak to stay in the green.",
  heroCtaPrimary: "Launch the bot in Telegram",
  heroCtaSecondary: "See it in action",
  heroNote: "No spreadsheets or finance degree • Everything lives inside Telegram",
  featuresTitle: "What this bot actually gives you in the first week",
  features: [{
    icon: <Sparkles className="text-primary" />,
    title: "AI that talks like a human, not a banker",
    text: "After a few days of tracking AI shows where you silently leak money, your heaviest categories and what you can cut without feeling miserable."
  }, {
    icon: <BarChart3 className="text-income" />,
    title: "Charts that instantly show if you're safe or burning cash",
    text: "Income, expenses and balance by day and month. Simple bars and lines — like on the screenshots below — instead of confusing reports."
  }, {
    icon: <ShieldCheck className="text-accent-foreground" />,
    title: "Finances that don't scare you away",
    text: "Mobile‑first interface. Everything looks like a normal chat and finance app — no 'debit/credit' jargon or ugly spreadsheets."
  }],
  screenshotsTitle: "How your financial day looks inside",
  screenshotsSubtitle: "Balance, recent operations, analytics, recurring payments and AI insights — all inside one Telegram app.",
  faqTitle: "Questions people ask before they start",
  faq: [{
    q: "Is it an app or a bot?",
    a: "It’s a Telegram application: you open it inside Telegram and manage your finances there."
  }, {
    q: "Why do you need AI here?",
    a: "AI helps you understand your spending habits, see dynamics and spot where you overspend regularly."
  }, {
    q: "Is it hard to use?",
    a: "No. The interface feels like a modern mobile finance app — categories, amounts and charts are easy to read."
  }, {
    q: "Will there be premium features?",
    a: "Yes. Family budget, receipt scanner and voice input are planned as premium features."
  }],
  langLabel: "English"
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
      mainEntity: t.faq.map(item => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a
        }
      }))
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
  return <div className="min-h-screen bg-background text-foreground">
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
              <button type="button" onClick={() => setLang("ua")} className={`px-2 py-0.5 rounded-full transition-colors text-xs ${lang === "ua" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                UA
              </button>
              <button type="button" onClick={() => setLang("en")} className={`px-2 py-0.5 rounded-full transition-colors text-xs ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
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
                {lang === "ua" ? "Це сума, яка залишиться після всіх запланованих витрат цього місяця." : "This is what’s left after all planned expenses this month."}
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
            {t.features.map(feature => <article key={feature.title} className="glass-card rounded-2xl p-5 flex flex-col gap-3 h-full">
                <div className="size-9 rounded-xl bg-secondary flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.text}</p>
              </article>)}
          </div>
        </section>

        {/* Inside preview built with blocks */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {lang === "ua" ? "Що ти бачиш усередині" : "What you see inside"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "ua" ? "Баланс, останні операції, динаміка й регулярні платежі — як на справжній фінансовій панелі." : "Balance, recent operations, dynamics and recurring payments — like a real personal finance cockpit."}
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
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" className="text-income" points="0,35 10,30 20,25 35,22 50,18 65,15 80,12 100,10" />
                  {/* Expense line */}
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" className="text-destructive" points="0,36 10,34 20,32 35,30 50,28 65,27 80,26 100,25" />
                </svg>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ua" ? "Зелена лінія — накопичений залишок, червона — витрати. Чим далі вони одна від одної, тим спокійніше за гроші." : "Green line is your accumulated balance, red is expenses. The further they are apart, the safer your money."}
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
            
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Зайняті айтішники" : "Busy tech people"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua" ? "Працюєш по 10+ годин, а гроші розчиняються. Бот збирає всі доходи та витрати в одну картинку й показує, скільки в тебе реально вільних грошей після обов'язкових платежів." : "You work 10+ hour days yet money evaporates. The bot gathers all income and spending into one picture and shows how much is truly free after mandatory bills."}
              </p>
            </article>
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Фрилансери та самозайняті" : "Freelancers"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua" ? "Сьогодні є замовлення — завтра тиша. Бот рахує, які витрати ти можеш собі дозволити при різних доходах і яка мінімальна сума дає тобі спокій на місяць." : "One month is packed, the next is empty. The app calculates what expenses you can safely afford at different income levels and what minimum keeps you calm for the month."}
              </p>
            </article>
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover-scale">
              <h3 className="font-semibold text-sm">
                {lang === "ua" ? "Пари та сім’ї" : "Couples & families"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua" ? "Спільні покупки, кредити, діти, поїздки. Бот показує, скільки ваша сім'я реально тягне, щоб ви планували відпустки й великі цілі без сварок про гроші." : "Shared purchases, loans, kids, trips. The bot shows what your family can truly afford so you can plan vacations and big goals without constant money fights."}
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

        {/* Premium features */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {lang === "ua" ? "Преміум‑можливості, які економлять час і нерви" : "Premium features that save time and nerves"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "ua" ? "Базового функціоналу вистачає, щоб навести лад у грошах. Преміум додає інструменти, які зазвичай є лише в важких фінансових застосунках — але в простому Telegram‑форматі." : "The basic version is enough to get order in your money. Premium adds powerful tools usually found only in heavy finance apps — but wrapped into a simple Telegram experience."}
            </p>
          </div>

          <div className="space-y-3">
            {/* Family budget */}
            <article className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between hover-scale">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-income-light flex items-center justify-center">
                  <Users className="size-4 text-income" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span>{lang === "ua" ? "Сімейний бюджет" : "Family budget"}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide">
                      <Sparkles className="size-3 text-primary" />
                      <span>{lang === "ua" ? "Преміум" : "Premium"}</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    {lang === "ua" ? "Ведіть спільний бюджет з партнером чи родиною: загальні витрати, доходи та ліміти в одному місці, без зведення табличок вручну." : "Run a shared budget with a partner or family: joint expenses, income and limits in one place — no manual spreadsheet merging."}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center">
                <div className="w-9 h-5 rounded-full bg-background/40 border border-border/60 flex items-center px-0.5 opacity-60">
                  <div className="size-4 rounded-full bg-muted" />
                </div>
              </div>
            </article>

            {/* Receipt scanner */}
            <article className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between hover-scale">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-accent/20 flex items-center justify-center">
                  <ReceiptText className="size-4 text-accent-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span>{lang === "ua" ? "Сканер чеків" : "Receipt scanner"}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide">
                      <Sparkles className="size-3 text-primary" />
                      <span>{lang === "ua" ? "Преміум" : "Premium"}</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    {lang === "ua" ? "Скануйте паперові чеки — суми й категорії автоматично потрапляють у витрати. Жодного ручного перенесення з фото в застосунок." : "Scan paper receipts and let the app automatically add amounts and categories to your expenses — no more manual typing from photos."}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center">
                <div className="w-9 h-5 rounded-full bg-background/40 border border-border/60 flex items-center px-0.5 opacity-60">
                  <div className="size-4 rounded-full bg-muted" />
                </div>
              </div>
            </article>

            {/* Voice input */}
            <article className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between hover-scale">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <Mic className="size-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span>{lang === "ua" ? "Запис голосом" : "Voice input"}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide">
                      <Sparkles className="size-3 text-primary" />
                      <span>{lang === "ua" ? "Преміум" : "Premium"}</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    {lang === "ua" ? "Додавай витрати голосом по дорозі — бот сам розпізнає текст і розкладе все по категоріях. Менше натискань — більше контролю." : "Add expenses by voice on the go — the bot converts speech to text and assigns categories for you. Fewer taps, more control."}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center">
                <div className="w-9 h-5 rounded-full bg-background/40 border border-border/60 flex items-center px-0.5 opacity-60">
                  <div className="size-4 rounded-full bg-muted" />
                </div>
              </div>
            </article>

          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">{t.faqTitle}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {t.faq.map(item => <article key={item.q} className="glass-card rounded-2xl p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {item.q}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.a}</p>
              </article>)}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10">
          <div className="glass-card rounded-3xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-semibold">
                {lang === "ua" ? "Запусти свого фінансового бота зараз" : "Launch your personal money bot now"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {lang === "ua" ? "Натисни одну кнопку, додай кілька останніх витрат — і вже за тиждень ти побачиш, скільки в тебе реально вільних грошей." : "Tap one button, add a few recent expenses — and within a week you'll see how much free money you truly have."}
              </p>
            </div>
            <Button size="lg" onClick={handleOpenTelegram} className="gradient-primary text-primary-foreground glow-primary min-w-[220px]">
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
            {lang === "ua" ? "Створено як перший український AI‑фінансовий Telegram‑стартап" : "Built as a Ukrainian AI‑powered finance startup inside Telegram"}
          </span>
        </div>
      </footer>
    </div>;
};
export default LandingPage;
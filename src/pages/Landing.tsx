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
          <div className="relative max-w-sm mx-auto w-full">
            <div className="glass-card rounded-[1.75rem] overflow-hidden glow-primary border border-balance/50 bg-balance-soft p-4 flex flex-col gap-4 max-h-[420px]">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{lang === "ua" ? "Мій місяць" : "My month"}</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary/70 text-[11px]">
                  {lang === "ua" ? "Ліміт: 50 000 ₴" : "Limit: 50 000 ₴"}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ua" ? "Залишок на цей місяць" : "Balance for this month"}
                </p>
                <p className="text-3xl font-semibold tracking-tight">31 600 ₴</p>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "ua" ? "Витрати за перші 10 днів: 18 400 ₴" : "Spent in first 10 days: 18 400 ₴"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-xl bg-card border border-border/60 p-2 flex flex-col gap-1">
                  <span className="text-muted-foreground">
                    {lang === "ua" ? "Доходи" : "Income"}
                  </span>
                  <span className="font-semibold text-income">+52 300 ₴</span>
                </div>
                <div className="rounded-xl bg-card border border-border/60 p-2 flex flex-col gap-1">
                  <span className="text-muted-foreground">
                    {lang === "ua" ? "Витрати" : "Expenses"}
                  </span>
                  <span className="font-semibold text-destructive">-18 400 ₴</span>
                </div>
                <div className="rounded-xl bg-card border border-border/60 p-2 flex flex-col gap-1">
                  <span className="text-muted-foreground">
                    {lang === "ua" ? "Баланс" : "Balance"}
                  </span>
                  <span className="font-semibold">31 600 ₴</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{lang === "ua" ? "Сьогодні" : "Today"}</span>
                  <span>{lang === "ua" ? "1 560 ₴ витрат" : "1 560 ₴ spent"}</span>
                </div>
                <div className="flex items-end gap-1 h-20">
                  {[40, 65, 30, 80, 55, 20, 60].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-full bg-secondary/70 overflow-hidden flex items-end"
                    >
                      <div
                        className="w-full rounded-full bg-primary"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto rounded-2xl bg-card border border-border/60 p-3 flex items-start gap-2 text-[11px]">
                <Sparkles className="size-4 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-xs">
                    {lang === "ua" ? "AI‑підказка" : "AI tip"}
                  </p>
                  <p className="text-muted-foreground">
                    {lang === "ua"
                      ? "Якщо скоротиш доставку їжі вдвічі, за місяць заощадиш ще 2 900 ₴."
                      : "If you cut food delivery in half, you’ll save extra 2 900 ₴ this month."}
                  </p>
                </div>
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

        {/* Inside preview (no real screenshots) */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              {lang === "ua" ? "Як усе виглядає всередині" : "What it looks like inside"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "ua"
                ? "Коротко: один погляд — і ти розумієш, скільки вже витратив, що болить і де можна зекономити без стресу."
                : "In one glance you see how much you’ve spent, what hurts and where you can save without feeling restricted."}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 items-stretch">
            <article className="glass-card rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-sm sm:text-base">
                {lang === "ua" ? "Головний екран" : "Main dashboard"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua"
                  ? "Баланс місяця, ліміт і скільки ти вже витратив. Без цифр, які нічого не пояснюють — тільки те, що реально важливо."
                  : "Monthly balance, limit and how much you’ve already spent. No meaningless numbers — only what truly matters."}
              </p>
              <div className="mt-1 rounded-xl bg-card border border-border/60 p-3 text-[11px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{lang === "ua" ? "Баланс" : "Balance"}</span>
                  <span className="font-semibold">31 600 ₴</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{lang === "ua" ? "Витрати цього тижня" : "This week’s spend"}</span>
                  <span className="font-semibold text-destructive">-6 420 ₴</span>
                </div>
              </div>
            </article>

            <article className="glass-card rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-sm sm:text-base">
                {lang === "ua" ? "Список витрат" : "Expense list"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua"
                  ? "Кожна покупка з категорією: продукти, таксі, кафе, підписки. Легко знайти, що з’їдає більшу частину бюджету."
                  : "Every purchase with a category: groceries, taxi, coffee, subscriptions. Easy to spot what eats most of your budget."}
              </p>
              <div className="mt-1 space-y-2 text-[11px]">
                <div className="flex items-center justify-between rounded-xl bg-card border border-border/60 px-3 py-2">
                  <div className="flex flex-col">
                    <span>Продукти • Сільпо</span>
                    <span className="text-muted-foreground">{lang === "ua" ? "сьогодні" : "today"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-640 ₴</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-card border border-border/60 px-3 py-2">
                  <div className="flex flex-col">
                    <span>Транспорт • Uber</span>
                    <span className="text-muted-foreground">{lang === "ua" ? "вчора" : "yesterday"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-210 ₴</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-card border border-border/60 px-3 py-2">
                  <div className="flex flex-col">
                    <span>Підписка • Netflix</span>
                    <span className="text-muted-foreground">{lang === "ua" ? "щомісяця" : "monthly"}</span>
                  </div>
                  <span className="font-semibold text-destructive">-279 ₴</span>
                </div>
              </div>
            </article>

            <article className="glass-card rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-sm sm:text-base">
                {lang === "ua" ? "AI‑пояснення людською мовою" : "AI, but human"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "ua"
                  ? "Замість сухої статистики — короткі висновки: де ти стабільно переплачуєш, на скільки можна зменшити витрати і що зробити прямо сьогодні."
                  : "Instead of dry stats you get short insights: where you overspend, how much you could cut and what to do today."}
              </p>
              <div className="mt-1 rounded-2xl bg-card border border-border/60 p-3 text-[11px] space-y-2">
                <p className="text-muted-foreground">
                  {lang === "ua"
                    ? "Ти витрачаєш 12 800 ₴ на їжу поза домом. Якщо перейти на доставку через день — це мінус 3 200 ₴ витрат щомісяця."
                    : "You spend 12 800 ₴ eating out. Switching to every‑other‑day delivery saves around 3 200 ₴ per month."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {lang === "ua" ? "Поставити ліміт на кафе" : "Set a cafe limit"}
                  </span>
                  <span className="text-primary text-[11px] font-medium">
                    {lang === "ua" ? "+ Додати ціль" : "+ Add goal"}
                  </span>
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

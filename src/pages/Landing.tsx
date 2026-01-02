import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe2, Sparkles, ShieldCheck, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import dashboardMain from "@/assets/landing-dashboard-1.png";
import dashboardAnalytics from "@/assets/landing-dashboard-2.png";
import recentOps from "@/assets/landing-recent-ops.png";
import regularSettings from "@/assets/landing-settings-regular.png";
import premiumFeatures from "@/assets/landing-premium.png";

const telegramLink = "https://t.me"; // TODO: replace with real bot link

const ua = {
  heroBadge: "Перший AI‑трекер витрат у Telegram",
  heroTitle: "Мої фінанси — контроль бюджету без таблиць і нервів",
  heroSubtitle:
    "Фіксуй доходи та витрати в Telegram, а ШІ покаже, куди зникають гроші і як тримати баланс.",
  heroCtaPrimary: "Відкрити в Telegram",
  heroCtaSecondary: "Подивитись можливості",
  heroNote: "Працює прямо в Telegram • Безкоштовний старт",
  featuresTitle: "Чому це не просто ще один фінтрекер",
  features: [
    {
      icon: <Sparkles className="text-primary" />, 
      title: "AI‑аналіз витрат",
      text: "ШІ підсумовує витрати, показує патерни і допомагає знаходити, де можна економити без болю.",
    },
    {
      icon: <BarChart3 className="text-income" />, 
      title: "Живі графіки та динаміка",
      text: "Доходи, витрати, баланс по днях і місяцях — все в наочних графіках, а не в сухих таблицях.",
    },
    {
      icon: <ShieldCheck className="text-accent-foreground" />, 
      title: "Для звичайних людей, не для бухгалтерів",
      text: "Інтерфейс простий, українською, заточений під телефон. Додати витрату — справа кількох секунд.",
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
  heroBadge: "AI‑powered finance tracker in Telegram",
  heroTitle: "My Finances — control your money without spreadsheets",
  heroSubtitle:
    "Track income and expenses right inside Telegram. AI explains where your money goes and how to stay in control.",
  heroCtaPrimary: "Open in Telegram",
  heroCtaSecondary: "See the features",
  heroNote: "Works inside Telegram • Free to start",
  featuresTitle: "Why it’s more than just another expense app",
  features: [
    {
      icon: <Sparkles className="text-primary" />, 
      title: "AI spending insights",
      text: "AI groups your expenses, spots patterns and shows where you can save without changing your life completely.",
    },
    {
      icon: <BarChart3 className="text-income" />, 
      title: "Clean charts and dynamics",
      text: "Income, expenses and balance by days and months — visual charts instead of boring tables.",
    },
    {
      icon: <ShieldCheck className="text-accent-foreground" />, 
      title: "Built for humans, not accountants",
      text: "Simple mobile‑first UI in Ukrainian. Adding a new expense literally takes a few seconds.",
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
          <div className="relative max-w-md mx-auto w-full">
            <div className="glass-card rounded-[1.75rem] overflow-hidden glow-primary border border-balance/50 bg-balance-soft">
              <img
                src={dashboardMain}
                alt="Головний екран фінансового застосунку — баланс та доходи/витрати"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-10 -right-6 w-40 glass-card rounded-2xl overflow-hidden border border-border/60 hidden sm:block">
              <img
                src={recentOps}
                alt="Список останніх операцій у застосунку Мої фінанси"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
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

        {/* Screenshots */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold">{t.screenshotsTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.screenshotsSubtitle}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
            <div className="space-y-4">
              <div className="glass-card rounded-[1.75rem] overflow-hidden">
                <img
                  src={dashboardAnalytics}
                  alt="Аналітика доходів та витрат у вигляді графіків в застосунку Мої фінанси"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass-card rounded-2xl overflow-hidden">
                <img
                  src={regularSettings}
                  alt="Налаштування регулярних доходів і витрат у застосунку Мої фінанси"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <img
                  src={premiumFeatures}
                  alt="Преміум‑функції: сімейний бюджет, сканер чеків, запис голосових витрат"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
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

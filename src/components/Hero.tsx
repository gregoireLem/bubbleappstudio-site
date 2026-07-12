import { motion } from "framer-motion";
import { useRef } from "react";
import type { HomePageContent } from "../i18n/site";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function AppleBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="store-badge-icon">
      <path
        fill="currentColor"
        d="M15.19 12.92c.03 3.22 2.82 4.29 2.85 4.31-.02.08-.44 1.52-1.44 3.01-.87 1.29-1.77 2.58-3.19 2.61-1.39.03-1.84-.82-3.43-.82-1.59 0-2.08.79-3.4.85-1.37.05-2.41-1.37-3.29-2.65C1.51 17.63.15 12.9 1.99 9.71c.91-1.58 2.54-2.58 4.31-2.61 1.35-.03 2.62.91 3.43.91.81 0 2.33-1.13 3.92-.96.67.03 2.57.27 3.79 2.05-.1.06-2.26 1.32-2.25 3.82ZM12.74 4.98c.73-.88 1.22-2.11 1.09-3.33-1.05.04-2.32.7-3.07 1.58-.67.78-1.26 2.02-1.1 3.21 1.17.09 2.35-.6 3.08-1.46Z"
      />
    </svg>
  );
}

function AndroidBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="store-badge-icon">
      <path
        fill="currentColor"
        d="M7.39 8.13 5.93 5.6a.5.5 0 1 1 .87-.5l1.5 2.59a10.07 10.07 0 0 1 7.4 0l1.5-2.59a.5.5 0 0 1 .87.5l-1.46 2.53A6.88 6.88 0 0 1 19.5 13v5.25a1.75 1.75 0 1 1-3.5 0V15h-1v6.25a2 2 0 1 1-4 0V15h-1v6.25a2 2 0 1 1-4 0V15H5v3.25a1.75 1.75 0 1 1-3.5 0V13c0-2.1.96-3.97 2.46-5.18ZM7 12.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm10 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5.25 13.5h13.5c-.23-2.96-2.72-5.25-6.75-5.25s-6.52 2.29-6.75 5.25Z"
      />
    </svg>
  );
}

type HeroProps = {
  content: HomePageContent;
  legalLinks: {
    termsHref: string;
    privacyHref: string;
  };
};

export default function Hero({ content, legalLinks }: HeroProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const baseUrl = import.meta.env.BASE_URL;
  const appStoreUrl = "https://apps.apple.com/app/id6740009341";
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=xyz.bubbleappstudio.werewolfundercover&pcampaignid=web_share";
  const roles = content.roles.map((role) => ({
    ...role,
    image: `${baseUrl}${role.image}`
  }));

  const scrollCarousel = (
    ref: { current: HTMLDivElement | null },
    direction: "left" | "right"
  ) => {
    const node = ref.current;
    if (!node) return;
    const amount = node.clientWidth * 0.7;
    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/2 top-[-120px] h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,80,80,0.35),transparent_70%)] blur-3xl"
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-140px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,20,20,0.5),transparent_70%)] blur-3xl"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-base flex min-h-screen items-center justify-center py-20">
        <motion.div
          className="relative w-full max-w-6xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              variants={item}
              className="icon-glow mx-auto flex h-32 w-32 items-center justify-center rounded-[32px] border border-white/10 bg-white/5"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={`${baseUrl}assets/wolfo.png`}
                  alt={content.iconAlt}
                  className="h-28 w-28 rounded-[28px] object-cover"
                />
              </motion.div>
            </motion.div>

            <motion.h1
              variants={item}
              className="title-glow font-accent mt-8 text-5xl uppercase tracking-[0.2em] text-white sm:text-6xl"
            >
              {content.titleLine1}
              <span className="mt-2 block text-[0.82em] text-[var(--accent-yellow)]">
                {content.titleLine2}
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-base text-slate-200 sm:text-lg"
            >
              <strong>{content.tagline}</strong>
            </motion.p>
            <motion.p
              variants={item}
              className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base"
            >
              <strong>{content.intro}</strong>
            </motion.p>
            <motion.p
              variants={item}
              className="mt-4 text-sm leading-relaxed text-slate-400"
            >
              {content.body}
            </motion.p>
            {content.searchIntentParagraph && (
              <motion.p
                variants={item}
                className="mt-4 text-sm leading-relaxed text-slate-400"
              >
                {content.searchIntentParagraph}
              </motion.p>
            )}

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <motion.a
                className="store-badge"
                href={appStoreUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={content.appStoreAriaLabel}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="store-badge-logo">
                  <AppleBadgeIcon />
                </span>
                <span className="store-badge-copy">
                  <span className="store-badge-caption">{content.appStoreCaption}</span>
                  <span className="store-badge-title">{content.appStoreTitle}</span>
                </span>
              </motion.a>
              <motion.a
                className="store-badge"
                href={playStoreUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={content.playStoreAriaLabel}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="store-badge-logo store-badge-logo-android">
                  <AndroidBadgeIcon />
                </span>
                <span className="store-badge-copy">
                  <span className="store-badge-caption">{content.playStoreCaption}</span>
                  <span className="store-badge-title">{content.playStoreTitle}</span>
                </span>
              </motion.a>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-3"
            >
              {content.stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <p className="font-accent text-3xl text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={item} className="mt-12 text-left">
            <div className="flex items-center justify-between gap-4">
              <p className="font-accent text-2xl uppercase tracking-[0.2em] text-white">
                {content.rolesHeading}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="carousel-button"
                  aria-label={content.carouselLeftLabel}
                  onClick={() => scrollCarousel(carouselRef, "left")}
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  className="carousel-button"
                  aria-label={content.carouselRightLabel}
                  onClick={() => scrollCarousel(carouselRef, "right")}
                >
                  &#8250;
                </button>
              </div>
            </div>
            <div className="relative mt-4">
              <div className="carousel-fade carousel-fade-left" />
              <div className="carousel-fade carousel-fade-right" />
              <div ref={carouselRef} className="carousel-track">
                {roles.map((role) => (
                  <div key={role.name} className="carousel-card">
                    <img
                      src={role.image}
                      alt={`${role.name} role art`}
                      className="h-36 w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-slate-300">
                      {role.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="mt-10 text-left">
            <p className="font-accent text-2xl uppercase tracking-[0.2em] text-white">
              {content.contactHeading}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                contact@bubbleappstudio.xyz
              </span>
              <a className="btn btn-primary" href="mailto:contact@bubbleappstudio.xyz">
                {content.contactButton}
              </a>
            </div>
          </motion.div>

          <motion.footer
            variants={item}
            className="mt-12 text-[10px] uppercase tracking-[0.18em] text-white"
          >
            <p>{content.footerCopy}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-white/70">
              <a className="transition hover:text-[var(--accent-yellow)]" href={legalLinks.termsHref}>
                {content.termsLabel}
              </a>
              <span aria-hidden="true">•</span>
              <a
                className="transition hover:text-[var(--accent-yellow)]"
                href={legalLinks.privacyHref}
              >
                {content.privacyLabel}
              </a>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </section>
  );
}

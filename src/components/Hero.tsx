import { motion } from "framer-motion";
import { useRef } from "react";

const roleData = [
  { name: "Loup-garou", image: "assets/roles/wolf.png" },
  { name: "Voyante", image: "assets/roles/seer.png" },
  { name: "Petite Fille", image: "assets/roles/little_girl.png" },
  { name: "Villageois", image: "assets/roles/villager.png" },
  { name: "Sorciere", image: "assets/roles/witch.png" },
  { name: "Cupidon", image: "assets/roles/cupid.png" },
  { name: "Chasseur", image: "assets/roles/hunter.png" }
];


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

export default function Hero() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const baseUrl = import.meta.env.BASE_URL;
  const roles = roleData.map((role) => ({
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
                  alt="Wolfo app icon"
                  className="h-28 w-28 rounded-[28px] object-cover"
                />
              </motion.div>
            </motion.div>

            <motion.h1
              variants={item}
              className="title-glow font-accent mt-8 text-5xl uppercase tracking-[0.2em] text-white sm:text-6xl"
            >
              Loup-garou
              <span className="mt-2 block text-[0.82em] text-[var(--accent-yellow)]">
                Undercover
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-base text-slate-200 sm:text-lg"
            >
              <strong>Le jeu des Loups-Garous, sans carte.</strong>
            </motion.p>
            <motion.p
              variants={item}
              className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base"
            >
              <strong>
                Rassemblez vos amis et laissez votre telephone jouer le role du
                narrateur. Bluff, strategie et fous rires garantis.
              </strong>
            </motion.p>
            <motion.p
              variants={item}
              className="mt-4 text-sm leading-relaxed text-slate-400"
            >
              Jeu de soiree party de bluff et de role pour la famille et les
              amis, inspire de Thiercelieux et des jeux de mafia: le loup et le
              garou se cachent dans le village, sans cartes, avec un narrateur.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex justify-center">
              <motion.a
                className="btn btn-primary"
                href="https://apps.apple.com/fr/app/loup-garou-undercover/id6740009341"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                TÉLÉCHARGER L'APP
              </motion.a>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-3"
            >
              <div className="stat-card">
                <p className="font-accent text-3xl text-white">4,7</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em]">Note App Store</p>
              </div>
              <div className="stat-card">
                <p className="font-accent text-3xl text-white">6-18</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em]">Joueurs</p>
              </div>
              <div className="stat-card">
                <p className="font-accent text-3xl text-white">Gratuit</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em]">A telecharger</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={item} className="mt-12 text-left">
            <div className="flex items-center justify-between gap-4">
              <p className="font-accent text-2xl uppercase tracking-[0.2em] text-white">
                Decouvrir les roles
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="carousel-button"
                  aria-label="Defiler a gauche"
                  onClick={() => scrollCarousel(carouselRef, "left")}
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  className="carousel-button"
                  aria-label="Defiler a droite"
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
              Contact
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                contact@bubbleappstudio.xyz
              </span>
              <a className="btn btn-primary" href="mailto:contact@bubbleappstudio.xyz">
                Envoyer un email
              </a>
            </div>
          </motion.div>

          <motion.footer
            variants={item}
            className="mt-12 text-[10px] uppercase tracking-[0.18em] text-white"
          >
            Copyright Bubble App Studio 2026. Made with love in Paris 🇫🇷
          </motion.footer>
        </motion.div>
      </div>
    </section>
  );
}

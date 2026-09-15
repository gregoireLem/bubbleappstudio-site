import type { MarkdownInstance } from 'astro';
import { getLocalizedPath, localeMeta, locales, siteUrl, type Locale, type AlternateLink } from '../i18n/site';

export type PostMeta = { translationKey: string; locale: Locale; slug: string; title: string; description: string; category: string; image: string; published: string };
export type Post = MarkdownInstance<PostMeta>;
export const posts = Object.values(import.meta.glob<Post>('../data/blog/**/*.md', { eager: true }));
const seen = new Set<string>();
for (const { frontmatter: p } of posts) {
  const key = `${p.locale}/${p.slug}`;
  if (!locales.includes(p.locale) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || seen.has(key) || !p.title || !p.description || !/^\d{4}-\d{2}-\d{2}$/.test(p.published)) throw new Error(`Invalid blog metadata: ${key}`);
  seen.add(key);
}
export const postPath = (post: Post) => getLocalizedPath(post.frontmatter.locale, `/blog/${post.frontmatter.slug}`);
export const postsFor = (locale: Locale) => posts.filter(p => p.frontmatter.locale === locale);
export function translations(post: Post) {
  return Object.fromEntries(locales.map(locale => {
    const matches = posts.filter(p => p.frontmatter.translationKey === post.frontmatter.translationKey && p.frontmatter.locale === locale);
    if (matches.length !== 1) throw new Error(`Expected one ${locale} translation for ${post.frontmatter.translationKey}`);
    return [locale, postPath(matches[0])];
  })) as Record<Locale, string>;
}
export function blogAlternates(paths: Record<Locale, string>): AlternateLink[] {
  return [...locales.map(locale => ({ hrefLang: locale, href: new URL(paths[locale], siteUrl).href, locale: localeMeta[locale].ogLocale })),
    { hrefLang: 'en-US', href: new URL(paths.en, siteUrl).href },
    { hrefLang: 'x-default', href: new URL(paths.en, siteUrl).href }];
}
export const blogPaths = Object.fromEntries(locales.map(l => [l, getLocalizedPath(l, '/blog')])) as Record<Locale, string>;
export const blogCopy = {
  en: { title: 'Werewolf game guides', intro: 'Your next game night starts here. Learn the rules, understand the roles, and bring the village together with one phone.', label: 'The village journal', read: 'Read the guide', home: 'The game', all: 'All guides', toc: 'In this guide', related: 'Keep exploring', cta: 'Bring your village to life', ctaBody: 'Gather 5–18 players and let Werewolf Undercover narrate your next game night.', discover: 'Discover the app', published: 'Published', description: 'Learn how to play Werewolf, play without cards, and understand hidden roles. Practical Werewolf Undercover guides for your next game night.' },
  fr: { title: 'Les guides du Loup-garou', intro: 'Votre prochaine soirée commence ici. Apprenez les règles, découvrez les rôles et rassemblez le village autour d’un téléphone.', label: 'Le journal du village', read: 'Lire le guide', home: 'Le jeu', all: 'Tous les guides', toc: 'Dans ce guide', related: 'Pour aller plus loin', cta: 'Donnez vie à votre village', ctaBody: 'Réunissez 5 à 18 joueurs et laissez Loup-garou Undercover raconter votre prochaine partie.', discover: 'Découvrir l’application', published: 'Publié le', description: 'Apprenez les règles du Loup-garou, découvrez les rôles et jouez sans cartes. Des guides pratiques pour vos soirées avec Loup-garou Undercover.' },
  es: { title: 'Guías del juego de hombres lobo', intro: 'Tu próxima noche de juegos empieza aquí. Aprende las reglas, descubre los roles y reúne al pueblo con un solo teléfono.', label: 'El diario del pueblo', read: 'Leer la guía', home: 'El juego', all: 'Todas las guías', toc: 'En esta guía', related: 'Sigue explorando', cta: 'Dale vida a tu pueblo', ctaBody: 'Reúne de 5 a 18 jugadores y deja que Hombre lobo Undercover narre vuestra próxima partida.', discover: 'Descubrir la aplicación', published: 'Publicado el', description: 'Aprende a jugar a hombres lobo, conoce los roles y organiza partidas sin cartas. Guías prácticas de Hombre lobo Undercover para jugar con amigos.' },
  de: { title: 'Spielanleitungen für Werwolf', intro: 'Dein nächster Spieleabend beginnt hier. Lerne die Regeln, entdecke die Rollen und versammle das Dorf mit einem Smartphone.', label: 'Das Dorfjournal', read: 'Anleitung lesen', home: 'Das Spiel', all: 'Alle Anleitungen', toc: 'In dieser Anleitung', related: 'Weiterlesen', cta: 'Erwecke dein Dorf zum Leben', ctaBody: 'Versammle 5 bis 18 Spieler und lass Werwolf Undercover euren nächsten Spieleabend moderieren.', discover: 'App entdecken', published: 'Veröffentlicht am', description: 'Lerne die Werwolf-Regeln und Rollen kennen und spiele ohne Karten. Praktische Anleitungen für deinen nächsten Spieleabend mit Werwolf Undercover.' }
} satisfies Record<Locale, Record<string, string>>;

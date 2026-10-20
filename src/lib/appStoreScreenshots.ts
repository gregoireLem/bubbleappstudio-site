import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { Locale } from "../i18n/site";

export type AppStoreScreenshot = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
};

export const screenshotCopy = {
  fr: {
    heading: "La partie commence ici",
    description: "Un téléphone au centre de la table. Des rôles secrets. Une voix qui mène le jeu.",
    hint: "Faites défiler pour découvrir le jeu",
    images: [
      "Loup-Garou : une partie entre amis guidée par la voix du téléphone.",
      "Un joueur découvre son rôle secret de Loup-Garou.",
      "Le narrateur audio guide les joueurs pendant la nuit.",
      "Le téléphone passe de main en main pour révéler les rôles.",
      "Les joueurs choisissent qui éliminer pendant le vote.",
      "Loups-Garous ou Villageois : deux camps s'affrontent."
    ]
  },
  en: {
    heading: "Your next game night starts here",
    description: "One phone on the table. Secret roles. A voice that guides the game.",
    hint: "Scroll to explore the game",
    images: [
      "Werewolf: friends gather around a phone for an audio-guided game.",
      "A player discovers their secret Werewolf role.",
      "The audio narrator guides players through the night.",
      "Pass the phone around to reveal each player's role.",
      "Players choose who to eliminate during the vote.",
      "Werewolves or Villagers: two teams face off."
    ]
  },
  es: {
    heading: "La partida empieza aquí",
    description: "Un móvil en el centro de la mesa. Roles secretos. Una voz que guía la partida.",
    hint: "Desliza para descubrir el juego",
    images: [
      "Hombres Lobo: una partida entre amigos guiada por la voz del móvil.",
      "Un jugador descubre su rol secreto de hombre lobo.",
      "El narrador de audio guía a los jugadores durante la noche.",
      "El móvil pasa de mano en mano para revelar los roles.",
      "Los jugadores eligen a quién eliminar durante la votación.",
      "Hombres lobo o aldeanos: dos bandos se enfrentan."
    ]
  },
  de: {
    heading: "Hier beginnt euer Spieleabend",
    description: "Ein Handy auf dem Tisch. Geheime Rollen. Eine Stimme, die durchs Spiel führt.",
    hint: "Wische, um das Spiel zu entdecken",
    images: [
      "Werwolf: Freunde spielen gemeinsam mit der Stimme des Handys als Erzähler.",
      "Ein Spieler entdeckt seine geheime Rolle als Werwolf.",
      "Der Audio-Erzähler führt die Spieler durch die Nacht.",
      "Das Handy wird herumgereicht, um die geheimen Rollen aufzudecken.",
      "Bei der Abstimmung wählen die Spieler, wer ausscheiden soll.",
      "Werwölfe oder Dorfbewohner: Zwei Teams treten gegeneinander an."
    ]
  }
} satisfies Record<Locale, { heading: string; description: string; hint: string; images: string[] }>;

const originals = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/app-store/*/*.jpg",
  { eager: true }
);

export async function getAppStoreScreenshots(locale: Locale): Promise<AppStoreScreenshot[]> {
  return Promise.all(screenshotCopy[locale].images.map(async (alt, index) => {
    const file = String(index + 1).padStart(2, "0");
    const source = originals[`../assets/app-store/${locale}/${file}.jpg`].default;
    const [small, large] = await Promise.all(
      [400, 750].map((width) => getImage({ src: source, width, format: "webp", quality: 85 }))
    );
    return {
      src: small.src,
      srcSet: `${small.src} 400w, ${large.src} 750w`,
      width: source.width,
      height: source.height,
      alt
    };
  }));
}

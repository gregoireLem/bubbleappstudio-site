import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { bombPlayWords } from "../data/bombPlayWords";

type Phase = "intro" | "arming" | "ready" | "live" | "bloom" | "results";
type CameraMode = "idle" | "requesting" | "ready" | "fallback" | "error";

type CameraState = {
  mode: CameraMode;
  message: string;
  topStream: MediaStream | null;
  bottomStream: MediaStream | null;
  topMirrored: boolean;
  bottomMirrored: boolean;
  topLabel: string;
  bottomLabel: string;
};

type Accord = {
  name: string;
  copy: string;
  notes: string[];
};

const ROUND_DURATION = 30;
const READY_STEPS = ["3", "2", "1", "GO"];
const BLOOM_DURATION_MS = 2600;
const BEST_SCORE_KEY = "bomb-play-best-score";
const CAMERA_BOOT_TIMEOUT_MS = 900;

const colors = {
  electricViolet: "#6200FF",
  deepViolet: "#2E0099",
  lime: "#D8FF00",
  white: "#FFFFFF",
  black: "#04020B"
};

const accords: Accord[] = [
  {
    name: "Velvet Rose",
    copy: "The round opens like an atomizer burst, then settles into petals, powder and a bright trace of pink pepper.",
    notes: ["rose", "pink pepper", "powder", "velvet"]
  },
  {
    name: "Iris Static",
    copy: "A clean iris spray opens over the screen, then fades into amber, cedar and skin-soft musk.",
    notes: ["iris", "amber", "cedar", "musk"]
  },
  {
    name: "Night Bloom",
    copy: "White florals bloom through a fine mist first, then leave behind a smooth trail of jasmine and cashmere wood.",
    notes: ["white floral", "jasmine", "cashmere", "wood"]
  }
];

const petals = Array.from({ length: 16 }, (_, index) => {
  const horizontalBand = -1 + (index % 8) / 3.5;
  const lift = 86 + Math.floor(index / 2) * 16;

  return {
    id: index,
    x: horizontalBand * 56 + (index % 2 === 0 ? -10 : 10),
    y: -lift,
    rotate: -26 + index * 8,
    scale: 0.82 + (index % 4) * 0.12
  };
});

const initialCameraState: CameraState = {
  mode: "idle",
  message: "Enable the camera to mirror the native two-feed look.",
  topStream: null,
  bottomStream: null,
  topMirrored: false,
  bottomMirrored: true,
  topLabel: "Rear feed",
  bottomLabel: "Front feed"
};

function shuffleWords(words: readonly string[]) {
  const next = [...words];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
}

function readBestScore() {
  if (typeof window === "undefined") return 0;

  const rawValue = window.localStorage.getItem(BEST_SCORE_KEY);
  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function normalizeDeviceLabel(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function findCameraDeviceId(facing: "environment" | "user") {
  if (!navigator.mediaDevices?.enumerateDevices) return null;

  const matchers =
    facing === "environment"
      ? [/back/, /rear/, /environment/, /world/, /arriere/]
      : [/front/, /user/, /selfie/, /facetime/, /avant/];

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const camera = devices
      .filter((device) => device.kind === "videoinput")
      .find((device) => matchers.some((matcher) => matcher.test(normalizeDeviceLabel(device.label))));

    return camera?.deviceId ?? null;
  } catch {
    return null;
  }
}

async function primeCameraPermission() {
  if (!navigator.mediaDevices?.getUserMedia || !navigator.mediaDevices?.enumerateDevices) {
    return;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasNamedCamera = devices.some(
      (device) => device.kind === "videoinput" && device.label.trim().length > 0
    );

    if (hasNamedCamera) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    stopStream(stream);
  } catch {
    // Ignore: the real request path below handles user-facing errors.
  }
}

function FeedVideo({
  stream,
  mirrored,
  label
}: {
  stream: MediaStream | null;
  mirrored: boolean;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;

    node.srcObject = stream;

    const playPromise = node.play();
    if (playPromise) {
      playPromise.catch(() => undefined);
    }

    return () => {
      if (node.srcObject === stream) {
        node.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(98,0,255,0.45),transparent_42%),linear-gradient(180deg,#181033_0%,#090312_100%)]">
          <div className="text-center">
            <p
              className="text-[0.62rem] uppercase tracking-[0.28em] text-white/55"
              style={{ fontFamily: "\"Avenir Next\", \"Helvetica Neue\", sans-serif" }}
            >
              {label}
            </p>
            <p
              className="mt-3 text-2xl text-white/85"
              style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
            >
              Camera preview
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(0,0,0,0.46),rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgba(0,0,0,0.56),rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/14 bg-black/35 px-3 py-2 text-[0.6rem] uppercase tracking-[0.28em] text-white/82 backdrop-blur-md">
        {label}
      </div>
    </div>
  );
}

function FinalBloom({
  active,
  accord,
  score
}: {
  active: boolean;
  accord: Accord;
  score: number;
}) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div
            className="absolute h-[24rem] w-[24rem] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(248,224,255,0.86) 18%, rgba(98,0,255,0.34) 44%, rgba(98,0,255,0) 72%)",
              filter: "blur(10px)"
            }}
            initial={{ scale: 0.2, opacity: 0.1 }}
            animate={{ scale: 2, opacity: 1 }}
            exit={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.19, 1, 0.22, 1] }}
          />

          <motion.div
            className="absolute h-[28rem] w-[18rem] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 65%, rgba(255,255,255,0.62) 0%, rgba(255,226,241,0.28) 32%, rgba(255,255,255,0) 68%)",
              filter: "blur(24px)"
            }}
            initial={{ opacity: 0, scaleX: 0.7, scaleY: 0.45, y: 80 }}
            animate={{ opacity: 1, scaleX: 1.25, scaleY: 1.35, y: -14 }}
            exit={{ opacity: 0, y: -32 }}
            transition={{ duration: 1.15, ease: [0.19, 1, 0.22, 1] }}
          />

          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute rounded-[999px]"
              style={{
                width: 44,
                height: 108,
                background:
                  "linear-gradient(180deg, rgba(255,244,253,0.96), rgba(252,208,236,0.88) 38%, rgba(255,255,255,0.28))",
                boxShadow: "0 14px 40px rgba(46, 0, 153, 0.18)",
                transformOrigin: "50% 82%"
              }}
              initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 0 }}
              animate={{
                x: petal.x,
                y: petal.y,
                scale: petal.scale,
                rotate: petal.rotate,
                opacity: [0, 1, 0.8, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.55,
                times: [0, 0.18, 0.72, 1],
                ease: [0.19, 1, 0.22, 1]
              }}
            />
          ))}

          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 56%, rgba(255,255,255,0.22), rgba(255,255,255,0) 28%), radial-gradient(circle at 50% 44%, rgba(245,222,255,0.18), rgba(245,222,255,0) 46%)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />

          <motion.div
            className="relative z-10 mx-6 max-w-md rounded-[2rem] border border-white/20 bg-[rgba(20,11,50,0.72)] px-7 py-8 text-center shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl"
            initial={{ y: 18, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ delay: 0.18, duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
          >
            <p className="text-[0.64rem] uppercase tracking-[0.32em] text-[#D8FF00]">Perfume burst</p>
            <h3
              className="mt-3 text-4xl text-white"
              style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
            >
              {accord.name}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/75">{accord.copy}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {accord.notes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-white/14 bg-white/8 px-3 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/72"
                >
                  {note}
                </span>
              ))}
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-white/55">
              {score} passwords before the bloom
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function BombPlayExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [readyIndex, setReadyIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [passes, setPasses] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_DURATION);
  const [bestScore, setBestScore] = useState(0);
  const [roundWords, setRoundWords] = useState<string[]>(() => shuffleWords(bombPlayWords));
  const [wordIndex, setWordIndex] = useState(0);
  const [cameraState, setCameraState] = useState<CameraState>(initialCameraState);
  const [bloomKey, setBloomKey] = useState(0);
  const [accord, setAccord] = useState<Accord>(accords[0]);
  const [validationFlashOpacity, setValidationFlashOpacity] = useState(0);

  const roundStartRef = useRef(0);
  const ownedStreamsRef = useRef<MediaStream[]>([]);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiInstanceRef = useRef<((options: Record<string, unknown>) => Promise<null> | null) | null>(null);
  const confettiLoaderRef = useRef<Promise<typeof import("canvas-confetti")> | null>(null);
  const validationTimeoutRef = useRef<number | null>(null);

  const displaySeconds = Math.max(0, Math.ceil(secondsLeft));
  const progress = Math.max(0, Math.min(1, secondsLeft / ROUND_DURATION));
  const currentWord = roundWords[wordIndex] ?? bombPlayWords[wordIndex % bombPlayWords.length];
  const isActionVisible = phase === "live";
  const isStatusOverlayVisible =
    phase === "intro" || phase === "arming" || phase === "ready" || phase === "results";

  const resultsCopy = useMemo(() => {
    if (score >= 10) return "That round felt expensive.";
    if (score >= 6) return "Sharp tempo. Clean finish.";
    if (score >= 3) return "Good rhythm. Go again and push it harder.";
    return "The bloom was better than the score. Run it back.";
  }, [score]);

  useEffect(() => {
    setBestScore(readBestScore());
  }, []);

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        window.clearTimeout(validationTimeoutRef.current);
      }

      confettiInstanceRef.current?.reset();
      ownedStreamsRef.current.forEach((stream) => stopStream(stream));
    };
  }, []);

  useEffect(() => {
    if (phase !== "ready") return undefined;

    const timeout = window.setTimeout(() => {
      setReadyIndex((currentIndex) => {
        if (currentIndex >= READY_STEPS.length - 1) {
          roundStartRef.current = window.performance.now();
          setSecondsLeft(ROUND_DURATION);
          setPhase("live");
          return currentIndex;
        }

        return currentIndex + 1;
      });
    }, 680);

    return () => window.clearTimeout(timeout);
  }, [phase, readyIndex]);

  useEffect(() => {
    if (phase !== "live") return undefined;

    let animationFrame = 0;

    const update = () => {
      const elapsed = (window.performance.now() - roundStartRef.current) / 1000;
      const nextSecondsLeft = Math.max(0, ROUND_DURATION - elapsed);

      setSecondsLeft(nextSecondsLeft);

      if (nextSecondsLeft <= 0) {
        const nextAccord = accords[Math.floor(Math.random() * accords.length)];

        setAccord(nextAccord);
        setBloomKey((current) => current + 1);
        setPhase("bloom");
        launchFinale();
        return;
      }

      animationFrame = window.requestAnimationFrame(update);
    };

    animationFrame = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "bloom") return undefined;

    const timeout = window.setTimeout(() => {
      setPhase("results");
      setBestScore((currentBest) => {
        const nextBest = Math.max(currentBest, score);

        window.localStorage.setItem(BEST_SCORE_KEY, String(nextBest));
        return nextBest;
      });
    }, BLOOM_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [phase, score]);

  const launchFinale = () => {
    if (!confettiCanvasRef.current || prefersReducedMotion) return;

    const loadConfetti =
      confettiLoaderRef.current ??
      import("canvas-confetti").then((module) => {
        const confetti = module.default ?? module;

        confettiInstanceRef.current = confetti.create(confettiCanvasRef.current!, {
          resize: true,
          useWorker: true
        });

        return module;
      });

    confettiLoaderRef.current = loadConfetti;

    void loadConfetti.then((module) => {
      const confetti = module.default ?? module;
      const instance = confettiInstanceRef.current ?? confetti.create(confettiCanvasRef.current!, { resize: true, useWorker: true });
      confettiInstanceRef.current = instance;

      const petalShape = confetti.shapeFromPath({
        path: "M0 18C0 8 6 0 14 0C21 0 28 8 28 18C28 29 21 39 14 48C7 39 0 29 0 18Z"
      });

      const mistColors = ["#FFFFFF", "#FBE6F6", "#F3D7FF", "#E7D8FF", "#F8F1FF"];

      const mistBurst = (
        originX: number,
        originY: number,
        angle: number,
        particleCount: number,
        spread: number,
        drift: number
      ) => {
        instance({
          particleCount,
          angle,
          spread,
          startVelocity: 30,
          decay: 0.95,
          gravity: 0.34,
          drift,
          ticks: 260,
          scalar: 0.62,
          flat: true,
          origin: { x: originX, y: originY },
          colors: mistColors,
          shapes: ["circle"],
          disableForReducedMotion: true
        });
      };

      const petalBurst = (originX: number, angle: number, spread: number) => {
        instance({
          particleCount: 18,
          angle,
          spread,
          startVelocity: 26,
          decay: 0.93,
          gravity: 0.46,
          ticks: 240,
          scalar: 0.9,
          drift: originX < 0.5 ? -0.08 : 0.08,
          origin: { x: originX, y: 0.68 },
          colors: ["#FFD9EF", "#FBE9FF", "#EAD7FF"],
          shapes: [petalShape],
          disableForReducedMotion: true
        });
      };

      mistBurst(0.5, 0.72, 90, 90, 28, 0);
      window.setTimeout(() => mistBurst(0.46, 0.72, 82, 38, 16, -0.12), 90);
      window.setTimeout(() => mistBurst(0.54, 0.72, 98, 38, 16, 0.12), 90);
      window.setTimeout(() => mistBurst(0.5, 0.68, 90, 54, 58, 0), 180);
      window.setTimeout(() => petalBurst(0.44, 76, 18), 120);
      window.setTimeout(() => petalBurst(0.56, 104, 18), 120);
    });
  };

  const replaceOwnedStreams = (streams: MediaStream[]) => {
    const nextOwnedStreams = streams.filter(
      (stream, index) => streams.findIndex((candidate) => candidate.id === stream.id) === index
    );

    ownedStreamsRef.current.forEach((stream) => {
      if (!nextOwnedStreams.some((candidate) => candidate.id === stream.id)) {
        stopStream(stream);
      }
    });

    ownedStreamsRef.current = nextOwnedStreams;
  };

  const requestVideoStream = async (
    constraints: MediaTrackConstraints
  ): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1080 },
        height: { ideal: 1920 },
        aspectRatio: { ideal: 9 / 16 },
        ...constraints
      },
      audio: false
    });
  };

  const requestFacingStream = async (facing: "environment" | "user") => {
    const preferredDeviceId = await findCameraDeviceId(facing);
    const attempts: MediaTrackConstraints[] = [];

    if (preferredDeviceId) {
      attempts.push({ deviceId: { exact: preferredDeviceId } });
    }

    attempts.push({ facingMode: { exact: facing } });
    attempts.push({ facingMode: { ideal: facing } });

    for (const attempt of attempts) {
      try {
        const stream = await requestVideoStream(attempt);
        const track = stream.getVideoTracks()[0];
        const settings = track?.getSettings();
        const resolvedFacing = settings?.facingMode ?? "";
        const resolvedDeviceId = settings?.deviceId ?? "";
        const isMatchingFacing =
          resolvedFacing === facing ||
          (preferredDeviceId.length > 0 && resolvedDeviceId === preferredDeviceId);

        if (isMatchingFacing || (!resolvedFacing && !preferredDeviceId)) {
          return stream;
        }

        stopStream(stream);
      } catch {
        continue;
      }
    }

    return null;
  };

  const ensureCameras = async () => {
    if (
      (cameraState.mode === "ready" || cameraState.mode === "fallback") &&
      (cameraState.topStream || cameraState.bottomStream)
    ) {
      return true;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState({
        ...initialCameraState,
        mode: "error",
        message:
          "Live camera preview is unavailable on this URL. On iPhone, camera access needs HTTPS or localhost."
      });
      return false;
    }

    if (!window.isSecureContext) {
      setCameraState({
        ...initialCameraState,
        mode: "fallback",
        message:
          "On iPhone, live camera access usually needs HTTPS or localhost. This local preview keeps the split layout without blocking the round."
      });
      return false;
    }

    setCameraState((currentState) => ({
      ...currentState,
      mode: "requesting",
      message: "Preparing the split camera stage..."
    }));

    try {
      await primeCameraPermission();

      let topStream: MediaStream | null = null;
      let bottomStream: MediaStream | null = null;

      topStream = await requestFacingStream("environment");
      bottomStream = await requestFacingStream("user");

      if (!topStream && !bottomStream) {
        topStream = await requestFacingStream("user");
      }

      if (!topStream && bottomStream) {
        topStream = bottomStream;
      }

      if (!topStream) {
        throw new Error("Camera access failed");
      }

      const topTrack = topStream.getVideoTracks()[0];
      const bottomTrack = bottomStream?.getVideoTracks()[0] ?? null;
      const topDeviceId = topTrack?.getSettings().deviceId ?? "";
      const bottomDeviceId = bottomTrack?.getSettings().deviceId ?? "";
      const topFacing = topTrack?.getSettings().facingMode ?? "";
      const bottomFacing = bottomTrack?.getSettings().facingMode ?? "";
      const usingDistinctCameras =
        Boolean(bottomStream) &&
        Boolean(bottomTrack) &&
        topStream.id !== bottomStream?.id &&
        ((Boolean(topDeviceId) && Boolean(bottomDeviceId) && topDeviceId !== bottomDeviceId) ||
          (Boolean(topFacing) && Boolean(bottomFacing) && topFacing !== bottomFacing));

      if (!usingDistinctCameras) {
        const singleStream = (await requestFacingStream("environment")) ?? topStream ?? bottomStream;

        if (!singleStream) {
          throw new Error("Camera access failed");
        }

        if (topStream.id !== singleStream.id) {
          stopStream(topStream);
        }
        if (bottomStream && bottomStream.id !== singleStream.id) {
          stopStream(bottomStream);
        }

        const singleTrack = singleStream.getVideoTracks()[0];
        const singleFacing = singleTrack?.getSettings().facingMode ?? "";
        const singleIsUserFacing = singleFacing === "user";

        replaceOwnedStreams([singleStream]);

        setCameraState({
          mode: "fallback",
          message:
            singleIsUserFacing
              ? "Your browser exposes one live camera at a time. The front feed is live; the rear feed cannot run alongside it on iPhone web."
              : "Your browser exposes one live camera at a time. The rear feed is live; the front feed cannot run alongside it on iPhone web.",
          topStream: singleStream,
          bottomStream: null,
          topMirrored: singleIsUserFacing,
          bottomMirrored: true,
          topLabel: singleIsUserFacing ? "Front feed" : "Rear feed",
          bottomLabel: singleIsUserFacing ? "Rear feed unavailable" : "Front feed unavailable"
        });
      } else {
        replaceOwnedStreams([topStream, bottomStream!]);

        setCameraState({
          mode: "ready",
          message: "Rear and front previews are active.",
          topStream,
          bottomStream,
          topMirrored: false,
          bottomMirrored: true,
          topLabel: "Rear feed",
          bottomLabel: "Front feed"
        });
      }

      return true;
    } catch {
      replaceOwnedStreams([]);
      setCameraState({
        ...initialCameraState,
        mode: "error",
        message:
          "Camera access was blocked or unavailable. On iPhone, test this over HTTPS to unlock the live feeds."
      });
      return false;
    }
  };

  const resetRound = () => {
    setRoundWords(shuffleWords(bombPlayWords));
    setWordIndex(0);
    setScore(0);
    setPasses(0);
    setSecondsLeft(ROUND_DURATION);
    setReadyIndex(0);
  };

  const startRound = async () => {
    resetRound();
    setPhase("arming");
    await Promise.race([
      ensureCameras(),
      new Promise((resolve) => window.setTimeout(resolve, CAMERA_BOOT_TIMEOUT_MS))
    ]);
    setPhase("ready");
  };

  const backToIntro = () => {
    resetRound();
    setPhase("intro");
  };

  const triggerValidationFlash = () => {
    if (validationTimeoutRef.current) {
      window.clearTimeout(validationTimeoutRef.current);
    }

    setValidationFlashOpacity(0.9);
    validationTimeoutRef.current = window.setTimeout(() => {
      setValidationFlashOpacity(0);
    }, 260);
  };

  const handleFound = () => {
    if (phase !== "live") return;

    setScore((currentScore) => currentScore + 1);
    setWordIndex((currentIndex) => currentIndex + 1);
    triggerValidationFlash();
  };

  const handlePass = () => {
    if (phase !== "live") return;

    setPasses((currentPasses) => currentPasses + 1);
    setWordIndex((currentIndex) => currentIndex + 1);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(98,0,255,0.34),transparent_36%),linear-gradient(180deg,#6200FF_0%,#2E0099_34%,#2E0099_66%,#6200FF_100%)]" />

      <div className="absolute inset-0">
        <div className="h-1/2 w-full border-b border-white/6">
          <FeedVideo
            stream={cameraState.topStream}
            mirrored={cameraState.topMirrored}
            label={cameraState.topLabel}
          />
        </div>
        <div className="h-1/2 w-full">
          <FeedVideo
            stream={cameraState.bottomStream}
            mirrored={cameraState.bottomMirrored}
            label={cameraState.bottomLabel}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0)_24%,rgba(0,0,0,0)_78%,rgba(0,0,0,0.38)_100%)]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,255,0,0.26),rgba(216,255,0,0.02)_50%,rgba(216,255,0,0)_72%)] blur-2xl" />

      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={backToIntro}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/34 text-base font-black text-white/95 backdrop-blur-md transition hover:bg-black/46"
            aria-label="Back to intro"
          >
            ×
          </button>

          <div className="flex min-w-0 items-center gap-2">
            <div className="rounded-full border border-white/12 bg-black/34 px-3 py-2 text-[0.72rem] font-black uppercase tracking-[0.22em] text-white/95 backdrop-blur-md">
              {score} found
            </div>
            <div className="hidden rounded-full border border-[#D8FF00]/55 bg-black/28 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.26em] text-white/88 backdrop-blur-md sm:block">
              Bomb Play
            </div>
          </div>

          <div className="rounded-full border border-white/16 bg-white/14 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md">
            <span
              className="text-[1.9rem] font-black leading-none text-white"
              style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
            >
              {displaySeconds}
            </span>
          </div>
        </div>

        {cameraState.mode === "fallback" || cameraState.mode === "error" ? (
          <div className="mx-auto mt-3 max-w-5xl">
            <div className="inline-flex max-w-full rounded-full border border-white/10 bg-black/36 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/72 backdrop-blur-md">
              {cameraState.message}
            </div>
          </div>
        ) : null}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
        {phase === "live" ? (
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="w-full max-w-[min(92vw,28rem)] rounded-[1.8rem] border-[3px] border-[#D8FF00] px-6 py-7 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_34px_rgba(216,255,0,0.28),0_16px_38px_rgba(0,0,0,0.34)]"
            style={{
              background: "linear-gradient(135deg, rgba(98,0,255,0.96), rgba(46,0,153,0.96))"
            }}
          >
            <p
              className="text-[2rem] font-black uppercase tracking-[-0.03em] text-white sm:text-[2.35rem]"
              style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
            >
              {currentWord}
            </p>
          </motion.div>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6">
        <div className="mx-auto max-w-5xl pb-4">
          <AnimatePresence>
            {isActionVisible ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="flex items-center gap-4"
              >
                <button
                  type="button"
                  onClick={handlePass}
                  className="flex-1 rounded-[1.55rem] border border-[#D8FF00]/72 bg-[rgba(46,0,153,0.84)] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.24em] text-white shadow-[0_14px_32px_rgba(0,0,0,0.22)] transition hover:translate-y-[-1px]"
                >
                  Pass
                </button>
                <button
                  type="button"
                  onClick={handleFound}
                  className="flex-1 rounded-[1.55rem] border border-white/38 bg-[#D8FF00] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.24em] text-[#2E0099] shadow-[0_14px_34px_rgba(216,255,0,0.24)] transition hover:translate-y-[-1px]"
                >
                  Found it
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isStatusOverlayVisible ? (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(10,5,24,0.45)] px-5 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 1.02 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-md rounded-[2rem] border border-white/12 bg-[rgba(16,8,40,0.84)] px-7 py-8 text-center shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl"
            >
              {phase === "intro" ? (
                <>
                  <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[#D8FF00]">Web edition</p>
                  <h1
                    className="mt-4 text-4xl text-white sm:text-5xl"
                    style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
                  >
                    Bomb Play
                  </h1>
                  <p className="mt-5 text-sm leading-7 text-white/78">
                    Just like the app: split screen, the word in the middle, sharp 30-second rounds, then a floral perfume-style explosion.
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/48">
                    One-word clues only
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      void startRound();
                    }}
                    className="mt-7 inline-flex w-full items-center justify-center rounded-[1.4rem] border border-white/30 bg-[#D8FF00] px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-[#2E0099] shadow-[0_16px_34px_rgba(216,255,0,0.24)] transition hover:translate-y-[-1px]"
                  >
                    Enable camera and play
                  </button>
                  <p className="mt-4 text-[0.72rem] leading-6 text-white/52">
                    On some phones, the browser may only expose one live camera feed. The layout still stays split.
                  </p>
                </>
              ) : null}

              {phase === "arming" ? (
                <>
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/12 border-t-[#D8FF00]" />
                  <h2
                    className="mt-5 text-3xl text-white"
                    style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
                  >
                    Preparing stage
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/72">{cameraState.message}</p>
                </>
              ) : null}

              {phase === "ready" ? (
                <>
                  <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[#D8FF00]">Pass the phone</p>
                  <motion.p
                    key={READY_STEPS[readyIndex]}
                    initial={{ opacity: 0, y: 20, scale: 0.84 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.08 }}
                    className="mt-5 text-[5.5rem] font-black leading-none text-white"
                    style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
                  >
                    {READY_STEPS[readyIndex]}
                  </motion.p>
                  <p className="mt-4 text-sm leading-7 text-white/74">
                    The password appears on go. Keep the clue clean and fast.
                  </p>
                </>
              ) : null}

              {phase === "results" ? (
                <>
                  <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[#D8FF00]">Round finished</p>
                  <h2
                    className="mt-4 text-5xl font-black text-white"
                    style={{ fontFamily: "ui-rounded, \"SF Pro Rounded\", sans-serif" }}
                  >
                    {score}
                  </h2>
                  <p className="mt-2 text-[0.72rem] uppercase tracking-[0.26em] text-white/58">
                    passwords found
                  </p>
                  <p className="mt-5 text-sm leading-7 text-white/76">{resultsCopy}</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      ["Found", String(score)],
                      ["Passes", String(passes)],
                      ["Best", String(bestScore)]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1.2rem] border border-white/10 bg-white/8 px-3 py-3">
                        <p className="text-[0.6rem] uppercase tracking-[0.24em] text-white/48">{label}</p>
                        <p className="mt-2 text-xl font-black text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        void startRound();
                      }}
                      className="inline-flex w-full items-center justify-center rounded-[1.4rem] border border-white/30 bg-[#D8FF00] px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-[#2E0099] shadow-[0_16px_34px_rgba(216,255,0,0.24)] transition hover:translate-y-[-1px]"
                    >
                      Play again
                    </button>
                    <button
                      type="button"
                      onClick={backToIntro}
                      className="inline-flex w-full items-center justify-center rounded-[1.4rem] border border-white/14 bg-white/8 px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-white/92 transition hover:bg-white/12"
                    >
                      Back to intro
                    </button>
                  </div>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FinalBloom active={phase === "bloom"} accord={accord} score={score} key={bloomKey} />

      <motion.div
        className="pointer-events-none absolute inset-0 z-50 bg-white"
        animate={{ opacity: validationFlashOpacity }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      />

      <canvas ref={confettiCanvasRef} className="pointer-events-none absolute inset-0 z-50 h-full w-full" />
    </section>
  );
}

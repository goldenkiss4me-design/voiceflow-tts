import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import AudioPlayer from "./components/AudioPlayer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HistoryPanel from "./components/HistoryPanel";
import TTSEditor from "./components/TTSEditor";
import {
  AccentSetting,
  SpeedSetting,
  VoiceSetting,
  useAddEntry,
} from "./hooks/useQueries";

export interface TTSSettings {
  voice: VoiceSetting;
  accent: AccentSetting;
  speed: SpeedSetting;
}

export interface GeneratedAudio {
  text: string;
  settings: TTSSettings;
  isPlaying: boolean;
}

function speakText(text: string, settings: TTSSettings, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) {
    toast.error("Your browser doesn't support Text-to-Speech.");
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const langMap: Record<string, string> = {
    [AccentSetting.us]: "en-US",
    [AccentSetting.uk]: "en-GB",
    [AccentSetting.african]: "en-ZA",
  };
  utterance.lang = langMap[settings.accent] ?? "en-US";

  const rateMap: Record<string, number> = {
    [SpeedSetting.slow]: 0.7,
    [SpeedSetting.normal]: 1.0,
    [SpeedSetting.fast]: 1.5,
  };
  utterance.rate = rateMap[settings.speed] ?? 1.0;

  const voices = window.speechSynthesis.getVoices();
  const targetLang = langMap[settings.accent] ?? "en-US";
  const langPrefix = targetLang.split("-")[0];
  const langVoices = voices.filter(
    (v) => v.lang === targetLang || v.lang.startsWith(langPrefix),
  );

  if (langVoices.length > 0) {
    if (settings.voice === VoiceSetting.male) {
      const male = langVoices.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          ["David", "Mark", "Daniel", "James", "Alex", "George"].some((n) =>
            v.name.includes(n),
          ),
      );
      utterance.voice = male || langVoices[0];
    } else {
      const female = langVoices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          ["Zira", "Susan", "Kate", "Samantha", "Victoria", "Karen"].some((n) =>
            v.name.includes(n),
          ),
      );
      utterance.voice = female || langVoices[langVoices.length > 1 ? 1 : 0];
    }
  }

  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export { speakText };

export default function App() {
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const addEntry = useAddEntry();

  const handleGenerate = useCallback(
    async (text: string, settings: TTSSettings) => {
      if (!text.trim()) {
        toast.error("Please enter some text first.");
        return;
      }
      setIsGenerating(true);
      setGeneratedAudio(null);

      await new Promise((r) => setTimeout(r, 1500));

      setIsGenerating(false);
      setGeneratedAudio({ text, settings, isPlaying: true });

      speakText(text, settings, () => {
        setGeneratedAudio((prev) =>
          prev ? { ...prev, isPlaying: false } : null,
        );
      });

      addEntry.mutate({
        text,
        voice: settings.voice,
        accent: settings.accent,
        speed: settings.speed,
      });
    },
    [addEntry],
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" />
      <Header />

      <main className="flex-1">
        <Hero />

        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TTSEditor
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />

                {(isGenerating || generatedAudio) && (
                  <AudioPlayer
                    audio={generatedAudio}
                    isGenerating={isGenerating}
                    onPlay={(playing) =>
                      setGeneratedAudio((prev) =>
                        prev ? { ...prev, isPlaying: playing } : null,
                      )
                    }
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                <HistoryPanel />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Headphones, Pause, Play, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { speakText } from "../App";
import type { GeneratedAudio } from "../App";

interface Props {
  audio: GeneratedAudio | null;
  isGenerating: boolean;
  onPlay: (playing: boolean) => void;
}

const WAVEFORM_BARS = Array.from({ length: 40 }, (_, i) => ({
  id: `bar-${i}`,
  height:
    [
      20, 45, 30, 60, 35, 70, 50, 80, 55, 40, 65, 30, 75, 45, 55, 25, 60, 40,
      70, 35, 50, 65, 30, 55, 45, 75, 20, 60, 35, 50, 65, 40, 70, 30, 55, 45,
      60, 35, 50, 40,
    ][i] || 40,
  delay: ((i * 0.05) % 1.2).toFixed(2),
}));

function AnimatedWaveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[4px] h-16">
      {WAVEFORM_BARS.map((bar) => (
        <div
          key={bar.id}
          className={isPlaying ? "waveform-bar" : "waveform-bar-static"}
          style={{
            height: `${bar.height}%`,
            animationDelay: isPlaying ? `${bar.delay}s` : "0s",
          }}
        />
      ))}
    </div>
  );
}

export default function AudioPlayer({ audio, isGenerating, onPlay }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audio) {
      setIsPlaying(audio.isPlaying);
    }
  }, [audio]);

  const handlePlayPause = useCallback(() => {
    if (!audio) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      onPlay(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        onPlay(true);
      } else {
        window.speechSynthesis.cancel();
        speakText(audio.text, audio.settings, () => {
          setIsPlaying(false);
          onPlay(false);
        });
        setIsPlaying(true);
        onPlay(true);
      }
    }
  }, [audio, isPlaying, onPlay]);

  const handleDownload = (format: "mp3" | "wav") => {
    toast.info(
      `Download as ${format.toUpperCase()}: Replaying audio via your browser\'s built-in TTS. For file export, a backend TTS service is required.`,
      { duration: 4000 },
    );
    if (audio) {
      window.speechSynthesis.cancel();
      speakText(audio.text, audio.settings, () => {
        setIsPlaying(false);
        onPlay(false);
      });
      setIsPlaying(true);
      onPlay(true);
    }
  };

  const accentLabel: Record<string, string> = {
    us: "US English",
    uk: "UK English",
    african: "African English",
  };

  return (
    <AnimatePresence>
      <motion.div
        key="audio-player"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        data-ocid="audio.card"
      >
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Headphones className="h-4 w-4 text-primary" />
              </div>
              Audio Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGenerating ? (
              <div className="space-y-3" data-ocid="audio.loading_state">
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
            ) : audio ? (
              <>
                <div className="bg-muted/50 rounded-xl px-4 py-2">
                  <AnimatedWaveform isPlaying={isPlaying} />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Volume2 className="h-3 w-3" />
                    {audio.settings.voice === "female" ? "Female" : "Male"}{" "}
                    Voice
                  </span>
                  <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                    {accentLabel[audio.settings.accent]}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                    {audio.settings.speed} speed
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlayPause}
                    size="icon"
                    className="h-10 w-10 rounded-xl flex-shrink-0"
                    data-ocid="audio.primary_button"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-1000"
                      style={{ width: isPlaying ? "60%" : "0%" }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-10 rounded-xl border-border font-semibold text-sm"
                    onClick={() => handleDownload("mp3")}
                    data-ocid="audio.secondary_button"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download MP3
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 rounded-xl border-border font-semibold text-sm"
                    onClick={() => handleDownload("wav")}
                    data-ocid="audio.secondary_button"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download WAV
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

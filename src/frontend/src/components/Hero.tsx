import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const WAVEFORM_BARS = [
  { id: "wb01", h: 12 },
  { id: "wb02", h: 28 },
  { id: "wb03", h: 18 },
  { id: "wb04", h: 40 },
  { id: "wb05", h: 22 },
  { id: "wb06", h: 50 },
  { id: "wb07", h: 30 },
  { id: "wb08", h: 60 },
  { id: "wb09", h: 45 },
  { id: "wb10", h: 70 },
  { id: "wb11", h: 55 },
  { id: "wb12", h: 80 },
  { id: "wb13", h: 60 },
  { id: "wb14", h: 72 },
  { id: "wb15", h: 50 },
  { id: "wb16", h: 64 },
  { id: "wb17", h: 42 },
  { id: "wb18", h: 56 },
  { id: "wb19", h: 36 },
  { id: "wb20", h: 48 },
  { id: "wb21", h: 28 },
  { id: "wb22", h: 42 },
  { id: "wb23", h: 20 },
  { id: "wb24", h: 36 },
  { id: "wb25", h: 16 },
  { id: "wb26", h: 28 },
  { id: "wb27", h: 12 },
  { id: "wb28", h: 22 },
  { id: "wb29", h: 18 },
  { id: "wb30", h: 32 },
  { id: "wb31", h: 24 },
  { id: "wb32", h: 44 },
  { id: "wb33", h: 30 },
  { id: "wb34", h: 56 },
  { id: "wb35", h: 38 },
  { id: "wb36", h: 64 },
  { id: "wb37", h: 44 },
  { id: "wb38", h: 72 },
  { id: "wb39", h: 52 },
  { id: "wb40", h: 60 },
  { id: "wb41", h: 40 },
  { id: "wb42", h: 50 },
  { id: "wb43", h: 32 },
  { id: "wb44", h: 42 },
  { id: "wb45", h: 24 },
  { id: "wb46", h: 34 },
  { id: "wb47", h: 18 },
  { id: "wb48", h: 26 },
  { id: "wb49", h: 14 },
  { id: "wb50", h: 20 },
];

function WaveformIllustration() {
  return (
    <div className="flex items-center justify-center gap-[4px] h-32 px-8">
      {WAVEFORM_BARS.map((bar) => (
        <div
          key={bar.id}
          className="waveform-bar-static opacity-70"
          style={{ height: `${bar.h}%` }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const scrollToEditor = () => {
    document
      .querySelector("#tts-editor")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 px-4 border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Text to Speech
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
              Convert Text to{" "}
              <span className="text-primary">Natural Voice</span> in Seconds
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Paste your content, choose a voice and accent, and generate
              professional-quality audio instantly. Perfect for creators,
              students, and businesses.
            </p>
            <Button
              size="lg"
              className="rounded-xl font-semibold px-8 h-12 shadow-card"
              onClick={scrollToEditor}
              data-ocid="hero.primary_button"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6"
          >
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Audio Waveform Preview
            </div>
            <WaveformIllustration />
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1 bg-muted rounded-full">
                <div className="h-1 w-2/3 bg-primary rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground">0:42 / 1:03</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

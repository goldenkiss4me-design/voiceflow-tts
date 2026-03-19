import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { TTSSettings } from "../App";
import { AccentSetting, SpeedSetting, VoiceSetting } from "../hooks/useQueries";

const MAX_CHARS = 5000;
const WARN_CHARS = 4000;

interface Props {
  onGenerate: (text: string, settings: TTSSettings) => void;
  isGenerating: boolean;
}

const speedLabels: Record<SpeedSetting, string> = {
  [SpeedSetting.slow]: "Slow",
  [SpeedSetting.normal]: "Normal",
  [SpeedSetting.fast]: "Fast",
};

const speedValues: SpeedSetting[] = [
  SpeedSetting.slow,
  SpeedSetting.normal,
  SpeedSetting.fast,
];

export default function TTSEditor({ onGenerate, isGenerating }: Props) {
  const [text, setText] = useState(
    "Welcome to VoxFlow — the fastest way to convert your text into natural-sounding audio. " +
      "Whether you're a content creator looking to produce voiceovers, a student who wants to listen to notes, " +
      "or a business professional creating presentations, VoxFlow has you covered. " +
      "Simply type or paste your text here, choose your preferred voice, accent, and speed, then click Generate Audio to bring your words to life.",
  );
  const [voice, setVoice] = useState<VoiceSetting>(VoiceSetting.female);
  const [accent, setAccent] = useState<AccentSetting>(AccentSetting.us);
  const [speedIndex, setSpeedIndex] = useState(1); // 0=slow, 1=normal, 2=fast

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isWarning = charCount > WARN_CHARS && !isOverLimit;

  const counterColor = isOverLimit
    ? "text-destructive font-semibold"
    : isWarning
      ? "text-orange-500 font-semibold"
      : "text-muted-foreground";

  const handleGenerate = () => {
    onGenerate(text, {
      voice,
      accent,
      speed: speedValues[speedIndex],
    });
  };

  return (
    <Card
      id="tts-editor"
      className="shadow-card border-border"
      data-ocid="tts.card"
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mic className="h-4 w-4 text-primary" />
          </div>
          Text to Speech
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Textarea */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            Your Text
          </Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here... (up to 5,000 characters)"
            className="min-h-[220px] text-base leading-relaxed resize-y border-border focus:ring-2 focus:ring-primary/30 transition-all"
            data-ocid="tts.textarea"
          />
          <div className={`text-right text-xs mt-1.5 ${counterColor}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}{" "}
            characters
          </div>
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Voice */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Voice
            </Label>
            <Select
              value={voice}
              onValueChange={(v) => setVoice(v as VoiceSetting)}
            >
              <SelectTrigger
                className="bg-card border-border h-10"
                data-ocid="tts.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VoiceSetting.female}>Female</SelectItem>
                <SelectItem value={VoiceSetting.male}>Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accent */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Accent
            </Label>
            <Select
              value={accent}
              onValueChange={(v) => setAccent(v as AccentSetting)}
            >
              <SelectTrigger
                className="bg-card border-border h-10"
                data-ocid="tts.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AccentSetting.us}>🇺🇸 US English</SelectItem>
                <SelectItem value={AccentSetting.uk}>🇬🇧 UK English</SelectItem>
                <SelectItem value={AccentSetting.african}>
                  🌍 African English
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Speed */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Speed —{" "}
              <span className="text-primary">
                {speedLabels[speedValues[speedIndex]]}
              </span>
            </Label>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-muted-foreground">Slow</span>
              <Slider
                min={0}
                max={2}
                step={1}
                value={[speedIndex]}
                onValueChange={([v]) => setSpeedIndex(v)}
                className="flex-1"
                data-ocid="tts.toggle"
              />
              <span className="text-xs text-muted-foreground">Fast</span>
            </div>
          </div>
        </div>

        {/* Generate button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || isOverLimit || !text.trim()}
            className="w-full h-12 text-base font-semibold rounded-xl shadow-card"
            data-ocid="tts.submit_button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Audio...
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Generate Audio
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

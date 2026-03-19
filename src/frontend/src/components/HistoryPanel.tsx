import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, History, Play, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { toast } from "sonner";
import { speakText } from "../App";
import type { HistoryEntry } from "../backend";
import {
  AccentSetting,
  SpeedSetting,
  VoiceSetting,
  useDeleteEntry,
  useGetHistory,
} from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString();
}

function formatTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDay(entries: HistoryEntry[]) {
  const groups: Record<string, HistoryEntry[]> = {};
  for (const entry of entries) {
    const label = formatTimestamp(entry.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(entry);
  }
  return groups;
}

const accentLabel: Record<AccentSetting, string> = {
  [AccentSetting.us]: "US",
  [AccentSetting.uk]: "UK",
  [AccentSetting.african]: "AF",
};

function HistoryItem({
  entry,
  index,
  onDelete,
}: {
  entry: HistoryEntry;
  index: number;
  onDelete: () => void;
}) {
  const handlePlay = () => {
    speakText(entry.inputText, {
      voice: entry.voice as VoiceSetting,
      accent: entry.accent as AccentSetting,
      speed: entry.speed as SpeedSetting,
    });
    toast.success("Playing audio...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="group bg-muted/50 hover:bg-muted rounded-xl p-3 transition-colors"
      data-ocid={`history.item.${index}`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate leading-tight">
            {entry.inputText.slice(0, 60)}
            {entry.inputText.length > 60 ? "..." : ""}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="inline-flex items-center bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              {entry.voice === "female" ? "♀" : "♂"}{" "}
              {accentLabel[entry.accent as AccentSetting]}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {entry.speed}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground ml-auto">
              <Clock className="h-2.5 w-2.5" />
              {formatTime(entry.timestamp)}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-lg"
            onClick={handlePlay}
            data-ocid={`history.secondary_button.${index}`}
          >
            <Play className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
            data-ocid={`history.delete_button.${index}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

const DEMO_ENTRIES: HistoryEntry[] = [
  {
    id: BigInt(1),
    inputText:
      "Welcome to VoxFlow! This demo entry shows how your generated audio history will appear in this panel.",
    voice: VoiceSetting.female,
    accent: AccentSetting.us,
    speed: SpeedSetting.normal,
    timestamp: BigInt(Date.now() - 3600000) * BigInt(1_000_000),
  },
  {
    id: BigInt(2),
    inputText:
      "The quick brown fox jumps over the lazy dog. A classic sentence used for testing voice synthesis.",
    voice: VoiceSetting.male,
    accent: AccentSetting.uk,
    speed: SpeedSetting.slow,
    timestamp: BigInt(Date.now() - 7200000) * BigInt(1_000_000),
  },
  {
    id: BigInt(3),
    inputText:
      "Generate professional voiceovers for your YouTube videos, podcasts, and business presentations with ease.",
    voice: VoiceSetting.female,
    accent: AccentSetting.african,
    speed: SpeedSetting.fast,
    timestamp: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
  },
  {
    id: BigInt(4),
    inputText:
      "VoxFlow supports multiple accents including US English, UK English, and African English dialects.",
    voice: VoiceSetting.male,
    accent: AccentSetting.us,
    speed: SpeedSetting.normal,
    timestamp: BigInt(Date.now() - 86400000 * 2) * BigInt(1_000_000),
  },
];

export default function HistoryPanel() {
  const { data: entries, isLoading } = useGetHistory();
  const deleteEntry = useDeleteEntry();
  const deletingRef = useRef<Set<bigint>>(new Set());

  const allEntries = entries && entries.length > 0 ? entries : DEMO_ENTRIES;
  const groups = groupByDay(allEntries);

  const handleDelete = (id: bigint) => {
    if (deletingRef.current.has(id)) return;
    deletingRef.current.add(id);
    deleteEntry.mutate(id, {
      onSettled: () => deletingRef.current.delete(id),
    });
  };

  let globalIndex = 0;

  return (
    <Card
      className="shadow-card border-border sticky top-20"
      data-ocid="history.panel"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <History className="h-4 w-4 text-primary" />
          </div>
          History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        {isLoading ? (
          <div className="space-y-2 px-6" data-ocid="history.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : allEntries.length === 0 ? (
          <div
            className="px-6 py-8 text-center text-muted-foreground text-sm"
            data-ocid="history.empty_state"
          >
            <History className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No history yet. Generate your first audio!
          </div>
        ) : (
          <ScrollArea className="max-h-[520px]">
            <div className="px-4 space-y-4">
              <AnimatePresence>
                {Object.entries(groups).map(([label, items]) => (
                  <div key={label}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
                      {label}
                    </div>
                    <div className="space-y-2">
                      {items.map((entry) => {
                        const idx = ++globalIndex;
                        return (
                          <HistoryItem
                            key={entry.id.toString()}
                            entry={entry}
                            index={idx}
                            onDelete={() => handleDelete(entry.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

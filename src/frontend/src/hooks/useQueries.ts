import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccentSetting, SpeedSetting, VoiceSetting } from "../backend";
import { useActor } from "./useActor";

export { AccentSetting, SpeedSetting, VoiceSetting };

export function useGetHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      text,
      voice,
      accent,
      speed,
    }: {
      text: string;
      voice: VoiceSetting;
      accent: AccentSetting;
      speed: SpeedSetting;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addHistoryEntry(text, voice, accent, speed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

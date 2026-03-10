import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DroneState, LogEntry } from "../backend.d";
import { useActor } from "./useActor";

export function useDroneState() {
  const { actor, isFetching } = useActor();
  return useQuery<DroneState>({
    queryKey: ["droneState"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getDroneState();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 1000,
  });
}

export function useMissionLog() {
  const { actor, isFetching } = useActor();
  return useQuery<LogEntry[]>({
    queryKey: ["missionLog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMissionLog();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

function useDroneMutation(
  fn: (actor: any, ...args: any[]) => Promise<DroneState>,
) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (...args: any[]) => fn(actor, ...args),
    onSuccess: (data) => {
      queryClient.setQueryData(["droneState"], data);
    },
  });
}

export function useTakeoff() {
  return useDroneMutation((actor) => actor.takeoff());
}

export function useLand() {
  return useDroneMutation((actor) => actor.land());
}

export function useEmergencyStop() {
  return useDroneMutation((actor) => actor.emergencyStop());
}

export function useReturnToHome() {
  return useDroneMutation((actor) => actor.returnToHome());
}

export function useMoveForward() {
  return useDroneMutation((actor, dist: number) => actor.moveForward(dist));
}

export function useMoveBackward() {
  return useDroneMutation((actor, dist: number) => actor.moveBackward(dist));
}

export function useMoveLeft() {
  return useDroneMutation((actor, dist: number) => actor.moveLeft(dist));
}

export function useMoveRight() {
  return useDroneMutation((actor, dist: number) => actor.moveRight(dist));
}

export function useAscend() {
  return useDroneMutation((actor, amt: number) => actor.ascend(amt));
}

export function useDescend() {
  return useDroneMutation((actor, amt: number) => actor.descend(amt));
}

export function useSetSpeed() {
  return useDroneMutation((actor, speed: number) => actor.setSpeed(speed));
}

export function useSetAltitudeLimit() {
  return useDroneMutation((actor, limit: number) =>
    actor.setAltitudeLimit(limit),
  );
}

export function useSetFlightMode() {
  return useDroneMutation((actor, mode: string) => actor.setFlightMode(mode));
}

export function useCaptureSnapshot() {
  return useDroneMutation((actor) => actor.captureSnapshot());
}

export function useSimulateTick() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.simulateTick();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["droneState"] });
    },
  });
}

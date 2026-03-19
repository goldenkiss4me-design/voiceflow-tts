import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface HistoryEntry {
    id: bigint;
    accent: AccentSetting;
    inputText: string;
    voice: VoiceSetting;
    speed: SpeedSetting;
    timestamp: Time;
}
export enum AccentSetting {
    uk = "uk",
    us = "us",
    african = "african"
}
export enum SpeedSetting {
    normal = "normal",
    fast = "fast",
    slow = "slow"
}
export enum VoiceSetting {
    female = "female",
    male = "male"
}
export interface backendInterface {
    addHistoryEntry(inputText: string, voice: VoiceSetting, accent: AccentSetting, speed: SpeedSetting): Promise<bigint>;
    deleteEntry(id: bigint): Promise<void>;
    getAllEntries(): Promise<Array<HistoryEntry>>;
    getEntry(id: bigint): Promise<HistoryEntry>;
}

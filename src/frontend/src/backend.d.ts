import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LogEntry {
    message: string;
    timestamp: bigint;
}
export interface Position {
    x: number;
    y: number;
    z: number;
}
export interface DroneState {
    status: string;
    signalStrength: bigint;
    batteryLevel: bigint;
    altitude: number;
    flightMode: string;
    heading: number;
    speed: number;
    position: Position;
    altitudeLimit: number;
}
export interface backendInterface {
    ascend(amount: number): Promise<DroneState>;
    captureSnapshot(): Promise<DroneState>;
    descend(amount: number): Promise<DroneState>;
    emergencyStop(): Promise<DroneState>;
    getDroneState(): Promise<DroneState>;
    getMissionLog(): Promise<Array<LogEntry>>;
    land(): Promise<DroneState>;
    moveBackward(distance: number): Promise<DroneState>;
    moveForward(distance: number): Promise<DroneState>;
    moveLeft(distance: number): Promise<DroneState>;
    moveRight(distance: number): Promise<DroneState>;
    returnToHome(): Promise<DroneState>;
    setAltitudeLimit(limit: number): Promise<DroneState>;
    setFlightMode(mode: string): Promise<DroneState>;
    setSpeed(newSpeed: number): Promise<DroneState>;
    simulateTick(): Promise<void>;
    takeoff(): Promise<DroneState>;
}

export type HardwareState = {
    // Bot 1 (Scout Alpha) Live Data
    intensity: number;
    bot1State: "SAFE" | "CRITICAL";
    bot1Status: string;
    lastBot1Update: number;

    // Global Dispatch Data for Bot 2 (Responder Beta) and Dashboard
    dispatch: boolean;
    targetCoords: string | null;
    simulationState: "idle" | "analyzing" | "transmitting" | "evaluating" | "dispatching" | "extinguishing" | "resolving_minor" | "verifying" | "reporting" | "resolved";
};

const defaultState: HardwareState = {
    intensity: 0,
    bot1State: "SAFE",
    bot1Status: "Offline / Waiting for signal",
    lastBot1Update: 0,
    dispatch: false,
    targetCoords: null,
    simulationState: "idle"
};

// Next.js hot reload preserves global variables
const globalAny: any = global;

if (!globalAny.hardwareState) {
    globalAny.hardwareState = { ...defaultState };
}

export const getHardwareState = (): HardwareState => {
    return globalAny.hardwareState;
};

export const updateHardwareState = (updates: Partial<HardwareState>) => {
    globalAny.hardwareState = { ...globalAny.hardwareState, ...updates };
    return globalAny.hardwareState;
};

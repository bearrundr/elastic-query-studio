/**
 * Debug mode activation status
 * Activated when NODE_ENV is 'development'
 */
export class DebugLogger {
    private static instance: DebugLogger;
    private _isDebugMode: boolean;
    private globalTrackingId: string;
    private startTime: number;

    private constructor() {
        this._isDebugMode = process.env.NODE_ENV === 'development';
        this.globalTrackingId = `g${Math.random().toString(36).substring(2, 9)}`;
        this.startTime = Date.now();
    }

    public static getInstance(): DebugLogger {
        if (!DebugLogger.instance) {
            DebugLogger.instance = new DebugLogger();
        }
        return DebugLogger.instance;
    }

    public get isDebugMode(): boolean {
        return this._isDebugMode;
    }

    private getTimeTrack(): string {
        const elapsed = Date.now() - this.startTime;
        return `+${elapsed}ms`;
    }

    private formatMessage(level: string, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        const timeTrack = this.getTimeTrack();
        return `[${timestamp}][${level}][${this.globalTrackingId}][${timeTrack}] ${message}`;
    }

    public log(...args: any[]): void {
        if (this._isDebugMode) {
            const message = typeof args[0] === 'string' ? args.shift() : '';
            console.log(this.formatMessage('DEBUG', message), ...args);
        }
    }

    public error(...args: any[]): void {
        if (this._isDebugMode) {
            const message = typeof args[0] === 'string' ? args.shift() : '';
            console.error(this.formatMessage('ERROR', message), ...args);
        }
    }

    public warn(...args: any[]): void {
        if (this._isDebugMode) {
            const message = typeof args[0] === 'string' ? args.shift() : '';
            console.warn(this.formatMessage('WARN', message), ...args);
        }
    }

    public resetTimer(): void {
        this.startTime = Date.now();
    }

    public newTrackingId(): void {
        this.globalTrackingId = `g${Math.random().toString(36).substring(2, 9)}`;
        this.resetTimer();
    }
}

export const DEBUG = DebugLogger.getInstance();

/**
 * Function to output debug logs
 * Only outputs logs when DEBUG is true
 *
 * @param message - Log message
 * @param args - Additional arguments
 */
export function debugLog(message: string, ...args: any[]) {
    if (DEBUG.isDebugMode) {
        console.log(`[DEBUG] ${message}`, ...args);
    }
}

/**
 * Function to output debug errors
 * Only outputs errors when DEBUG is true
 *
 * @param message - Error message
 * @param args - Additional arguments
 */
export function debugError(message: string, ...args: any[]) {
    if (DEBUG.isDebugMode) {
        console.error(`[DEBUG ERROR] ${message}`, ...args);
    }
}

/**
 * Function to output debug warnings
 * Only outputs warnings when DEBUG is true
 *
 * @param message - Warning message
 * @param args - Additional arguments
 */
export function debugWarn(message: string, ...args: any[]) {
    if (DEBUG.isDebugMode) {
        console.warn(`[DEBUG WARN] ${message}`, ...args);
    }
}

export class ErrorLogger {
    public static logError(error: Error | unknown) {
        console.error((error as Error).message);
    }
}
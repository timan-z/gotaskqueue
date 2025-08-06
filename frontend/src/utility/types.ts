
export type Task = {
    id: string;
    payload: string;
    status: string;
    attempts: number;
    maxRetries: number;
}

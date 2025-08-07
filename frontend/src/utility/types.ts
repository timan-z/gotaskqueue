
export type Task = {
    ID: string;
    Payload: string;
    Type: string;
    Status: string;
    Attempts: number;
    MaxRetries: number;
    CreatedAt: string;
}

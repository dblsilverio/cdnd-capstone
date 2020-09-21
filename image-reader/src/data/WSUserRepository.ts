export interface WSUserRepository {
    put(connectionId: string, userId: string): Promise<void>
    delete(connectionId: string): Promise<void>
    activeConnections(userId: string): Promise<string[]>
}
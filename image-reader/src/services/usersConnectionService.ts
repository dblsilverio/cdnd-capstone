import { WSUserRepository, WSUserDynamo } from "../data";

const repo: WSUserRepository = new WSUserDynamo()

export async function putConnection(connectionId: string, userId: string): Promise<void> {
    await repo.put(connectionId, userId)
}

export async function deleteConnection(connectionId: string): Promise<void> {
    await repo.delete(connectionId)
}

export async function userConnections(userId: string): Promise<string[]> {
    return await repo.activeConnections(userId)
}
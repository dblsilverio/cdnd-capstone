export class NotFoundError extends Error{
    constructor(message: any) {
        super(`Resource '${message}' not found`)
        this.name = "NotFoundError"
    }
}
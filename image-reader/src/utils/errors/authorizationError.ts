export class AuthorizationError extends Error {

    constructor(message: any) {
        super(message)
        this.name = 'AuthorizationError'
    }
}
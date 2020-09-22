export default class Auth {

    isAuthorized(): boolean {
        const userToken = localStorage.getItem("token")

        return !!userToken
    }

    setTokenInfo(token: string, userId: string) {
        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId)
    }

    getToken(): string {
        return localStorage.getItem("token") || ""
    }

    getUserId(): string {
        return localStorage.getItem("userId") || ""
    }

    removeToken() {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
    }

}
export default class Auth {

    isAuthorized(): boolean {
        const userToken = localStorage.getItem("token")

        return !!userToken
    }

    setToken(token: string) {
        localStorage.setItem("token", token)
    }

    getToken(): string {
        return localStorage.getItem("token") || ""
    }

    removeToken() {
        localStorage.removeItem("token")
    }

}
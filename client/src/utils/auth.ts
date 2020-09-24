export function isAuthorized(): boolean {
    const userToken = localStorage.getItem("token")

    return !!userToken
}

export function setTokenInfo(token: string, userId: string) {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
}

export function getToken(): string {
    return localStorage.getItem("token") || ""
}

export function getUserId(): string {
    return localStorage.getItem("userId") || ""
}

export function removeToken() {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
}

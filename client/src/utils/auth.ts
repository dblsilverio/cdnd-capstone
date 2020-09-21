export default class Auth {

    isAuthorized(): boolean {
        const userToken = localStorage.getItem("userToken")

        return !!userToken
    }

}
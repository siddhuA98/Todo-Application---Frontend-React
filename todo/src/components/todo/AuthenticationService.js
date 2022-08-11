import axios from "axios";

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'

class AuthenticationService
{
    // createBasicAuthToken(username,password)
    // {
    //     return 'Basic ' + window.btoa(username + ":" + password)
    // }
    // executeBasicAuthenticationService(username,password)
    // {
    //     return axios.get('http://localhost:8080/basicauth', {headers: {authorization : this.createBasicAuthToken(username,password)}})
    // }
    executeJwtBasicAuthenticationService(username,password)
    {
        return axios.post('http://localhost:8080/authenticate',{username,password})
    }
    // registerSuccessfulLogin(username,password)
    // {
    //     let basicHeader = this.createBasicAuthToken(username,password)
    //     sessionStorage.setItem('USER_NAME_SESSION_ATTRIBUTE_NAME',username);
    //     this.setUpAxiosInterceptor(basicHeader)
    // }
    registerSuccessfulLoginJwt(username,token)
    {
        sessionStorage.setItem('USER_NAME_SESSION_ATTRIBUTE_NAME',username);
        this.setUpAxiosInterceptor(this.createJWTToken(token))
    }
    createJWTToken(token)
    {
        return 'Bearer '+ token
    }
    logout()
    {
        sessionStorage.removeItem('USER_NAME_SESSION_ATTRIBUTE_NAME')
    }
    isUserLoggedIn()
    {
        let user = sessionStorage.getItem('USER_NAME_SESSION_ATTRIBUTE_NAME')
        if(user===null) return false
        return true
    }
    getLoggedInUser()
    {
        let user = sessionStorage.getItem('USER_NAME_SESSION_ATTRIBUTE_NAME')
        if(user===null) return ''
        return user
    }
    setUpAxiosInterceptor(token)
    {
       
        axios.interceptors.request.use(
            (config) => {
                if(this.isUserLoggedIn())
                {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }
}

export default new AuthenticationService()


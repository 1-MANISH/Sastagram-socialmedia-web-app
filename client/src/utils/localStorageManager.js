export const ACCESS_TOKEN_KEY = "accessToken"
export const REFRESh_TOKEN_KEY = "refreshToken"

export const getItem = (key) => {
    return localStorage.getItem(key)
}
export const setItem = (key,value) => {
    return localStorage.setItem(key,value)
}

export const removeItem = (key) => {
    return localStorage.removeItem(key)
}
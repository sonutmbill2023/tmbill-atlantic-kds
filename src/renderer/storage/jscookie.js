import Cookies from 'js-cookie'

export const setCookie = (key, value, options) => {
    Cookies.set(key, value, options);
}

export const getCookie = (key, getJson) => {
    return getJson ? Cookies.getJSON(key) : Cookies.get(key);
}

export const removeCookie = (key) => {
    Cookies.remove(key);
}


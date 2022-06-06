import Cookies from "js-cookie"

export function usePermission() {
    return Cookies.get("permission")
}
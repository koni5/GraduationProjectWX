import { http } from "@/utils/http"
export const getShopAPI=()=>{
    return http({
        method:'GET',
        url:'/user/shop'
    })
}
import { http } from "@/utils/http"
export const addToCartAPI = (data) => {
    return http({
        method: 'POST',
        url: '/user/shopCart',
        data
    })
}
export const getCartListAPI = (shopId) => {
    return http({
        method: 'GET',
        url: `/user/shopCart?shopId=${shopId}`
    })
}
export const clearCartAPI=(shopId)=>{
    return http({
        method:'DELETE',
        url:`/user/shopCart/clearAll?shopId=${shopId}`
    })
}
export const addOneAPI=(shopCartId)=>{
    return http({
        method:'POST',
        url:`/user/shopCart/addOne?shopCartId=${shopCartId}`
    })
}
export const deleteOneAPI=(shopCartId)=>{
    return http({
        method:'POST',
        url:`/user/shopCart/deleteOne?shopCartId=${shopCartId}`
    })
}
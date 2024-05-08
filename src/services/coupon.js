import { http } from "@/utils/http"
export const getCouponListAPI = () => {
    return http({
        method: 'GET',
        url: '/user/coupon'
    })
}
export const getDiscountAPI = (couponId) => {
    return http({
        method: 'GET',
        url: `/user/coupon/${couponId}`
    })
}
export const getCouponCountAPI = () => {
    return http({
        method: 'GET',
        url: '/user/coupon/getCount'
    })
}
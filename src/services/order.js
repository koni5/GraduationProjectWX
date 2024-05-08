import { http } from "@/utils/http"
export const submitOrderAPI = (data) => {
    return http({
        method: 'POST',
        url: '/user/order',
        data
    })
}
export const cancelOrderAPI = (data) => {
    return http({
        method: 'PUT',
        url: '/user/order/cancel',
        data
    })
}
export const goPayAPI = (orderId) => {
    return http({
        method: 'PUT',
        url: `/user/order/pay?orderId=${orderId}`
    })
}
export const getOrderStatusAPI = (orderId) => {
    return http({
        method: 'GET',
        url: `/user/order/status?orderId=${orderId}`
    })
}
export const getOrderListAPI = (pageNum, pageSize) => {
    return http({
        method: 'GET',
        url: `/user/order/recentOrders?pageNum=${pageNum}&pageSize=${pageSize}`
    })
}

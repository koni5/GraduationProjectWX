import { http } from "@/utils/http"
export const getOrderDetailAPI = (orderId) => {
    return http({
        method: 'GET',
        url: `/user/order/orderDetail/${orderId}`
    })
}
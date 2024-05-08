import { defineStore } from 'pinia'
import { ref } from 'vue'
// 定义 Store
export const useCouponStore = defineStore(
    'coupon',
    () => {
        // 使用的优惠券信息
        const info = ref()

        // 保存使用的优惠券信息，下订单时使用
        const setInfo = (val) => {
            info.value = val
        }
        // 清理优惠券信息，支付订单时使用
        const clear = () => {
            info.value = undefined
        }
        return {
            info,
            setInfo,
            clear
        }
    },
    // TODO: 持久化
    {
        persist: {
            storage: {
                getItem(key) {
                    return uni.getStorageSync(key)
                },
                setItem(key, value) {
                    uni.setStorageSync(key, value)
                }
            }
        }
    },
)
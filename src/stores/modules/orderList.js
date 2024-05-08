import { defineStore } from 'pinia'
import { ref } from 'vue'
// 定义 Store
export const useOrderListStore = defineStore(
    'orderList',
    () => {
        // 订单菜品信息
        const data = ref()

        // 保存订单菜品信息，待支付页面使用
        const setData = (val) => {
            data.value = val
        }
        // 清理优惠券信息，支付订单时使用
        const clear = () => {
            data.value = undefined
        }
        return {
            data,
            setData,
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
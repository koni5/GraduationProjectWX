import { defineStore } from 'pinia'
import { ref } from 'vue'
// 定义 Store
export const useShopStore = defineStore(
    'shop',
    () => {
      // 店铺信息
      const info = ref()
  
      // 保存店铺信息，点餐时使用
      const setInfo = (val) => {
        info.value = val
      }
      return {
        info,
        setInfo
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
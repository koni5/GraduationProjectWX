import { useMemberStore } from "@/stores"
const baseURL
  =
  'http://localhost:8080'
  const httpInterceptor = {
    //拦截前触发
    invoke(options) {
      if (!options.url.startsWith('http')) {
        options.url = baseURL + options.url
      }
      //请求超时
      options.timeout = 10000
      options.header = {
        'source-client': 'miniapp'
      }
      //添加token
      const memberStore = useMemberStore()
      const token = memberStore.profile?.token
      if (token) {
        options.header.token = token
      }
      //console.log(options)
    }
  }
  uni.addInterceptor("request", httpInterceptor)
  uni.addInterceptor("uploadFile", httpInterceptor)
export const http = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      //将options对象中的属性展开
      ...options,
      success(res) {
        //状态码2xx开头
        if (res.statusCode >= 200 && res.statusCode < 300) {
          //断言
          resolve(res.data)
        } else if (res.statusCode === 401) {
          //清理用户信息,跳转到登录页
          useMemberStore().clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          console.log(res)
          reject(res)
        } else {
          //其他错误
          uni.showToast({
            icon: 'none',
            title: (res.data).msg || '请求错误'
          })
          reject(res)
        }
      },
      fail(error) {
        uni.showToast({
          icon: "none",
          title: '网络错误'
        })
        reject(error)
      },
    })
  })
}

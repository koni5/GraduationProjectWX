import { http } from "@/utils/http"
//获取菜品分类
export const getCategoryAPI=()=>{
    return http({
        method:'GET',
        url:'/user/category/list'
    })
}
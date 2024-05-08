import { http } from "@/utils/http"
export const getDishAPI=(categoryId)=>{
    return http({
        method:'GET',
        url:`/user/dish/list?categoryId=${categoryId}`
    })
}
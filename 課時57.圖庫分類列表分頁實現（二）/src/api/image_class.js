import axios from "~/axios"

export function getImageClassList(page){
    return axios.get("/admin/image_class/" + page)
}

export function createImageClass(data){
    return axios.post("/admin/image_class",data)
}
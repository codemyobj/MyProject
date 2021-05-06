import request from "@/utils/request";

export const getFansData = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers'
  })
}
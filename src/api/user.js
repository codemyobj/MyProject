/*
用户相关请求模块
*/
import request from "@/utils/request";

// 用户登陆
export const login = data => {
  return request({
    method: "POST",
    url: "/mp/v1_0/authorizations",
    //data用来设置POST请求体
    data
  })
}

//获取用户信息
export const getUserProfile = () => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile',
    // 后端要求把需要授权的用户身份放到请求头中
    // axiso 可以通过headers选项设置请求头
    // headers: {
    // 属性名和值都得看接口的要求
    // 属性名Authorization 
    // 属性值Bearer空格token数据
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

//修改用户信息
export const updateUser = () => {

}
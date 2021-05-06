//基于axios封装的请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from 'vue-router'
// 非组件模块加载使用
import { Message } from 'element-ui'

//创建一个axios实例 
//通过这个实例发送请求
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  timeout: 5000,
  //定制后端返回的原始数据的处理
  //参数data就是后端返回的原始数据(未经处理的JSON格式字符串)
  transformResponse: [function (data) {
    // console.log(data)
    //axios默认在内部使用JSON.parse 来转换处理原始数据

    //后端返回的数据可能不是JSON格式字符串
    //如果不是的话，那么 JSONbig.parse 调用就会报错
    //所以使用 try-catch来捕获异常 处理异常的发生
    try {
      //如果转换成功 则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      //如果转化失败 则进入这里
      //在这里把数据原封不动的直接返回给请求使用 
      return data
    }

    //
  }]
})

//请求拦截器
request.interceptors.request.use(function (config) {
  const user = JSON.parse(window.localStorage.getItem('user'))

  //如果有用户登录信息就统一设置token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  //所有请求会经过这里
  //config是当前请求的配置相关对象
  //config是可以修改的

  //然后就可以在允许请求出去之前定制统一业务功能处理
  // 例如 统一的设置token


  //但这里return了之后请求才会真正的发出去
  return config
},
  //请求失败 会经过这里
  function (err) {
    return Promise.reject(err)
  })

//响应拦截器
request.interceptors.response.use(function (response) {
  //成功的响应 2xx 进入这里
  return response
}, function (err) {
  const { status } = err.response
  //超出2xx的响应码进入这里
  if (status === 401) {
    // 跳转到登录页面
    // 清除本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效,请重新登录')

  } else if (status === 403) {
    // token未携带或已过期
    Message.warning('没有操作权限')

  } else if (status >= 400) {
    // 参数错误
    Message.error('请求参数异常')
  } else if (status >= 500) {
    Message.error('服务器内部异常,请稍后重试')
  }
  return Promise.reject(err)
})

//导出请求方法
export default request

// 谁要使用谁就加载request模块

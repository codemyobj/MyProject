//文章相关请求模块
import request from "@/utils/request";


export const getArticles = params => {
  return request({
    method: 'GET',
    url: "/mp/v1_0/articles",
    //body  参数使用data传
    //Query 参数使用params 设置
    //Header参数使用headers设置,
    params
  })
}

//获取文章频道列表
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

//删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    //接口文档中的路径参数需要在url中传递
    //凡是看到接口文档中有的 :xxx 字段 则需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 新建文档
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data
  })
}

// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}

// 获取指定文章
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`,
  })
}
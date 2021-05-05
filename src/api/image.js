//素材相关模块
import request from '@/utils/request'

//上传图片素材
export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    //一般文件上传的接口都要求把请求头中的content-type设置为multidata/from data
    //但是我们使用axios上传文件的时候不需要手动设置
    // 你只要给data一个formdata对象即可
    data
  })
}

// 获取素材列表
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    //一般文件上传的接口都要求把请求头中的content-type设置为multidata/from data
    //但是我们使用axios上传文件的时候不需要手动设置
    // 你只要给data一个formdata对象即可
    params
  })
}

// 收藏/取消素材列表
export const collectImage = (imageId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}

// 删除素材
export const deleteImage = imageId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`,
  })
}
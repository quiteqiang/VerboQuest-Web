import request from '@/utils/request'

export const recordWord = (data) => {
  return request({
    url: '/word',
    method:'POST',
    data
  })
}

export const fetchWords = (num) => {
  return request({
    url: '/word/random/' + num,
    method:'GET'
  })
}

export const knownWord = (wordID) => {
  return request({
    url: '/word/known/' + wordID,
    method:'PATCH'
  })
}

export const forgotWord = (wordID) => {
  return request({
    url: '/word/forgot/' + wordID,
    method:'PATCH'
  })
}
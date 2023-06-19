import axios from 'axios'
import Vue from 'vue';
import store from '../store/index';
import router from '../router/index.js';
import Element from "element-ui"

// let vm = new Vue();

const instance = axios.create({
  timeout: 3000,
  // baseURL: "/bbs",
  // baseURL: "http://8.130.83.202:8080/bbs",
  baseURL: "http://localhost:8081",
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// 请求拦截
instance.interceptors.request.use(config => {
  console.log("config", config);
  // 自定义header，可添加项目token
  if (config.method != "get" && store.state.token) {
    config.headers.Authorization = store.state.token;
    console.log("token：", config.headers.token);
  }
  return config;
}, error => {
  return Promise.reject(error);
})

// 响应拦截
instance.interceptors.response.use(response => {
  console.log("响应拦截中的response: ", response);
  const resCode = response.status;
  if (resCode == 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
  return response;
}, error => {
  console.log("响应拦截中的errpr: ", errpr);
  const resCode = error.response.status;
  switch (resCode) {
    case 498: 
      console.log("token过期失效, 请重新登录~");
      // 清除本地token
      store.commit('logout')
      // 关闭所有页面返回到登录页
      router.replace({
        name: 'home'
      });
    case 401:
      Element.Message.error('用户名或密码错误，请重新输入~');
      break;
    case 404:
      Element.Message.error('网络请求不存在~');
      break;
    case 500:
      Element.Message.error('服务器连接错误~');
      break;
    // 其他状态码错误提示
    default:
      Element.Message.error(error.response.data.message);
      console.log("请求错误：", err);
  }
  return Promise.reject(error);
})

/*
 *封装get方法
 *@param{String} url [请求地址]
 *@param{Object} params 请求参数
 */
export function Get(url, params) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params: params
    }).then((res) => {
      resolve(res.data);
    }).catch((error) => {
      reject(error.data);
    })
  })
}

/**
 *封装post方法
 *@param{String} url 请求地址
 *@param{Object} params 请求参数
 */
export function Post(url, params) {
  return new Promise((resolve, reject) => {
    instance.post(url, params).then((res) => {
      resolve(res.data);
    }).catch((error) => {
      reject(error.data);
    })
  })
}

/**
 *封装put方法
 *@param{String} url 请求地址
 *@param{Object} params 请求参数
 */
export function Put(url, params) {
  return new Promise((resolve, reject) => {
    instance.put(url, params).then((res) => {
      resolve(res.data);
    }).catch((error) => {
      reject(error.data);
    })
  })
}

/**
 *封装patch方法
 *@param{String} url 请求地址
 *@param{Object} params 请求参数
 */
export function Patch(url, params) {
  return new Promise((resolve, reject) => {
    instance.put(url, params).then((res) => {
      resolve(res.data);
    }).catch((error) => {
      reject(error.data);
    })
  })
}

/**
 *封装delete方法
 *@param{String} url [请求地址]
 *@param{Object} params [请求参数]
 */
export function Delete(url, params) {
  return new Promise((resolve, reject) => {
    instance.delete(url, {
      params: params
    }).then((res) => {
      resolve(res.data);
    }).catch((error) => {
      reject(error.data);
    })
  })
}

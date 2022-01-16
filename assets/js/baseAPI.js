//先调用AjaxPrefilter提供的配置对象
$.ajaxPrefilter(options => {
  //在发起请求之前，统一拼接请求的根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
  console.log(options.url);
  //统一为有权限的接口，设置headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      //  Authorization权限
      Authorization: localStorage.getItem('token' || '')//要是没有token值则返回空字符串
    }
  }
  options.complete = function (res) {
    console.log(res,'------------------')
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //  强制清空 token
      localStorage.removeItem('token')
      //  强制跳转到登录页面
      location.href = '/login.html'
    }
  }
}) 

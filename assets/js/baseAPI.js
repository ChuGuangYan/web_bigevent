//先调用AjaxPrefilter提供的配置对象
$.ajaxPrefilter(options =>{
  //在发起请求之前，统一拼接请求的根路径
  options.url = 'http://www.liulongbin.top:3007'+ options.url
  console.log( options.url);
}) 
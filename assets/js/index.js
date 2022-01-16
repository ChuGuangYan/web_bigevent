$(() => {
  getUserInfo()
  let layer = layui.layer
  $('#btnLogout').on('click', function () {
    //提示用户是否退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
      function (index) {
        //do something
        //清空本地存储
        localStorage.removeItem('token')
        //2.重新跳转登录页面
        location.href = '/login.html'
        //关闭询问狂
        layer.close(index);
      });
  })
})
//获取基本信息
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    //headers就是请求头配置对象，也是传给服务器的，浏览器在协议里面自带，也可以自己设置，一起传给服务器

    success: res => {
      console.log(res);
      //  console.log(res.data);
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      rederAvatar(res.data)
    }

  })
}
//渲染用户头像
function rederAvatar(user) {
  //获取名称
  let name = user.nickname || user.username
  //设置欢迎文本
  $('#welcome').html(name + '欢迎你')
  //渲染用户头像
  if (user.user_pic !== null) {
    //渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    //渲染文字头像
    $('.layui-nav-img').hide()
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
} 
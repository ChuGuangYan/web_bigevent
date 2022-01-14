$(function () {
  let form = layui.form
  let layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })
  initUserInfo()
  //初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: res => {
        if (res.status !== 0) {
          return lay.msg('获取用户信息失败')
        }
        console.log(res);
        console.log(res.data);
        //调用form.val()快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }
  //重置表单数据
  $('#btnReset').on('click',function(e){
e.preventDefault()
initUserInfo()
  })
 
  $('.layui-form').on('submit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/userinfo',
      data:$(this).serialize(),
      success:res=>{
        if(res.status!==0){
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新页面成功！')
        //调用父页面中的方法，进行渲染用户头像和用户信息
        window.parent.getUserInfo()
      }
    })
  })
})
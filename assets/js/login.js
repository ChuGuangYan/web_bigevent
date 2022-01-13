$(() => {
  //点击‘注册’链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击“去登入”的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  //从layui 中获取form 对象、layer弹出框
  let form = layui.form
  let layer = layui.layer
  //自定义校验规则
  form.verify({
    //psd的校验规则，不正确的时候出现错误提示，逗号后面是错误提示
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    //校验两次密码是否一致
    repwd: value => {
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

//监听注册表单的提交时间
$('#form_reg').on('submit',function(e){
  //阻止默认行为
e.preventDefault()
//发起Ajax的POST请求
let data = {username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val()}
$.post('/api/reguser',data,res=>{
  if(res.status !==0){
    return layer.msg(res.message);
  } 
  layer.msg('注册成功,请登入');
  // console.log(res);
  //手动模拟'登入'点击行为
  $('#link_login').click()
})
//监听登录表单行为
$('#form_login').on('submit',function(e){
//阻止默认行为
e.preventDefault()
$.ajax({
  url:'/api/login',
  method:'POST',
  //快速获取整个表单数据
  data:$(this).serialize(),
  success:res=>{
    if (res.status !== 0) {
      return layer.msg('登录失败')
    }
    layer.msg('登录成功')
    console.log(res);
    // console.log(res.token);//token是访问有权限的接口,标识访问者身份
      // 将登录成功得到的 token 字符串，保存到 localStorage 中
    localStorage.setItem('token',res.token)//往localStorage里steItem 存取数据
    location.href = '/index.html'
  }
})
})

})












})
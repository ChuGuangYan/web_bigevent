$(() => {

  let layer = layui.layer
  let form = layui.form
  //加载文章
  initCate()
  // 初始化富文本编辑器//浓缩版的word
  initEditor()
  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        console.log(123);
        console.log(res);

        if (res.status !== 0) {
          return layer.msg('初始化文章失败！')
        }
        //调用模板殷勤渲染下拉菜单
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        //调用 form.render()
        form.render()
      }
    })
  }
  // 1. 初始化图片裁剪器
  var $image = $('#image')
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)
  //为选择封面的按钮，绑定事件
  $('#btnChooseImage').on('click', function () {
    console.log(111);
    //模拟手动点击事件
    $('#coverFile').click()
  })
  //监听coverFile的change 事件，获取用户选择的文件列表
  $('#coverFile').on('click', function (e) {
    // files是伪书组
    let files = e.target.files
    //判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    var newImgURL = URL.createObjectURL(files[0])
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })
  //定义文章的发布状态
  let art_state = '已发布'
  //为草稿按钮绑定事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })
  //为表单绑定submit提交时间
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    //创建FormData对象
    // let fd = new FormData($(this)[0])//将jq转为原生的
    let fd = new FormData(this)//与上相等
    //向fd中追加state
    fd.append('state', art_state)
    //循环
    fd.forEach(function(k,v){
      console.log(v,k);

    })
    //封面裁剪过后的图片，输出一个文件对象(复制粘贴)
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      //可以输出裁剪过后的图片文件
      .toBlob(function (blob) {// 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        //发起ajax请求
        publishArticle(fd)
      })
  })
  //定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: res => {
        console.log(res);
        
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        //发布文章成功后，跳转到文章列表页面
        // location.href ='/article/art/art_list.html'
      
        location.href = '/article/art_list.html'
      }
    })
  }
})
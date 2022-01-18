$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage
  let hasRow;
  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    let myDate = new Date(date)
    // console.log(myDate);
    let y = String(myDate.getFullYear())
    let m = String(myDate.getMonth() + 1).padStart(2, '0')
    let d = String(myDate.getDate()).padStart(2, '0')
    let hh = String(myDate.getHours()).padStart(2, '0')
    let mm = String(myDate.getMinutes()).padStart(2, '0')
    let ss = String(myDate.getSeconds()).padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

  }
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initTable()
  initCate()

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // hasRow = res.data.length
        // console.log(hasRow);

        // res.data = [
        //   { id: 1, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:9:3.817', state: '草稿' },
        //   { id: 2, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:8:8.817', state: '草稿' },
        //   { id: 3, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:4:3.817', state: '草稿' },
        //   { id: 4, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:8:3.817', state: '草稿' }
        // ]

        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        //条用渲染分页方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        //调用模板引擎
        let htmlStr = template('tpl-cate', res)
        console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr)
        //通过layui重新渲染表单区域的结构
        form.render()
        //页面上可视的下拉菜单，并不是原生的下拉菜单，真正的下拉菜单被隐藏了
        //而下拉项被添加了原生的下拉菜单中，而并没有添加到可视的下拉菜单内
        //所以还需要让可视化的下拉菜单(layui)去真正的下拉菜单中读取一份
      }
    })
  }
  //为帅选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    //获取表单选中项的值
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    //为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    //根据最新的筛选条件，重新渲染表格数据
    initTable()
  })
  //定义渲染分页
  function renderPage(total) {
    console.log(total);
    laypage.render({
      elem: 'pageBox',//fenyede容器
      count: total,//总数
      limit: q.pagesize,//每页显示几条数据
      curr: q.pagenum,//默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 4, 6, 8,11],
      //分页发生时，触发jump会调
      jump: function (obj, first) {
        console.log(first);
        console.log(obj.curr);
        // console.log(obj.limit)
        //最新的页面值
        q.pagenum = obj.curr
        //最新的分页条数
        q.pagesize = obj.limit
        //  initTable()//会造成死循环
        if (!first) {
          initTable()
        }
      }
    })
  }

  // 通过世事件五i托的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    //获取删除按钮个数
    let len = $('.btn-delete').length
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: res => {
          console.log(res);

          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')

          if (len === 1) {//未删除之前的条数，只能等于1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    });
  })

})


var pageSize = 10;
var nowPage = 1;
var tableData = [];
var searchWord = "";
function bindEvent() {
    $('#menu').on('click', 'dd', function (e) {
        $('#menu > dd.active').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-id');
        // console.log($(this).data('id'))
        if (id == 'student-list') {
            getTableData(nowPage);
            $('#add-student-form')[0].reset();
        }
        $('.content').fadeOut();
        $('#' + id).fadeIn();
    }); 
    $('#edit-submit').click(function (e) {
        e.preventDefault();
        var data = $('#edit-student-form').serialize()
        transferData('/api/student/updateStudent', data, function() {
            alert('修改成功');
            $('#modal').slideUp();
            $('#menu > dd[data-id=student-list]').trigger('click');
        });
    });
    $('#add-submit').click(function(e) {
        e.preventDefault();
        var data = $('#add-student-form').serialize();
        transferData('/api/student/addStudent', data, function() {
            alert('提交成功');
            $('#add-student-form')[0].reset();
            $('#menu > dd[data-id=student-list]').trigger('click');
        });
    });
    // 搜索过滤功能
    $('#search-submit').click(function(e) {
        var value = $('#search-word').val();
        // 如果搜索框里面没有内容 则调用findByPage接口
        nowPage = 1;
        if (!value) {
            getTableData(nowPage);
            return false;
        }
        searchWord = value;
        // 有内容则 让其获取searchStudent接口数据数据 
        getSearchTableData();
    })

}
function bindTableEvent() {
    $('.edit').click(function (e) {
        var index = $(this).data('index');
        $('#modal').slideDown();
        initEditForm(tableData[index]);
    });
    $('.modal-content').click(function(e) {
        e.stopPropagation();
    })
    $('#modal').click(function(e) {
        $('#modal').slideUp();
    });

    $('.del').click(function(e) {
        var index = $(this).data('index');
        var isDel = window.confirm('确认删除？');
        var sNo = tableData[index].sNo;
        if (isDel) {
            transferData('/api/student/delBySno', {
                sNo: sNo
            }, function (req) {
                alert('删除成功');
                $('#menu > dd[data-id=student-list]').trigger('click');
            });
        }
    })
}
// 获取表格数据
function getTableData(page) {
    // 获取搜索前的表格数据
    transferData('/api/student/findByPage',{
        page: page,
        size: pageSize
    }, function(req) {
        // 总页数
        allPage = Math.ceil(req.data.cont / pageSize);
        // 添加翻页
        $('#turn-page').turnPage({
            allPage: allPage,
            curPage: page,
            // 改变页码时触发函数  重新获取搜索后的表格数据
            changePage: function (page) {
                nowPage = page;
                getTableData(page);
            }
        });
        // 渲染数据
        renderTable(req.data.findByPage);
    });
}

function getSearchTableData() {
    // 获取搜索后的表格数据
    transferData("/api/student/searchStudent", {
        sex: -1,
        search: searchWord,
        page: nowPage,
        size: pageSize,
    }, function (req) {
        // 总页数
        var allPage = Math.ceil(req.data.cont / pageSize);
        // 插入翻页插件  把总页数和当前页传过去
        $('#turn-page').turnPage({
            curPage: nowPage,
            allPage: allPage,
            // 切换页码时触发函数  要重新获取数据 并且当前页码保存
            changePage: function (page) {
                nowPage = page;
                getSearchTableData();
            }
        });
        // 渲染表格数据
        renderTable(req.data.searchList);
    });
}
// 初始化编辑的表单  （回填数据）
function initEditForm(data) {
    // 获取到编辑的form元素
    var editForm = $('#edit-student-form')[0];
    for (var prop in data) {
        // 判断 form表单里面是否存在name=prop的input标签 若有 回填数据
        if (editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }
}
function init () {
    bindEvent();
    $('#menu > dd').eq(0).trigger('click');
}
init();
function renderTable(data) {
    tableData = data;
    var str = '';
    data.forEach(function (item, index) {
        str += '<tr>\
            <td>' + item.sNo + '</td>\
            <td> ' + item.name + ' </td>\
            <td>' + (item.sex ? '女' : '男') + '</td>\
            <td> ' + item.email + '</td>\
            <td>' + ( new Date().getFullYear() - item.birth) +'</td>\
            <td> ' + item.phone + '</td>\
            <td> ' + item.address + '</td>\
            <td>\
                <button class="btn edit" data-index=' + index + '>编辑</button>\
                <button class="btn del" data-index=' + index + '>删除</button>\
            </td>\
        </tr>';
    });
    $('#student-body').html(str);
    bindTableEvent();
}
// 不一样的作为参数传递  相同的代码封装到函数里面
function transferData(api, data, callback) {
    if ($.type(data) == 'string') {
        data += "&appkey=dongmeiqi_1547441744650";
    } else {
        data = $.extend(data, {
            appkey: 'dongmeiqi_1547441744650'
        });
    }
    $.ajax({
        type: 'get',
        url: 'http://open.duyiedu.com' + api,
        data: data,
        dataType: 'json',
        success: function (req) {
            if (req.status == 'success') {
                callback(req);
            } else {
                alert(req.msg);
            }
        }
    });
}
﻿function loadData(num) {
    $("#PageCount").val(num);
}

function exeData(num) {
    loadData(num);
    loadpage();
}
function loadpage() {
    var pageNow = 1;
    //debugger
    var myPageCount = parseInt($("#PageCount").val());
    var myPageSize = parseInt($("#PageSize").val());
    var countindex = myPageCount % myPageSize > 0 ? (myPageCount / myPageSize) + 1 : (myPageCount / myPageSize);
    $("#countindex").val(countindex);

    $.jqPaginator('#pagination', {
        totalPages: parseInt($("#countindex").val()),
        visiblePages: parseInt($("#visiblePages").val()),
        currentPage: pageNow,
        first: '<li class="first"><a href="javascript:;">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:;"><i class="arrow arrow2"></i>上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页<i class="arrow arrow3"></i></a></li>',
        last: '<li class="last"><a href="javascript:;">末页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if (type == "change") {
                exeData(num);
                console.log("---"+num);
                pageNow = num;
                refresh(num,12);
            }
        }
    });
}

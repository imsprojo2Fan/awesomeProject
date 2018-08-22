jQuery(document).ready(function() {
    RevolutionSlider.initRSfullWidth();
});

$(function () {


    $('#back-to-top').click();

    var toRequest = getCookieValue("request");
    if(toRequest){
        $('#2request').click();
        deleteCookie("request","/");
    }

    //获取电影列表
    $.post("/index/resource/list",{pageNow:1,pageSize:12,type:1},function (r) {
        //console.log(r);
        $('#movieWrap').html("");
        var dataArr = r.data;
        if(dataArr.length==0){
            $('#movieWrap').html("<p>暂无资源</p>");
        }else{
            for(var i=0;i<dataArr.length;i++){
                var obj = dataArr[i];
                var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                var error = "../image/error1.png";
                //var description = obj.description.substring(0,15)+"...";
                $('#movieWrap').append('<div class="col-sm-3">\n' +
                    '\t\t\t\t\t<div onclick="toDetail('+obj.type+','+obj.id+')" class="about">\n' +
                    '\t\t\t\t\t\t<!--<i class="fa fa-cogs"></i>-->\n' +
                    '\t\t\t\t\t\t<img onerror=src="'+error+'" class="img-responsive" src="'+imgSrc+'" alt="图片加载失败">\n' +
                    '\t\t\t\t\t\t<h3>'+obj.name+'</h3>\n' +
                    '\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>');
            }
            $('#movie2more').show();
        }

    });
    //获取电视剧列表
    setTimeout(function () {
        $.post("/index/resource/list",{pageNow:1,pageSize:12,type:2},function (r) {
            //console.log(r);
            $('#seriesWrap').html("");
            var dataArr = r.data;
            if(dataArr.length==0){
                $('#seriesWrap').html("<p>暂无资源</p>");
            }else{
                for(var i=0;i<dataArr.length;i++){
                    var obj = dataArr[i];
                    var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                    var error = "../image/error1.png";
                    $('#seriesWrap').append('<div onclick="toDetail('+obj.type+','+obj.id+')" class="col-sm-3 work">\n' +
                        '\t\t\t\t\t<img onerror=src="'+error+'" class="img-responsive" src="'+imgSrc+'" alt="图片加载失败">\n' +
                        '\t\t\t\t\t<div class="overlay"></div>\n' +
                        '\t\t\t\t\t<div class="work-content">\n' +
                        '\t\t\t\t\t\t<h3>'+obj.name+'</h3>\n' +
                        '\t\t\t\t\t\t<div class="work-link">\n' +
                        '\t\t\t\t\t\t\t<a href="javascript:void(0)" title="查看详情"><i class="fa fa-external-link"></i></a>\n' +
                        '\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t</div>\n' +
                        '\t\t\t\t</div>');
                }
                $('#series2more').show();
            }

        });
    },1000);
    //获取综艺列表
    setTimeout(function () {
        $.post("/index/resource/list",{pageNow:1,pageSize:12,type:3},function (r) {
            //console.log(r);
            $('#varietyWrap').html("");
            var dataArr = r.data;
            if(dataArr.length==0){
                $('#varietyWrap').html("<p>暂无资源</p>");

            }else{
                for(var i=0;i<dataArr.length;i++){
                    var obj = dataArr[i];
                    var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                    var error = "../image/error1.png";
                    $('#varietyWrap').append('<div onclick="toDetail('+obj.type+','+obj.id+')" class="col-sm-3">\n' +
                        '\t\t\t\t\t<div class="team">\n' +
                        '\t\t\t\t\t\t<div class="team-img">\n' +
                        '\t\t\t\t\t\t\t<img onerror=src="'+error+'" class="img-responsive" src="'+imgSrc+'" alt="图片加载失败">\n' +
                        '\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t<div class="team-content">\n' +
                        '\t\t\t\t\t\t\t<h3>'+obj.name+'</h3>\n' +
                        '\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t</div>\n' +
                        '\t\t\t\t</div>');
                }
                $('#variety2more').show();
            }

        });
    },2000);
    //获取动漫列表
    setTimeout(function () {
        $.post("/index/resource/list",{pageNow:1,pageSize:12,type:4},function (r) {
            //console.log(r);
            $('#animateWrap').html("");
            var dataArr = r.data;
            if(dataArr.length==0){
                $('#animateWrap').html("<p>暂无资源</p>");

            }else{
                for(var i=0;i<dataArr.length;i++){
                    var obj = dataArr[i];
                    var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                    var error = "../image/error1.png";
                    $('#animateWrap').append('<div onclick="toDetail('+obj.type+','+obj.id+')" class="col-sm-3">\n' +
                        '\t\t\t\t\t<div class="pricing">\n' +
                        '\t\t\t\t\t\t<div class="price-head">\n' +
                        '\t\t\t\t\t\t\t<img style="width: 75%;margin: 12px auto;" onerror=src="'+error+'" class="img-responsive" src="'+imgSrc+'" alt="图片加载失败">\n' +
                        '\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t<ul class="price-content">\n' +
                        '\t\t\t\t\t\t\t<li>\n' +
                        '\t\t\t\t\t\t\t\t<h3>'+obj.name+'</h3>\n' +
                        '\t\t\t\t\t\t\t</li>\n' +
                        '\t\t\t\t\t\t</ul>\n' +
                        '\t\t\t\t\t\t<div class="price-btn">\n' +
                        '\t\t\t\t\t\t\t<button style="border: 1px solid #6195FF" class="outline-btn ">查看详情</button>\n' +
                        '\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t</div>\n' +
                        '\t\t\t\t</div>');
                }
                $('#animate2more').show();
            }

        });
    },3000);

});

function toMore(type) {
    $.post("/setSession",{type:type},function (r) {
        if(r.code==1){
            window.location.href = "/list";
        }
    });
}

function toDetail(type,itemId) {
    $.post("/setSession",{type:type,itemId:itemId},function (r) {
        if(r.code==1){
            window.location.href = "/single";
        }
    });
}

function sub() {
    var nickName = $('#nickName').val().trim();
    var email = $('#email').val().trim();
    var type = $('#type').val().trim();
    var description = $('#description').val().trim();

    if(!email){
        swal("邮箱地址不能为空！","火星人还有五秒到达战场","warning");
        return;
    }
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if(!reg.test(email)){
        swal("请填写邮箱邮箱！","火星人表示他们也看不懂","warning");
        return;
    }

    if(!description){
        swal("我需要你一些描述！","游戏才刚刚开始","warning");
        return;
    }

    $.post("/index/feedback/wishes",{
        nickName:nickName,
        email:email,
        type:type,
        description:description
    },function (r) {
        if(r.code==1){
            $('#nickName').val("");
            $('#email').val("");
            $('#description').val("");
            swal("已成功提交!","小哥哥将尽快为您处理 /偷笑","success");
        }else{
            swal("火星人来袭","服务貌似不在线了..","error");
        }
    });
}
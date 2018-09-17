jQuery(document).ready(function() {
    RevolutionSlider.initRSfullWidth();
});

window.onload = function(){
    $("#preloader").fadeOut(200);
}

$(document).ready(function(){

    var p=0,t=0,n1=0,n2=0,n3=0,n4=0;

    $(window).scroll(function(e){
        p = $(this).scrollTop();
        //下滚至此位置获取电视剧列表
        var mod01 = Math.floor($('#movie').offset().top);

        //下滚至此位置获取综艺列表
        var mod02 = Math.floor($('#TVSeries').offset().top);

        //下滚至此位置获取动漫列表
        var mod03 = Math.floor($('#Variety').offset().top);

        //下滚至此位置获取动漫列表
        var mod04 = Math.floor($('#Animate').offset().top);

        if(t<=p){//下滚

            //console.log("下滚");
            var scroll = Math.floor($(window).scrollTop());
            //console.log(scroll);
            if(scroll===0){
                n1=0;n2=0;n3=0;n4=0;
            }
            if(scroll>mod01){

                n1++;
                //console.log("--------"+n1);
                if(n1===1&&$('#series2more').is(":hidden")){//获取电视剧列表
                    console.log("---获取电视剧列表");
                    $.post("/index/resource/list",{pageNow:1,pageSize:12,type:2},function (r) {
                        //console.log(r);
                        $('#seriesWrap').html("");
                        var dataArr = r.data;
                        if(dataArr.length==0){
                            $('#seriesWrap').html("<p>暂无资源</p>");
                        }else{
                            for(var i=0;i<dataArr.length;i++){
                                var obj = dataArr[i];
                                var name = obj.name;
                                if(name.length>8){
                                    name = name.substring(0,8)+"...";
                                }
                                var imgSrc = ""+obj.imgSrc2;
                                var error = "../image/error1.png";
                                $('#seriesWrap').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                                    '\t\t\t\t\t<div onclick="toDetail('+obj.type+','+obj.id+')" class="about">\n' +
                                    '\t\t\t\t\t\t<!--<i class="fa fa-cogs"></i>-->\n' +
                                    '\t\t\t\t\t\t<img onerror=src="'+error+'" class="img-responsive lazy" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">\n' +
                                    '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                                    '\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                                    '\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>');
                            }
                            $('#series2more').show();
                            /*$("img.lazy").lazyload({
                                effect : "fadeIn",
                                placeholder : "../image/loading.gif"
                            });*/
                        }

                    });
                }
            }
            if(scroll>mod02){
                n2++;
                if(n2===1&&$('#variety2more').is(":hidden")){//获取综艺列表
                    console.log("---获取综艺列表");
                    $.post("/index/resource/list",{pageNow:1,pageSize:12,type:3},function (r) {
                        //console.log(r);
                        $('#varietyWrap').html("");
                        var dataArr = r.data;
                        if(dataArr.length==0){
                            $('#varietyWrap').html("<p>暂无资源</p>");

                        }else{
                            for(var i=0;i<dataArr.length;i++){
                                var obj = dataArr[i];
                                var name = obj.name;
                                if(name.length>8){
                                    name = name.substring(0,8)+"...";
                                }
                                var imgSrc = ""+obj.imgSrc2;
                                var error = "../image/error1.png";
                                $('#varietyWrap').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                                    '\t\t\t\t\t<div onclick="toDetail('+obj.type+','+obj.id+')" class="about">\n' +
                                    '\t\t\t\t\t\t<!--<i class="fa fa-cogs"></i>-->\n' +
                                    '\t\t\t\t\t\t<img onerror=src="'+error+'" class="img-responsive lazy" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">\n' +
                                    '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                                    '\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                                    '\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>');
                            }
                            $('#variety2more').show();
                            /*$("img.lazy").lazyload({
                                effect : "fadeIn",
                                placeholder : "../image/loading.gif"
                            });*/
                        }

                    });
                }
            }
            if(scroll>mod03){
                n3++;
                if(n3===1&&$('#animate2more').is(":hidden")){//获取动漫列表
                    console.log("---获取动漫列表");
                    $.post("/index/resource/list",{pageNow:1,pageSize:12,type:4},function (r) {
                        //console.log(r);
                        $('#animateWrap').html("");
                        var dataArr = r.data;
                        if(dataArr.length==0){
                            $('#animateWrap').html("<p>暂无资源</p>");

                        }else{
                            for(var i=0;i<dataArr.length;i++){
                                var obj = dataArr[i];
                                var name = obj.name;
                                if(name.length>8){
                                    name = name.substring(0,8)+"...";
                                }
                                var imgSrc = ""+obj.imgSrc2;
                                var error = "../image/error1.png";
                                $('#animateWrap').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                                    '\t\t\t\t\t<div onclick="toDetail('+obj.type+','+obj.id+')" class="about">\n' +
                                    '\t\t\t\t\t\t<!--<i class="fa fa-cogs"></i>-->\n' +
                                    '\t\t\t\t\t\t<img onerror=src="'+error+'" class="img-responsive lazy" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">\n' +
                                    '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                                    '\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                                    '\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>');
                            }
                            $('#animate2more').show();
                            /*$("img.lazy").lazyload({
                                effect : "fadeIn",
                                placeholder : "../image/loading.gif"
                            });*/
                        }

                    });
                }
            }

            if(scroll>mod04){
                n4++;
                if(n4===1&&$('#tv2more').is(":hidden")){//获取电视列表
                    console.log("---获取电视列表");
                    $.post("/index/resource/list4tv",{pageNow:1,pageSize:12},function (r) {
                        //console.log(r);
                        $('#tvWrap').html("");
                        var dataArr = r.data;
                        if(dataArr.length==0){
                            $('#tvWrap').html("<p>暂无资源</p>");

                        }else{
                            for(var i=0;i<dataArr.length;i++){
                                var obj = dataArr[i];
                                var name = obj.name;
                                if(name.length>8){
                                    name = name.substring(0,8)+"...";
                                }
                                var imgSrc = ""+obj.imgSrc;
                                var error = "../image/error1.png";
                                $('#tvWrap').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                                    '\t\t\t\t\t<div onclick="toTVDetail(\''+obj.eid+'\')" class="about">\n' +
                                    '\t\t\t\t\t\t<!--<i class="fa fa-cogs"></i>-->\n' +
                                    '\t\t\t\t\t\t<img onerror=src="'+error+'" class="img-responsive lazy" style="min-height: 120px;" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">\n' +
                                    '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                                    '\t\t\t\t\t\t<a href="javascript:void(0)">前往观看</a>\n' +
                                    '\t\t\t\t\t</div>\n' +
                                    '\t\t\t\t</div>');
                            }
                            $('#tv2more').show();
                            /*$("img.lazy").lazyload({
                                effect : "fadeIn",
                                placeholder : "../image/loading.gif"
                            });*/
                        }

                    });
                }
            }
        }
        else{//上滚
            //console.log("上滚");
        }
        setTimeout(function(){t = p;},0);
    });
});



$(function () {

    $('#back-to-top').click();

    var toRequest = getCookieValue("request");
    if(toRequest){
        $('#2request').click();
        deleteCookie("request","/");
    }

    $('#banner').show();

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
                var name = obj.name;
                if(name.length>7){
                    name = name.substring(0,7)+"...";
                }
                var imgSrc = obj.imgSrc2;
                var error = "../image/error1.png";
                //var description = obj.description.substring(0,15)+"...";
                var imgId = "IMG-"+i;
                $('#movieWrap').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                    '\t\t\t\t\t<div onclick="toDetail('+obj.type+','+obj.id+')" class="about">\n' +
                    '\t\t\t\t\t\t<!--<i class="fa fa-cogs"></i>-->\n' +
                    '\t\t\t\t\t\t<img id="'+imgId+'" onerror=src="'+error+'" class="img-responsive lazy" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">\n' +
                    '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                    '\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>');
            }
            $('#movie2more').show();
            $("img.lazy").lazyload({
                
            });
        }
    });

    var interval = setInterval(function () {
        var imgHeight = $('#IMG-0').height();
        if(imgHeight>10){
            //$("#preloader").delay(300).fadeOut();
            window.clearInterval(interval);
        }
    },10);

    //渲染观看历史
    renderHistory();

});

function toMore(type) {
    $.post("/setSession",{type:type},function (r) {
        if(r.code==1){
            window.location.href = "/list";
        }
    });
}

function toMoreTV() {
    window.location.href = "/listTV";
}

function toDetail(type,itemId) {
    $.post("/setSession",{type:type,itemId:itemId},function (r) {
        if(r.code==1){
            window.location.href = "/single";
        }
    });
}

function toTVDetail(eid) {
    window.location.href = "/singleTV?eid="+eid;
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

function renderHistory() {
    if(!window.localStorage){
        //alert("浏览器支持localstorage");
    }else{
        $('#historyWrap').html("");
        var history = localStorage.getItem("history");
        if(history){
            var dataArr = JSON.parse(history);
            dataArr.reverse();
            for(var i=0;i<dataArr.length;i++){
                var obj = dataArr[i];
                //var jsonObj = JSON.parse(obj);
                var name = obj.name.trim();
                if(name.length>7){
                    name = name.substring(0,6);
                }
                var title = name;
                if(obj.sequence>1){
                    title = name+"-"+obj.sequence;
                }
                $('#historyWrap').append('<li style="padding: 0px 0px">\n' +
                    '\t\t\t\t\t\t\t\t<a style="padding: 10px 10px;" href="javascript:toHistory(\''+obj.eid+','+obj.type+'\')">\n' +
                    '\t\t\t\t\t\t\t\t\t<span style="font-size:13px;">'+title+'</span>\n' +
                    '\t\t\t\t\t\t\t\t\t<span style="font-size: 9px;">['+obj.viewTime+']</span>\n' +
                    '\t\t\t\t\t\t\t\t</a>\n' +
                    '\t\t\t\t\t\t\t</li>')
            }
        }
    }
}

function toHistory(eid) {
    var arr = eid.split(",");
    eid = arr[0];
    var type = arr[1];
    if(parseInt(type)){
        window.location.href = "/index/resource/share?v="+eid;
    }else{
        window.location.href = "/singleTV?eid="+eid;
    }
}
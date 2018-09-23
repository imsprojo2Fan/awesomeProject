var GlobalItem;
var GlobalFrame;
$(function () {

    //返回顶部
    $('body,html').animate({
        scrollTop: 0
    }, 300);

    if(isPhone()){
        $('#play').hide();
        $('#logo').css("margin-left","38%");
        $('#aside').hide();
        $('#pageWrap').hide();
        $('#iframe').css("height","205px");
        $('.loading-wrap').css("width","90%");
        $('.loader').css("margin-left","-30px");
        $('.loading-wrap').css("height","205px");
        $('.loading-wrap').css("top","6px");
        //$("[data-toggle='tooltip']").tooltip();
        //隐藏喜欢和收藏
        $('#actionWrap').hide();
        //隐藏迅雷下载
        $('#downloadWrap').hide();
    }

    var myFrame = document.getElementById('myFrame');
    GlobalFrame = myFrame;
    myFrame.onload = myFrame.onreadystatechange = function () {
        if (this.readyState && this.readyState != 'complete') {
            //console.log("加载中。。。");
        }
        else {
            //console.log("加载完成。。。");
            $('#frameLoading').hide();
        }
    }

    $('.order a').on('click',function () {
        var txt = $(this).html();
        var col;
        if(txt==="最多观看"){
            col = "views";
        }else if(txt ==="最多喜欢"){
            col = "likes";
        }else{
            col = "collects";
        }
        $('#tip').html("["+txt+"]");
        aside(col);
    });

    //获取url参数
    var eid = getQueryString("eid");
    getItem(eid);

    if(!isPhone()){
        setTimeout(function () {
            //右侧导航
            category();
            aside("views");
            //获取评论列表
            list4comment(eid,1,1000);
        },1000);
    }

});

function getItem(eid) {

    $("#preloader").fadeIn(200);

    $.post("/index/resource/list4tvItem",{eid:eid},function (r) {
        //debugger
        var url = "'/listTV'";
        $('#tab2').html('<a  href="javascript:window.location.href='+url+'">电视列表</a>');
        console.log(r);
        var obj = r.data[0];
        GlobalItem = obj;
        $('#tab3').html(obj.name);
        //设置分类
        $('#tagWrap').html('<a href="javascript:void(0)"><i class="fa fa-tag"></i>'+obj.area_type
            +'</a>');
        //设置查看数、喜欢数、收藏数
        $('#views').html(obj.views);
        $('#likes').html(obj.likes);
        $('#collects').html(obj.collects);
        //生成分享二维码
        makeCode(obj.eid);
        $("#preloader").fadeOut(200);

        if(obj.is_on==0){
            $('#frameLoading').hide();
            $('#tipLoading').show();
            $('#lineWrapAll').hide();
            $('#actionWrapAll').hide();
            return
        }

        //渲染ui
        $('#lineWrap').html("");
        if(isPhone()){
            for(var i=0;i<3;i++){
                var func;
                var title;
                var flag = false;
                var style = "margin-right: 4px;";
                if(i==0){
                    func = "setUrl(0)";
                    title="线路一";
                    if(!GlobalItem.url4||GlobalItem.url4=="暂无资源"){
                        flag = true;
                    }
                }else if(i==1){
                    func = "setUrl(1)";
                    title="线路二";
                    if(!GlobalItem.url5||GlobalItem.url5=="暂无资源"){
                        flag = true;
                    }
                }else if(i==2){
                    func = "setUrl(2)";
                    title="线路三";
                    if(!GlobalItem.url6||GlobalItem.url6=="暂无资源"){
                        flag = true;
                    }
                }
                $('#lineWrap').append('<a class="btn" id="line'+i+'" href="javascript:'+func+'" style="'+style+'" data-toggle="tooltip" data-placement="bottom" title="'+title+'">\n' +
                    '\t\t\t\t\t\t\t\t\t\t<i class="fa fa-chain"></i>'+title+'' +
                    '\t\t\t\t\t\t\t\t\t</a>');
                if(flag){
                    $('#line'+i).attr("disabled",flag);
                    $('#line'+i).attr("href","javascript:void(0);");
                    $('#line'+i).attr('title',"暂不可看").tooltip('fixTitle');
                }
            }
        }else{
            for(var j=0;j<6;j++){
                var func;
                var title;
                var flag = false;
                var style = "margin-right: 4px;";

                if(j==0){
                    func = "setUrl(0)";
                    title="线路一";
                    if(!GlobalItem.url1||GlobalItem.url1=="暂无资源"){
                        flag = true;
                    }
                }else if(j==1){
                    func = "setUrl(1)";
                    title="线路二";
                    if(!GlobalItem.url2||GlobalItem.url2=="暂无资源"){
                        flag = true;
                    }
                }else if(j==2){
                    func = "setUrl(2)";
                    title="线路三";
                    if(!GlobalItem.url3||GlobalItem.url3=="暂无资源"){
                        flag = true;
                    }
                }else if(j==3){
                    func = "setUrl(3)";
                    title="线路四";
                    if(!GlobalItem.url4||GlobalItem.url4=="暂无资源"){
                        flag = true;
                    }
                }else if(j==4){
                    func = "setUrl(4)";
                    title="线路五";
                    if(!GlobalItem.url5||GlobalItem.url5=="暂无资源"){
                        flag = true;
                    }
                }else if(j==5){
                    func = "setUrl(5)";
                    title="线路六";
                    if(!GlobalItem.url6||GlobalItem.url6=="暂无资源"){
                        flag = true;
                    }
                }

                $('#lineWrap').append('<a class="btn" id="line'+j+'" href="javascript:'+func+'" style="'+style+'" data-toggle="tooltip" data-placement="bottom" title="'+title+'">\n' +
                    '\t\t\t\t\t\t\t\t\t\t<i class="fa fa-chain"></i>'+title+'' +
                    '\t\t\t\t\t\t\t\t\t</a>');
                if(flag){
                    $('#line'+j).attr("disabled",flag);
                    $('#line'+j).attr("href","javascript:void(0);");
                    $('#line'+j).attr('title',"暂不可看").tooltip('fixTitle');
                }
            }
        }

        //默认播放
        setUrl(0);

    });



    //渲染观看历史
    renderHistory();



}

function searchResource() {
    swal({
        title: '请输入频道名称',  //标题
        input: 'text',
        showCancelButton: true,
        cancelButtonText:'取消',
        confirmButtonText: '确定',
        showLoaderOnConfirm: true,
        preConfirm: function(val) {               //功能执行前确认操作，支持function
            return new Promise(function(resolve, reject) {
                addCookie("searchTV",val,1,"/");
                window.location.href = "/listTV"
                resolve();

            })
        },
        allowOutsideClick: true
    }).then(function(val) {
        //console.log(val)
    });
}

function request() {
    addCookie("request","request",1,"/");
    window.location.href = "/";
}

function category() {

    if(isPhone()){
        return;
    }

    //获取目录概览数据
    $.post("/index/resource/category",{},function (r) {
        //console.log(r);
        $('#categoryWrap').html("");
        var title;
        if(r.length==0){
            $('#categoryWrap').html("<p>暂无资源</p>");
        }
        for(var i=0;i<r.length;i++){
            var obj = r[i];
            if(i===0){
                title = "电影";
            }else if(i===1){
                title = "电视剧";
            }else if(i===2){
                title = "综艺";
            }else if(i===3){
                title = "动漫";
            }
            if(i<4){
                var type = i+1;
                $('#categoryWrap').append('<a onclick="toMore('+type+')" href="javascript:void(0)">'+title+'<span>('+obj+')</span></a>');
            }else{
                $('#categoryWrap').append('<a  href="javascript:toMoreTV()">电视直播<span>('+obj+')</span></a>');
            }
        }
    });
}

function aside(col) {

    if(isPhone()){
        return;
    }

    //获取最多观看数据
    $.post("/index/tv/list4TVOrder",{col:col},function (r) {
        //console.log(r);
        $('#popularWrap').html("");
        if(r.length==0){
            $('#popularWrap').html("<p>暂无数据</p>");
            return;
        }
        var icon;
        var dCount;

        for(var j=0;j<r.length;j++){
            var obj = r[j];

            if(col==="views"){
                icon = '<i class="fa fa-eye"></i>';
                dCount = obj.views;
            }else if(col==="likes"){
                icon = '<i class="fa fa-heart"></i>';
                dCount = obj.likes;
            }else{
                icon = '<i class="fa fa-star"></i>';
                dCount = obj.collects;

            }

            var imgSrc = ""+obj.imgSrc;
            var error = "../image/error1.png";
            $('#popularWrap').append('<div ><div onclick="getItem(\''+obj.eid+'\')" class="asideWrap"><div class="asideItem">'+obj.name+'</div></div><span style="float:right;margin-top:-34px;margin-right:6px;color:#6195FF">'+icon+dCount+'</span></div>');
        }
    });
    $("[data-toggle='tooltip']").tooltip();

}

function toMore(type) {
    $.post("/setSession",{type:type},function (r) {
        if(r.code==1){
            window.location.href = "/list";
        }
    });
}

function share() {
    //debugger
    var dom = $('#qrcode').clone();
    $(dom).css("display","block");
    $(dom).css("margin","0 auto");
    swal({
        title: "<p>长按扫码/保存分享</p>",
        text:'',
        html: dom
    });


}

function makeCode(eid) {
    var url = "http://awesome.zooori.cn/singleTV?eid="+eid;
    var qrcode = new QRCode("qrcode", {
        text: url,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

function report() {
    swal({
        title: '资源不可播？',
        text: '扫描右下角二维码进分享群直接反馈',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6195FF',
        cancelButtonColor: '#d33',
        confirmButtonText: '确定..',
        cancelButtonText:'你再试试',
    }).then(function(){

        $.post("/index/resource/report",{id:GlobalItem.id,name:GlobalItem.name},function (r) {
            if(r.code==1){
                swal(
                    '您反馈的问题已提交',
                    '小哥哥将尽快处理呢,笔芯❤',
                    'success'
                );
            }else{
                swal("火星人来袭","服务貌似不在线了..","error");
            }
        });
    })
}

function comment() {
    //swal("Oops,功能还未开放喔","有什么感想可以悄悄告诉我的 /偷笑","info");
    var nickName = $('#nickName').val().trim();
    var email = $('#email').val().trim();
    var content = $('#content').val().trim();
    if(!nickName){
        swal("昵称似乎忘记填写了","^ˇ^≡","warning");
        return;
    }

    if(!email){
        swal("邮箱不能为空喔","~ (^_^)∠※","warning");
        return;
    }

    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if(!reg.test(email)){
        swal("邮箱格式似乎不对！","( ¯▽¯；)","warning");
        return;
    }

    if(!content){
        swal("难道不想写些什么吗","~ (^_^)∠※","warning");
        return;
    }
    $.post("/index/comment/add",{rid:GlobalItem.eid,nickName:nickName,email:email,content:content,count:$('#comments').html()},function (r) {
        if(r.code==1){
            //获取评论列表
            list4comment(GlobalId,1,1000);
            $('#nickName').val("");
            $('#email').val("");
            $('#content').val("");
            swal("我貌似发现了一个潜在的诗人","(☆＿☆)","success");
        }else{
            swal("服务器貌似被火星人占领了","( ⊙ o ⊙ )","error");
        }
    })
}

function down(url) {
    window.location.href = url;
}

function action(type) {
    swal("火星人来袭","该操作需要登录才行","warning");
}

/*//返回顶部
$('body,html').animate({
    scrollTop: 0
}, 300);*/

function setUrl(index) {

    //返回顶部
    $('body,html').animate({
        scrollTop: 0
    }, 300);

    $('#frameLoading').show();

    var dom = $('#myFrame').clone();
    $('#iframeWrap').html("");
    $('#iframeWrap').html(dom);
    var myFrame = document.getElementById('myFrame');
    myFrame.onload = myFrame.onreadystatechange = function () {
        if (this.readyState && this.readyState != 'complete') {
            //console.log("加载中。。。");
        }
        else {
            //console.log("加载完成。。。");
            $('#frameLoading').hide();
        }
    }

    var iframeUrl = "";
    //移除选中状态
    $('#lineWrap').html("");
    //渲染ui
    if(isPhone()){
        for(var i=0;i<3;i++){
            var func;
            var title;
            var flag = false;
            var style = "margin-right: 4px;";
            if(i==0){
                func = "setUrl(0)";
                title="线路一";
                if(!GlobalItem.url4||GlobalItem.url4=="暂无资源"){
                    flag = true;
                }
            }else if(i==1){
                func = "setUrl(1)";
                title="线路二";
                if(!GlobalItem.url5||GlobalItem.url5=="暂无资源"){
                    flag = true;
                }
            }else if(i==2){
                func = "setUrl(2)";
                title="线路三";
                if(!GlobalItem.url6||GlobalItem.url6=="暂无资源"){
                    flag = true;
                }
            }
            $('#lineWrap').append('<a class="btn" id="line'+i+'" href="javascript:'+func+'" style="'+style+'" data-toggle="tooltip" data-placement="bottom" title="'+title+'">\n' +
                '\t\t\t\t\t\t\t\t\t\t<i class="fa fa-chain"></i>'+title+'' +
                '\t\t\t\t\t\t\t\t\t</a>');
            if(flag){
                $('#line'+i).attr("disabled",flag);
                $('#line'+i).attr("href","javascript:void(0);");
                $('#line'+i).attr('title',"暂不可看").tooltip('fixTitle');
            }
        }
    }else{

        if(!GlobalItem.url1){
            index = 3;//url1为空时则使用url4
        }

        for(var j=0;j<6;j++){
            var func;
            var title;
            var flag = false;
            var style = "margin-right: 4px;";

            if(j==0){
                func = "setUrl(0)";
                title="线路一";
                if(!GlobalItem.url1||GlobalItem.url1=="暂无资源"){
                    flag = true;
                }
            }else if(j==1){
                func = "setUrl(1)";
                title="线路二";
                if(!GlobalItem.url2||GlobalItem.url2=="暂无资源"){
                    flag = true;
                }
            }else if(j==2){
                func = "setUrl(2)";
                title="线路三";
                if(!GlobalItem.url3||GlobalItem.url3=="暂无资源"){
                    flag = true;
                }
            }else if(j==3){
                func = "setUrl(3)";
                title="线路四";
                if(!GlobalItem.url4||GlobalItem.url4=="暂无资源"){
                    flag = true;
                }
            }else if(j==4){
                func = "setUrl(4)";
                title="线路五";
                if(!GlobalItem.url5||GlobalItem.url5=="暂无资源"){
                    flag = true;
                }
            }else if(j==5){
                func = "setUrl(5)";
                title="线路六";
                if(!GlobalItem.url6||GlobalItem.url6=="暂无资源"){
                    flag = true;
                }
            }
            if(j==index){
                style = "margin-right:4px;background:#6195FF;color:#fff;";
            }
            $('#lineWrap').append('<a class="btn" id="line'+j+'" href="javascript:'+func+'" style="'+style+'" data-toggle="tooltip" data-placement="bottom" title="'+title+'">\n' +
                '\t\t\t\t\t\t\t\t\t\t<i class="fa fa-chain"></i>'+title+'' +
                '\t\t\t\t\t\t\t\t\t</a>');
            if(flag){
                $('#line'+j).attr("disabled",flag);
                $('#line'+j).attr("href","javascript:void(0);");
                $('#line'+j).attr('title',"暂不可看").tooltip('fixTitle');
            }
        }
    }

    if(index==0){
        iframeUrl = GlobalItem.url1;
    }else if(index==1){
        iframeUrl = GlobalItem.url2;
    }else if(index==2){
        iframeUrl = GlobalItem.url3;
    }else if(index==3){
        iframeUrl = GlobalItem.url4;
    }else if(index==4){
        iframeUrl = GlobalItem.url5;
    }else if(index==5){
        iframeUrl = GlobalItem.url6;
    }
    if(isPhone()){//移动端
        if(index==0){
            iframeUrl = GlobalItem.url4;
        }else if(index==1){
            iframeUrl = GlobalItem.url5;
        }else if(index==2){
            iframeUrl = GlobalItem.url6;
        }
        if(iframeUrl){
            iframeUrl = "/iframe?url="+iframeUrl;
            iframeUrl = iframeUrl+"?rel=0&amp;autoplay=1";
            $('#frameLoading').show();
            $('#myFrame').attr("src",iframeUrl);
            $('#tipPlay').show();
            //添加观看历史
            history();
        }else{//移动端地址为空时显示资源不可播放
            $('#frameLoading').hide();
            $('#tipLoading').show();
        }
    }else{
        if(iframeUrl){
            if(iframeUrl.indexOf(".flv")>0||iframeUrl.indexOf(".m3u8")>0){
                //iframeUrl = iframeUrl.split("url=")[1];
                iframeUrl = "/iframe?url="+iframeUrl;
            }
            $('#frameLoading').show();
            $('#myFrame').attr("src",iframeUrl);
            $('#tipPlay').show();
            //添加观看历史
            history();
        }else{//移动端地址为空时显示资源不可播放
            $('#frameLoading').hide();
            $('#tipLoading').show();
        }
    }
}


function list4comment(id,pageNow,pageSize) {
    $.post("/index/comment/list",{id:id,pageNow:pageNow,pageSize:pageSize},function (r) {
        console.log(r);
        var dataArr = r.data;
        $('#comments').html("("+r.count+")");
        $('#commentWrap').html("");
        for(var i=0;i<dataArr.length;i++){
            var obj = dataArr[i];
            var nickName = obj.nickName;
            var created = obj.created;
            created = getDateDiff(created);
            if(nickName.length>10){
                nickName = nickName.substring(0,10)+"...";
            }

            $('#commentWrap').append('<div class="media">\n' +
                '\t\t\t\t\t\t\t\t<div class="media-left">\n' +
                '\t\t\t\t\t\t\t\t\t<img class="media-object" src="../image/default4person2.png" alt="">\n' +
                '\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t<div class="media-body">\n' +
                '\t\t\t\t\t\t\t\t\t<h4 class="media-heading">'+nickName+'<span class="time">'+created+'</span><!--<a href="#" class="reply">Reply <i class="fa fa-reply"></i></a>--></h4>\n' +
                '\t\t\t\t\t\t\t\t\t<p>'+obj.content+'</p>\n' +
                '\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t</div>');
        }
    });
}


//字符串转换为时间戳
function getDateTimeStamp (dateStr) {
    return Date.parse(dateStr.replace(/-/gi,"/"));
}

function getDateDiff (dateStr) {
    var publishTime = getDateTimeStamp(dateStr)/1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime()/1000),
        d,

        date = new Date(publishTime*1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
        M = '0' + M;
    }
    if (D < 10) {
        D = '0' + D;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d/86400);
    d_hours = parseInt(d/3600);
    d_minutes = parseInt(d/60);
    d_seconds = parseInt(d);

    if(d_days > 0 && d_days < 3){
        return d_days + '天前';
    }else if(d_days <= 0 && d_hours > 0){
        return d_hours + '小时前';
    }else if(d_hours <= 0 && d_minutes > 0){
        return d_minutes + '分钟前';
    }else if (d_seconds < 60) {
        if (d_seconds <= 0) {
            return '刚刚发表';
        }else {
            return d_seconds + '秒前';
        }
    }else if (d_days >= 3 && d_days < 30){
        return M + '-' + D + '&nbsp;' + H + ':' + m;
    }else if (d_days >= 30) {
        return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function history(){
    if(!window.localStorage){
        //alert("浏览器支持localstorage");
    }else{
        if(!GlobalItem){
            return;
        }
        var storage = window.localStorage;
        var arr = localStorage.getItem("history");
        if(!arr){
            arr = [];
        }else{
            arr = JSON.parse(arr);
            if(arr.length>20){
                arr = [];
            }
            //移除已存在的记录
            for(var i=0;i<arr.length;i++){
                var obj = arr[i];
                if(obj.name==GlobalItem.name){
                    arr.splice(i,1);
                }
            }
        }
        GlobalItem.viewTime = format();
        //var d = JSON.stringify(GlobalItem);
        arr.push(GlobalItem);
        storage.setItem("history",JSON.stringify(arr));

        var name = GlobalItem.name;
        GlobalItem.viewTime = format();
        var d = JSON.stringify(GlobalItem);
        storage.setItem(name,d);
    }
    renderHistory();
}

function format(){
    var date = new Date();
    var year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var newTime = year + '-' +
        (month < 10 ? '0' + month : month) + '-' +
        (day < 10 ? '0' + day : day) + ' ' +
        (hour < 10 ? '0' + hour : hour) + ':' +
        (min < 10 ? '0' + min : min) + ':' +
        (sec < 10 ? '0' + sec : sec);
    newTime = (month < 10 ? '0' + month : month) + '-' +
        (day < 10 ? '0' + day : day) + ' ' +
        (hour < 10 ? '0' + hour : hour) + ':' +
        (min < 10 ? '0' + min : min) + ':' +
        (sec < 10 ? '0' + sec : sec);

    return newTime;
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

function toMoreTV() {
    window.location.href = "/listTV";
}


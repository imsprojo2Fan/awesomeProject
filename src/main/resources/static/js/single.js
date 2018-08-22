var GlobalId;
var GlobalName;
var GlobalVideoSrc;
var GlobalArr;
var GlobalBdUrl;
var isSeries;//是否多剧集
var GlobalFrame;
$(function () {

    //禁止内置浏览器整个网页被拉动---------------------------------------start
    /*var overscroll = function(el) {
        el.addEventListener('touchstart', function() {
            var top = el.scrollTop
                , totalScroll = el.scrollHeight
                , currentScroll = top + el.offsetHeight;
            //If we're at the top or the bottom of the containers
            //scroll, push up or down one pixel.
            //
            //this prevents the scroll from "passing through" to
            //the body.
            if(top === 0) {
                el.scrollTop = 1;
            } else if(currentScroll === totalScroll) {
                el.scrollTop = top - 1;
            }
        });
        el.addEventListener('touchmove', function(evt) {
            //if the content is actually scrollable, i.e. the content is long enough
            //that scrolling can occur
            if(el.offsetHeight < el.scrollHeight)
                evt._isScroller = true;
        });
    }
    overscroll(document.querySelector('.scroll'));
    document.body.addEventListener('touchmove', function(evt) {
        //In this case, the default behavior is scrolling the body, which
        //would result in an overflow.  Since we don't want that, we preventDefault.
        if(!evt._isScroller) {
            evt.preventDefault();
        }
    });*/
    //禁止内置浏览器整个网页被拉动---------------------------------------end

    if(isPhone()){
        $('#play').hide();
        $('#logo').css("margin-left","38%");
        $('#aside').hide();
        $('#pageWrap').hide();
        $('#iframe').css("height","30vh");
        $('.loading-wrap').css("height","31vh");
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

    getItem("");

});

function getItem(id) {

    $("#preloader").delay(300).fadeIn();

    $.post("/index/resource/list4item",{id,id},function (r) {
        //debugger
        var tab = "";
        var types = r.type;
        var type = parseInt(types);
        if(type===1){
            tab = "电影列表";
        }else if(type===2){
            tab = "电视剧列表";
        }else if(type===3){
            tab = "综艺列表";
        }else if(type===4){
            tab = "动漫列表";
        }
        $('#tab2').html('<a onclick="toMore('+type+')" href="javascript:void(0);">'+tab+'</a>');

        //console.log(r);

        var dataArr = r.data;
        GlobalArr = r.data;
        for(var i=0;i<dataArr.length;i++){
            var obj = dataArr[i];
            GlobalId = obj.id;
            GlobalName = obj.name;
            $('#tab3').html(obj.name);
            $('#name').html(obj.name);
            var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
            $('#img').attr('src',imgSrc);
            $('#director').html("导演："+obj.director);
            var actor = obj.actor;
            if(actor.length>25){
                actor = actor.substring(0,45)+"...";
            }
            $('#actor').html("主演："+actor);
            $('#publish').html("发行日期："+obj.publish);
            $('#length').html("播放时长："+obj.length);
            $('#views').html(obj.views);
            $('#collects').html(obj.collects);
            $('#likes').html(obj.likes);
            $('#comments').html("("+obj.comments+")");
            if(obj.comments==0){
                $('#commentWrap').html("<p style='margin-left: 6px'>暂无评论</p>");
            }
            var description = obj.description;
            $('#description').html(description);
            if(i==dataArr.length-1){
                var detailType = obj.detailType;
                var tArr = detailType.split(",");
                $('#tagWrap').html("");
                for(var j=0;j<tArr.length;j++){
                    $('#tagWrap').append('<a style="margin-right: 5px" href="javascript:void(0)"><i class="fa fa-tag"></i>'+tArr[j]+'</a>')
                }
            }

            if(dataArr.length==1){//剧集数为1时直接显示在线播放等

                $('#urlWrap').show();
                //处理移动端及电脑端在线资源链接
                if(isPhone()){
                    var phoneSrc = obj.phoneSrc;
                    if(!phoneSrc||phoneSrc=="无资源链接"){
                        GlobalVideoSrc = "";
                    }else{
                        GlobalVideoSrc = phoneSrc+"?rel=0&amp;autoplay=1";
                    }
                }else{
                    GlobalVideoSrc = obj.videoSrc+"?rel=0&amp;autoplay=1";
                }

                var bdUrl = obj.bdUrl;
                var isOn = obj.isOn;
                if(isOn===0){
                    $('#stopBtn').show();
                    $('#playBtn').hide();
                    $('#play').hide();
                }else{
                    $('#stopBtn').hide();
                    $('#playBtn').show();

                    if(!isPhone()){
                        $('#play').show();
                    }
                    //图片绑定播放事件
                    $('#img').on("click",function () {
                        switchWindow();
                    });
                }
                if(isPhone()){
                    $('#bdUrl').hide();
                    $('#bdUrl2').show();

                    if(bdUrl&&bdUrl!="无资源链接"){
                        bdUrl = bdUrl.substring(3,bdUrl.length);
                        bdUrl = bdUrl.replace(":","：");
                        var bdArr = bdUrl.split("密码：");
                        var pass = bdArr[1];
                        var url = bdArr[0].replace("：",":");
                        GlobalBdUrl = url;
                        $('#copy').val(pass);
                    }

                }else{
                    if(bdUrl&&bdUrl!="无资源链接"){
                        bdUrl = bdUrl.substring(3,bdUrl.length);
                        bdUrl = bdUrl.replace(":","：");
                        var bdArr = bdUrl.split("密码：");
                        var pass = bdArr[1];
                        var url = bdArr[0].replace("：",":");
                        $('#bdUrl').attr("disabled",false);
                        $('#bdUrl').attr("href",url);
                        $('#bdUrl').attr('title',"密码:"+pass).tooltip('fixTitle');
                    }else{
                        $('#bdUrl').attr("disabled",true);
                        $('#bdUrl').attr("href","javascript:void(0);");
                        $('#bdUrl').attr('title',"暂无分享链接").tooltip('fixTitle');
                    }
                }

                $('#downloadWrap').html("");
                for(var k=0;k<3;k++){
                    if(k===0){
                        if(!obj.xlUrl1||obj.xlUrl1==="无资源链接"){
                            $('#downloadWrap').append('<a style="margin-right: 6px" data-toggle="tooltip" data-placement="bottom" title="暂无下载链接" class="btn" disabled="true"  href="javascript:void(0);"><i class="fa  fa-download"></i>迅雷下载一</a>')
                        }else{
                            $('#downloadWrap').append('<a style="margin-right: 6px" class="btn"  href="javascript:down(\''+obj.xlUrl1+'\')"><i class="fa  fa-download"></i>迅雷下载一</a>')
                        }
                    }else if(k===1){
                        if(!obj.xlUrl2||obj.xlUrl2==="无资源链接"){
                            $('#downloadWrap').append('<a style="margin-right: 6px" data-toggle="tooltip" data-placement="bottom" title="暂无下载链接" class="btn" disabled="true"  href="javascript:void(0);"><i class="fa  fa-download"></i>迅雷下载二</a>')
                        }else{
                            $('#downloadWrap').append('<a style="margin-right: 6px" class="btn"  href="javascript:down(\''+obj.xlUrl2+'\')"><i class="fa  fa-download"></i>迅雷下载二</a>')
                        }
                    }else{
                        if(!obj.xlUrl3||obj.xlUrl3==="无资源链接"){
                            $('#downloadWrap').append('<a class="btn" data-toggle="tooltip" data-placement="bottom" title="暂无下载链接" disabled="true" target="_blank" href="javascript:void(0);"><i class="fa  fa-download"></i>迅雷下载三</a>')
                        }else{
                            $('#downloadWrap').append('<a class="btn" href="javascript:down(\''+obj.xlUrl3+'\')"><i class="fa  fa-download"></i>迅雷下载三</a>')
                        }
                    }
                }
            }else{//多剧集处理
                isSeries = true;
                $('#seriesParent').show();
                $('#play').hide();

                var sequence = obj.sequence;
                if(sequence<10){
                    sequence = "0"+sequence;
                }

                var seriesIsOn = obj.seriesIsOn;
                var sid = "s"+i;
                if(obj.isOn===0){//整季下架
                    $('#seriesWrap').append('<a id="'+sid+'" style="margin-right: 5px" class="btn" disabled="true" data-toggle="tooltip" data-placement="top" title="资源已下架" href="javascript:void(0);">'+sequence+'</a>');
                }else{
                    if(seriesIsOn===0){//当前集下架
                        $('#seriesWrap').append('<a style="margin-right: 5px" class="btn" disabled="true" data-toggle="tooltip" data-placement="top" title="资源已下架" href="javascript:void(0);">'+sequence+'</a>');
                    }else{
                        $('#seriesWrap').append('<a style="margin-right: 5px" onclick="toSeries('+i+');" href="javascript:void(0);">'+sequence+'</a>');
                    }
                }
            }
        }
        category();
        aside("views");
        //获取评论列表
        list4comment(GlobalId,1,10);
    });

    //初始化资源信息
    $('#playBtn').html('<i class="fa fa-angle-double-left"></i>返回详情');
    $('#playBtn').click();
}

function searchResource() {
    swal({
        title: '请输入资源名称',  //标题
        input: 'text',
        showCancelButton: true,
        cancelButtonText:'取消',
        confirmButtonText: '确定',
        showLoaderOnConfirm: true,
        preConfirm: function(val) {               //功能执行前确认操作，支持function
            return new Promise(function(resolve, reject) {
                addCookie("search",val,1,"/");
                window.location.href = "/list"
                resolve();
                /*setTimeout(function() {                 //添加一个时间函数，在俩秒后执行，这里可以用作异步操作数据
                    if (email === 'taken@example.com') {  //这里的意思是：如果输入的值等于'taken@example.com',数据已存在，提示信息
                        reject('用户已存在')                  //提示信息
                    } else {
                        resolve()                           //方法出口
                    }
                }, 2000)*/
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
            }else{
                title = "动漫";
            }
            var type = i+1;
            $('#categoryWrap').append('<a onclick="toMore('+type+')" href="javascript:void(0)">'+title+'<span>('+obj+')</span></a>');
        }
    });
}

function aside(col) {
    //获取最多观看数据
    $.post("/index/resource/list4order",{col:col},function (r) {
        //console.log(r);
        $('#popularWrap').html("");
        if(r.length==0){
            $('#popularWrap').html("<p>暂无数据</p>");
            return;
        }
        var icon;
        if(col==="views"){
            icon = '<i class="fa fa-eye"></i>';
        }else if(col==="likes"){
            icon = '<i class="fa fa-heart"></i>';
        }else{
            icon = '<i class="fa fa-star"></i>';
        }
        for(var j=0;j<r.length;j++){
            var obj = r[j];
            var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
            var error = "../image/error1.png";
            $('#popularWrap').append('<div class="widget-post">\n' +
                '\t\t\t\t\t\t<a onclick="getItem('+obj.id+')" href="javascript:void(0);">\n' +
                '\t\t\t\t\t\t\t<img style="width: 20%" onerror=src="'+error+'" src="'+imgSrc+'" alt="图片加载失败"> '+obj.name+'\n' +
                '\t\t\t\t\t\t</a>\n' +
                '\t\t\t\t\t\t<ul class="blog-meta">\n' +
                '\t\t\t\t\t\t\t<li>'+icon+obj.views+'</li>\n' +
                '\t\t\t\t\t\t</ul>\n' +
                '\t\t\t\t\t</div>');
        }
    });
    $("[data-toggle='tooltip']").tooltip();
    $("#preloader").delay(300).fadeOut();
}

function toMore(type) {
    $.post("/setSession",{type:type},function (r) {
        if(r.code==1){
            window.location.href = "/list";
        }
    });
}

function switchWindow() {
    //debugger
    var txt = $('#playBtn').html();
    $('#info').hide();
    $('#iframe').hide();
    if(txt.indexOf("在线播放")>0){
        $('#playBtn').html('<i class="fa fa-angle-double-left"></i>返回详情');
        $('#iframe').show();
        if(GlobalVideoSrc){
            $('#frameLoading').show();
            $('#myFrame').attr("src",GlobalVideoSrc);
        }else{//移动端地址为空时显示资源不可播放
            $('#frameLoading').hide();
            $('#tipLoading').show();
        }
        //隐藏返回列表
        $('#backList').hide();
    }else if(txt.indexOf("返回详情")>0){
        //$('#itemWrap').html(GlobalFrame);
        $('#myFrame').attr("src","/blank");
        $('#playBtn').html('<i class="fa fa-play-circle"></i>在线播放');
        $('#info').show();
        //隐藏返回列表
        if(isSeries){
            $('#backList').show();
        }
    }
    //返回顶部
    $('body,html').animate({
        scrollTop: 0
    }, 300);
}

function report() {
    swal({
        title: '确定资源出错了是吗？',
        text: '没准网络断开连接了呢 hhh',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6195FF',
        cancelButtonColor: '#d33',
        confirmButtonText: '确定了啦',
        cancelButtonText:'你再试试',
    }).then(function(){

        $.post("/index/resource/report",{id:GlobalId,name:GlobalName},function (r) {
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
    $.post("/index/comment/add",{rid:GlobalId,nickName:nickName,email:email,content:content,count:$('#comments').html()},function (r) {
        if(r.code==1){
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

function toSeries(index) {
    var obj = GlobalArr[index];
    console.log(obj);
    $('#seriesParent').hide();
    $('#backList').show();
    $('#urlWrap').show();

    if(obj.seriesIsOn===0){
        $('#stopBtn').show();
        $('#playBtn').hide();
        $('#play').hide();
    }else{
        $('#stopBtn').hide();
        $('#playBtn').show();
        //图片绑定播放事件
        $('#img').on("click",function () {
            switchWindow();
        });
    }


    //处理移动端及电脑端在线资源链接
    if(isPhone()){
        var phoneSrc = obj.phoneSrc;
        if(phoneSrc=="无资源链接"){
            GlobalVideoSrc = "";
        }else{
            GlobalVideoSrc = phoneSrc+"?rel=0&amp;autoplay=1";
        }
    }else{
        GlobalVideoSrc = obj.videoSrc+"?rel=0&amp;autoplay=1";
    }

    var bdUrl = obj.bdUrl;
    if(isPhone()){
        $('#bdUrl').hide();
        $('#bdUrl2').show();
        if(bdUrl&&bdUrl!="无资源链接"){
            bdUrl = bdUrl.substring(3,bdUrl.length);
            bdUrl = bdUrl.replace(":","：");
            var bdArr = bdUrl.split("密码：");
            var pass = bdArr[0].replace("：",":");
            var url = bdArr[0].replace("：",":");
            GlobalBdUrl = url;
            $('#copy').val(pass);
        }
    }else{
        if(bdUrl&&bdUrl!="无资源链接"){
            bdUrl = bdUrl.substring(3,bdUrl.length);
            bdUrl = bdUrl.replace(":","：");
            var bdArr = bdUrl.split("密码：");
            var pass = bdArr[1];
            var url = bdArr[0].replace("：",":");
            $('#bdUrl').attr("disabled",false);
            $('#bdUrl').attr("href",url);
            $('#bdUrl').attr('title',"密码:"+pass).tooltip('fixTitle');
        }else{
            $('#bdUrl').attr("disabled",true);
            $('#bdUrl').attr("href","javascript:void(0);");
            $('#bdUrl').attr('title',"暂无分享链接").tooltip('fixTitle');
        }
    }

    $('#downloadWrap').html("");
    for(var k=0;k<3;k++){
        if(k===0){
            if(!obj.xlUrl1||obj.xlUrl1==="无资源链接"){
                $('#downloadWrap').append('<a style="margin-right: 6px" data-toggle="tooltip" data-placement="bottom" title="暂无下载链接" class="btn" disabled="true"  href="javascript:void(0);"><i class="fa  fa-download"></i>迅雷下载一</a>')
            }else{
                $('#downloadWrap').append('<a style="margin-right: 6px" class="btn"  href="javascript:down(\''+obj.xlUrl1+'\')"><i class="fa  fa-download"></i>迅雷下载一</a>')
            }
        }else if(k===1){
            if(!obj.xlUrl2||obj.xlUrl2==="无资源链接"){
                $('#downloadWrap').append('<a style="margin-right: 6px" data-toggle="tooltip" data-placement="bottom" title="暂无下载链接" class="btn" disabled="true"  href="javascript:void(0);"><i class="fa  fa-download"></i>迅雷下载二</a>')
            }else{
                $('#downloadWrap').append('<a style="margin-right: 6px" class="btn"  href="javascript:down(\''+obj.xlUrl2+'\')"><i class="fa  fa-download"></i>迅雷下载二</a>')
            }
        }else{
            if(!obj.xlUrl3||obj.xlUrl3==="无资源链接"){
                $('#downloadWrap').append('<a class="btn" data-toggle="tooltip" data-placement="bottom" title="暂无下载链接" disabled="true" target="_blank" href="javascript:void(0);"><i class="fa  fa-download"></i>迅雷下载三</a>')
            }else{
                $('#downloadWrap').append('<a class="btn" href="javascript:down(\''+obj.xlUrl3+'\')"><i class="fa  fa-download"></i>迅雷下载三</a>')
            }
        }
    }
}

function backList() {
    $('#seriesParent').show();
    $('#backList').hide();
    $('#urlWrap').hide();
}

function toBDCloud() {
    //alert(GlobalBdUrl);
    if(GlobalBdUrl){
        var title = "分享密码为:"+$('#copy').val();
        swal({
            title: title,
            text: '是否前往百度网盘?',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#6195FF',
            cancelButtonColor: '#ff1200',
            confirmButtonText: '是',
            cancelButtonText:'否'
        }).then(function(){
            window.open(GlobalBdUrl);
        });
    }else{
        swal("暂无网盘分享链接","小哥哥将尽快处理","error");
    }
}

function list4comment(id,pageNow,pageSize) {
    $.post("/index/comment/list",{id:id,pageNow:pageNow,pageSize:pageSize},function (r) {
        console.log(r);
        var dataArr = r.data;
        var count = r.count;
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

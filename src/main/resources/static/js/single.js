var GlobalId;
var GlobalRid;
var GlobalName;
var GlobalVideoSrc;
var GlobalDataArr;
var GlobalBdUrl;
var isSeries;//是否多剧集
var GlobalFrame;
var GlobalItem;
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
        $('#iframe').css("height","205px");
        $('.loading-wrap').css("height","205px");
        $('.loading-wrap').css("width","85%");
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

    $("img.lazy").lazyload({
        effect : "fadeIn",
        placeholder : "../image/loading.gif"
    });

    //渲染观看历史
    renderHistory();


});

function getItem(id) {

    $("#preloader").fadeIn(200);

    preLoading();

    //preLoading();

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
        GlobalDataArr = r.data;
        for(var i=0;i<dataArr.length;i++){
            var obj = dataArr[i];
            GlobalItem = obj;
            GlobalId = obj.id;
            GlobalRid = obj.eid;
            GlobalName = obj.name;
            var bdUrl = obj.bdUrl;
            $('#tab3').html(obj.name);
            $('#name').html(obj.name);
            var imgSrc = ""+obj.imgSrc2;
            $('#img').attr('src',imgSrc);
            $('#img').attr("data-original",imgSrc);
            $('#director').html("导演："+obj.director);
            var actor = obj.actor;
            if(actor.length>25){
                actor = actor.substring(0,40)+"...";
            }
            $('#actor').html("主演："+actor);
            $('#publish').html("发行日期："+obj.publish);
            $('#length').html("播放时长："+obj.length);
            $('#views').html(obj.views);
            $('#collects').html(obj.collects);
            $('#likes').html(obj.likes);
            //$('#comments').html("("+obj.comments+")");
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
                        if(phoneSrc.indexOf(".flv")>0||phoneSrc.indexOf(".m3u8")>0){
                            if(phoneSrc.indexOf("url=")>0){
                                phoneSrc = "/iframe?url="+phoneSrc.split("url=")[1];
                            }
                        }

                        GlobalVideoSrc = phoneSrc+"?rel=0&amp;autoplay=1";
                    }
                }else{
                    var videoSrc = obj.videoSrc;
                    if(videoSrc.indexOf(".flv")>0||videoSrc.indexOf(".m3u8")>0){
                        videoSrc = videoSrc.split("url=")[1];
                        videoSrc = "/iframe?url="+videoSrc;
                    }
                    GlobalVideoSrc = videoSrc+"?rel=0&amp;autoplay=1";
                }

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
                        bdUrl = bdUrl.replace("：",":");
                        var bdArr = bdUrl.split("密码:");
                        var pass = bdArr[1];
                        var url = bdArr[0];
                        GlobalBdUrl = url;
                        $('#copy').val(pass);
                    }

                }else{

                    var name = obj.name;
                    var nameArr = name.split(" ");
                    name = nameArr[0];
                    $('#title').html(name);

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

                if(isSeries){//处理多剧集
                    $('#seriesParent').show();

                    $('#seriesWrap').html("");
                    for(var i=0;i<GlobalDataArr.length;i++){
                        var obj = GlobalDataArr[i];
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

                                //获取已看的集数记录
                                var obj = localStorage.getItem(GlobalItem.name);
                                if(obj){
                                    obj = JSON.parse(obj);
                                    var index = obj.sequence-1;
                                    $('#seriesWrap a').each(function (index2) {//移除选中状态

                                        if(index==index2){
                                            //添加选中状态
                                            $(this).css("color","#fff");
                                            $(this).css("background","#6195FF");
                                        }else{
                                            $(this).css("color","#10161A");
                                            $(this).css("background","#F4F4F4");
                                        }

                                    });
                                }
                            }
                        }
                    }
                }



                $('#play').hide();
                $('#urlWrap').show();

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
                    //debugger
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


                /*$('#seriesParent').show();
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
                }*/
            }
        }
        if(!id){
            category();
            aside("views");
        }
        //获取评论列表
        list4comment(GlobalId,1,1000);
        makeCode(GlobalRid);
    });

    //初始化资源信息
    $('#playBtn').html('<i class="fa fa-angle-double-left"></i>返回详情');
    $('#playBtn').click();

    $("#preloader").delay(300).fadeOut(200);

}

function searchResource() {
    swal({
        title: '请输入关键字',  //标题
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
                var url = "/listTV";
                $('#categoryWrap').append('<a  href="javascript:window.location.href='+url+'">电视直播<span>('+obj+')</span></a>');
            }
        }
    });
}

function aside(col) {

    if(isPhone()){
        return;
    }

    //获取最多观看数据
    $.post("/index/resource/list4order",{col:col},function (r) {
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

            var imgSrc = ""+obj.imgSrc2;
            var error = "../image/error1.png";
            $('#popularWrap').append('<div class="widget-post">\n' +
                '\t\t\t\t\t\t<a onclick="getItem('+obj.id+')" href="javascript:void(0);">\n' +
                '\t\t\t\t\t\t\t<img style="width: 20%" onerror=src="'+error+'" src="'+imgSrc+'" alt="图片加载失败"> '+obj.name+'\n' +
                '\t\t\t\t\t\t</a>\n' +
                '\t\t\t\t\t\t<ul class="blog-meta">\n' +
                '\t\t\t\t\t\t\t<li>'+icon+dCount+'</li>\n' +
                '\t\t\t\t\t\t</ul>\n' +
                '\t\t\t\t\t</div>');
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

function switchWindow() {

    $('#tipPlay').hide();

    //debugger
    var txt = $('#playBtn').html();
    $('#info').hide();
    $('#iframe').hide();
    if(txt.indexOf("在线播放")>0){

        if(isSeries){//处理多剧集
            var index = 0;
            //获取已看的集数记录
            var obj = localStorage.getItem(GlobalItem.name);
            if(obj){
                obj = JSON.parse(obj);
                index = obj.sequence-1;
            }
            var obj = GlobalDataArr[index];
            GlobalItem = obj;
            if(obj.isOn!==0&&obj.seriesIsOn!==0){//默认播放第一集
                if(isPhone()){
                    var phoneSrc = obj.phoneSrc;
                    if(!phoneSrc||phoneSrc=="无资源链接"){
                        GlobalVideoSrc = "";
                    }else{
                        if(phoneSrc.indexOf(".flv")>0||phoneSrc.indexOf(".m3u8")>0){
                            if(phoneSrc.indexOf("url=")>0){
                                phoneSrc = "/iframe?url="+phoneSrc.split("url=")[1];
                            }
                        }
                        GlobalVideoSrc = phoneSrc+"?rel=0&amp;autoplay=1";
                    }
                }else{
                    var videoSrc = obj.videoSrc;
                    if(videoSrc.indexOf(".flv")>0||videoSrc.indexOf(".m3u8")>0){
                        if(videoSrc.indexOf("url=")>0){
                            videoSrc = "/iframe?url="+videoSrc.split("url=")[1];
                        }else{
                            videoSrc = "/iframe?url="+videoSrc;
                        }

                    }
                    GlobalVideoSrc = videoSrc+"?rel=0&amp;autoplay=1";
                }
                var name = obj.name;
                var nameArr = name.split(" ");
                name = nameArr[0];
                var sequence = obj.sequence;
                if(sequence<10){
                    sequence = "0"+sequence;
                }
                $('#title').html(name+"-"+sequence);
                //添加选中状态
                var dom = $('#seriesWrap a')[index];
                $(dom).css("color","#fff");
                $(dom).css("background","#6195FF");
            }
        }

        $('#playBtn').html('<i class="fa fa-angle-double-left"></i>返回详情');
        $('#iframe').show();
        if(GlobalVideoSrc){
           $('#frameLoading').show();
           $('#myFrame').attr("src",GlobalVideoSrc);
           $('#tipPlay').show();
            //添加观看历史
            history();
        }else{//移动端地址为空时显示资源不可播放
           $('#frameLoading').hide();
           $('#tipLoading').show();
        }
    }else if(txt.indexOf("返回详情")>0){
        $('#title').html("");
        //$('#itemWrap').html(GlobalFrame);
        $('#myFrame').attr("src","/blank");
        $('#playBtn').html('<i class="fa fa-play-circle"></i>在线播放');
        $('#info').show();
        //隐藏返回列表
        if(isSeries){
            $('#backList').show();
        }
    }

    //隐藏返回列表
    $('#backList').hide();

    //返回顶部
    $('body,html').animate({
        scrollTop: 0
    }, 300);
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

function makeCode(rid) {
    var url = "https://interesting.zooori.cn/index/resource/share?v="+rid;
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

function toSeries(index) {

    $('#seriesWrap a').each(function (index2) {//移除选中状态

        if(index==index2){
            //添加选中状态
            $(this).css("color","#fff");
            $(this).css("background","#6195FF");
        }else{
            $(this).css("color","#10161A");
            $(this).css("background","#F4F4F4");
        }

    });

    $('#tipPlay').hide();
    var obj = GlobalDataArr[index];
    GlobalItem = obj;
    //console.log(obj);
    //$('#seriesParent').hide();
    //$('#backList').show();
    //$('#urlWrap').show();

    var name = obj.name;
    var nameArr = name.split(" ");
    name = nameArr[0];
    var sequence = obj.sequence;
    if(sequence<10){
        sequence = "0"+sequence;
    }
    $('#title').html(name+"-"+sequence);

    //处理移动端及电脑端在线资源链接
    if(isPhone()){
        var phoneSrc = obj.phoneSrc;
        if(!phoneSrc||phoneSrc=="无资源链接"){
            GlobalVideoSrc = "";
        }else{
            if(phoneSrc.indexOf(".flv")>0||phoneSrc.indexOf(".m3u8")>0){
                if(phoneSrc.indexOf("url=")>0){
                    phoneSrc = "/iframe?url="+phoneSrc.split("url=")[1];
                }
            }
            GlobalVideoSrc = phoneSrc+"?rel=0&amp;autoplay=1";
        }
    }else{
        var videoSrc = obj.videoSrc;
        if(videoSrc.indexOf(".flv")>0||videoSrc.indexOf(".m3u8")>0){
            if(videoSrc.indexOf("url=")>0){
                videoSrc = "/iframe?url="+videoSrc.split("url=")[1];
            }else{
                videoSrc = "/iframe?url="+videoSrc;
            }

        }
        GlobalVideoSrc = videoSrc+"?rel=0&amp;autoplay=1";
    }
    if(GlobalVideoSrc){
        $('#frameLoading').show();
        $('#myFrame').attr("src",GlobalVideoSrc);
        $('#tipPlay').show();
        //添加观看历史
        history();
    }else{//移动端地址为空时显示资源不可播放
        $('#frameLoading').hide();
        $('#tipLoading').show();
    }

    $('#playBtn').html('<i class="fa fa-angle-double-left"></i>返回详情');
    $('#info').hide();//隐藏详情
    $('#iframe').show();//打开iframe

    //--------------------------------------------百度网盘
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

    //--------------------------------------------迅雷下载
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

    //返回顶部
    $('body,html').animate({
        scrollTop: 0
    }, 300);
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
        //console.log(r);
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

function preLoading() {
    //$('#preloader').fadeIn(200);
    var interval = setInterval(function () {
        var src = $('#img').attr('src');
        //console.log(src);
        if(src.indexOf("doubanio")>0){
            $("#preloader").fadeOut(200);
            window.clearInterval(interval);
        }
    },10);
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
        window.location.href = "/singleTV?tid="+eid;
    }
}

String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d)
}

function toMoreTV() {
    window.location.href = "/listTV";
}


var RefreshId;
var GlobalPageNow = 0;
var listDom;
var miniRefresh;
var GlobalKey;
var GlobalType;
$(function () {

    //禁止内置浏览器整个网页被拉动---------------------------------------start
    // var overscroll = function(el) {
    //     el.addEventListener('touchstart', function() {
    //         var top = el.scrollTop
    //             , totalScroll = el.scrollHeight
    //             , currentScroll = top + el.offsetHeight;
    //         //If we're at the top or the bottom of the containers
    //         //scroll, push up or down one pixel.
    //         //
    //         //this prevents the scroll from "passing through" to
    //         //the body.
    //         if(top === 0) {
    //             el.scrollTop = 1;
    //         } else if(currentScroll === totalScroll) {
    //             el.scrollTop = top - 1;
    //         }
    //     });
    //     el.addEventListener('touchmove', function(evt) {
    //         //if the content is actually scrollable, i.e. the content is long enough
    //         //that scrolling can occur
    //         if(el.offsetHeight < el.scrollHeight)
    //             evt._isScroller = true;
    //     });
    // }
    // overscroll(document.querySelector('.scroll'));
    // document.body.addEventListener('touchmove', function(evt) {
    //     //In this case, the default behavior is scrolling the body, which
    //     //would result in an overflow.  Since we don't want that, we preventDefault.
    //     if(!evt._isScroller) {
    //         evt.preventDefault();
    //     }
    // });
    //禁止内置浏览器整个网页被拉动---------------------------------------end


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

    //debugger
    GlobalKey = getCookieValue("search");

    if(isPhone()){//移动端
        //隐藏类型选择
        $('#typeSelect').hide();
        $('#header').hide();
        $('#aside').hide();
        $('#items').hide();
        $('#pageWrap').hide();
        $('#footer').hide();
        $('#search').show();
        $('#qr4code').show();
        //$('#back-to-top').show();
        if(GlobalKey){
            GlobalKey = unescape(document.cookie.split("searchTV=")[1].split(";")[0]);
            deleteCookie("searchTV","/");
        }
        listDom = document.querySelector('#listData');
        miniRefresh = new MiniRefresh({
            container: '#minirefresh',
            down: {
                isLock:true,
                // 本主题独有的效果
                secretGarden: {
                    // 是否开启秘密花园（即类似淘宝二楼效果）
                    enable: false,
                    // 下拉超过200后可以出现秘密花园效果，注意，必须大于down的offset
                    offset: 20,
                    // 过度动画
                    duration: 1000,
                    // 提示文字
                    tips: '看风了风,只和有趣的人玩儿',
                    inSecretGarden: function() {
                        //alert(RefreshId);
                        // 可以像淘宝一样打开另一个页面，或者在本页面进行动画也行
                        //console.log('进入秘密花园');
                        if(!RefreshId){
                            miniRefresh.resetSecretGarden();
                            return;
                        }else{
                            preLoading();
                            $.post("/index/resource/list4refresh",{id:RefreshId},function (r) {
                                //console.log(r);
                                var dataArr = r.data;
                                for(var i=0;i<r.data.length;i++){
                                    var obj = dataArr[i];
                                    if(i==0){
                                        RefreshId = obj.id;
                                    }
                                    var name = obj.name;
                                    /*if(name.length>9){
                                        name = name.substring(0,9)+"...";
                                    }*/
                                    var imgSrc = ""+obj.imgSrc;
                                    var error = "../image/error1.png";
                                    var imgId = "IMG-"+i;
                                    $(listDom.children[0]).before('<div title="'+obj.name+'" class="col-sm-3">\n' +
                                        '\t\t\t\t\t<div onclick="toTVDetail(\''+obj.eid+'\')" class="about">\n' +
                                        '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                                        '\t\t\t\t\t\t<a href="javascript:void(0)">前往观看</a>\n' +
                                        '\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t</div>');
                                }
                            });
                            miniRefresh.resetSecretGarden();
                            if(isPhone()){//重置手机端图片样式
                                $('.img-responsive').css("max-width","75%");
                                $('.img-responsive').css("margin","0 auto");
                            }

                            /*$("img.lazy").lazyload({
                                effect : "fadeIn",
                                placeholder : "../image/loading.gif"
                            });*/
                        }
                    }
                }
            },
            up: {
                isAuto: true,
                callback: function() {
                    preLoading();
                    GlobalPageNow++;
                    $.post("/index/resource/list4tv",{pageNow:GlobalPageNow,pageSize:24,key:GlobalKey},function (r) {
                        //console.log(r);
                        var dataArr = r.data;
                        if(GlobalKey&&GlobalPageNow==1){
                            $('#listData').html("");
                        }
                        for(var i=0;i<dataArr.length;i++){
                            var obj = dataArr[i];
                            if(GlobalPageNow==1&&i==0){
                                RefreshId = obj.id;
                            }
                            var name = obj.name;
                            /*if(name.length>9){
                                name = name.substring(0,9)+"...";
                            }*/
                            var imgSrc = ""+obj.imgSrc;
                            var error = "../image/error1.png";
                            var imgId = "IMG-"+i;
                            $('#listData').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                                '\t\t\t\t\t<div onclick="toTVDetail(\''+obj.eid+'\')" class="about">\n' +
                                '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                                '\t\t\t\t\t\t<a href="javascript:void(0)">前往观看</a>\n' +
                                '\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>');
                        }
                        miniRefresh.endUpLoading(listDom.children.length >= r.recordsTotal ? true : false);
                        if(isPhone()){//重置手机端图片样式
                            $('.img-responsive').css("max-width","75%");
                            $('.img-responsive').css("margin","0 auto");
                        }

                        /*$("img.lazy").lazyload({
                            effect : "fadeIn",
                            placeholder : "../image/loading.gif"
                        });*/
                    });

                }

            }
        });
        if(GlobalKey){
            miniRefresh.refreshOptions({down:{isLock:true}});//锁定不可下拉刷新
        }

    }else{//pc端
        $('#minirefresh').hide();
        if(GlobalKey){
            GlobalKey = unescape(document.cookie.split("searchTV=")[1].split(";")[0]);
            deleteCookie("searchTV","/");
            //查询列表
            list4search(1,48,GlobalKey);
        }else{
            //分页获取资源列表
            listItem(1,48,"");
            category();
            aside("views");
        }
    }

    //渲染观看历史
    renderHistory();

});

function listItem(pageNow,pageSize) {

    //preLoading();
    $("#preloader").fadeIn();
    $.post("/index/resource/list4tv",{pageNow:pageNow,pageSize:pageSize,areaType:GlobalType},function (r) {
        //console.log(r);

        $('#tab2').html("电视列表");

        $('#itemWrap').html("");
        var dataArr = r.data;
        if(dataArr.length==0){
            $('#itemWrap').css("text-align","center");
            $('#itemWrap').html("<p>暂无数据</p>");
        }
        for(var i=0;i<dataArr.length;i++){
            var obj = dataArr[i];
            var name = obj.name;
            if(name.length>6){
                name = name.substring(0,5)+"...";
            }
            var imgSrc = ""+obj.imgSrc;
            //var description = obj.description.substring(0,15)+"...";
            var imgId = "IMG-"+i;
            var error = "../image/error1.png";
            $('#itemWrap').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                '\t\t\t\t\t<div onclick="toTVDetail(\''+obj.eid+'\')" class="about">\n' +
                '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                '\t\t\t\t\t\t<a href="javascript:void(0)">前往观看</a>\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>');
        }

        if(pageNow===1&&r.recordsTotal!=0){
            loadData(r.recordsTotal);
            loadpage();
        }
        if(!isPhone()){
            $("img.lazy").lazyload({
                effect : "fadeIn",
                placeholder : "../image/loading.gif"
            });
        }

        if(isPhone()){//重置手机端图片样式
            $('.img-responsive').css("max-width","75%");
            $('.img-responsive').css("margin","0 auto");
        }

        $("#preloader").fadeOut(200);

    });
}

function listByType(type) {
    GlobalType = type;
    listItem(1,24);
}

function list4search(pageNow,pageSize,key) {

    //preLoading();

    if(isPhone()){
        GlobalPageNow = 0;
        GlobalKey = key;
        miniRefresh.refreshOptions({down:{isLock:true}});//锁定不可下拉刷新
        miniRefresh.triggerUpLoading();//触发上拉效果
    }else{
        $("#preloader").fadeIn();
        $.post("/index/resource/list4TVSearch",{pageNow:pageNow,pageSize:pageSize,key:key},function (r) {
            //console.log(r);

            var tab = "查询列表";
            $('#tab2').html(tab);

            $('#itemWrap').html("");
            var dataArr = r.data;
            if(dataArr.length==0){
                $('#itemWrap').html("<p>暂无数据</p>");
            }
            var name = obj.name;
            if(name.length>7){
                name = name.substring(0,7)+"...";
            }
            for(var i=0;i<dataArr.length;i++){
                var obj = dataArr[i];
                var imgSrc = ""+obj.imgSrc;
                //var description = obj.description.substring(0,15)+"...";
                var error = "../image/error1.png";
                var imgId = "IMG-"+i;
                $('#itemWrap').append('<div title="'+obj.name+'" class="col-sm-3">\n' +
                    '\t\t\t\t\t<div onclick="toTVDetail(\''+obj.eid+'\')" class="about">\n' +
                    '\t\t\t\t\t\t<h3>'+name+'</h3>\n' +
                    '\t\t\t\t\t\t<a href="javascript:void(0)">前往观看</a>\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>')
            }
            if(pageNow===1&&r.recordsTotal!=0){
                loadData(r.recordsTotal);
                loadpage();
            }

            category();
            aside("views");

            if(!isPhone()){
                $("img.lazy").lazyload({
                    effect : "fadeIn",
                    placeholder : "../image/loading.gif"
                });
            }

        });
    }
}

function toMore(type) {
    $.post("/setSession",{type:type},function (r) {
        if(r.code==1){
            window.location.href = "/list";
        }
    });
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
            $('#categoryWrap').html("<p>暂无数据</p>");
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
                $('#categoryWrap').append('<a  href="#">电视直播<span>('+obj+')</span></a>');
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

function toTVDetail(eid) {
    $.post("/setSession",{eid:eid},function (r) {
        if(r.code==1){
            window.location.href = "/tv?eid="+eid;
        }
    });
}

function searchResource() {
    swal({
        title: '请输入频道名',//标题
        input: 'text',
        showCancelButton: true,
        cancelButtonText:'取消',
        confirmButtonText: '确定',
        showLoaderOnConfirm: true,
        preConfirm: function(val) {               //功能执行前确认操作，支持function
            return new Promise(function(resolve, reject) {
                $('#search').val(val);
                list4search(1,24,val);
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

function preLoading() {

    //返回顶部
    $('body,html').animate({
        scrollTop: 0
    }, 300);

    $("#preloader").fadeOut(200);

    /*var interval = setInterval(function () {
        var imgHeight = $('#IMG-0').height();
        if(imgHeight>10){
            $("#preloader").fadeOut(200);
            window.clearInterval(interval);
        }
    },10);*/
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
        window.location.href = "/tv?eid="+eid;
    }
}


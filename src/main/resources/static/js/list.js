
var RefreshId;
var GlobalPageNow = 0;
var listDom;
var miniRefresh;
var GlobalKey;
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
        $('#header').hide();
        $('#aside').hide();
        $('#items').hide();
        $('#pageWrap').hide();
        $('#footer').hide();
        $('#search').show();
        //$('#back-to-top').show();
        if(GlobalKey){
            GlobalKey = unescape(document.cookie.split("search=")[1].split(";")[0]);
            deleteCookie("search","/");
        }
        listDom = document.querySelector('#listData');
        miniRefresh = new MiniRefresh({
            container: '#minirefresh',
            down: {
                isLock:false,
                // 本主题独有的效果
                secretGarden: {
                    // 是否开启秘密花园（即类似淘宝二楼效果）
                    enable: true,
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
                                    var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                                    var error = "../image/error1.png";
                                    var imgId = "IMG-"+i;
                                    $(listDom.children[0]).before('<div class="col-sm-3" style="width: 95%;margin: 0 auto">' +
                                        '<div onclick="toDetail('+obj.type+','+obj.id+')" class="blog">' +
                                        '<div class="blog-img">' +
                                        '<img id="'+imgId+'" onerror=src="'+error+'" style="width: 85%;margin: 0 auto" class="img-responsive lazy" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">' +
                                        '</div>' +
                                        '<div class="blog-content">' +
                                        '<br/><h4>'+obj.name+'</h4>' +
                                        '<a href="javascript:void(0)">查看详情</a>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>');
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
                    $.post("/index/resource/list",{pageNow:GlobalPageNow,pageSize:10,key:GlobalKey},function (r) {
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
                            var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                            var error = "../image/error1.png";
                            var imgId = "IMG-"+i;
                            $('#listData').append('<div class="col-sm-3" style="width: 95%;margin: 0 auto">\n' +
                                '\t\t\t\t\t<div onclick="toDetail('+obj.type+','+obj.id+')" class="blog">\n' +
                                '\t\t\t\t\t\t<div class="blog-img">\n' +
                                '\t\t\t\t\t\t\t<img id="'+imgId+'" onerror=src="'+error+'" style="width: 85%;margin: 0 auto" class="img-responsive lazy" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">\n' +
                                '\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t<div class="blog-content">\n' +
                                '\t\t\t\t\t\t\t<br/><h4>'+obj.name+'</h4>\n' +
                                '\t\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                                '\t\t\t\t\t\t</div>\n' +
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
            GlobalKey = unescape(document.cookie.split("search=")[1].split(";")[0]);
            deleteCookie("search","/");
            //查询列表
            list4search(1,16,GlobalKey);
        }else{
            //分页获取资源列表
            listItem(1,16);
        }
    }

});

function listItem(pageNow,pageSize) {

    preLoading();
    $("#preloader").fadeIn();
    $.post("/index/resource/list",{pageNow:pageNow,pageSize:pageSize},function (r) {
        //console.log(r);

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
        $('#tab2').html(tab);

        $('#itemWrap').html("");
        var dataArr = r.data;
        if(dataArr.length==0){
            $('#itemWrap').html("<p>暂无数据</p>");
        }
        for(var i=0;i<dataArr.length;i++){
            var obj = dataArr[i];
            var name = obj.name;
            if(name.length>9){
                name = name.substring(0,9)+"...";
            }
            var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
            //var description = obj.description.substring(0,15)+"...";
            var imgId = "IMG-"+i;
            var error = "../image/error1.png";
            $('#itemWrap').append('<div class="col-sm-3">\n' +
                '\t\t\t\t\t<div title="'+obj.name+'" onclick="toDetail('+obj.type+','+obj.id+')" class="blog">\n' +
                '\t\t\t\t\t\t<div class="blog-img">\n' +
                '\t\t\t\t\t\t\t<img id="'+imgId+'" onerror=src="'+error+'" class="img-responsive lazy" data-original="'+imgSrc+'"  src="'+imgSrc+'" alt="图片加载失败">\n' +
                '\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t<div class="blog-content">\n' +
                '\t\t\t\t\t\t\t<h5>'+name+'</h5>\n' +
                '\t\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                '\t\t\t\t\t\t</div>\n' +
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

        category();

        aside("views");

        if(isPhone()){//重置手机端图片样式
            $('.img-responsive').css("max-width","75%");
            $('.img-responsive').css("margin","0 auto");
        }

    });
}

function list4search(pageNow,pageSize,key) {

    preLoading();

    if(isPhone()){
        GlobalPageNow = 0;
        GlobalKey = key;
        miniRefresh.refreshOptions({down:{isLock:true}});//锁定不可下拉刷新
        miniRefresh.triggerUpLoading();//触发上拉效果
    }else{
        $("#preloader").fadeIn();
        $.post("/index/resource/list4search",{pageNow:pageNow,pageSize:pageSize,key:key},function (r) {
            //console.log(r);

            var tab = "查询列表";
            $('#tab2').html(tab);

            $('#itemWrap').html("");
            var dataArr = r.data;
            if(dataArr.length==0){
                $('#itemWrap').html("<p>暂无数据</p>");
            }
            for(var i=0;i<dataArr.length;i++){
                var obj = dataArr[i];
                var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                //var description = obj.description.substring(0,15)+"...";
                var error = "../image/error1.png";
                var imgId = "IMG-"+i;
                $('#itemWrap').append('<div class="col-sm-3">\n' +
                    '\t\t\t\t\t<div onclick="toDetail('+obj.type+','+obj.id+')" class="blog">\n' +
                    '\t\t\t\t\t\t<div class="blog-img">\n' +
                    '\t\t\t\t\t\t\t<img id="'+imgId+'" onerror=src="'+error+'" class="img-responsive lazy" data-original="'+imgSrc+'" src="'+imgSrc+'" alt="图片加载失败">\n' +
                    '\t\t\t\t\t\t</div>\n' +
                    '\t\t\t\t\t\t<div class="blog-content">\n' +
                    '\t\t\t\t\t\t\t<h5>'+obj.name+'</h5>\n' +
                    '\t\t\t\t\t\t\t<a href="javascript:void(0)">查看详情</a>\n' +
                    '\t\t\t\t\t\t</div>\n' +
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
            }else{
                title = "动漫";
            }
            var type = i+1;
            $('#categoryWrap').append('<a onclick="toMore('+type+')" href="javascript:void(0)">'+title+'<span>('+obj+')</span></a>');
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

            var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
            var error = "../image/error1.png";
            $('#popularWrap').append('<div class="widget-post">\n' +
                '\t\t\t\t\t\t<a onclick="toDetail('+obj.type+','+obj.id+')" href="javascript:void(0);">\n' +
                '\t\t\t\t\t\t\t<img style="width: 20%" onerror=src="'+error+'" src="'+imgSrc+'" alt="图片加载失败"> '+obj.name+'\n' +
                '\t\t\t\t\t\t</a>\n' +
                '\t\t\t\t\t\t<ul class="blog-meta">\n' +
                '\t\t\t\t\t\t\t<li>'+icon+dCount+'</li>\n' +
                '\t\t\t\t\t\t</ul>\n' +
                '\t\t\t\t\t</div>');
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

function searchResource() {
    swal({
        title: '请输入关键字',//标题
        input: 'text',
        showCancelButton: true,
        cancelButtonText:'取消',
        confirmButtonText: '确定',
        showLoaderOnConfirm: true,
        preConfirm: function(val) {               //功能执行前确认操作，支持function
            return new Promise(function(resolve, reject) {
                $('#search').val(val);
                list4search(1,16,val);
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

function preLoading() {
    var interval = setInterval(function () {
        var imgHeight = $('#IMG-0').height();
        if(imgHeight>10){
            $("#preloader").fadeOut(200);
            window.clearInterval(interval);
        }
    },10);
}


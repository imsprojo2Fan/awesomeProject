

var GlobalDom;
var storage = window.localStorage;
$(function () {
    //调用父页面弹窗通知
    //window.parent.swalInfo('TEST',666,'error');

    //tab导航栏切换
    $(".breadcrumb a").each(function (i,item) {
        $(item).on("click",function () {
            var isActive = $(item).attr("class");
            if(isActive){
                return
            }else{
                //移除所有已选中
                $(".breadcrumb a").each(function () {
                    $(this).removeClass("active");
                });
                //选中当前项
                $(this).addClass("active");
                if(i==0){
                    $('#add').hide();
                    $("#list").show();
                    //refresh(1,18);
                    self.location.reload();
                }else{
                    $('#list').hide();
                    $("#add").show();
                    resetItem();
                }
            }
        });
    });

    //获取选中资源类型
    var resourceType = storage.getItem("resourceType");
    //alert(resourceType);
    if(!resourceType){
        resourceType = 1;
    }
    $('#resourceSelect').val(resourceType);
    $('#resourceSelect').selectpicker('refresh');

    var typeFilter = storage.getItem("typeFilter");
    //alert(typeFilter);
    if(!typeFilter){
        typeFilter = "created";
    }
    $('#typeFilter').val(typeFilter);
    $('#typeFilter').selectpicker('refresh');

    var orderFilter = storage.getItem("orderFilter");
    //alert(orderFilter);
    if(!orderFilter){
        orderFilter = "DESC";
    }
    $('#orderFilter').val(orderFilter);
    $('#orderFilter').selectpicker('refresh');

    refresh(1,18);

    $('#uploadPic').on('click',function () {
        openWindow("/main/redirect?htmlName=uploadPic","",1000,600);
    });

    $('#edit_uploadPic').on('click',function () {
        openWindow("/main/redirect?htmlName=uploadPic","",1000,600);
    });

    /*$("img.lazy").lazyload({
        placeholder : "../../image/loading.gif",
        effect : "fadeIn",
        //threshold : 200,
        //skip_invisible : true
    });*/

    GlobalDom = $('#edit_type').html();

});
var GlobalArr;
//刷新数据
function refresh(pageNow,pageSize) {
    //debugger
    //设置全局查询条件
    storage.setItem("resourceType",$('#resourceSelect').val());
    storage.setItem("typeFilter",$('#typeFilter').val());
    storage.setItem("orderFilter",$('#orderFilter').val());

    var key = $('#key').val().trim();
    $.ajax({
        url:"/main/resource/list",
        type:"POST",
        dataType:"json",
        cache : false,
        data:{
            key:key,
            type:$('#resourceSelect').val(),
            typeFilter:$('#typeFilter').val(),
            orderFilter:$('#orderFilter').val(),
            pageNow:pageNow,
            pageSize:pageSize
        },
        beforeSend:function(){
            $("body").parent().css("overflow-y","hidden");
            $('#loading').fadeIn(200);
        },
        success : function(r,status) {
            if (status == "success") {
                //console.log(r.data);
                GlobalArr = r.data;
                $('#content').html("");
                var dataArr = r.data;
                $('#page').show();
                if(dataArr.length==0){
                    $('#page').hide();
                    swal("暂无数据!","换个姿势吧","info");
                    return;
                }
                for(var i=0;i<dataArr.length;i++){
                    var obj = dataArr[i];
                    var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
                    //var error = "https://interesting.zooori.cn/pic/error.png";
                    var error = "../../image/error1.png";
                    var name = obj.name;
                    if(name.length>7){
                        name = obj.name.substring(0,7)+"...";
                    }
                    $('#content').append('<div class="col-sm-2">\n' +
                        '                                            <div class="team fa-border" style="padding: 30px">\n' +
                        '                                                <div class="team-img">\n' +
                        '                                                    <img style="cursor: pointer" onclick="edit('+i+')" onerror=src="'+error+'" title="'+obj.name+'" class="img-responsive " src="'+imgSrc+'" alt="图片加载失败">\n' +
                        '                                                </div>\n' +
                        '                                                <div class="team-content">\n' +
                        '                                                    <h6>'+name+'</h6>\n' +
                        '                                                    <a style="cursor: pointer" onclick="edit('+i+')" title="编辑"><i class="fa fa-edit"> 编辑</i></a>\n' +
                        '                                                    &nbsp;&nbsp;\n' +
                        '                                                    <a style="cursor: pointer" onclick="del('+i+')" title="删除"><i class="text-danger fa fa-trash-o"> 删除</i></a>\n' +
                        '                                                </div>\n' +
                        '                                            </div>\n' +
                        '                                        </div>');
                }

                //debugger
                if(pageNow===1){
                    loadData(r.recordsTotal);
                    loadpage();
                }
            } else {
                swal(r.msg,' ',"error");
            }
        },
        complete:function () {
            $("body").parent().css("overflow-y","auto");
            $('#loading').fadeOut(200);
        }
    });
}

function reset() {
    itemArr = new Array();
    $(":input").each(function () {
        $(this).val("");
    });
    $("input:checkbox").each(function () {
        $(this).attr("checked",false);
    });
    $(".selectpicker").selectpicker('val',1);//下拉框选中 value=“1” 的option
    $(".selectpicker").selectpicker('refresh');
    $('#uploadPic').html("上传图片");
    $('#picName').html("");
    $('#picVal').val("");
    $('#edit_uploadPic').html("替换图片");
    $('#edit_picName').html("");
    $('#edit_picVal').val("");
}

function back() {
    $('#nav1').show();
    $('#list').show();
    $('#nav2').hide();
    $('#edit').hide();
}
//上传图片
function openWindow(url,name,iWidth,iHeight)
{

    var url; //转向网页的地址;
    var name; //网页名称，可为空;
    var iWidth; //弹出窗口的宽度;
    var iHeight; //弹出窗口的高度;
    var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
    var openWindow = window.open(url,name,'height='+iHeight+',,innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
    //alert(openWindow);
}

var itemArr = new Array();
//新增数据
function add() {
    var name = $('#name').val().trim();
    var director = $('#director').val().trim();
    var actor = $('#actor').val().trim();
    var type = $('#typeSelect').val();
    var arr = "";
    $('.styled').each(function () {
        if($(this).is(":checked")){
            arr = arr+","+$(this).next().html();
        }
    });
    arr = arr.substring(1,arr.length);
    var area = $('#areaSelect').val();
    var language = $('#language').val();
    var publish = $('#publish').val();
    var length = $('#length').val().trim();
    var imgSrc1 = $('#picVal').val();
    var description = $('#description').val().trim();
    if(!name){
        swal("名字不能为空！","","error");
        return;
    }
    if(!director){
        swal("导演不能为空！","","error");
        return;
    }
    if(!actor){
        swal("演员不能为空！","","error");
        return;
    }

    if(itemArr.length==0){
        swal("请添加剧集！","","error");
        return;
    }
    var Orders = "";
    var videoSrcArr = "";
    var phoneSrcArr = "";
    var bdUrlArr = "";
    var xlUrlArr1 = "";
    var xlUrlArr2 = "";
    var xlUrlArr3 = "";
    for(var i=0;i<itemArr.length;i++){
        var obj = itemArr[i];

        var order = obj.order;
        if(!order){
            order = 0;
        }
        Orders = Orders+","+order;
        var a1 = obj.videoSrc;
        videoSrcArr = videoSrcArr+","+a1;

        var a2 = obj.bdUrl;
        bdUrlArr = bdUrlArr+","+a2;

        var a3 = obj.xlUrl1;
        xlUrlArr1 = xlUrlArr1+","+a3;

        var a4 = obj.xlUrl2;
        xlUrlArr2 = xlUrlArr2+","+a4;

        var a5 = obj.xlUrl3;
        xlUrlArr3 = xlUrlArr3+","+a5;

        var a6 = obj.phoneSrc;
        phoneSrcArr = phoneSrcArr+","+a6;
    }

    $.ajax({
        url:"/main/resource/add",
        type:"POST",
        dataType:"json",
        cache : false,
        data:{
            name:name,
            director:director,
            actor:actor,
            type:type,
            detailType:arr,
            area:area,
            language:language,
            publish:publish,
            length:length,
            imgSrc1:imgSrc1,
            description:description,
            a0:Orders,
            a1:videoSrcArr,
            a2:bdUrlArr,
            a3:xlUrlArr1,
            a4:xlUrlArr2,
            a5:xlUrlArr3,
            a6:phoneSrcArr
        },
        beforeSend:function(){
            $("body").parent().css("overflow-y","hidden");
            $('#loading').fadeIn(200);
        },
        success : function(r) {
            if (r.code == 1) {
                self.location.reload();
            } else {
                swal(r.msg,' ',"error");
            }
        },
        complete:function () {
            $("body").parent().css("overflow-y","auto");
            $('#loading').fadeOut(200);
        }
    });
}
//更新数据
function edit(index_) {
    //console.log(GlobalArr[index_]);
    var obj = GlobalArr[index_];
    var itemIndex=0,index=-1;
    $('#edit_itemWrap').html("");

    var rid = obj.eid;
    $.post("/main/series/searchByKey",{key:rid},function (r) {
        //console.log(r);
        itemArr = new Array();
        for(var i=0;i<r.length;i++){
            var obj = r[i];
            //渲染剧集ui
            var itemIndex = obj.sequence;
            index++;
            var obj_ = {};
            obj_.id = index;
            obj_.sid = obj.sid;
            obj_.eid = obj.rid;
            obj_.seriesIsOn = obj.seriesIsOn;
            obj_.sequence = obj.sequence;
            obj_.videoSrc = obj.videoSrc;
            obj_.phoneSrc = obj.phoneSrc;
            obj_.bdUrl = obj.bdUrl;
            obj_.xlUrl1 = obj.xlUrl1;
            obj_.xlUrl2 = obj.xlUrl2;
            obj_.xlUrl3 = obj.xlUrl3;
            itemArr.push(obj_);
            if(itemIndex<10){
                itemIndex = "0"+itemIndex;
            }
            $('#edit_itemWrap').append('<a style="margin-top: 6px;margin-right: 5px" class="btn btn-default btn-sm s_item" onclick="editItem2('+index+')">'+itemIndex+'</a>');

        }

    });

    $('#id').val(obj.id);
    $('#edit_name').val(obj.name);
    $('#edit_director').val(obj.director);
    $('#edit_actor').val(obj.actor);
    $('#edit_typeSelect').val(obj.type);
    $('#edit_typeSelect').selectpicker('refresh');
    var str = obj.detailType;
    var arr = str.split(",");


    $('#edit_type').html(GlobalDom);

    $('#edit_type .styled').each(function () {
        //debugger
        var val = $(this).val();
        for(var i=0;i<arr.length;i++){
            var type = arr[i];
            if(val===type){
                //console.log("val:"+val+"---type:"+type);
                $(this).attr('checked',true);
                $(this).parents('.checker').find('span').addClass('checked');
            }
        }
    });

    $('#edit_areaSelect').val(obj.area);
    $('#edit_areaSelect').selectpicker('refresh');
    $('#edit_language').val(obj.language);
    $('#edit_language').selectpicker('refresh');
    $('#edit_isOn').val(obj.isOn);
    $('#edit_isOn').selectpicker('refresh');
    $('#edit_publish').val(obj.publish);
    $('#edit_length').val(obj.length);
    $('#edit_description').val(obj.description);
    $('#edit_picVal').val(obj.imgSrc1);
    var imgSrc = "https://interesting.zooori.cn/pic/"+obj.imgSrc1;
    $('#edit_picName').html('<img width="6%" style="float: right" class="img-responsive" src="'+imgSrc+'">')

    $('#nav1').hide();
    $('#list').hide();
    $('#nav2').show();
    $('#edit').show();
}
//更新数据
function submit() {
    var name = $('#edit_name').val().trim();
    var director = $('#edit_director').val().trim();
    var actor = $('#edit_actor').val().trim();
    var type = $('#edit_typeSelect').val();
    var arr = "";
    $('#edit_type .styled').each(function () {
        //console.log($(this).is(":checked"));
        //console.log($(this).next().html());
        if($(this).is(":checked")){
            arr = arr+","+$(this).next().html();
        }
    });
    arr = arr.substring(1,arr.length);
    var area = $('#edit_areaSelect').val();
    var language = $('#edit_language').val();
    var publish = $('#edit_publish').val();
    var length = $('#edit_length').val().trim();
    var imgSrc1 = $('#edit_picVal').val();

    var description = $('#edit_description').val().trim();
    if(!name){
        swal("名字不能为空！","","error");
        return;
    }
    if(!director){
        swal("导演不能为空！","","error");
        return;
    }
    if(!actor){
        swal("演员不能为空！","","error");
        return;
    }


    $.ajax({
        url:"/main/resource/edit",
        type:"POST",
        dataType:"json",
        cache : false,
        data:{
            id:$('#id').val(),
            name:name,
            director:director,
            actor:actor,
            type:type,
            detailType:arr,
            area:area,
            language:language,
            publish:publish,
            length:length,
            imgSrc1:imgSrc1,
            description:description,
            isOn:$('#edit_isOn').val()
        },
        beforeSend:function(){
            $("body").parent().css("overflow-y","hidden");
            $('#loading').fadeIn(200);
        },
        success : function(r) {
            if (r.code == 1) {
                self.location.reload();
            } else {
                swal(r.msg,' ',"error");
            }
        },
        complete:function () {
            $("body").parent().css("overflow-y","auto");
            $('#loading').fadeOut(200);
        }
    });
}

//删除数据
function del(index) {
    var obj = GlobalArr[index];
    var id = obj.id;
    swal({
            title: "确定删除吗？",
            text: "删除将无法恢复该信息！",
            type: "warning",
            showCancelButton: true,
            cancelButtonText:"取消",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            closeOnConfirm: false
        },
        function(){
            //return
            $.post("/main/resource/delete",{id:id},function (r,status) {
                if(status==="success"){
                    swal(r.msg,"","success");
                    refresh(1,18);
                }else{
                    swal(r.msg,"","error");
                }
            })
        });
}

function swal(title,msg,type) {
    window.parent.swalInfo(title,msg,type);
}

function select() {
    var val = $('#typeSelect').val();
    if(val==1){
        $('#linkWrap').show();
        $('#seriesWrap').hide();
        $('#itemWrap').html("");
        itemIndex = 0;
        itemArr = new Array();
    }else{
        $('#linkWrap').hide();
        $('#seriesWrap').show();
    }
}
var itemIndex = 0;
var index = -1;

function addItem() {
    resetItem();
    $('#myModal').modal("show");
}
//新增数据-->新增/更新剧集确认
function itemConfirm(){
    //debugger
    var type = $('#confirm').html().trim();
    if(type==="新增"){//新增数据
        itemIndex++;
        index++;
        var obj = {};
        obj.id = index;
        obj.order = $('#item_order').val().trim();
        obj.videoSrc = $('#item_videoSrc').val().trim();
        obj.phoneSrc = $('#item_phoneSrc').val().trim();
        obj.bdUrl = $('#item_bdUrl').val().trim();
        obj.xlUrl1 = $('#item_xlUrl1').val().trim();
        obj.xlUrl2 = $('#item_xlUrl2').val().trim();
        obj.xlUrl3 = $('#item_xlUrl3').val().trim();
        itemArr.push(obj);
        if(itemIndex<10){
            itemIndex = "0"+itemIndex;
        }
        $('#itemWrap').append('<a style="margin-top: 6px;margin-right: 5px" class="btn btn-default btn-sm s_item" onclick="editItem('+index+')">'+itemIndex+'</a>');
    }else{//编辑更新
        var curIndex = $('#itemId').val();
        //console.log(curIndex);
        var obj = itemArr[curIndex];
        obj.id = curIndex;
        obj.order = $('#item_order').val().trim();
        obj.videoSrc = $('#item_videoSrc').val().trim();
        obj.phoneSrc = $('#item_phoneSrc').val().trim();
        obj.bdUrl = $('#item_bdUrl').val().trim();
        obj.xlUrl1 = $('#item_xlUrl1').val().trim();
        obj.xlUrl2 = $('#item_xlUrl2').val().trim();
        obj.xlUrl3 = $('#item_xlUrl3').val().trim();
    }

    $('#myModal').modal("hide");

}
//新增数据-->编辑剧集
function editItem(index) {
    //console.log(index);
    //console.log(itemArr);

    $('#cancel').html("删除");
    $('#confirm').html("确定");
    $('#myModalLabel').html("编辑剧集");
    var item = itemArr[index];
    $('#sid').val(item.sid);
    $('#itemId').val(item.id);
    $('#item_order').val(item.order);
    $('#item_videoSrc').val(item.videoSrc);
    $('#item_phoneSrc').val(item.phoneSrc);
    $('#item_bdUrl').val(item.bdUrl);
    $('#item_xlUrl1').val(item.xlUrl1);
    $('#item_xlUrl2').val(item.xlUrl2);
    $('#item_xlUrl3').val(item.xlUrl3);
    $('#myModal').modal("show");
}
//新增数据-->删除剧集
function delItem(){
    //debugger
    var type = $('#cancel').html().trim();
    if(type==="删除"){

        var index = $('#itemId').val();
        //console.log(itemArr);
        var obj = {}
        obj.id=-1;
        itemArr[index] = obj;
        //console.log(itemArr);
        //渲染ui;
        $('#edit_itemWrap').html("");
        for(var i=0;i<itemArr.length;i++){
            //debugger;
            var obj = itemArr[i];
            var id = obj.id;
            var itemIndex = id+1;
            if(id!==-1){
                if(itemIndex<10){
                    itemIndex = "0"+itemIndex;
                }
                $('#edit_itemWrap').append('<a style="margin-top: 6px;margin-right: 5px" class="btn btn-default btn-sm s_item" onclick="editItem('+obj.id+')">'+itemIndex+'</a>');
            }
        }
    }

    $('#myModal').modal("hide");

}

function resetItem(){
    $('#sid').val("");
    $('#item_order').val("");
    $('#itemId').val("");
    $('#item_videoSrc').val("无资源链接");
    $('#item_phoneSrc').val("无资源链接");
    $('#item_bdUrl').val("无资源链接");
    $('#item_xlUrl1').val("无资源链接");
    $('#item_xlUrl2').val("无资源链接");
    $('#item_xlUrl3').val("无资源链接");
    $('#cancel').html("取消");
    $('#confirm').html("新增");
    $('#myModalLabel').html("新增剧集");
}
//编辑数据-->新增剧集
function addItem2() {
    resetItem2();
    //console.log(itemArr);
    $('#myModal2').modal("show");
}
//编辑数据-->新增/更新剧集确认
function itemConfirm2(){
    //debugger
    var type = $('#confirm2').html().trim();
    if(type==="新增"){//新增数据
        var rid = itemArr[0].eid;
        $.post("/main/series/add",{
            rid:rid,
            seriesIsOn:$('#edit_seriesIsOn').val(),
            sequence:$('#item_order2').val().trim(),
            videoSrc:$('#item_videoSrc2').val().trim(),
            phoneSrc:$('#item_phoneSrc2').val().trim(),
            bdUrl:$('#item_bdUrl2').val().trim(),
            xlUrl1:$('#item_xlUrl12').val().trim(),
            xlUrl2:$('#item_xlUrl22').val().trim(),
            xlUrl3:$('#item_xlUrl32').val().trim()
        },function (r) {
            if(r.code==1){
                self.location.reload();
            }
        });
    }else{//编辑更新
        $.post("/main/series/edit",{
            sid:$('#sid').val(),
            seriesIsOn:$('#edit_seriesIsOn').val(),
            sequence:$('#item_order2').val().trim(),
            videoSrc:$('#item_videoSrc2').val().trim(),
            phoneSrc:$('#item_phoneSrc2').val().trim(),
            bdUrl:$('#item_bdUrl2').val().trim(),
            xlUrl1:$('#item_xlUrl12').val().trim(),
            xlUrl2:$('#item_xlUrl22').val().trim(),
            xlUrl3:$('#item_xlUrl32').val().trim()
        },function (r) {
            if(r.code==1){
                self.location.reload();
            }

        });
    }
    $('#myModal').modal("hide");

}
//编辑数据-->编辑剧集
function editItem2(index) {
    //debugger
    //alert(index);
    //console.log(index);
    //console.log(itemArr);
    $('#myModalLabel2').html("编辑剧集");
    $('#cancel2').html("删除");
    $('#confirm2').html("确定");
    var item = itemArr[index];
    //console.log(item);
    $('#sid').val(item.sid);
    $('#edit_seriesIsOn').val(item.seriesIsOn);
    $('#edit_seriesIsOn').selectpicker('refresh');
    $('#item_order2').val(item.sequence);
    $('#item_videoSrc2').val(item.videoSrc);
    $('#item_phoneSrc2').val(item.phoneSrc);
    $('#item_bdUrl2').val(item.bdUrl);
    $('#item_xlUrl12').val(item.xlUrl1);
    $('#item_xlUrl22').val(item.xlUrl2);
    $('#item_xlUrl32').val(item.xlUrl3);
    $('#myModal2').modal("show");
}
//编辑数据-->删除剧集
function delItem2(){

    var type = $('#cancel2').html().trim();
    if(type==="删除"){
        //删除数据库剧集
        $.post("/main/series/delete",{sid:$('#sid').val()},function (r) {
            //debugger
            if(r.code==1){
                self.location.reload();
            }
        });
    }

    $('#myModal2').modal("hide");

}
//编辑数据-->重置模态框
function resetItem2(){
    $('#sid').val("");
    $('#itemId2').val("");
    $('#item_order2').val("");
    $('#item_videoSrc2').val("无资源链接");
    $('#item_phoneSrc2').val("无资源链接");
    $('#item_bdUrl2').val("无资源链接");
    $('#item_xlUrl12').val("无资源链接");
    $('#item_xlUrl22').val("无资源链接");
    $('#item_xlUrl32').val("无资源链接");
    $('#cancel2').html("取消");
    $('#confirm2').html("新增");
    $('#myModalLabel2').html("新增剧集");
}

Array.prototype.delete=function(delIndex){
    var temArray=[];
    for(var i=0;i<this.length;i++){
        if(i!=delIndex){
            temArray.push(this[i]);
        }
    }
    return temArray;
}
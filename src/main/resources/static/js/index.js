
function redirect(htmlName){
    var url = "/main/redirect?htmlName="+htmlName;
    $('#mainframe').attr("src",url);
}

//动态更改iframe高度
$(window.parent.document).find("#mainframe").load(function(){
    var main = $(window.parent.document).find("#mainframe");
    var thisHeight = window.innerHeight+100;
    var width = window.innerWidth;
    main.height(thisHeight);
    if(width<700){
        $("#mainframe").contents().find("#blank").css("display","none");
    }


});
window.onresize=function(){
    var main = $(window.parent.document).find("#mainframe");
    var thisHeight = window.innerHeight+100;
    main.height(thisHeight);
    var width = window.innerWidth;
    main.height(thisHeight);
    if(width<700){
        $("#mainframe").contents().find("#blank").css("display","none");
    }
}

function swalInfo(title,msg,type){
    swal(title,msg,type);
}

function loading(flag) {
    if(flag){
        $('#loading').show();
    }else{
        $('#loading').hide();
    }
}

var clicCount = 0;
function isHide() {

    var iframe = document.getElementById("mainframe");
    var iwindow = iframe.contentWindow;
    var idoc = iwindow.document;
    /*console.log("window",iwindow);//获取iframe的window对象
    console.log("document",idoc);  //获取iframe的document
    console.log("html",idoc.documentElement);//获取iframe的html
    console.log("head",idoc.head);  //获取head
    console.log("body",idoc.body);  //获取body*/

    var panel = idoc.getElementById("panel");//动态设置panel宽度 ie没试
    var modals = idoc.getElementsByClassName("modal-dialog");

    clicCount++;
    if(clicCount%2==0){
        console.log("open");
        if(panel){
            panel.setAttribute("class", "col-sm-10");
        }
        if(modals.length>0){//设置模态框水平居中
            for(var i=0;i<modals.length;i++){
                modals[i].style.marginLeft = '25%';
            }
        }
        $('#mainframe').css("margin-left","250px");
    }else{
        console.log("close");
        if(panel){
            panel.setAttribute("class", "col-sm-12");
        }
        if(modals.length>0){
            for(var i=0;i<modals.length;i++){
                modals[i].style.marginLeft = '35%';
            }
        }
        $('#mainframe').css("margin-left","0px");
    }
}
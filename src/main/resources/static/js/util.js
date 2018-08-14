/*
账号输入
onKeyUp="value=value.replace(/[^/a-zA-Z0-9]/g,'')"

姓名输入
onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"

手机输入
onkeyup="this.value=this.value.replace(/\D/g,'')"

特殊字符：

onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5\w]/g,'')"
只能输入数字：

onkeyup="value=value.replace(/[^\d]/g,'') "

只能输入数字和字母：

onkeyup="value=value.replace(/[\W]/g,'') "


JS 控制文本框只能输入数字
input onkeyup="value=value.replace(/[^0-9]/g,'')" onpaste="value=value.replace(/[^0-9]/g,'')" oncontextmenu = "value=value.replace(/[^0-9]/g,'')"

JS 控制文本框只能输入数字、小数点
input onkeyup="value=value.replace(/[^\0-9\.]/g,'')" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu = "value=value.replace(/[^\0-9\.]/g,'')">

S 控制文本框只能输入英文
input onkeyup="value=value.replace(/[^\a-\z\A-\Z]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z]/g,'')">

JS 控制文本框只能输入英文、数字
input onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')">

JS 控制文本框只能输入中文
input onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')" onpaste="value=value.replace(/[^\u4E00-\u9FA5]/g,'')" oncontextmenu = "value=value.replace(/[^\u4E00-\u9FA5]/g,'')">

JS 控制文本框只能输入中文、英文、数字
input onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')">

JS 控制文本框只能输入中文、英文、数字、空格
input onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')">

JS 控制文本框只能输入中文、英文、数字、小数点
input onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g,'')">


总而言之:先在input标签里输入onkeyup="value=value.replace(/[^\X]/g,'')" 然后在(/[\X]/g,'')里的X换成你想输入的代码就可以了,中文u4E00-u9FA5，数字0-9，英文a-z\A-Z，其它符号@、点或其它符号。也可以多个，用\隔开就行了。
例如：中英文 + 数字 + @符号 + 点符号   \a-\z\A-\Z0-9\u4E00-\u9FA5\@\.

若想在文本框里不能右键弹出菜单和不能粘贴进复制的信息的话
就要在input里输入 onpaste="return false" oncontextmenu="return false;"*/

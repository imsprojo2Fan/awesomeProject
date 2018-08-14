package com.awesome.controller;

import com.awesome.config.JsonResult;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 9:50 2018/7/3
 * @Modified By:
 */
@Controller
@RequestMapping("/main")
public class RedirectController {

	JsonResult jsonResult = new JsonResult();

	/**
	 * 用户登录首页
	 * @param
	 * @return
	 */
	@ApiOperation(value="用户登录首页", notes="")
	@RequestMapping(value = "")
	public String index (){
		return "/html/main/index.html";
	}

	/**
	 * 左侧菜单跳转
	 * @param
	 * @return
	 */
	@ApiOperation(value="左侧菜单跳转", notes="")
	@ApiImplicitParams({
			@ApiImplicitParam(
					paramType = "query", dataType = "String", name = "htmlName", value = "html文件名", required = true),
	})
	@RequestMapping("/redirect")
	public Object redirect(String htmlName){
		if (StringUtils.isEmpty(htmlName)){
			jsonResult.setCode(-1);
			jsonResult.setMsg("htmlName can`t be null!");
			jsonResult.setData(null);
			return jsonResult;
		}
		return "/html/main/"+htmlName+".html";
	}

}

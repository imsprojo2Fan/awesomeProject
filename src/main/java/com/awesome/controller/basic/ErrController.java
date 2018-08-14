package com.awesome.controller.basic;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 13:06 2018/7/6
 * @Modified By:
 */
@Controller
@RequestMapping("/err")
public class ErrController {

	@ApiIgnore
	@RequestMapping("/404")
	public String goTo404(){
		return "/html/err/404.html";
	}

	@ApiIgnore
	@RequestMapping("/500")
	public String goTo500(){
		return "/html/err/500.html";
	}

	@ApiIgnore
	@RequestMapping("/403")
	public String goTo403(){
		return "/html/err/403.html";
	}
}

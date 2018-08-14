package com.awesome.controller.basic;

import com.awesome.config.JsonResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 12:30 2018/7/27
 * @Modified By:
 */
@RestController
@RequestMapping("/test")
public class TestController {

	JsonResult result = new JsonResult();

	@RequestMapping("/test")
	public Object Test(){
		result.setCode(1);
		result.setMsg("test");
		result.setData(null);
		return result;
	}

}

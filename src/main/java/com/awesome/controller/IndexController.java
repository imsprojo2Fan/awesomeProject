package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.User;
import com.awesome.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 11:37 2018/8/2
 * @Modified By:
 */
@RestController//直接返回json格式数据
@RequestMapping("/main")
public class IndexController {

	@Autowired
	private UserService userService;

	Map<String,Object> qMap = new HashMap<>();

	List<Map<String,Object>> rList = new ArrayList<>();

	Map<String,Object> backMap = new HashMap<>();

	int GlobalDraw = 0;

	@Value("com.awesome.pageNow")
	public static int PAGE_NOW;
	@Value("com.awesome.pageSize")
	public static int PAGE_SIZE;

	JsonResult r = new JsonResult(-1,"failure",null);

	@RequestMapping(value = "/index/init",method = RequestMethod.POST)
	public Object init(HttpSession session){

		User user = (User) session.getAttribute("user");
		if(user==null){
			r.setMsg("登录超时!");
			return r;
		}
		User user1 = userService.selectByPrimaryKey(user.getId());
		qMap.put("user",user1);
		r.setCode(1);
		r.setMsg("");
		r.setData(qMap);
		return r;
	}


}

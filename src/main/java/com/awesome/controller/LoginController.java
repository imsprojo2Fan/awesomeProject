package com.awesome.controller;

import com.alibaba.fastjson.JSON;
import com.awesome.config.JsonResult;
import com.awesome.model.User;
import com.awesome.util.Md5Util;
import com.awesome.service.UserService;
import com.awesome.util.SendMailUtil;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpSession;
import java.lang.reflect.Method;
import java.util.*;
import java.util.concurrent.Callable;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 9:36 2018/7/2
 * @Modified By:
 */
@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	JsonResult jsonResult = new JsonResult();

	@Value("${com.awesome.sessionMaxTime}")
	private static int sessionMaxTime;

	@Autowired
	private UserService userService;

	@Autowired
	private SendMailUtil sendMail;

	Map<String,Object> qMap = new HashMap<>();

	List<Map<String,Object>> rList = new ArrayList<>();

	@Autowired
	private RedisTemplate<String,Object> redisTemplate;

	JsonResult r = new JsonResult();



	@ApiIgnore//使用该注解忽略这个API
	@RequestMapping(value = "/")
	public String index(){
		return "/html/index.html";
	}

	@ApiIgnore//使用该注解忽略这个API
	@RequestMapping(value = "/list")
	public String list(){
		return "/html/list.html";
	}

	@ApiIgnore//使用该注解忽略这个API
	@RequestMapping(value = "/single")
	public String single() {
		return "/html/single.html";
	}
	@ApiIgnore//使用该注解忽略这个API
	@RequestMapping(value = "/login")
	public String loginIndex(){
		return "/html/login.html";
	}

	@ApiIgnore//使用该注解忽略这个API
	@RequestMapping(value = "/blank")
	public String blank(){
		return "/html/blank.html";
	}

	@ApiIgnore//使用该注解忽略这个API
	@RequestMapping(value = "/signup")
	public String signIndex(){
		return "/html/signup.html";
	}


	@ApiIgnore//使用该注解忽略这个API
	@RequestMapping(value = "/setSession")
	@ResponseBody
	public Object setSession(String type,String itemId,HttpSession session){

		if(!StringUtils.isEmpty(type)){
			session.setAttribute("type",type);
		}

		if(!StringUtils.isEmpty(itemId)){
			session.setAttribute("itemId",itemId);
		}
		r.setCode(1);
		return r;
	}


	/**
	 * 用户登录验证
	 * @param account password
	 * @return
	 */
	@ApiOperation(value="用户登录验证", notes="根据表单账号及密码验证用户")
	@ApiImplicitParams({
			@ApiImplicitParam(
					paramType = "form", dataType = "String", name = "account", value = "用户账号", required = true),
			@ApiImplicitParam(
					paramType = "form", dataType = "String", name = "password", value = "用户密码", required = true)
	})
	@RequestMapping (value = "/validate",method = RequestMethod.POST)
	@ResponseBody
	public Object  login(String account, String password, HttpSession session) {

		jsonResult.setCode(-1);
		jsonResult.setMsg("failure");
		jsonResult.setData(null);

		if(StringUtils.isEmpty(account)||StringUtils.isEmpty(password)){
			jsonResult.setMsg("account or password can`t be null!");
			return jsonResult;
		}
		qMap.put("account",account);
		User user = userService.getUserByAccount(qMap);

		if(user!=null){
			String pass = user.getPassword();
			String md5Pass = Md5Util.getMD5WithSalt(password);
			if(pass.equals(md5Pass)){
				session.setMaxInactiveInterval(sessionMaxTime);
				session.setAttribute("user",user);
				jsonResult.setCode(1);
				jsonResult.setMsg("success");
				jsonResult.setData(null);
			}else{
				jsonResult.setMsg("账号或密码不正确！");
				return jsonResult;
			}
		}
		jsonResult.setMsg("账号未激活或不存在！");
		return jsonResult;
	}

	/**
	 * 用户退出登录
	 * @param
	 * @return
	 */
	//@ApiIgnore//使用该注解忽略这个API
	@ApiOperation(value="用户退出登录", notes="无")
	@ApiImplicitParams({
			@ApiImplicitParam(
					paramType = "query", dataType = "null", name = "null", value = "null", required = false)
	})
	@RequestMapping(value = "/logout")
	public Object loginOut( HttpSession session) {
		session.removeAttribute("user");
		return "/html/login.html";
	}

	/**
	 * 用户注册
	 * @param
	 * @return
	 */
	@ApiIgnore//使用该注解忽略这个API
	@ResponseBody
	@RequestMapping(value = "/sign")
	public Object signUp(String name,String email,String password) {
		jsonResult.setCode(-1);
		jsonResult.setMsg("failure");
		jsonResult.setData(null);


		if(StringUtils.isEmpty(email)||StringUtils.isEmpty(password)){
			jsonResult.setMsg("Parameter Error!");
			return jsonResult;
		}

		//验证邮箱是否已存在
		qMap.put("key","email");
		qMap.put("value",email);
		rList = userService.searchByKey(qMap);
		if(rList.size()>0){
			jsonResult.setMsg("邮箱地址已被注册!");
			return jsonResult;
		}

		//执行发邮件操作
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("zooori@foxmail.com");
		message.setTo(email);
		message.setSubject("[看风了风]注册账号激活邮件");
		String md5Mail = Md5Util.getMD5WithSalt(email);
		String link = "尊敬的用户,您的账号激活链接是:\n https://interesting.zooori.cn/activate?para="+md5Mail+"\n请在10分钟内激活链接";
		message.setText(link);
		qMap.put("name",name);
		qMap.put("email",email);
		qMap.put("password",password);
		qMap.put("current",System.currentTimeMillis());
		sendMail.asyncMethod(message,qMap,md5Mail,0);


		jsonResult.setCode(1);
		jsonResult.setMsg("邮件已发送!");

		return jsonResult;
	}

	@ResponseBody
	@RequestMapping("/activate")
	public Object activate(String para){
		jsonResult.setCode(-1);
		jsonResult.setMsg("failure");
		jsonResult.setData(null);
		if(StringUtils.isEmpty(para)){
			jsonResult.setMsg("参数不能为空！");
			return jsonResult;
		}
		ValueOperations<String,Object> redis = redisTemplate.opsForValue();
		Object obj = redis.get(para);
		if(obj==null){
			jsonResult.setMsg("无效的激活链接！");
		}else{
			Map map = (Map)obj;
			long current = System.currentTimeMillis();
			long current2 = Long.parseLong(map.get("current").toString());
			if((current-current2)/1000>60*10){
				redis.set(para,null);
				jsonResult.setMsg("激活链接已过期！");
			}else{
				String name = map.get("name").toString();
				String email = map.get("email").toString();
				String password = map.get("password").toString();
				User user = new User();
				user.setEmail(email);
				user.setNickname(name);
				user.setPassword(Md5Util.getMD5WithSalt(password));
				user.setCreated(new Date());
				if(userService.insertSelective(user)>0){
					jsonResult.setMsg("账号已成功激活！");
					jsonResult.setCode(1);
					redis.set(para,null);
				}else{
					jsonResult.setMsg("账号激活失败！请联系管理员");
				}
			}
		}
		return jsonResult;
	}

	@ResponseBody
	@RequestMapping(value = "/reset",method = RequestMethod.POST)
	public Object reset(String email){
		jsonResult.setCode(-1);
		jsonResult.setMsg("failure");
		jsonResult.setData(null);
		rList.clear();


		if(StringUtils.isEmpty(email)){
			jsonResult.setMsg("参数不能为空！");
			return jsonResult;
		}

		//验证邮箱是否已存在
		qMap.put("key","email");
		qMap.put("value",email);
		rList = userService.searchByKey(qMap);
		if(rList.size()==0){
			jsonResult.setMsg("邮箱地址不存在！");
			return jsonResult;
		}else{
			//执行发邮件操作
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom("zooori@foxmail.com");
			message.setTo(email);
			message.setSubject("[看风了风]重置密码邮件");
			String md5Mail = Md5Util.getMD5WithSalt(email);
			String password = md5Mail.substring(0,8);
			password = Md5Util.getMD5WithSalt(password).substring(0,8).toUpperCase();
			String link = "尊敬的用户,系统给您随机分配的密码是:\n"+password+"\n请尽快更改!";
			message.setText(link);
			qMap.put("email",email);
			qMap.put("password",password);
			qMap.put("current",System.currentTimeMillis());
			sendMail.asyncMethod(message,qMap,md5Mail,1);
			jsonResult.setCode(1);
			jsonResult.setMsg("重置密码邮件已发送!");
		}

		return jsonResult;
	}





}


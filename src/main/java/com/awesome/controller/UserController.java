package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.User;
import com.awesome.util.Md5Util;
import com.awesome.service.UserService;
import com.awesome.util.SendMailUtil;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 9:38 2018/7/2
 * @Modified By:
 */
@RestController//直接返回json格式数据
@RequestMapping("/main")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private SendMailUtil sendMail;

	@Autowired
	private RedisTemplate<String,Object> redisTemplate;

	Map<String,Object> qMap = new HashMap<>();
	List<Map<String,Object>> rList = new ArrayList<>();
	Map<String,Object> backMap = new HashMap<>();
	int GlobalDraw = 0;
	@Value("com.awesome.pageNow")
	public static int PAGE_NOW;
	@Value("com.awesome.pageSize")
	public static int PAGE_SIZE;
	JsonResult r = new JsonResult();

	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(UserController.class);

	/**
	 * 添加用户
	 * @param user
	 * @return
	 */
	@ApiOperation(value="创建用户", notes="根据User对象创建用户")
	@ApiImplicitParam(name = "user", value = "用户详细实体user", required = true, dataType = "User")
	@RequestMapping(value = "/user/add", method = RequestMethod.POST)
	public Object add (@ModelAttribute User user){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		try {
			//查询账号是否存在
			qMap.put("account",user.getAccount());
			User u = userService.getUserByAccount(qMap);
			if(u!=null){
				r.setMsg("账号已存在!");
				return r;
			}
			//加密密码
			String pass = Md5Util.getMD5WithSalt(user.getPassword());
			user.setPassword(pass);
			user.setCreated(new Date());
			int uid = userService.insert(user);
			if (uid > 0) {
				r.setCode(1);
				r.setMsg("操作成功!");
				r.setData(uid);
			}
		} catch (Exception e) {
			r.setMsg("数据库操作异常!");
			e.printStackTrace();
		}
		return r;
	}

	/**
	 * 根据id删除用户
	 * @param id
	 * @return
	 */
	@ApiOperation(value="删除用户", notes="根据url的id来指定删除用户")
	@ApiImplicitParam(name = "id", value = "用户ID", required = true, dataType = "Long", paramType = "path")
	@RequestMapping(value = "/user/delete", method = RequestMethod.POST)
	public Object delete (String id){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		int Id = 0;
		if(StringUtils.isEmpty(id)){
			r.setMsg("id can`t be null!");
			return r;
		}else{
			try {
				Id = Integer.parseInt(id);
			}catch (NumberFormatException e){
				r.setMsg("NumberFormatException!");
				e.printStackTrace();
			}
		}
		try {
			int ret = userService.deleteByPrimaryKey(Id);
			if (ret > 0) {
				r.setCode(1);
				r.setMsg("success");
				r.setData(null);
			}
		} catch (Exception e) {
			r.setMsg("数据库操作异常!");
			e.printStackTrace();
		}
		return r;
	}

	/**
	 * 根据id修改用户信息
	 * @param user
	 * @return
	 */
	@ApiOperation(value="更新信息", notes="根据表单数据的id来指定更新用户信息")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "user", value = "用户实体user", required = true, dataType = "User")
	})
	@RequestMapping(value = "/user/edit", method = RequestMethod.POST)
	public Object edit(User user){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);

		try {
			if(user.getPassword().equals("123456")){//不更新密码
				user.setPassword(null);
			}else{
				user.setPassword(Md5Util.getMD5WithSalt(user.getPassword()));
			}
			user.setUpdated(new Date());
			int ret = userService.updateByPrimaryKeySelective(user);
			if (ret > 0) {
				r.setCode(1);
				r.setMsg("操作成功!");
				r.setData(ret);
			}
		} catch (Exception e) {
			r.setMsg("数据库操作异常!");
			e.printStackTrace();
		}
		return r;
	}


	/**
	 * 查询用户列表
	 * @return
	 */
	@ApiOperation(value="用户分页查询", notes="获取用户列表")
	@RequestMapping(value = "/user/list", method = RequestMethod.POST)
	public Object getUserList (HttpServletRequest request){
		GlobalDraw++;

		String start = request.getParameter("start");
		String length = request.getParameter("length");
		String sortType = request.getParameter("order[0][dir]");
		String searchKey = request.getParameter("search[value]");
		if(!StringUtils.isEmpty(start)){
			PAGE_NOW = Integer.parseInt(start);
		}
		if(!StringUtils.isEmpty(length)){
			PAGE_SIZE = Integer.parseInt(length);
		}

		qMap.put("pageNow",PAGE_NOW);
		qMap.put("pageSize",PAGE_SIZE);
		qMap.put("sortCol","id");
		qMap.put("sortType",sortType);
		qMap.put("searchKey",searchKey);

		int count = userService.listAllCount(qMap);
		rList = userService.listByPage(qMap);

		backMap.put("draw",GlobalDraw);
		backMap.put("recordsTotal",count);
		backMap.put("recordsFiltered",count);
		backMap.put("data",rList);

		return backMap;
	}

	/**
	 * 更换邮箱获取邮箱验证码
	 * @return
	 */
	@ApiOperation(value="更换邮箱获取邮箱验证码", notes="更换邮箱获取邮箱验证码")
	@RequestMapping(value = "/user/getCode", method = RequestMethod.POST)
	public Object getCode (String email){

		init();

		if(StringUtils.isEmpty(email)){
			r.setMsg("email can`t be null!");
			return r;
		}

		//验证邮箱是否已存在
		qMap.put("key","email");
		qMap.put("value",email);
		rList = userService.searchByKey(qMap);
		if(rList.size()>0){
			r.setMsg("邮箱已被使用!");
			return r;
		}

		//发送邮箱验证码
		//执行发邮件操作
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("zooori@foxmail.com");
		message.setTo(email);
		message.setSubject("[一路看风]验证码");
		String md5Mail = Md5Util.getMD5WithSalt("random"+email);
		int random = (int)((Math.random()*9+1)*100000);
		String link = "尊敬的用户,您的验证码是:\n"+random+"\n";
		message.setText(link);
		qMap.put("email",email);
		qMap.put("random",random);
		qMap.put("current",System.currentTimeMillis());
		sendMail.asyncMethod(message,qMap,md5Mail,2);
		r.setCode(1);
		r.setMsg("验证码邮件已发送!");
		return r;
	}

	/**
	 * 根据id修改用户信息
	 * @param user
	 * @return
	 */
	@ApiOperation(value="更新信息", notes="根据表单数据的id来指定更新用户信息")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "user", value = "用户实体user", required = true, dataType = "User")
	})
	@RequestMapping(value = "/user/update", method = RequestMethod.POST)
	public Object update(User user,String code){
		init();

		try {

			if(user.getId()==0){
				r.setMsg("parameter error!");
				return r;
			}

			if(!StringUtils.isEmpty(code)){
				ValueOperations<String,Object> redis = redisTemplate.opsForValue();
				Object obj = redis.get(Md5Util.getMD5WithSalt("random"+user.getEmail()));
				if(obj==null){
					r.setMsg("验证码无效!");
					return r;
				}else{
					Map map = (Map)obj;
					long current = System.currentTimeMillis();
					long current2 = Long.parseLong(map.get("current").toString());
					if((current-current2)/1000>60*10){
						r.setMsg("验证码过期!");
						return r;
					}
					String code_l = map.get("random").toString();
					if(!code.equals(code_l)){
						r.setMsg("验证码错误!");
						return r;
					}
				}
			}

			//查询账号是否存在
			if(!StringUtils.isEmpty(user.getAccount())){
				qMap.put("account",user.getAccount());
				User u = userService.getUserByAccount(qMap);
				if(u!=null){
					r.setMsg("账号已存在!");
					return r;
				}
			}

			if(user.getPassword().equals("********")){//不更新密码
				user.setPassword(null);
			}else{
				user.setPassword(Md5Util.getMD5WithSalt(user.getPassword()));
			}
			user.setUpdated(new Date());
			int ret = userService.updateByPrimaryKeySelective(user);
			if (ret > 0) {
				r.setCode(1);
				r.setMsg("操作成功!");
				r.setData(ret);
			}
		} catch (Exception e) {
			r.setMsg("数据库操作异常!");
			e.printStackTrace();
		}
		return r;
	}

	public void init(){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		qMap.clear();
		rList.clear();
	}

}

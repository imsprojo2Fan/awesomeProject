package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.Feedback;
import com.awesome.model.Resource;
import com.awesome.model.Wishes;
import com.awesome.service.FeedbackService;
import com.awesome.service.ResourceService;
import com.awesome.service.SeriesService;
import com.awesome.service.WishesService;
import com.awesome.util.Md5Util;
import com.awesome.util.SendMailUtil;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 19:21 2018/8/16
 * @Modified By:
 */
@RequestMapping("/index")
@RestController
public class IndexMainController {

	@Autowired
	private ResourceService service;

	@Autowired
	private SeriesService seriesService;

	@Autowired
	private FeedbackService feedbackService;

	@Autowired
	private WishesService wishesService;

	@Autowired
	private SendMailUtil sendMail;

	Map<String,Object> qMap = new HashMap<>();
	List<List> tempList = new ArrayList<>();
	List<String> mdList = new ArrayList<>();
	List<Map<String,Object>> rList = new ArrayList<>();
	Map<String,Object> backMap = new HashMap<>();
	int GlobalDraw = 0;
	@Value("com.awesome.pageNow")
	public static int PAGE_NOW;
	@Value("com.awesome.pageSize")
	public static int PAGE_SIZE;
	JsonResult r = new JsonResult();


	/**
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="分页查询", notes="获取列表")
	@RequestMapping(value = "/resource/list", method = RequestMethod.POST)
	public Object getList (HttpServletRequest request, HttpSession session){

		String type = request.getParameter("type");
		if(StringUtils.isEmpty(type)){
			type = (String) session.getAttribute("type");
			if(StringUtils.isEmpty(type)){
				type = "1";
			}
		}
		init();
		String start = request.getParameter("pageNow");
		String length = request.getParameter("pageSize");
		String searchKey = request.getParameter("key");
		String detailType = request.getParameter("detailType");
		if(!StringUtils.isEmpty(start)){
			PAGE_NOW = Integer.parseInt(start);
		}
		if(!StringUtils.isEmpty(length)){
			PAGE_SIZE = Integer.parseInt(length);
		}

		qMap.put("pageNow",(PAGE_NOW-1)*PAGE_SIZE);
		qMap.put("pageSize",PAGE_SIZE);
		qMap.put("searchKey",searchKey);
		qMap.put("type",type);
		qMap.put("detailType",detailType);

		List cList = service.listAllCount(qMap);
		rList = service.listByPage(qMap);
		backMap.put("type",type);
		backMap.put("recordsTotal",cList.size());
		backMap.put("data",rList);
		backMap.put("msg","成功查询数据");

		return backMap;
	}

	/**
	 * 搜索查询列表
	 * @return
	 */
	@ApiOperation(value="分页查询", notes="获取列表")
	@RequestMapping(value = "/resource/list4search", method = RequestMethod.POST)
	public Object list4search (HttpServletRequest request){


		init();
		String start = request.getParameter("pageNow");
		String length = request.getParameter("pageSize");
		String searchKey = request.getParameter("key");
		String detailType = request.getParameter("detailType");
		if(!StringUtils.isEmpty(start)){
			PAGE_NOW = Integer.parseInt(start);
		}
		if(!StringUtils.isEmpty(length)){
			PAGE_SIZE = Integer.parseInt(length);
		}

		qMap.put("pageNow",(PAGE_NOW-1)*PAGE_SIZE);
		qMap.put("pageSize",PAGE_SIZE);
		qMap.put("searchKey",searchKey);
		qMap.put("detailType",detailType);

		List cList = service.listAllCount(qMap);
		rList = service.listByPage(qMap);
		backMap.put("recordsTotal",cList.size());
		backMap.put("data",rList);
		backMap.put("msg","成功查询数据");

		return backMap;
	}

	/**
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@RequestMapping(value = "/resource/category", method = RequestMethod.POST)
	public Object category(){

		init();
		List list = new ArrayList();

		Map map = new HashMap();

		for(int i=1;i<5;i++){
			map.put("key","type");
			map.put("value",i);
			List tList = service.searchByKey(map);
			list.add(tList.size());
		}
		return list;
	}

	/**
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@RequestMapping(value = "/resource/list4order", method = RequestMethod.POST)
	public Object searchByOrder(HttpServletRequest request,HttpSession session){

		init();
		Map map = new HashMap();
		String type = (String) session.getAttribute("type");
		if(StringUtils.isEmpty(type)){
			type = "1";
		}

		String col = request.getParameter("col");
		if(!"views".equals(col)&&!"comments".equals(col)&&!"likes".equals(col)&&!"collects".equals(col)){
			r.setMsg("col error!");
			return r;
		}

		map.put("key","type");
		map.put("value",type);
		map.put("col",col);
		map.put("orderType","desc");
		map.put("pageSize",7);
		rList = service.searchByOrder(map);
		return rList;
	}

	/**
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@RequestMapping(value = "/resource/list4item", method = RequestMethod.POST)
	public Object list4item(HttpSession session,String id){

		init();

		Map map = new HashMap();

		String type = (String) session.getAttribute("type");
		if(StringUtils.isEmpty(type)){
			type = "1";
		}
		String itemId = "";
		if(!StringUtils.isEmpty(id)){
			itemId = id;
			session.setAttribute("itemId",id);
		}else{
			itemId = (String) session.getAttribute("itemId");
			if(StringUtils.isEmpty(itemId)){
				itemId = "3";
			}
		}

		map.put("type",type);
		map.put("id",itemId);
		rList = service.list4item(map);
		if(rList.size()>0){
			Map rMap = rList.get(0);
			int lid = (int) rMap.get("id");
			int count = (int) rMap.get("views");
			Resource resource = new Resource();
			resource.setId(lid);
			resource.setViews(count+1);
			service.updateByPrimaryKeySelective(resource);
		}

		backMap.put("type",type);
		backMap.put("data",rList);
		return backMap;
	}

	/**
	 * 资源播不了反馈
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@RequestMapping(value = "/resource/report", method = RequestMethod.POST)
	public Object report(Integer id,String name,HttpServletRequest request){

		init();

		String ip = getLocalIp(request);
		Feedback feedback = new Feedback();
		feedback.setRid(id);
		feedback.setCreated(new Date());
		int res = feedbackService.insertSelective(feedback);
		if(res>0){

			//执行发邮件操作
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom("zooori@foxmail.com");
			message.setTo("imsprojo2fan@foxmail.com");
			message.setSubject("[看风了风]资源出错反馈");
			String link = "ip:"+ip+"\n资源名称:"+name;
			message.setText(link);
			sendMail.asyncMethod(message,qMap,"",-1);

			r.setCode(1);
			r.setMsg("success!");
		}
		return r;
	}
	@ApiOperation(value="留言求片", notes="留言求片")
	@RequestMapping(value = "/feedback/wishes",method = RequestMethod.POST)
	public Object wishes(HttpServletRequest request){
		String ip = getLocalIp(request);
		String nickName = request.getParameter("nickName");
		String email = request.getParameter("email");
		String type = request.getParameter("type");
		String description = request.getParameter("description");
		Wishes wishes = new Wishes();
		wishes.setType(Integer.parseInt(type));
		wishes.setIp(ip);
		wishes.setEmail(email);
		wishes.setName(nickName);
		wishes.setDescription(description);
		wishes.setCreated(new Date());
		int res = wishesService.insertSelective(wishes);
		if(res>0){

			//执行发邮件操作
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom("zooori@foxmail.com");
			message.setTo("imsprojo2fan@foxmail.com");
			message.setSubject("[看风了风]留言求片");
			String md5Mail = Md5Util.getMD5WithSalt(email);
			String link = "ip:"+ip+"\n昵称:"+nickName+"\n邮箱:"+email+"\n类型:"+type+"\n描述:"+description;
			message.setText(link);
			sendMail.asyncMethod(message,qMap,md5Mail,-1);

			r.setCode(1);
			r.setMsg("success");
		}
		return r;
	}


	public void init(){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		qMap = new HashMap<>();
		rList = new ArrayList<>();
		mdList = new ArrayList<>();
		tempList = new ArrayList<>();
	}

	/**
	 * 从Request对象中获得客户端IP，处理了HTTP代理服务器和Nginx的反向代理截取了ip
	 * @param request
	 * @return ip
	 */
	public static String getLocalIp(HttpServletRequest request) {
		String remoteAddr = request.getRemoteAddr();
		String forwarded = request.getHeader("X-Forwarded-For");
		String realIp = request.getHeader("X-Real-IP");

		String ip = null;
		if (realIp == null) {
			if (forwarded == null) {
				ip = remoteAddr;
			} else {
				ip = remoteAddr + "/" + forwarded.split(",")[0];
			}
		} else {
			if (realIp.equals(forwarded)) {
				ip = realIp;
			} else {
				if(forwarded != null){
					forwarded = forwarded.split(",")[0];
				}
				ip = realIp + "/" + forwarded;
			}
		}
		return ip;
	}
}

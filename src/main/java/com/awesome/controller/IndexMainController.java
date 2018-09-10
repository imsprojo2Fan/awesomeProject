package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.Comment;
import com.awesome.model.Feedback;
import com.awesome.model.Resource;
import com.awesome.model.Wishes;
import com.awesome.service.*;
import com.awesome.util.Md5Util;
import com.awesome.util.SendMailUtil;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 19:21 2018/8/16
 * @Modified By:
 */
@RequestMapping("/index")
@Controller
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
	private CommentService commentService;

	@Autowired
	private SendMailUtil sendMail;

	Map<String,Object> qMap = new HashMap<>();
	List<List> tempList = new ArrayList<>();
	List<String> mdList = new ArrayList<>();
	List<Map<String,Object>> rList = new ArrayList<>();
	Map<String,Object> backMap = new HashMap<>();
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
	@ResponseBody
	@RequestMapping(value = "/resource/list", method = RequestMethod.POST)
	public Object getList (HttpServletRequest request, HttpSession session){

		Map qMap = new HashMap();
		Map backMap = new HashMap<>();
		List<Map<String,Object>> rList;

		String type = request.getParameter("type");
		if(StringUtils.isEmpty(type)){
			type = (String) session.getAttribute("type");
			if(StringUtils.isEmpty(type)){
				type = "1";
			}
		}

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
		if(StringUtils.isEmpty(searchKey)){
			qMap.put("type",type);//当关键字搜索时可以搜索所有资源类型
		}
		qMap.put("detailType",detailType);
		qMap.put("sortCol","created");
		qMap.put("sortType","desc");

		List cList = service.listAllCount(qMap);
		rList = service.listByPage(qMap);
		backMap.put("type",type);
		backMap.put("recordsTotal",cList.size());
		backMap.put("data",rList);
		backMap.put("msg","成功查询数据");

		return backMap;
	}

	/**
	 * 查询刷新
	 * @return
	 */
	@ApiOperation(value="查询刷新", notes="查询刷新")
	@ResponseBody
	@RequestMapping(value = "/resource/list4refresh", method = RequestMethod.POST)
	public Object list4refresh (String id,HttpSession session){


		String 	type = (String) session.getAttribute("type");
		if(StringUtils.isEmpty(type)){
			type = "1";
		}
		init();

		qMap.put("type",type);
		qMap.put("id",id);
		rList = service.list4refresh(qMap);
		backMap.put("data",rList);

		return backMap;
	}

	/**
	 * 分享链接
	 * @return
	 */
	@ApiOperation(value="分享链接", notes="分享链接")
	@ResponseBody
	@RequestMapping(value = "/resource/share", method = RequestMethod.GET)
	public Object share (HttpServletRequest request,HttpSession session,HttpServletResponse response) throws IOException {

		init();
		String eid = request.getParameter("v");
		if(StringUtils.isEmpty(eid)){
			r.setCode(-1);
			r.setMsg("Parameter Error!");
			r.setData(null);
			return r;
		}

		//根据eid获取资源id
		qMap.put("key","eid");
		qMap.put("value",eid);
		rList = service.searchByKey(qMap);

		if(rList.size()>0){
			session.setAttribute("itemId",rList.get(0).get("id").toString());
			//跳转single.html
			response.sendRedirect("/single");
			return null;

		}else{
			r.setCode(-1);
			r.setMsg("未找到相关资源!");
			r.setData(null);
		}
		return r;
	}

	/**
	 * 搜索查询列表
	 * @return
	 */
	@ApiOperation(value="搜索查询列表", notes="获取列表")
	@ResponseBody
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
	 * 查询目录
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@ResponseBody
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
	 * 查询排序
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@ResponseBody
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
		List rList = service.searchByOrder(map);
		return rList;
	}

	/**
	 * 查询剧集详情
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@ResponseBody
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
	@ResponseBody
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
	@ResponseBody
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

	@ApiOperation(value="评论", notes="评论")
	@ResponseBody
	@RequestMapping(value = "/comment/add",method = RequestMethod.POST)
	public Object comment(HttpServletRequest request, Comment record,String counts){

		init();
		int count = 0;
		if(!StringUtils.isEmpty(counts)){
			count = Integer.parseInt(counts);
		}

		record.setIp(getLocalIp(request));
		record.setCreated(new Date());
		int res = commentService.insertSelective(record);
		if(res>0){
			Resource resource = new Resource();
			resource.setId(Integer.parseInt(record.getRid()));
			resource.setComments(count+1);
			service.updateByPrimaryKeySelective(resource);
			r.setCode(1);
			r.setMsg("success");
		}
		return r;
	}

	@ApiOperation(value="评论列表", notes="评论列表")
	@ResponseBody
	@RequestMapping(value = "/comment/list",method = RequestMethod.POST)
	public Object list4comment(String id,HttpServletRequest request){

		init();

		String start = request.getParameter("pageNow");
		String length = request.getParameter("pageSize");
		if(!StringUtils.isEmpty(start)){
			PAGE_NOW = Integer.parseInt(start);
		}
		if(!StringUtils.isEmpty(length)){
			PAGE_SIZE = Integer.parseInt(length);
		}
		qMap.put("pageNow",(PAGE_NOW-1)*PAGE_SIZE);
		qMap.put("pageSize",PAGE_SIZE);
		qMap.put("sortCol","created");
		qMap.put("sortType","DESC");
		qMap.put("rid",id);

		int count = commentService.listAllCount(qMap);
		rList = commentService.listByPage(qMap);
		backMap.put("count",count);
		backMap.put("data",rList);
		return backMap;
	}


	public void init(){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		backMap = new HashMap<>();
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
		String ipArr[] = ip.split("/");
		return ipArr[0];
	}
}

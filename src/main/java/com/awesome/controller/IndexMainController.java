package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.service.ResourceService;
import com.awesome.service.SeriesService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
		String type = (String) session.getAttribute("type");
		if(StringUtils.isEmpty(type)){
			type = "1";
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
		map.put("pageSize",10);
		rList = service.searchByOrder(map);
		return rList;
	}


	public void init(){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		qMap.clear();
		rList.clear();
		mdList.clear();
		tempList.clear();

	}
}

package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.Resource;
import com.awesome.model.Series;
import com.awesome.service.ResourceService;
import com.awesome.service.SeriesService;
import com.awesome.util.Md5Util;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 17:04 2018/8/8
 * @Modified By:
 */
@RestController
@RequestMapping("/main")
public class SeriesController {

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

	@RequestMapping(value = "/series/add", method = RequestMethod.POST)
	public Object addSeries(Series series){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		series.setCreated(new Date());
		int res = seriesService.insertSelective(series);
		if(res>0){
			r.setCode(1);
			r.setMsg("success");
		}

		return r;
	}

	@RequestMapping(value = "/series/edit", method = RequestMethod.POST)
	public Object updateSeries(Series series){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		series.setUpdated(new Date());
		int res = seriesService.updateByPrimaryKeySelective(series);
		if(res>0){
			r.setCode(1);
			r.setMsg("success");
		}

		return r;
	}

	/**
	 * 根据sid删除
	 * @param sid
	 * @return
	 */
	@ApiOperation(value="删除", notes="根据url的sid来指定删除")
	@ApiImplicitParam(name = "id", value = "ID", required = true, dataType = "Long", paramType = "path")
	@RequestMapping(value = "/series/delete", method = RequestMethod.POST)
	public Object delSeries (String sid){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		int Id = 0;
		if(StringUtils.isEmpty(sid)){
			r.setMsg("sid can`t be null!");
			return r;
		}else{
			try {
				Id = Integer.parseInt(sid);
			}catch (NumberFormatException e){
				r.setMsg(e.getMessage());
				e.printStackTrace();
			}
		}
		try {
			int ret = seriesService.deleteByPrimaryKey(Id);
			if (ret > 0) {
				r.setCode(1);
				r.setMsg("操作成功!");
				r.setData(null);
			}
		} catch (Exception e) {
			r.setMsg(e.getMessage());
			e.printStackTrace();
		}
		return r;
	}


	/**
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="分页查询", notes="获取列表")
	@RequestMapping(value = "/series/list", method = RequestMethod.POST)
	public Object getWXInfoList (HttpServletRequest request){
		GlobalDraw++;

		init();

		String start = request.getParameter("pageNow");
		String length = request.getParameter("pageSize");
		String searchKey = request.getParameter("key");
		if(!StringUtils.isEmpty(start)){
			PAGE_NOW = Integer.parseInt(start);
		}
		if(!StringUtils.isEmpty(length)){
			PAGE_SIZE = Integer.parseInt(length);
		}

		qMap.put("pageNow",(PAGE_NOW-1)*PAGE_SIZE);
		qMap.put("pageSize",PAGE_SIZE);
		qMap.put("searchKey",searchKey);

		int count = seriesService.listAllCount(qMap);
		rList = seriesService.listByPage(qMap);

		backMap.put("recordsTotal",count);
		backMap.put("data",rList);
		backMap.put("msg","成功查询数据");
		return backMap;
	}
	/**
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@RequestMapping(value = "/series/searchByKey", method = RequestMethod.POST)
	public Object searchByKey(String key){
		init();
		qMap.put("key","rid");
		qMap.put("value",key);
		rList = seriesService.searchByKey(qMap);
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
	/*
	 * @author imsprojo2Fan
	 * @date 2018/8/14 20:41
	 * @param   List去重
	 * @return
	 */
	public static List removeDuplicate(List list)  {
		for  ( int  i  =   0 ; i  <  list.size()  -   1 ; i ++ )  {
			for  ( int  j  =  list.size()  -   1 ; j  >  i; j -- )  {
				if  (list.get(j).equals(list.get(i)))  {
					list.remove(j);
				}
			}
		}
		return list;
	}

}

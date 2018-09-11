package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.Series;
import com.awesome.model.Tvs;
import com.awesome.service.ResourceService;
import com.awesome.service.SeriesService;
import com.awesome.service.TvsService;
import com.awesome.util.Md5Util;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 11:30 2018/9/10
 * @Modified By:
 */
@RestController
@RequestMapping("/main/tvs")
public class TvsController {

	@Autowired
	private TvsService service;

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

	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public Object addSeries(Tvs record){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		record.setTid(Md5Util.getMD5WithSalt(System.currentTimeMillis()+""));
		Random random = new Random();
		record.setViews(random.nextInt(3000)%(3000-1000+1) + 1000);
		record.setCollects(random.nextInt(3000)%(3000-1000+1) + 1000);
		record.setLikes(random.nextInt(3000)%(3000-1000+1) + 1000);
		record.setCreated(new Date());
		int res = service.insertSelective(record);
		if(res>0){
			r.setCode(1);
			r.setMsg("success");
		}

		return r;
	}

	@RequestMapping(value = "/edit", method = RequestMethod.POST)
	public Object updateSeries(Tvs record){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		record.setUpdated(new Date());
		int res = service.updateByPrimaryKeySelective(record);
		if(res>0){
			r.setCode(1);
			r.setMsg("success");
		}

		return r;
	}

	/**
	 * 根据sid删除
	 * @param id
	 * @return
	 */
	@ApiOperation(value="删除", notes="根据url的id来指定删除")
	@ApiImplicitParam(name = "id", value = "ID", required = true, dataType = "Long", paramType = "path")
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public Object delSeries (String id){
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
				r.setMsg(e.getMessage());
				e.printStackTrace();
			}
		}
		try {
			int ret = service.deleteByPrimaryKey(Id);
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
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	public Object list (HttpServletRequest request){
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

		int count = service.listAllCount(qMap);
		rList = service.listByPage(qMap);

		backMap.put("draw",GlobalDraw);
		backMap.put("recordsTotal",count);
		backMap.put("recordsFiltered",count);
		backMap.put("data",rList);

		return backMap;
	}
	/**
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="查询", notes="获取列表")
	@RequestMapping(value = "/searchByKey", method = RequestMethod.POST)
	public Object searchByKey(String key){
		init();
		qMap.put("key","rid");
		qMap.put("value",key);
		rList = service.searchByKey(qMap);
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

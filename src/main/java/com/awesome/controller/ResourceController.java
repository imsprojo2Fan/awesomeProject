package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.Resource;
import com.awesome.model.Series;
import com.awesome.model.WXInfo;
import com.awesome.service.ResourceService;
import com.awesome.service.SeriesService;
import com.awesome.util.Md5Util;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

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
public class ResourceController {

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

	List sList = new ArrayList();

	/**
	 * 添加
	 * @param 
	 * @return
	 */
	@ApiOperation(value="创建", notes="根据record对象创建")
	@ApiImplicitParam(name = "", value = "详细实体", required = true, dataType = "Record")
	@RequestMapping(value = "/resource/add", method = RequestMethod.POST)
	public Object add (@ModelAttribute Resource record,HttpServletRequest request){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		sList.clear();

		String videoSrcStr = request.getParameter("a1");

		try {
			Random random = new Random();
			String eid = Md5Util.getMD5WithSalt(System.currentTimeMillis()+"");
			record.setEid(eid);
			record.setViews(random.nextInt(3000)%(3000-1000+1) + 1000);
			record.setCollects(random.nextInt(3000)%(3000-1000+1) + 1000);
			record.setLikes(random.nextInt(3000)%(3000-1000+1) + 1000);
			record.setCreated(new Date());
			int uid = service.insertSelective(record);
			if (uid > 0) {

				if(!StringUtils.isEmpty(videoSrcStr)){
					videoSrcStr = videoSrcStr.substring(1,videoSrcStr.length());
					String[] videoSrcArr = videoSrcStr.split(",");

					String orderStr = request.getParameter("a0");
					orderStr = orderStr.substring(1,orderStr.length());
					String[] orderArr = orderStr.split(",");

					String bdStr = request.getParameter("a2");
					bdStr = bdStr.substring(1,bdStr.length());
					String[] bdArr = bdStr.split(",");

					String xl1Str = request.getParameter("a3");
					xl1Str = xl1Str.substring(1,xl1Str.length());
					String[] xl1Arr = xl1Str.split(",");

					String xl2Str = request.getParameter("a4");
					xl2Str = xl2Str.substring(1,xl2Str.length());
					String[] xl2Arr = xl2Str.split(",");

					String xl3Str = request.getParameter("a5");
					xl3Str = xl3Str.substring(1,xl3Str.length());
					String[] xl3Arr = xl3Str.split(",");

					String phoneSrcStr = request.getParameter("a6");
					phoneSrcStr = phoneSrcStr.substring(1,phoneSrcStr.length());
					String[] phoneSrcArr = phoneSrcStr.split(",");

					for(int i=0;i<videoSrcArr.length;i++){
						Map item = new HashMap();
						item.put("rid",eid);
						item.put("seriesName",record.getName());
						item.put("sequence",orderArr[i]);
						item.put("videoSrc",videoSrcArr[i]);
						item.put("phoneSrc",phoneSrcArr[i]);
						item.put("bdUrl",bdArr[i]);
						item.put("xlUrl1",xl1Arr[i]);
						item.put("xlUrl2",xl2Arr[i]);
						item.put("xlUrl3",xl3Arr[i]);
						item.put("description",record.getDescription());
						item.put("isOn",1);
						item.put("views",random.nextInt(3000)%(3000-1000+1) + 1000);
						item.put("comments",random.nextInt(3000)%(3000-1000+1) + 1000);
						item.put("collects",random.nextInt(3000)%(3000-1000+1) + 1000);
						item.put("likes",random.nextInt(3000)%(3000-1000+1) + 1000);
						item.put("created",new Date());
						sList.add(item);
					}
					System.out.println(sList);
					seriesService.insertBatch(sList);
				}
				r.setCode(1);
				r.setMsg("操作成功!");
				r.setData(uid);
			}
		} catch (Exception e) {
			r.setMsg(e.getMessage());
			e.printStackTrace();
		}
		return r;
	}

	/**
	 * 根据id删除
	 * @param id
	 * @return
	 */
	@ApiOperation(value="删除", notes="根据url的id来指定删除")
	@ApiImplicitParam(name = "id", value = "ID", required = true, dataType = "Long", paramType = "path")
	@RequestMapping(value = "/resource/delete", method = RequestMethod.POST)
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
	 * 根据id修改信息
	 * @param resource
	 * @return
	 */
	@ApiOperation(value="更新信息", notes="根据表单数据的id来指定更新信息")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "resource", value = "实体resource", required = true, dataType = "WXInfo")
	})
	@RequestMapping(value = "/resource/edit", method = RequestMethod.POST)
	public Object edit(Resource resource){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);

		try {

			resource.setUpdated(new Date());
			int ret = service.updateByPrimaryKeySelective(resource);
			if (ret > 0) {
				r.setCode(1);
				r.setMsg("操作成功!");
				r.setData(ret);
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
	@RequestMapping(value = "/resource/list", method = RequestMethod.POST)
	public Object getWXInfoList (HttpServletRequest request){
		GlobalDraw++;

		init();

		String start = request.getParameter("pageNow");
		String length = request.getParameter("pageSize");
		String searchKey = request.getParameter("key");
		String type = request.getParameter("type");
		String typeFilter = request.getParameter("typeFilter");
		String orderFilter = request.getParameter("orderFilter");
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
		qMap.put("typeFilter",typeFilter);
		qMap.put("orderFilter",orderFilter);

		List cList = service.listAllCount(qMap);
		rList = service.listByPage(qMap);

		backMap.put("recordsTotal",cList.size());
		backMap.put("data",removeDuplicate(rList));
		backMap.put("msg","成功查询数据");

		return backMap;
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

package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.model.WXInfo;
import com.awesome.service.WXInfoService;
import com.awesome.util.Md5Util;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
public class WXInfoController {

	@Autowired
	private WXInfoService wxinfoService;


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

	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(WXInfoController.class);

	/**
	 * 添加
	 * @param wxinfo
	 * @return
	 */
	@ApiOperation(value="创建", notes="根据record对象创建")
	@ApiImplicitParam(name = "wxinfo", value = "详细实体", required = true, dataType = "Record")
	@RequestMapping(value = "/wxinfo/add", method = RequestMethod.POST)
	public Object add (@ModelAttribute WXInfo wxinfo){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		try {

			wxinfo.setCreated(new Date());
			int uid = wxinfoService.insert(wxinfo);
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
	@ApiOperation(value="删除", notes="根据url的id来指定删除")
	@ApiImplicitParam(name = "id", value = "ID", required = true, dataType = "Long", paramType = "path")
	@RequestMapping(value = "/wxinfo/delete", method = RequestMethod.POST)
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
			int ret = wxinfoService.deleteByPrimaryKey(Id);
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
	 * @param wxinfo
	 * @return
	 */
	@ApiOperation(value="更新信息", notes="根据表单数据的id来指定更新信息")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "wxinfo", value = "用户实体wxinfo", required = true, dataType = "WXInfo")
	})
	@RequestMapping(value = "/wxinfo/edit", method = RequestMethod.POST)
	public Object edit(WXInfo wxinfo){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);

		try {

			wxinfo.setUpdated(new Date());
			int ret = wxinfoService.updateByPrimaryKeySelective(wxinfo);
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
	 * 查询列表
	 * @return
	 */
	@ApiOperation(value="分页查询", notes="获取列表")
	@RequestMapping(value = "/wxinfo/list", method = RequestMethod.POST)
	public Object getWXInfoList (HttpServletRequest request){
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

		int count = wxinfoService.listAllCount(qMap);
		rList = wxinfoService.listByPage(qMap);

		backMap.put("draw",GlobalDraw);
		backMap.put("recordsTotal",count);
		backMap.put("recordsFiltered",count);
		backMap.put("data",rList);

		return backMap;
	}


	public void init(){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		qMap.clear();
		rList.clear();
	}

}

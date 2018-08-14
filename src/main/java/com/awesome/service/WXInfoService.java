package com.awesome.service;

import com.awesome.model.WXInfo;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 16:26 2018/8/3
 * @Modified By:
 */
public interface WXInfoService {

	int deleteByPrimaryKey(Integer id);

	int insert(WXInfo record);

	int insertSelective(WXInfo record);

	WXInfo selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(WXInfo record);

	int updateByPrimaryKey(WXInfo record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

package com.awesome.service;

import com.awesome.model.Resource;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 15:59 2018/8/8
 * @Modified By:
 */
public interface ResourceService {
	int deleteByPrimaryKey(Integer id);

	int insert(Resource record);

	int insertSelective(Resource record);

	Resource selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Resource record);

	int updateByPrimaryKey(Resource record);

	List<Map<String,Object>> listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

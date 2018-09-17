package com.awesome.service;

import com.awesome.model.Tvs;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 11:27 2018/9/10
 * @Modified By:
 */
public interface TvsService {

	int deleteByPrimaryKey(Integer id);

	int insert(Tvs record);

	int insertSelective(Tvs record);

	Tvs selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Tvs record);

	int updateByPrimaryKey(Tvs record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);

	List<Map<String,Object>> searchByOrder(Map<String,Object> qMap);
}

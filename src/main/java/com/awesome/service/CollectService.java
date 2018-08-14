package com.awesome.service;

import com.awesome.model.Collect;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 16:09 2018/8/3
 * @Modified By:
 */
public interface CollectService {

	int deleteByPrimaryKey(Integer id);

	int insert(Collect record);

	int insertSelective(Collect record);

	Collect selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Collect record);

	int updateByPrimaryKey(Collect record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

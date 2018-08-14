package com.awesome.service;

import com.awesome.model.Wishes;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 16:23 2018/8/3
 * @Modified By:
 */
public interface WishesService {

	int deleteByPrimaryKey(Integer id);

	int insert(Wishes record);

	int insertSelective(Wishes record);

	Wishes selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Wishes record);

	int updateByPrimaryKey(Wishes record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

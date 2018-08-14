package com.awesome.service;

import com.awesome.model.OperateHistory;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 16:17 2018/8/3
 * @Modified By:
 */
public interface OperateHistoryService {
	int deleteByPrimaryKey(Integer id);

	int insert(OperateHistory record);

	int insertSelective(OperateHistory record);

	OperateHistory selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(OperateHistory record);

	int updateByPrimaryKey(OperateHistory record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

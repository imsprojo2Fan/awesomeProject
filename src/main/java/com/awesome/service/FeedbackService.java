package com.awesome.service;

import com.awesome.model.Feedback;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 15:54 2018/8/8
 * @Modified By:
 */
public interface FeedbackService {
	int deleteByPrimaryKey(Integer id);

	int insert(Feedback record);

	int insertSelective(Feedback record);

	Feedback selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Feedback record);

	int updateByPrimaryKey(Feedback record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

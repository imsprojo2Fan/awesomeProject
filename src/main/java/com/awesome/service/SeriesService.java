package com.awesome.service;

import com.awesome.model.Series;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 13:26 2018/8/12
 * @Modified By:
 */
public interface SeriesService {
	int deleteByPrimaryKey(Integer id);

	int insert(Series record);

	int insertSelective(Series record);

	Series selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Series record);

	int updateByPrimaryKey(Series record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);

	int insertBatch(List<Map<String,Object>> qList);
}

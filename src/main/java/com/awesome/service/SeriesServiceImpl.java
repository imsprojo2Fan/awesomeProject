package com.awesome.service;

import com.awesome.dao.SeriesMapper;
import com.awesome.model.Series;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 13:26 2018/8/12
 * @Modified By:
 */
@Service
public class SeriesServiceImpl implements SeriesService {

	@Autowired
	private SeriesMapper mapper;
	@Override
	public int deleteByPrimaryKey(Integer id) {
		return mapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(Series record) {
		return mapper.insert(record);
	}

	@Override
	public int insertSelective(Series record) {
		return mapper.insertSelective(record);
	}

	@Override
	public Series selectByPrimaryKey(Integer id) {
		return mapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(Series record) {
		return mapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Series record) {
		return mapper.updateByPrimaryKey(record);
	}

	@Override
	public int listAllCount(Map<String, Object> qMap) {
		return mapper.listAllCount(qMap);
	}

	@Override
	public List<Map<String, Object>> listByPage(Map<String, Object> qMap) {
		return mapper.listByPage(qMap);
	}

	@Override
	public List<Map<String, Object>> searchByKey(Map<String, Object> qMap) {
		return mapper.searchByKey(qMap);
	}

	@Override
	public int insertBatch(List<Map<String, Object>> qList) {
		return mapper.insertBatch(qList);
	}
}

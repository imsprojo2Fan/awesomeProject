package com.awesome.service;

import com.awesome.dao.CollectMapper;
import com.awesome.model.Collect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 16:09 2018/8/3
 * @Modified By:
 */
@Service
public class CollectServiceImpl implements CollectService {

	@Autowired
	private CollectMapper mapper;


	@Override
	public int deleteByPrimaryKey(Integer id) {
		return mapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(Collect record) {
		return mapper.insert(record);
	}

	@Override
	public int insertSelective(Collect record) {
		return mapper.insertSelective(record);
	}

	@Override
	public Collect selectByPrimaryKey(Integer id) {
		return mapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(Collect record) {
		return mapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Collect record) {
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
}

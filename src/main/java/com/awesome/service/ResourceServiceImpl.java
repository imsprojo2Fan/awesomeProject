package com.awesome.service;

import com.awesome.dao.ResourceMapper;
import com.awesome.model.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 15:59 2018/8/8
 * @Modified By:
 */
@Service
public class ResourceServiceImpl implements ResourceService {

	@Autowired
	private ResourceMapper mapper;

	@Override
	public int deleteByPrimaryKey(Integer id) {
		return mapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(Resource record) {
		return mapper.insert(record);
	}

	@Override
	public int insertSelective(Resource record) {
		return mapper.insertSelective(record);
	}

	@Override
	public Resource selectByPrimaryKey(Integer id) {
		return mapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(Resource record) {
		return mapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Resource record) {
		return mapper.updateByPrimaryKey(record);
	}

	@Override
	public List<Map<String,Object>> listAllCount(Map<String, Object> qMap) {
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
	public List<Map<String, Object>> searchByOrder(Map<String, Object> qMap) {
		return mapper.searchByOrder(qMap);
	}

	@Override
	public List<Map<String, Object>> list4item(Map<String, Object> qMap) {
		return mapper.list4item(qMap);
	}

	@Override
	public List<Map<String, Object>> listItem4wx(Map<String, Object> qMap) {
		return mapper.listItem4wx(qMap);
	}

	@Override
	public List<Map<String, Object>> list4refresh(Map<String, Object> qMap) {
		return mapper.list4refresh(qMap);
	}
}

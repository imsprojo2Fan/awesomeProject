package com.awesome.service;

import com.awesome.dao.TvsMapper;
import com.awesome.model.Tvs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 11:27 2018/9/10
 * @Modified By:
 */
@Service
public class TvsServiceImpl implements TvsService {

	@Autowired
	private TvsMapper tvsMapper;

	@Override
	public int deleteByPrimaryKey(Integer id) {
		return tvsMapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(Tvs record) {
		return tvsMapper.insert(record);
	}

	@Override
	public int insertSelective(Tvs record) {
		return tvsMapper.insertSelective(record);
	}

	@Override
	public Tvs selectByPrimaryKey(Integer id) {
		return tvsMapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(Tvs record) {
		return tvsMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Tvs record) {
		return tvsMapper.updateByPrimaryKey(record);
	}

	@Override
	public int listAllCount(Map<String, Object> qMap) {
		return tvsMapper.listAllCount(qMap);
	}

	@Override
	public List<Map<String, Object>> listByPage(Map<String, Object> qMap) {
		return tvsMapper.listByPage(qMap);
	}

	@Override
	public List<Map<String, Object>> searchByKey(Map<String, Object> qMap) {
		return tvsMapper.searchByKey(qMap);
	}
}

package com.awesome.service;

import com.awesome.dao.UserMapper;
import com.awesome.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 9:30 2018/7/2
 * @Modified By:
 */
@Service
public class UserServiceImpl implements UserService {
	@Autowired
	private UserMapper mapper;


	@Override
	public int deleteByPrimaryKey(Integer id) {
		return mapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(User record) {
		return mapper.insert(record);
	}

	@Override
	public int insertSelective(User record) {
		return mapper.insertSelective(record);
	}

	@Override
	public User selectByPrimaryKey(Integer id) {
		return mapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(User record) {
		return mapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByEmailSelective(User record) {
		return mapper.updateByEmailSelective(record);
	}

	@Override
	public int updateByPrimaryKey(User record) {
		return mapper.updateByPrimaryKey(record);
	}

	@Override
	public User getUserByAccount(Map<String,Object> qMap) {
		return mapper.getUserByAccount(qMap);
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


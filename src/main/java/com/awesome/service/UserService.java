package com.awesome.service;

import com.awesome.model.User;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 9:29 2018/7/2
 * @Modified By:
 */
public interface UserService {

	int deleteByPrimaryKey(Integer id);

	int insert(User record);

	int insertSelective(User record);

	User selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(User record);

	int updateByEmailSelective(User record);

	int updateByPrimaryKey(User record);

	User getUserByAccount(Map<String,Object> qMap);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

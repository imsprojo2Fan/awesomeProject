package com.awesome.service;

import com.awesome.model.Reply;

import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 16:20 2018/8/3
 * @Modified By:
 */
public interface ReplyService {

	int deleteByPrimaryKey(Integer id);

	int insert(Reply record);

	int insertSelective(Reply record);

	Reply selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Reply record);

	int updateByPrimaryKey(Reply record);

	int listAllCount(Map<String,Object> qMap);

	List<Map<String,Object>> listByPage(Map<String,Object> qMap);

	List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}

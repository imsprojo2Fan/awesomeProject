package com.awesome.dao;

import com.awesome.model.Reply;

import java.util.List;
import java.util.Map;

public interface ReplyMapper {
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
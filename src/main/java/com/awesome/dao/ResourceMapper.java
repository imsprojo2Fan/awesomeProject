package com.awesome.dao;

import com.awesome.model.Resource;

import java.util.List;
import java.util.Map;

public interface ResourceMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Resource record);

    int insertSelective(Resource record);

    Resource selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Resource record);

    int updateByPrimaryKey(Resource record);

    List<Map<String,Object>> listAllCount(Map<String,Object> qMap);

    List<Map<String,Object>> listByPage(Map<String,Object> qMap);

    List<Map<String,Object>> searchByKey(Map<String,Object> qMap);

    List<Map<String,Object>> searchByOrder(Map<String,Object> qMap);

    List<Map<String,Object>> list4item(Map<String,Object> qMap);

    List<Map<String,Object>> list4refresh(Map<String,Object> qMap);
}
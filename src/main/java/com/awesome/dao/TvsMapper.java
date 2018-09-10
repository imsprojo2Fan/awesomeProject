package com.awesome.dao;

import com.awesome.model.Tvs;

import java.util.List;
import java.util.Map;

public interface TvsMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Tvs record);

    int insertSelective(Tvs record);

    Tvs selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Tvs record);

    int updateByPrimaryKey(Tvs record);

    int listAllCount(Map<String,Object> qMap);

    List<Map<String,Object>> listByPage(Map<String,Object> qMap);

    List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}
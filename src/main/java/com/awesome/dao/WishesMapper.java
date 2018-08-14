package com.awesome.dao;

import com.awesome.model.Wishes;

import java.util.List;
import java.util.Map;

public interface WishesMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Wishes record);

    int insertSelective(Wishes record);

    Wishes selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Wishes record);

    int updateByPrimaryKey(Wishes record);

    int listAllCount(Map<String,Object> qMap);

    List<Map<String,Object>> listByPage(Map<String,Object> qMap);

    List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}
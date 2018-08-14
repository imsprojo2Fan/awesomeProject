package com.awesome.dao;

import com.awesome.model.WXInfo;

import java.util.List;
import java.util.Map;

public interface WXInfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(WXInfo record);

    int insertSelective(WXInfo record);

    WXInfo selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(WXInfo record);

    int updateByPrimaryKey(WXInfo record);

    int listAllCount(Map<String,Object> qMap);

    List<Map<String,Object>> listByPage(Map<String,Object> qMap);

    List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}
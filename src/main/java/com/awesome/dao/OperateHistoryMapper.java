package com.awesome.dao;

import com.awesome.model.OperateHistory;

import java.util.List;
import java.util.Map;

public interface OperateHistoryMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(OperateHistory record);

    int insertSelective(OperateHistory record);

    OperateHistory selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(OperateHistory record);

    int updateByPrimaryKey(OperateHistory record);

    int listAllCount(Map<String,Object> qMap);

    List<Map<String,Object>> listByPage(Map<String,Object> qMap);

    List<Map<String,Object>> searchByKey(Map<String,Object> qMap);
}
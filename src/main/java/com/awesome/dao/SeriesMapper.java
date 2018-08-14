package com.awesome.dao;

import com.awesome.model.Series;

import java.util.List;
import java.util.Map;

public interface SeriesMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Series record);

    int insertSelective(Series record);

    Series selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Series record);

    int updateByPrimaryKey(Series record);

    int listAllCount(Map<String,Object> qMap);

    List<Map<String,Object>> listByPage(Map<String,Object> qMap);

    List<Map<String,Object>> searchByKey(Map<String,Object> qMap);

    int insertBatch(List<Map<String,Object>> qList);
}
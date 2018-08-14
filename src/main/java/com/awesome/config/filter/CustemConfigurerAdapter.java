package com.awesome.config.filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: imsprojo2Fan
 * @Description:authFilterRegistrationBean方法是对AuthFilter过滤类的注册，
 * urlList.add("/*")是添加这个过滤器需要过滤的URL地址，可以添加多个；
 * registrationBean.setOrder(1)是设置该过滤器执行的顺序。SpringBoot会根据order从小到大的顺序执行。
 * @Date: Created in 17:47 2018/7/2
 * @Modified By:
 */
@Configuration
public class CustemConfigurerAdapter {

	@Bean
	public FilterRegistrationBean authFilterRegistrationBean() {
		FilterRegistrationBean registrationBean = new FilterRegistrationBean();
		registrationBean.setName("authFilter");
		AuthFilter authFilter = new AuthFilter();
		registrationBean.setFilter(authFilter);
		registrationBean.setOrder(1);
		List<String> urlList = new ArrayList<String>();
		urlList.add("/main/*");
		registrationBean.setUrlPatterns(urlList);
		return registrationBean;
	}

}

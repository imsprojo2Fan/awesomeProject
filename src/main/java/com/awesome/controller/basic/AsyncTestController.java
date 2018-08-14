package com.awesome.controller.basic;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.Callable;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * 当controller返回值是Callable的时候，springmvc就会启动一个线程将Callable交给TaskExecutor去处理
 * 然后DispatcherServlet还有所有的spring拦截器都退出主线程，然后把response保持打开的状态
 * 当Callable执行结束之后，springmvc就会重新启动分配一个request请求，然后DispatcherServlet就重新
 * 调用和处理Callable异步执行的返回结果， 然后返回视图
 * @Date: Created in 9:28 2018/7/2
 * @Modified By:
 */

@RestController
public class AsyncTestController {

	private static final Logger logger = LoggerFactory.getLogger(AsyncTestController.class);


	@RequestMapping(value = "/sync", method = RequestMethod.GET)
	public Object sync() throws InterruptedException {
		logger.info(System.currentTimeMillis()+"");
		//Thread.sleep(1000);
		//List<User> users = userService.getUserList();
		return null;
	}

	@RequestMapping("/async")
	//@Async
	public Object callable() {
		/*List<User> users = userService.getUserList();
		System.out.println(users);
		return  JSON.toJSONString(users);*/
		// 使用异步将不会阻塞tomcat的io读写线程池、使得增加系统的吞吐量
		return new Callable<String>() {
			@Override
			public String call() throws Exception {
				logger.info(System.currentTimeMillis()+"");
				//Thread.sleep(1000);
				//List<User> users = userService.getUserList();
				return  JSON.toJSONString("");
			}
		};
	}
}

package com.awesome;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AwesomeApplicationTests {

	@Autowired
	private JavaMailSender mailSender;

	@Test
	public void sendSimpleMail() throws Exception {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("zooori@foxmail.com");
		message.setTo("imsprojo2fan@foxmail.com");
		message.setSubject("主题：简单邮件");
		message.setText("测试邮件内容");

		mailSender.send(message);
	}

	@Autowired
	private RedisTemplate<String,Object> redisTemplate;

	@Test
	public void redisTest(){
		ValueOperations<String,Object> valueOperations = redisTemplate.opsForValue();
		valueOperations.set("hello", "redis666");
		System.out.println("useRedisDao = " + valueOperations.get("hello"));
	}

}

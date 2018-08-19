package com.awesome.util;

import com.awesome.model.User;
import com.awesome.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 16:30 2018/8/1
 * @Modified By:
 */
@Component
public class SendMailUtil {

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private RedisTemplate<String,Object> redisTemplate;

	@Autowired
	private UserService userService;

	public Exception GlobalException;

	/**
	 * @Async 表明这是一个异步方法，也就是说当调用这个方法时，
	 * spring会创建一条线程来执行这个方法。
	 * 注意：不能使用static来修饰此方法，否则@Async无效
	 *
	 * @author chenmc
	 * @date 2017年9月4日 下午3:34:24
	 */
	@Async
	public void asyncMethod(SimpleMailMessage message,Map map,String md5Mail,int type){
		System.out.println(Thread.currentThread().getName());
		try{
			GlobalException = null;
			mailSender.send(message);
		}catch (MailException exception){
			exception.printStackTrace();
			GlobalException = exception;
		}finally {
			if(GlobalException==null){
				if(type==0){//账号激活邮件
					ValueOperations<String,Object> redis = redisTemplate.opsForValue();
					redis.set(md5Mail,map);
				}else if(type==1){//重置密码
					User user = new User();
					String password = map.get("password").toString();
					user.setPassword(Md5Util.getMD5WithSalt(password));
					user.setEmail(map.get("email").toString());
					user.setUpdated(new Date());
					userService.updateByEmailSelective(user);
				}
				else if(type==2){//邮箱验证码
					ValueOperations<String,Object> redis = redisTemplate.opsForValue();
					redis.set(md5Mail,map);
				}else{

				}
			}

		}

	}

}

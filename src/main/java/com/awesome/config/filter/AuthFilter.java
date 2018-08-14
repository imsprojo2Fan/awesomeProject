package com.awesome.config.filter;

import com.awesome.model.User;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 17:46 2018/7/2
 * @Modified By:
 */
public class AuthFilter implements Filter {

	public static final  String filterAdd = "add";
	public static final String filterEdit = "edit";
	public static final String filterDel = "delete";
	public static final String filterList = "list";
	public static final String filterSignUp = "signup";

	@Override
	public void destroy() {
		// 顾名思义，在销毁时使用
		System.out.println("AuthFilter destroy");
	}

	@Override
	public void doFilter(ServletRequest arg0, ServletResponse arg1,
						 FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)arg0;
		HttpServletResponse response = (HttpServletResponse)arg1;
		if(needLogin(request)) {
			// 需要登录则跳转到登录Controller
			response.sendRedirect("/login");
			return;
		}
		if(!hasRight(request)){
			response.sendRedirect("/err/403");
			return;
		}
		chain.doFilter(arg0, arg1);
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
		// 初始化操作
		System.out.println("AuthFilter init");
	}

	/**
	 * 判断是否需要登录
	 * @param request
	 * @return
	 */
	private boolean needLogin(HttpServletRequest request) {

		String uri = request.getRequestURI();
		if(uri.indexOf(filterSignUp)>0){//左侧配置数据无需登录
			return false;
		}

		//进行是否需要登录的判断操作
		User user = (User) request.getSession().getAttribute("user");
		if (user==null){
			return true;
		}
		return false;
	}

	/**
	 * 判断是否有权限操作
	 * @param request
	 * @return
	 */
	private boolean hasRight(HttpServletRequest request) {

		String uri = request.getRequestURI();
		if("/main/user/editById".equals(uri)){
			return true;
		}

		if(uri.indexOf(filterAdd)>0||uri.indexOf(filterEdit)>0||uri.indexOf(filterDel)>0||uri.indexOf(filterList)>0){//左侧配置需验证权限
			//进行是否需要登录的判断操作
			User user = (User) request.getSession().getAttribute("user");
			if (user.getType()<2){
				return false;
			}
		}
		return true;
	}

}

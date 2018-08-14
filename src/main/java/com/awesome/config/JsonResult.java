package com.awesome.config;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 9:23 2018/7/2
 * @Modified By:
 */
public class JsonResult {

	public static int code; //返回状态码 1成功 -1失败
	private static String msg;	 //结果信息
	private static Object data; //返回数据

	public JsonResult() {
	}

	public JsonResult(int code, String msg, Object data) {
		this.code = code;
		this.msg = msg;
		this.data = data;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "JsonResult{" +
				"code='" + code + '\'' +
				", msg='" + msg + '\'' +
				", data=" + data +
				'}';
	}
}

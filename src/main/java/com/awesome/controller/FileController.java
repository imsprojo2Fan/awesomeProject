package com.awesome.controller;

import com.awesome.config.JsonResult;
import com.awesome.service.ResourceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: imsprojo2Fan
 * @Description:
 * @Date: Created in 14:00 2018/8/8
 * @Modified By:
 */
@RestController
@RequestMapping("/main")
public class FileController {

	private static final Logger logger = LoggerFactory.getLogger(FileController.class);

	@Autowired
	private ResourceService resourceService;


	@Value("${spring.profiles.active}")
	private String type;

	@Value("${com.file.path4windows}")
	private String path1;

	@Value("${com.file.path4linux}")
	private String path2;

	String filePath;

	Map<String,Object> qMap = new HashMap<>();
	List<Map<String,Object>> rList = new ArrayList<>();
	Map<String,Object> backMap = new HashMap<>();
	JsonResult r = new JsonResult();

	//文件上传相关代码
	@RequestMapping(value = "/upload4pic",method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public Object upload4pic(MultipartFile file) throws FileNotFoundException {

		init();

		if (file.isEmpty()) {
			return "文件为空";
		}
		// 获取文件名
		String fileName = file.getOriginalFilename();
		logger.info("上传的文件名为：" + fileName);
		// 获取文件的后缀名
		String suffixName = fileName.substring(fileName.lastIndexOf("."));
		logger.info("上传的后缀名为：" + suffixName);
		if(suffixName.indexOf("jpg")==0||suffixName.indexOf("jpeg")==0||suffixName.indexOf("png")==0){
			r.setMsg("文件格式错误");
			return r;
		}

		fileName = System.currentTimeMillis()+suffixName;

		// 文件上传后的路径
		File path = new File(ResourceUtils.getURL("").getPath());
		String path1 = path.getAbsolutePath();
		path1 = path1.replaceAll("AwesomeProject","files");
		File pic = new File(path1,"pic");
		if(!pic.exists()){
			pic.mkdirs();
		}

		// 解决中文问题，linux下中文路径，图片显示问题
		// fileName = UUID.randomUUID() + suffixName;
		File dest = new File(pic.getAbsolutePath()+File.separator + fileName);
		// 检测是否存在目录
		if (!dest.getParentFile().exists()) {
			dest.getParentFile().mkdirs();
		}
		try {
			file.transferTo(dest);
			return fileName;
		} catch (IllegalStateException e) {
			e.printStackTrace();
			r.setMsg(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			r.setMsg(e.getMessage());
		}
		return r;
	}

	@RequestMapping(value = "/upload")
	@ResponseBody
	public Object upload(@RequestParam("roncooFile") MultipartFile file) {
		if (file.isEmpty()) {
			return "文件为空";
		}
		// 获取文件名
		String fileName = file.getOriginalFilename(); logger.info("上传的文件名为:" + fileName);
		// 获取文件的后缀名
		String suffixName = fileName.substring(fileName.lastIndexOf(".")); logger.info("上传的后缀名为:" + suffixName);
		// 文件上传路径
		// 文件上传后的路径
		String filePath = "";
		if(type.equals("dev")){
			filePath = path1;
		}else{
			filePath = path2;
		}
		// 解决中文问题,liunx 下中文路径,图片显示问题
		//fileName = UUID.randomUUID() + suffixName;
		File dest = new File(filePath + fileName);
		// 检测是否存在目录
		if (!dest.getParentFile().exists()) {
			dest.getParentFile().mkdirs();
		}
		try {
			file.transferTo(dest);
			r.setCode(1);
			r.setMsg("上传成功");
			return r;
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return r;
	}

	//多文件上传
	@RequestMapping(value = "/batch/upload", method = RequestMethod.POST)
	@ResponseBody
	public String handleFileUpload(HttpServletRequest request) {
		List<MultipartFile> files = ((MultipartHttpServletRequest) request)
				.getFiles("file");
		MultipartFile file = null;
		BufferedOutputStream stream = null;
		for (int i = 0; i < files.size(); ++i) {
			file = files.get(i);
			if (!file.isEmpty()) {
				try {
					byte[] bytes = file.getBytes();
					stream = new BufferedOutputStream(new FileOutputStream(
							new File(file.getOriginalFilename())));
					stream.write(bytes);
					stream.close();

				} catch (Exception e) {
					stream = null;
					return "You failed to upload " + i + " => "
							+ e.getMessage();
				}
			} else {
				return "You failed to upload " + i
						+ " because the file was empty.";
			}
		}
		return "upload successful";
	}

	public void init(){
		r.setCode(-1);
		r.setMsg("fail");
		r.setData(null);
		qMap.clear();
		rList.clear();
		backMap.clear();
	}
}

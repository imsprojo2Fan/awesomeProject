/*
Navicat MySQL Data Transfer

Source Server         : vultr
Source Server Version : 50722
Source Host           : 144.202.13.218:3306
Source Database       : awesome_project

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2018-07-31 21:03:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `collect`
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `openId` varchar(32) DEFAULT '' COMMENT '微信openId',
  `fId` int(16) DEFAULT '0' COMMENT '电影id',
  `mId` int(16) DEFAULT '0' COMMENT '歌曲Id',
  `pId` int(16) DEFAULT '0' COMMENT '图片id',
  `updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='收藏信息记录表';

-- ----------------------------
-- Records of collect
-- ----------------------------

-- ----------------------------
-- Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `fId` int(16) DEFAULT '0' COMMENT '电影id',
  `mId` int(16) DEFAULT '0' COMMENT '歌曲id',
  `pId` int(16) DEFAULT '0' COMMENT '图片id',
  `uid` int(16) DEFAULT '0' COMMENT '评论人id',
  `content` varchar(1024) DEFAULT '' COMMENT '评论内容',
  `zanCount` int(16) DEFAULT '0' COMMENT '评论赞数',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='评论表';

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for `feedback`
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` int(16) NOT NULL,
  `type` int(4) DEFAULT '0' COMMENT '反馈类型 0程序bug 1资源bug',
  `description` varchar(256) DEFAULT '' COMMENT '问题描述',
  `openId` varchar(32) DEFAULT '',
  `email` varchar(32) DEFAULT '',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='反馈信息记录表';

-- ----------------------------
-- Records of feedback
-- ----------------------------

-- ----------------------------
-- Table structure for `film`
-- ----------------------------
DROP TABLE IF EXISTS `film`;
CREATE TABLE `film` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT '' COMMENT '电影名',
  `director` varchar(256) DEFAULT '' COMMENT '导演',
  `actor` varchar(512) DEFAULT '' COMMENT '演员',
  `type` varchar(64) DEFAULT '' COMMENT '电影类型',
  `area` varchar(32) DEFAULT '' COMMENT '地区',
  `language` varchar(16) DEFAULT '' COMMENT '语言',
  `publish` varchar(32) DEFAULT '' COMMENT '上映日期',
  `length` varchar(32) DEFAULT '' COMMENT '片长',
  `imgSrc` varchar(256) DEFAULT '' COMMENT '图片地址',
  `videoSrc` varchar(512) DEFAULT '' COMMENT '视频地址',
  `description` varchar(1024) DEFAULT '' COMMENT '描述',
  `views` int(16) DEFAULT '0' COMMENT '观看数',
  `comments` int(16) DEFAULT '0' COMMENT '评论数',
  `collects` int(16) DEFAULT '0' COMMENT '收藏数',
  `likes` int(16) DEFAULT '0' COMMENT '点赞数',
  `updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='电影信息记录表';

-- ----------------------------
-- Records of film
-- ----------------------------

-- ----------------------------
-- Table structure for `operate_history`
-- ----------------------------
DROP TABLE IF EXISTS `operate_history`;
CREATE TABLE `operate_history` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `openId` varchar(32) DEFAULT '' COMMENT '微信openid',
  `filmId` int(16) DEFAULT '0' COMMENT '电影id',
  `musicId` int(16) DEFAULT '0' COMMENT '歌曲id',
  `picId` int(16) DEFAULT '0' COMMENT '图片id',
  `updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='操作历史记录表';

-- ----------------------------
-- Records of operate_history
-- ----------------------------

-- ----------------------------
-- Table structure for `reply`
-- ----------------------------
DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
  `id` int(16) NOT NULL,
  `commentId` int(16) DEFAULT '0' COMMENT '评论id',
  `fromUid` int(16) DEFAULT '0' COMMENT '回复人id',
  `toUid` int(16) DEFAULT '0' COMMENT '被回复人id',
  `replyMsg` varchar(1024) DEFAULT '' COMMENT '回复信息',
  `read` int(2) DEFAULT '0' COMMENT '0未读 1已读',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reply
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) DEFAULT NULL COMMENT 'uid',
  `account` varchar(32) DEFAULT NULL COMMENT '登录账号',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `type` int(4) DEFAULT '0' COMMENT '账户类型 0普通用户 1管理员',
  `name` varchar(32) DEFAULT NULL COMMENT '姓名',
  `birthday` varchar(16) DEFAULT '0' COMMENT '生日',
  `gender` tinyint(2) DEFAULT '0',
  `age` int(4) DEFAULT NULL COMMENT '年龄',
  `phone` varchar(16) DEFAULT NULL COMMENT '手机号',
  `email` varchar(32) DEFAULT NULL COMMENT '邮箱',
  `city` varchar(16) DEFAULT '' COMMENT '城市',
  `address` varchar(64) DEFAULT '' COMMENT '地址',
  `avatar` varchar(64) DEFAULT NULL COMMENT '头像存储路径',
  `signature` varchar(255) DEFAULT NULL COMMENT '个性签名',
  `signFrom` int(4) DEFAULT NULL COMMENT '注册方式 0前端注册 1后台添加',
  `isActivate` int(2) DEFAULT '0' COMMENT '是否激活账号',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '最后一次登录时间',
  `loginCount` int(16) DEFAULT '0' COMMENT '登录次数',
  `updated` datetime NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('34', '3d29f7e1-4777-4df4-9c31-3d3a066d2a0f', null, 'chengy', '0', null, null, '0', null, '18667363003', '582187611@qq.com', '', null, null, null, '0', '0', null, '1', '2018-06-27 15:24:04', '2018-06-27 15:23:58');
INSERT INTO `user` VALUES ('48', '161c68ac7120e59c9e2edb9d0cf77c04', 'imsprojo2Fan', 'd0a72b817e6c8cf6efaf55a443b84d80', '0', '饭饭', '1991-11-29', '1', '27', '13922305912', 'imsprojo2fan@foxmail.com', '厦门', '1342号', '', 'Everything will flow', '1', '1', '2018-07-31 17:44:24', '95', '2018-06-27 15:24:04', '2018-06-27 15:23:58');

-- ----------------------------
-- Table structure for `wishes`
-- ----------------------------
DROP TABLE IF EXISTS `wishes`;
CREATE TABLE `wishes` (
  `id` int(16) NOT NULL,
  `type` int(4) DEFAULT '0' COMMENT '资源类型 0电影 1歌曲 2电视剧',
  `name` varchar(32) DEFAULT '' COMMENT '资源名',
  `email` varchar(32) DEFAULT '' COMMENT 'email',
  `isFound` int(2) DEFAULT '0' COMMENT '资源是否已找到 0未完成 1已完成',
  `updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='心愿表';

-- ----------------------------
-- Records of wishes
-- ----------------------------

-- ----------------------------
-- Table structure for `wxinfo`
-- ----------------------------
DROP TABLE IF EXISTS `wxinfo`;
CREATE TABLE `wxinfo` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `openid` varchar(64) DEFAULT '' COMMENT '微信openid',
  `unionid` varchar(64) DEFAULT '' COMMENT '微信unionid',
  `nickName` varchar(128) DEFAULT '' COMMENT '微信昵称',
  `avatar` varchar(128) DEFAULT '' COMMENT '头像',
  `gender` int(4) DEFAULT '0' COMMENT '0未知 1男 2女',
  `country` varchar(16) DEFAULT '' COMMENT '国家',
  `province` varchar(16) DEFAULT '' COMMENT '省份',
  `city` varchar(16) DEFAULT '' COMMENT '城市',
  `updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微信信息记录表';

-- ----------------------------
-- Records of wxinfo
-- ----------------------------

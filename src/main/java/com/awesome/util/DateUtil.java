package com.awesome.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @author fangyy
 * @ClassName: DateUtil
 * @Description: 日期工具类
 */
public class DateUtil {

    public static String string2Date(String date, int i) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d = null;
        try {
            d = sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar calendar = Calendar.getInstance();
        // 把当前时间赋给日历
        calendar.setTime(d);
        // 设置为前一天
        calendar.add(Calendar.DAY_OF_MONTH, i);
        // 得到前一天的时间
        d = calendar.getTime();

        String defaultStartDate = sdf.format(d);

        return defaultStartDate;
    }

    public static String getStringDate() {
        Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateNowStr = sdf.format(d);
        return dateNowStr;

    }

    public static String string2Date(Date d) {

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateNowStr = sdf.format(d);
        return dateNowStr;

    }

    public static String getStringDate(Date d) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateNowStr = sdf.format(d);
        return dateNowStr;

    }

    /*
     * String转Date
     */

    public static Date str2Date(String str, String formatStr) {

        DateFormat format = new SimpleDateFormat(formatStr);
        Date date = null;
        try {
            date = format.parse(str.toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return date;
    }
    /*
     * String转Date
     */

    public static Date str2Date(String str) {

        SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", java.util.Locale.US);
        Date date = null;
        try {
            date = sdf.parse(str.toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return date;
    }

    public static String Mill2Time(long m) {

        Date date = new Date(m);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateStr = sdf.format(date);
        System.out.println("查询时间：" + dateStr + "------");
        return dateStr;
    }

    /**
     * 该方法用于比较两个用字符串表示的日期 param date1,date2 返回值为两个日期相差的天数
     */
    public static int compareDate(Date date1, Date date2) {
        // 被减数
        long minuend = 0L;
        // 减数
        long meiosis = 0L;
        if (date2.getTime() >= date1.getTime()) {
            minuend = date2.getTime();
            meiosis = date1.getTime();
        } else {
            minuend = date1.getTime();
            meiosis = date2.getTime();
        }
        int returnVal = (int) ((minuend - meiosis) / (1000 * 60 * 60 * 24));
        return returnVal;
    }

    /**
     * 获得指定日期的前一天
     *
     * @param specifiedDay
     * @return
     * @throws Exception
     */
    public static String getSpecifiedDayBefore(String specifiedDay) {// 可以用new
        // Date().toLocalString()传递参数
        Calendar c = Calendar.getInstance();
        Date date = null;
        try {
            date = new SimpleDateFormat("yy-MM-dd").parse(specifiedDay);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        c.setTime(date);
        int day = c.get(Calendar.DATE);
        c.set(Calendar.DATE, day - 1);

        String dayBefore = new SimpleDateFormat("yyyy-MM-dd").format(c.getTime());
        return dayBefore;
    }

    /**
     * 获得指定日期的后一天
     *
     * @param specifiedDay
     * @return
     */
    public static String getSpecifiedDayAfter(String specifiedDay) {
        Calendar c = Calendar.getInstance();
        Date date = null;
        try {
            date = new SimpleDateFormat("yy-MM-dd").parse(specifiedDay);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        c.setTime(date);
        int day = c.get(Calendar.DATE);
        c.set(Calendar.DATE, day + 1);

        String dayAfter = new SimpleDateFormat("yyyy-MM-dd").format(c.getTime());
        return dayAfter;
    }

    /*
     * 获取当前年月日
     */

    public static String getToday() {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String specifiedDay = sdf.format(date);
        return specifiedDay;
    }

    public static String getTime2Time(String s1, String s2) {
        String result = "";
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date d1 = df.parse(s1);
            Date d2 = df.parse(s2);
            // 这样得到的差值是微秒级别
            long diff = d2.getTime() - d1.getTime();
            long days = diff / (1000 * 60 * 60 * 24);
            long hours = (diff - days * (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
            long minutes = (diff - days * (1000 * 60 * 60 * 24) - hours * (1000 * 60 * 60)) / (1000 * 60);
            long seconds = (diff - days * (1000 * 60 * 60 * 24) - hours * (1000 * 60 * 60) - minutes * (1000 * 60))
                    / (1000);
            result = "" + days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
        } catch (Exception e) {
        }
        return result;
    }

    /**
     * 两个时间相差距离多少小时多少分多少秒
     *
     * @return String 返回值为：小时:分:秒
     */
    public static String getDistanceTime(Date date1, Date date2) {
        long time1 = date1.getTime();
        long time2 = date2.getTime();
        long diff;
        if (time1 < time2) {
            diff = time2 - time1;
        } else {
            diff = time1 - time2;
        }
        long day = diff / (24 * 60 * 60 * 1000);
        long hour = (diff / (60 * 60 * 1000) - day * 24);
        long min = ((diff / (60 * 1000)) - day * 24 * 60 - hour * 60);
        long sec = (diff / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60);
        return (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min) + ":"
                + (sec < 10 ? "0" + sec : sec);
    }

    public static Date string2Date(String str) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = sdf.parse(str.toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 将时间转换为时间戳
     */
    public static String dateToStamp(String s) throws ParseException {
        String res;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = simpleDateFormat.parse(s);
        long ts = date.getTime();
        res = String.valueOf(ts);
        return res;
    }

    /**
     * 将时间戳转换为时间
     */
    public static String stampToDate(String s) {
        String res;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        long lt = new Long(s);
        Date date = new Date(lt);
        res = simpleDateFormat.format(date);
        return res;
    }

    public static String getHoursTime(String time, int num) {
        String oneHoursAgoTime = "";
        Calendar cal = Calendar.getInstance();
        cal.setTime(str2Date(time, "yyyy-MM-dd HH:mm:ss"));
        cal.set(Calendar.HOUR_OF_DAY, cal.get(Calendar.HOUR_OF_DAY) + num);
        //当前月前一月
        // cal.set(Calendar. MONTH , Calendar. MONTH -1);
        // 获取到完整的时间
        oneHoursAgoTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(cal.getTime());
        return oneHoursAgoTime;
    }

    /**
     * 两个时间相差距离多少小时多少分多少秒
     *
     * @return String 返回值如：1小时1分1秒
     */
    public static String getDistance2Time(Date date1, Date date2) {
        long time1 = date1.getTime();
        long time2 = date2.getTime();
        long diff;
        if (time1 < time2) {
            diff = time2 - time1;
        } else {
            diff = time1 - time2;
        }
        long day = diff / (24 * 60 * 60 * 1000);
        long hour = (diff / (60 * 60 * 1000) - day * 24);
        long min = ((diff / (60 * 1000)) - day * 24 * 60 - hour * 60);
        long sec = (diff / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60);
        String result = "";
        if (day > 0) {
            result += day + "天";
        }
        if (hour > 0) {
            result += hour + "小时";
        }
        if (min > 0) {
            result += min + "分钟";
        }
        if (sec > 0) {
            result += sec + "秒";
        }
        return result;
    }

    /**
     * 秒转化为天小时分秒字符串
     *
     * @param seconds
     * @return String
     */
    public static String formatSeconds(long seconds) {
        String timeStr = seconds + "秒";
        if (seconds > 60) {
            long second = seconds % 60;
            long min = seconds / 60;
            timeStr = min + "分" + second + "秒";
            if (min > 60) {
                min = (seconds / 60) % 60;
                long hour = (seconds / 60) / 60;
                timeStr = hour + "小时" + min + "分" + second + "秒";
                if (hour > 24) {
                    hour = ((seconds / 60) / 60) % 24;
                    long day = (((seconds / 60) / 60) / 24);
                    timeStr = day + "天" + hour + "小时" + min + "分" + second + "秒";
                }
            }
        }
        return timeStr;
    }

    /**
     * 获取指定间隔时间点对应的时间
     *
     * @param startDate
     * @param endDate
     * @param minutes
     * @return
     */
    public static List<Date> getInterval(Date startDate, Date endDate, Long minutes) {
        List<Date> dates = new ArrayList<>();
        while (startDate.getTime() < endDate.getTime()) {
            dates.add(startDate);
            startDate = addMinute(startDate, minutes.intValue());
        }
        dates.add(endDate);
        return dates;
    }

    public static Date addMinute(Date date, int minute) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, minute);
        return calendar.getTime();
    }

    /**
     * 获取当前时间之前或之后几分钟 minute
     * @param date
     * @param minute
     * @return
     */
    public static Date getTimeByMinute(Date date, int minute) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, minute);
        return calendar.getTime();
    }

    /**
     * 获取过去第几天的日期
     *
     * @param past
     * @return
     */
    public static String getPastDate(int past) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) - past);
        Date today = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String result = format.format(today);
        return result;
    }

    /**
     * 获取未来 第 past 天的日期
     * @param past
     * @return
     */
    public static String getFetureDate(int past) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) + past);
        Date today = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String result = format.format(today);
        return result;
    }

    public static void main(String[]args){
        System.out.println(getSpecifiedDayAfter("2018-07-17"));
    }
}

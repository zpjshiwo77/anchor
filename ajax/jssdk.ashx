<%@ WebHandler Language="C#" Class="jssdk" %>

using System;
using System.Web;

public class jssdk : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {

        Json j = new Json();
        j["wfpUser"] = "ancharfuc";
        j["appKey"] = EasyTool.SHA512("ancharfuc" + "ancharfuc@pwd1227");
        j["Function"] = "GetOwnerJsApiTicket";
        j["unixtime"] = EasyTool.GetTimeStamp();
        j["APPID"] = "wxd211f54d29066a83";
        j["Dbhost"] = "Anchor";
        Json r = EasyTool.Request("http://fswechatmgmt.chinacloudsites.cn/api/JsApi/GetOwnerJsApiTicket", "POST", j).Replace("\n\r", "").Replace("\n", "").Replace("\r", "");
        context.Response.Write(JSSDKSign("wxd211f54d29066a83", context.Request["url"], r["Ticket"]));

    }

    public string JSSDKSign(string AppID, string Url, string Ticket)
    {
        if (string.IsNullOrEmpty(AppID)) throw new Exception("参数appid不能为空");

        string noncestr = EasyTool.GenerateRandom(8);
        string jsapi_ticket = Ticket;
        string timestamp = EasyTool.GetTimeStamp();
        string url = Url;
        string signature = EasyTool.SHA1("jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url);
        Json j = new Json();
        j["appid"] = AppID;
        j["timestamp"] = timestamp;
        j["noncestr"] = noncestr;
        j["signature"] = signature;
        return j.ToString();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}
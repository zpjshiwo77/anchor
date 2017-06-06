<%@ WebHandler Language="C#" Class="appkey" %>

using System;
using System.Web;

public class appkey : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {

        Json j = new Json();
        j["wfpUser"] = "ancharfuc";
        j["appKey"] = EasyTool.SHA512("ancharfuc" + "ancharfuc@pwd1227");
        j["unixtime"] = EasyTool.GetTimeStamp();
        context.Response.Write(j);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;

    public static class EasyTool
    {
        public static string Request(string Address, string Method = "GET", string Data = "")
        {
            using (WebClient wc = new WebClient())
            {
                if (Method == "POST")
                {
                    //wc.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                    wc.Headers.Add("Content-Type", "Application/json");
                    return Encoding.UTF8.GetString(wc.UploadData(Address, Method, System.Text.Encoding.UTF8.GetBytes(Data)));
                }
                else
                {
                    wc.Encoding = Encoding.UTF8;
                    return wc.DownloadString(Address + "?" + Data);
                }
            }
        }
        public static void RequestAsync(string Address, string Method = "GET", string Data = "")
        {
            using (WebClient wc = new WebClient())
            {
                if (Method == "POST")
                {
                    wc.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                    wc.UploadDataAsync(new Uri(Address), Method, System.Text.Encoding.UTF8.GetBytes(Data));
                }
                else
                {
                    wc.Encoding = Encoding.UTF8;
                    wc.DownloadStringAsync(new Uri(Address + "?" + Data));
                }
            }
        }
        public static string MD5(string str)
        {
            StringBuilder sb = new StringBuilder(32);
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] t = md5.ComputeHash(Encoding.UTF8.GetBytes(str));
            for (int i = 0; i < t.Length; i++)
            {
                sb.Append(t[i].ToString("x").PadLeft(2, '0'));
            }
            return sb.ToString();
        }

        public static string SHA1(string str)
        {
            return BitConverter.ToString(System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.Default.GetBytes(str))).Replace("-", "").ToLower();
        }

        public static string SHA512(string strData)
        {
            byte[] bytValue = System.Text.Encoding.UTF8.GetBytes(strData);
            SHA512 sha512 = new SHA512CryptoServiceProvider();
            byte[] retVal = sha512.ComputeHash(bytValue);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < retVal.Length; i++)
            {
                sb.Append(retVal[i].ToString("x2"));
            }
            return sb.ToString();
        }

        public static string IP()
        {
            return HttpContext.Current.Request.UserHostAddress;
        }
        public static void Log(string text, string path = "all", string filename = "")
        {
            path = AppDomain.CurrentDomain.BaseDirectory + "\\log\\" + path + "\\";
            filename = DateTime.Now.ToString("yyyy-MM-dd") + filename;
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);

            FileStream fs = new FileStream(path + filename + ".txt", FileMode.Append);
            StreamWriter sw = new StreamWriter(fs, Encoding.Default);
            sw.WriteLine(DateTime.Now + " " + text);
            sw.Close();
            fs.Close();
        }

        public static string GetTimeStamp()
        {
            return ((DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000000).ToString("f0");
        }
        public static DateTime GetDate(long TimeStamp)
        {
            return new DateTime(1970, 1, 1, 8, 0, 0).AddSeconds(TimeStamp);
        }

        public static int GetLength(string s)
        {
            return Encoding.Default.GetByteCount(s);
        }

        private static char[] c = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
        public static string GenerateRandom(int Length)
        {
            StringBuilder random = new StringBuilder(35);
            Random rd = new Random();
            for (int i = 0; i < Length; i++)
            {
                random.Append(c[rd.Next(35)]);
            }
            return random.ToString();
        }
    }
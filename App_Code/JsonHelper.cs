using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Collections;
using System.Text;
using System.Data;
using System.Reflection;
using System.Text.RegularExpressions;

using System.Runtime.Serialization.Json;

    /// <summary>
    /// JsonHelper 的摘要说明  .net 4.0 需引用 System.Runtime.Serialization  System.Web.Extensions
    /// </summary>
    public static class JsonHelper
    {
        #region To Get<T> 新方式自定义的Json 类 DataTable 转换方式 易用性 与 效率 远胜原有的转换方式
        /// <summary>
        /// 转换DataTable为JSON格式数据  
        /// </summary>
        /// <param name="dt">DataTable</param>
        /// <returns>JSON格式数据</returns>
        public static string To(DataTable dt)
        {
            StringBuilder s = new StringBuilder();
            s.Append("[");
            foreach (DataRow dr in dt.Rows)
            {
                s.Append("{");
                foreach (DataColumn dc in dt.Columns)
                {
                    s.AppendFormat("\"{0}\":{1}", dc.ColumnName, ValueToJson(dr[dc]));
                    s.Append(",");
                }
                s.Remove(s.Length - 1, 1).Append("}");
            }
            s.Append("]");
            return s.ToString();
        }

        /// <summary>
        /// 转换对象为JSON格式数据
        /// </summary>
        /// <param name="obj">对象</param>
        /// <returns>JSON格式数据</returns>
        public static string To(object o)
        {
            if (o.GetType().IsGenericType)
            {
                return ArrayToJson(o);
            }
            else
            {
                return ModelToJson(o);
            }
        }



        public static T Get<T>(string json) where T : new()
        {
            if (typeof(T).IsGenericType)
            {
                return JsonToArray<T>(json);
            }
            else
            {
                return JsonToModel<T>(json);
            }
        }

        #endregion

        #region 新方式使用 private

        private static string ValueToJson(object v)
        {
            if (v == null) return "null";
            else if (typeof(string) == v.GetType()) return string.Format("\"{0}\"", v.ToString().Replace("\"", "\\\""));
            else if (typeof(DateTime) == v.GetType()) return GetTimeStamp(v);
            else if (typeof(bool) == v.GetType()) return v.ToString().ToLower();
            else if (IsType(v)) return v.ToString();
            return string.Format("\"{0}\"", v);
        }
        private static bool IsType(object v)
        {
            Type t = v.GetType();
            return typeof(int) == t || typeof(decimal) == t || typeof(double) == t || typeof(float) == t || typeof(decimal) == t || typeof(decimal) == t;
        }
        private static object JsonToValue(object v, Type t)
        {
            if (v == null) return null;
            else if (typeof(DateTime) == t) return GetDateTime(long.Parse(v.ToString())); //Js 可直接使用的时间戳 注：实际的时间戳去除三个零
            else if (typeof(string) == t) return v.ToString();
            return Convert.ChangeType(v.ToString(), t);
        }
        private static string GetTimeStamp(object dt)
        {
            return ((((DateTime)dt).ToUniversalTime().Ticks - 621355968000000000) / 10000).ToString("f0");
        }
        public static DateTime GetDateTime(long l)
        {
            return TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)).Add(new TimeSpan(l * 10000));
        }
        private static string ArrayToJson(object o)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("[");
            var ol = o as IEnumerable;
            foreach (object x in ol)
            {
                sb.Append(string.Format(",{0}", ModelToJson(x)));
            }
            if (sb.Length > 1) sb.Remove(1, 1);
            sb.Append("]");
            return sb.ToString();
        }
        private static string ModelToJson(object o)
        {
            Type t = o.GetType();
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            FieldInfo[] fil = t.GetFields();
            foreach (FieldInfo fi in fil)
            {
                sb.AppendFormat(",\"{0}\":{1}", fi.Name, ValueToJson(fi.GetValue(o)));
            }
            PropertyInfo[] pil = t.GetProperties();
            foreach (PropertyInfo pi in pil)
            {
                sb.AppendFormat(",\"{0}\":{1}", pi.Name, ValueToJson(pi.GetValue(o, null)));
            }
            if (sb.Length > 1) sb.Remove(1, 1);
            sb.Append("}");
            return sb.ToString();
        }
        private static T JsonToArray<T>(Json l) where T : new()
        {
            T t = new T();
            var list = new T() as ArrayList;
            for (int i = 0; i < l.Count; i++)
            {
                list.Add(JsonToModel<T>(l[i]));
            }
            return t;
        }
        private static T JsonToModel<T>(Json j) where T : new()
        {
            T model = new T();
            FieldInfo[] fil = model.GetType().GetFields();
            foreach (FieldInfo fi in fil)
            {
                fi.SetValue(model, JsonToValue(j[fi.Name], fi.FieldType));
            }
            PropertyInfo[] pil = model.GetType().GetProperties();
            foreach (PropertyInfo pi in pil)
            {
                pi.SetValue(model, JsonToValue(j[pi.Name], pi.PropertyType), null);
            }
            return model;
        }

        #endregion


        #region ToJson T GetT<T> 原始转换方式
        /// <summary>
        /// 转换DataTable为JSON格式数据  转换结果与List<T>保持一致
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static string ToJson(DataTable dt)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            ArrayList al = new ArrayList();
            foreach (DataRow dr in dt.Rows)
            {
                Dictionary<string, object> info = new Dictionary<string, object>();
                foreach (DataColumn dc in dt.Columns)
                {
                    info.Add(dc.ColumnName, dr[dc]);
                }
                al.Add(info);
            }
            return jss.Serialize(al); ;
        }
        /// <summary>
        /// 转换对象为JSON格式数据   js读取DateTime类型方式： new Date(parseInt('/Date(1433820938220)/'.slice(6, 19)));
        /// </summary>
        /// <param name="obj">对象</param>
        /// <returns>JSON格式数据</returns>
        public static string ToJson(object obj)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            return jss.Serialize(obj);
        }
        /// <summary>
        /// JSON格式字符转换为T类型的对象
        /// </summary>
        /// <typeparam name="T">类</typeparam>
        /// <param name="json">JSON格式数据</param>
        /// <returns>对象</returns>
        public static T GetT<T>(string json)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            T o = jss.Deserialize<T>(json);
            return LocalTime<T>(o);
        }

        /// <summary>
        /// 修复 Json 转类型后没有将UTC时间 转换成 本地时间 的BUG
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="o"></param>
        /// <returns></returns>
        private static T LocalTime<T>(T o)
        {
            Type t = o.GetType();
            Type dt = typeof(DateTime);
            if (t.IsGenericType)
            {
                foreach (object x in (o as IEnumerable))
                {
                    LocalTime<object>(x);
                }
                return o;
            }
            else
            {
                PropertyInfo[] pil = t.GetProperties();
                foreach (PropertyInfo pi in pil)
                {
                    if (pi.PropertyType == dt)
                    {
                        pi.SetValue(o, ((DateTime)pi.GetValue(o, null)).ToLocalTime(), null);
                    }
                }
                return o;
            }
        }

        #endregion
    }

    public class Json
    {
        private object o;

        private Dictionary<string, object> d;
        private ArrayList l;

        private static Regex reg_json = new Regex("^{.*}$");
        private static Regex reg_list = new Regex(@"^\[.*\]$");
        private static JavaScriptSerializer jss = new JavaScriptSerializer();

        public Json() { }
        public Json(string json)
        {
            if (reg_json.IsMatch(json))
                o = jss.Deserialize<Dictionary<string, object>>(json);
            else if (reg_list.IsMatch(json))
                o = jss.Deserialize<ArrayList>(json);
            else
                o = json;
        }
        public Json(object o)
        {
            this.o = o;
        }
        public Json this[string key]
        {
            get
            {
                d = (Dictionary<string, object>)o;
                if (d != null && d.ContainsKey(key) && d[key] != null)
                    return new Json(d[key]);
                else
                    return null;
            }
            set
            {
                if (o == null) o = jss.Deserialize<object>("{}");
                d = (Dictionary<string, object>)o;
                if (value == null)
                    d.Remove(key);
                else
                    d[key] = value.o;
            }
        }

        public Json this[int index]
        {
            get
            {
                if (o != null)
                {
                    if (o.GetType() == typeof(ArrayList))
                    {
                        l = (ArrayList)o;
                        if (l.Count > index)
                            return new Json(l[index]);
                        else
                            return null;
                    }
                    else
                    {
                        d = (Dictionary<string, object>)o;
                        if (d.Count > index)
                            return new Json(d.ElementAt(index).Value);
                        else
                            return null;
                    }
                }
                else
                    return null;
            }
            set
            {
                if (o.GetType() == typeof(ArrayList))
                {
                    l = (ArrayList)o;
                    if (l.Count > index)
                        l[index] = value;
                }
                else
                {
                    d = (Dictionary<string, object>)o;
                    if (d.Count > index)
                    {
                        string key = d.ElementAt(index).Key;
                        if (value == null)
                            d.Remove(key);
                        else
                            d[key] = value;
                    }
                }
            }
        }

        public void Add(string json)
        {
            if (o == null) o = jss.Deserialize<ArrayList>("[]");
            l = (ArrayList)o;
            l.Add(jss.Deserialize<object>(json));
        }

        public int Count
        {
            get
            {
                if (o != null)
                {
                    if (o.GetType() == typeof(ArrayList))
                    {
                        return ((ArrayList)o).Count;
                    }
                    else
                    {
                        return ((Dictionary<string, object>)o).Count;
                    }
                }
                else
                    return 0;
            }
        }


        public override string ToString()
        {
            if (o != null)
            {
                Type t = o.GetType();
                if (t == typeof(ArrayList))
                    return jss.Serialize(o);
                else if (t == typeof(Dictionary<string, object>))
                    return jss.Serialize(o);
                else
                    return o.ToString();
            }
            else
                return string.Empty;
        }
        public static implicit operator string(Json j)
        {
            if (j == null)
                return string.Empty;
            else
                return j.ToString();
        }
        public static implicit operator Json(string s)
        {
            return new Json(s);
        }
        public static implicit operator Json(DateTime dt)
        {
            return new Json(dt);
        }
        public static implicit operator Json(bool b)
        {
            return new Json(b);
        }
        public static implicit operator Json(int i)
        {
            return new Json(i);
        }

    }

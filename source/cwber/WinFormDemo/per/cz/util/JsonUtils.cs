using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Web.Script.Serialization;

namespace per.cz.util
{
    public static class JsonUtils
    {
        public static string ToJson(Object source)
        {
            if (source == null) return string.Empty;

            
                JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
                //执行序列化
                return jsonSerializer.Serialize(source);
        }
        public static T FromJson<T>(this String str) where T : new()
        {
            if (str == null)
            {
                return new T();
            }
            else
            {
                string ss = str.Trim().Replace(Environment.NewLine, "");
                if (ss.StartsWith("[") == false && ss.StartsWith("{") == false)
                {
                    str = "{" + str + "}";
                }
            }

            if (str[0] == '[')
            {
                JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
                return jsonSerializer.Deserialize<T>(str);
            }
            Type type = typeof(T);
            var nvType = typeof(NameValueCollection);
            if (type == nvType || type.IsSubclassOf(nvType))
            {
                JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
                var dict = jsonSerializer.Deserialize<Dictionary<string, string>>(str);

                NameValueCollection nv = new NameValueCollection();
                if (dict == null) return new T();
                foreach (var item in dict)
                {
                    nv[item.Key] = item.Value;
                }
                return (T)(object)nv;
            }
            else
            {
                JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
                return jsonSerializer.Deserialize<T>(str);
            }
        }
        public static Dictionary<string, object> JsonToDictionary(string jsonData)
        {
            //实例化JavaScriptSerializer类的新实例
            JavaScriptSerializer jss = new JavaScriptSerializer();
            try
            {
                //将指定的 JSON 字符串转换为 Dictionary<string, object> 类型的对象
                return jss.Deserialize<Dictionary<string, object>>(jsonData);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static T[] Json2Array<T>(this string str)
        {
            if (str == null)
            {
                return new T[0];
            }
            else
            {
                string ss = str.Trim().Replace(Environment.NewLine, "");
                if (ss.StartsWith("[") == false && ss.StartsWith("{") == false)
                {
                    str = "{" + str + "}";
                }
            }

            JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
            return jsonSerializer.Deserialize<T[]>(str);
        }
    }
}

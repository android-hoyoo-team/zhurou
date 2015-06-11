using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
//using System.Runtime.Serialization.Json;
using System.Configuration;
using System.IO;
using System.Web.Script.Serialization;
using System.Net;
using per.cz.bean;
using System.Collections;
using System.Collections.Specialized;

namespace per.cz.util
{
    public class Utils
    {


        public static NameValueCollection DictionaryToNameValueCollection(Dictionary<string, Object> dic)
        {

            NameValueCollection nc = null;
            if (dic != null)
            {
                nc=new NameValueCollection();
               // Dictionary<string,object > dic=new Dictionary<string,object>();
                //nv.ToDictionary();
                foreach (var item in dic)
                {
                   nc[item.Key] = item.Value.ToString();
                }
            }
            return nc;
        }
        //public static Object  ExeJavaScript(WebBrowser brower,string js,Object[] args)
        //{
        //    return brower.InvokeScript(js, args);
        //}
    }
}

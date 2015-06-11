using per.cz.bean;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace per.cz.util
{
    public class HttpUtils
    {
        public static string http_get(string url)
        {
            Console.WriteLine(url);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            WebResponse response = request.GetResponse();
            StringBuilder sb = new StringBuilder();
            using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            {
                while (reader.Peek() != -1)
                {
                    sb.AppendLine(reader.ReadLine());
                    Console.WriteLine(reader.ReadLine());
                }
            }
            return sb.ToString();
        }

        /// <summary>  
        /// 创建POST方式的HTTP请求  
        /// </summary>  
        /// <param name="url">请求的URL</param>  
        /// <param name="parameters">随同请求POST的参数名称及参数值字典</param>  
        /// <param name="timeout">请求的超时时间</param>  
        /// <param name="userAgent">请求的客户端浏览器信息，可以为空</param>  
        /// <param name="requestEncoding">发送HTTP请求时所用的编码</param>  
        /// <param name="cookies">随同HTTP请求发送的Cookie信息，如果不需要身份验证可以为空</param>  
        /// <returns></returns>  
        /*
             requestEncoding
             method
             userAgent
             contentType
             accept
             timeout
             data
              
             
             */
        public static Result<string> http_string_response(string jsonParam, CookieCollection cookies)
        {

            Result<string> res = new Result<string>();
            Result<object> hres = http(jsonParam, cookies);
            if (!hres.status.Equals("success"))
            {
                res.message = hres.message;
                res.status = hres.status;
                return res;
            }
            return _get_result_from_response(hres.result as HttpWebResponse);
          
            //string cookieString = response.Headers["Set-Cookie"];
            //Console.WriteLine(response.Headers["Content-Type"]);
            // Console.WriteLine(response.StatusCode);
            
           
            // Console.WriteLine(10);

          
            //return request.GetResponse() as HttpWebResponse;
        }
        public static Result<Object> http(string jsonParam, CookieCollection cookies)
        {
            //string url, IDictionary<string, string> parameters, int? timeout, string userAgent, Encoding requestEncoding, CookieCollection cookies
            Result<Object> res = new Result<Object>();
            try
            {
                Console.WriteLine("jsonParam:" + jsonParam);
                //Result res = new Result();
                string method = "GET";
                string url = null;
                Encoding requestEncoding = Encoding.GetEncoding("utf-8");
                // Encoding responseEncoding = Encoding.GetEncoding("utf-8"); 
                string contentType = "application/json";//application/x-www-form-urlencoded
                string accept = "application/json";
                string userAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
                int? timeout = 2000;
                IDictionary<string, object> data = null;
                Dictionary<string, Object> p = null;
                try
                {
                    p = JsonUtils.FromJson<Dictionary<string, Object>>(jsonParam);
                }
                catch (Exception ex)
                {
                    res.message = ex.Message;
                    res.status = "error";
                    res.result = ex.StackTrace;
                    return res;
                }
                if (!p.ContainsKey("url") || p["url"] == null || string.IsNullOrEmpty(p["url"].ToString()))
                {
                    res.status = "error_url_null";
                    res.message = "url is not allow null";
                    return res;
                    //throw new ArgumentNullException("url");
                }
                Console.WriteLine("url" + p["url"]);
                url = p["url"].ToString();
                /*
                 requestEncoding
                 method
                 userAgent
                 contentType
                 accept
                 timeout
                 data
              
             
                 */
                if (p.ContainsKey("requestEncoding") && p["requestEncoding"] != null)
                {
                    requestEncoding = Encoding.GetEncoding(p["requestEncoding"].ToString());
                }
                if (p.ContainsKey("method") && p["method"] != null)
                {
                    method = p["method"].ToString();
                }
                if (p.ContainsKey("contentType") && p["contentType"] != null)
                {
                    contentType = p["contentType"].ToString();
                }
                if (p.ContainsKey("accept") && p["accept"] != null)
                {
                    accept = p["accept"].ToString();
                }
                if (p.ContainsKey("userAgent") && p["userAgent"] != null && !string.IsNullOrEmpty(p["userAgent"].ToString().Trim()))
                {
                    userAgent = p["userAgent"].ToString();
                }
                if (p.ContainsKey("timeout") && p["timeout"] != null && !string.IsNullOrEmpty(p["timeout"].ToString().Trim()))
                {
                    timeout = Convert.ToInt32(p["timeout"].ToString());
                }
                if (p.ContainsKey("data") && p["data"] != null)
                {
                    data = ((Dictionary<string, Object>)p["data"]);
                }

                HttpWebRequest request = null;
                //如果是发送HTTPS请求  
                if (url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
                {
                    ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(CheckValidationResult);
                    request = WebRequest.Create(url) as HttpWebRequest;
                    request.ProtocolVersion = HttpVersion.Version10;
                }
                else
                {
                    request = WebRequest.Create(url) as HttpWebRequest;
                }
                request.Method = method;
                request.ContentType = contentType;
                request.Accept = accept;
                request.UserAgent = userAgent;
                Console.Write(timeout.Value);
                request.Timeout = timeout.Value;
                if (cookies != null)
                {
                    request.CookieContainer = new CookieContainer();
                    request.CookieContainer.Add(cookies);
                }
                //如果需要POST数据  
                StringBuilder buffer = new StringBuilder();
                if (!(data == null || data.Count == 0))
                {

                    if (contentType.Trim().ToLower().Equals("application/json"))
                    {
                        //int i = 0;
                        buffer.Append(JsonUtils.ToJson(data));
                    }
                    else
                    {
                        int i = 0;
                        foreach (string key in data.Keys)
                        {

                            if (i > 0)
                            {
                                buffer.AppendFormat("&{0}={1}", key, data[key]);
                            }
                            else
                            {
                                buffer.AppendFormat("{0}={1}", key, data[key]);
                            }
                            i++;


                        }

                    }
                    Console.WriteLine(buffer.ToString());
                    byte[] _data = requestEncoding.GetBytes(buffer.ToString());
                    using (Stream stream = request.GetRequestStream())
                    {
                        stream.Write(_data, 0, _data.Length);
                    }
                }

                WebResponse response = null; ;
                try
                {
                    response = request.GetResponse() as WebResponse;
                }
                catch (WebException ex)
                {
                    response = (WebResponse)ex.Response;
                }
                res.status = "success";
                res.message = "url is not allow null";
                res.result = response;
                return res;
                // return response;
            }
            catch (Exception ex)
            {
                res.message = ex.Message;
                res.status = "error";
                res.result = ex.StackTrace;
                return res;
            }
           
        }
        public static Result<string> http_string_response(string method, string url, string data, CookieCollection cookies)
        {

            Result<string> res = new Result<string>();
            Result<object> hres = http(method, url, data, cookies);
            if (!hres.status.Equals("success"))
            {
                res.message = hres.message;
                res.status = hres.status;
                return res;
            }
            return _get_result_from_response(hres.result as HttpWebResponse);
            // Console.WriteLine(10);
        }
        private static Result<string> _get_result_from_response(HttpWebResponse response)
        {
            Result<string> res = new Result<string>();
            //string cookieString = response.Headers["Set-Cookie"];
            //Console.WriteLine(response.Headers["Content-Type"]);
            // Console.WriteLine(response.StatusCode);
            StringBuilder sb = new StringBuilder();
            try
            {

                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    while (reader.Peek() != -1)
                    {
                        sb.AppendLine(reader.ReadLine());
                        //Console.WriteLine(reader.ReadLine());
                    }
                    WebHeaderCollection webHeaders = response.Headers;
                    Dictionary<string, string> headers = new Dictionary<string, string>();
                    for (var i = 0; i < webHeaders.AllKeys.Length; i++)
                    {
                        headers.Add(webHeaders.AllKeys[i], response.GetResponseHeader(webHeaders.AllKeys[i]));
                    }
                    res.message = response.StatusCode.ToString();
                    res.status = (int)response.StatusCode;
                    Console.WriteLine(sb.ToString());
                    res.result = sb.ToString().Trim();//.Replace("\"","\\\"");
                    if (headers.Count > 0)
                        res.header = headers;
                    return res;
                }
            }
            catch (Exception ex)
            {
                res.message = ex.Message;
                res.status = "error";
                res.result = ex.StackTrace;
                return res;
            }
        }
        public static Result<string> http_string_response(string method, string url, IDictionary<string, object> data , CookieCollection cookies)
        {

            Result<string> res = new Result<string>();
            Result<object> hres = http(method, url, data,cookies);
            if (!hres.status.Equals("success"))
            {
                res.message = hres.message;
                res.status = hres.status;
                return res;
            }

            return _get_result_from_response(hres.result as HttpWebResponse);
            // Console.WriteLine(10);


            //return request.GetResponse() as HttpWebResponse;
        }
        public static Result<Object> http(string method, string url, IDictionary<string, object> data ,CookieCollection cookies)
        {
            Result<Object> res = new Result<Object>();

            Encoding requestEncoding = Encoding.GetEncoding("utf-8");
            // Encoding responseEncoding = Encoding.GetEncoding("utf-8"); 
            string contentType = "application/json";//application/x-www-form-urlencoded
            string accept = "application/json";
            string userAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
            int? timeout = 2000;
            //IDictionary<string, object> data = null;
            HttpWebRequest request = null;
            try{
                //如果是发送HTTPS请求  
                if (url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
                {
                    ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(CheckValidationResult);
                    request = WebRequest.Create(url) as HttpWebRequest;
                    request.ProtocolVersion = HttpVersion.Version10;
                }
                else
                {
                    request = WebRequest.Create(url) as HttpWebRequest;
                }
                request.Method = method;
                request.ContentType = contentType;
                request.Accept = accept;
                request.UserAgent = userAgent;
                request.Timeout = timeout.Value;
                if (cookies != null)
                {
                    request.CookieContainer = new CookieContainer();
                    request.CookieContainer.Add(cookies);
                }
                //如果需要POST数据  
                StringBuilder buffer = new StringBuilder();
                if (!(data == null || data.Count == 0))
                {

                    if (contentType.Trim().ToLower().Equals("application/json"))
                    {
                        //int i = 0;
                        buffer.Append(JsonUtils.ToJson(data));
                    }
                    else
                    {
                        int i = 0;
                        foreach (string key in data.Keys)
                        {

                            if (i > 0)
                            {
                                buffer.AppendFormat("&{0}={1}", key, data[key]);
                            }
                            else
                            {
                                buffer.AppendFormat("{0}={1}", key, data[key]);
                            }
                            i++;


                        }

                    }
                    Console.WriteLine(buffer.ToString());
                    byte[] _data = requestEncoding.GetBytes(buffer.ToString());
                    using (Stream stream = request.GetRequestStream())
                    {
                        stream.Write(_data, 0, _data.Length);
                    }
                }

                WebResponse response = null; ;
                try
                {
                    response = request.GetResponse() as WebResponse;
                }
                catch (WebException ex)
                {
                    response = (WebResponse)ex.Response;
                }
                res.status = "success";
                res.result = response;
                return res;
                // return response;
            }
            catch (Exception ex)
            {
                res.message = ex.Message;
                res.status = "error";
                res.result = ex.StackTrace;
                return res;
            }
        }
        public static Result<Object> http(string method, string url, string data, CookieCollection cookies)
        {
            Result<Object> res = new Result<Object>();

            Encoding requestEncoding = Encoding.GetEncoding("utf-8");
            // Encoding responseEncoding = Encoding.GetEncoding("utf-8"); 
            string contentType = "application/json";//application/x-www-form-urlencoded
            string accept = "application/json";
            string userAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
            int? timeout = 2000;
            //IDictionary<string, object> data = null;
            HttpWebRequest request = null;
            try
            {
                //如果是发送HTTPS请求  
                if (url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
                {
                    ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(CheckValidationResult);
                    request = WebRequest.Create(url) as HttpWebRequest;
                    request.ProtocolVersion = HttpVersion.Version10;
                }
                else
                {
                    request = WebRequest.Create(url) as HttpWebRequest;
                }
                request.Method = method;
                request.ContentType = contentType;
                request.Accept = accept;
                request.UserAgent = userAgent;
                request.Timeout = timeout.Value;
                if (cookies != null)
                {
                    request.CookieContainer = new CookieContainer();
                    request.CookieContainer.Add(cookies);
                }
                //如果需要POST数据  
                StringBuilder buffer = new StringBuilder();
                if (data != null &&!data.ToString().Trim().Equals(""))
                {
                    buffer.Append(data);
                    Console.WriteLine(buffer.ToString());
                    byte[] _data = requestEncoding.GetBytes(buffer.ToString());
                    using (Stream stream = request.GetRequestStream())
                    {
                        stream.Write(_data, 0, _data.Length);
                    }
                }

                WebResponse response = null; ;
                try
                {
                    response = request.GetResponse() as WebResponse;
                }
                catch (WebException ex)
                {
                    response = (WebResponse)ex.Response;
                }
                res.status = "success";
                res.result = response;
                return res;
                // return response;
            }
            catch (Exception ex)
            {
                res.message = ex.Message;
                res.status = "error";
                res.result = ex.StackTrace;
                return res;
            }
        }
        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {
            return true; //总是接受  
        }
        public static string uploadFile(string serverUrl, string localFile, string new_file_name, string dir_name)
        {
            System.Net.WebClient myWebClient = new System.Net.WebClient();
            // myWebClient.Encoding = Encoding.GetEncoding("gb2312");
            //myWebClient.Encoding = System.Text.Encoding.Unicode;
            myWebClient.QueryString["new_file_name"] = new_file_name;
            if (dir_name != null &&! dir_name.Trim().ToString().Equals(""))
                myWebClient.QueryString["dir_name"] = dir_name;
            // myWebClient.QueryString["Encoding"] = "utf-8";
            // myWebClient.QueryString["Encoding1"] = "哈哈";
            // myWebClient.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
            try
            {
                byte[] responseArray = myWebClient.UploadFile(serverUrl, "POST", localFile);
                return Encoding.GetEncoding("utf-8").GetString(responseArray);
            }
            catch (Exception ex)
            {
                return "error";
            }

        }
        /*
        * {
        *  type:'post',//可选get
           url:'action.php',//这里是接收数据的PHP程序
           data:'data='dsa'',//传给PHP的数据，多个参数用&连接
           dataType:'text',//服务器返回的数据类型 可选XML ,Json jsonp script html text等
        * 
        * }
        */

        public static string downloadFile(string serverUrl, string localFile)
        {
            System.Net.WebClient myWebClient = new System.Net.WebClient();
            try
            {
                myWebClient.DownloadFile(serverUrl, localFile);
                return "success";
            }
            catch (Exception ex)
            {
                return "error";
            }

        }
    }
}

using per.cz.bean;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace per.cz.util
{
    class ExcelExport
    {
        private string header = null;

        private const string STYLE = "<style type=\"text/css\">" +
                                       ".spercent" +
                                       " {" +
                                       "   background-color:#ffff99;" +
                                       "   mso-number-format:0.00%;" +
                                       " }" +
                                        ".sId" +
                                       " {" +
                                       "   background-color:#ff6633;" +
                                       "   mso-number-format:0;" +
                                       " }" +
                                        ".sName" +
                                       " {" +
                                       "     color:red;" +
                                       " }" +
                                        ".sValue" +
                                       " {" +
                                       "   color:blue;" +
                                       "   mso-number-format:0;" +
                                       " }" +
                                       "</style>";


        public static  string getExcelHeader(Dictionary<string, Object> p)
        {
            /*
             * <tr>
<th>ID</th>
<th>Name</th>
<th>Value</th>
<th>Percent</th>
<tr>
             */
            string excelHeader = null;
            ArrayList headers = null;
            if (p.ContainsKey("headers"))
            {
                headers = (ArrayList)(p["headers"]);
                excelHeader = "<tr>";
            }
            if (headers != null)
            {
                for (int i = 0; i < headers.Count; i++)
                    excelHeader += "<th>" + headers[i] + "</th>";
            }
            if (excelHeader != null)
            {
                excelHeader += "</tr>";
            }
            return excelHeader;
        }
        public static string getHtmlMeta(Dictionary<string, Object> p)
        {
            string setting="";
            string charset = "utf-8";
            if (p.ContainsKey("charset"))
            {
                charset = (string)(p["charset"]);
            }
           setting= "<meta http-equiv=Content-Type content=\"text/html; charset=\"" + charset + "\">";
            return setting;
        }
        public static string getHtmlHeader(Dictionary<string, Object> p)
        {
            string header = "<head>" + getExcelSetting (p)+ "</head>";
            return header;
        }
        public static StringBuilder getExcelData(Dictionary<string, Object> p)
        {
            ArrayList data = null;
            StringBuilder dataSB = null;
            if (p.ContainsKey("excel_data"))
            {
                data = (ArrayList)(p["excel_data"]);
                dataSB = new StringBuilder();
                for (int i = 0; i < data.Count; i++)
                {
                    ArrayList _data = (ArrayList)(data[i]);
                   dataSB.Append("<tr>");
                    for (int j = 0; j < _data.Count; j++)
                    {
                        dataSB.Append("<td>");
                        dataSB.Append(_data[j]);
                        dataSB.Append("</td>");
                    }
                    dataSB.Append("</tr>");
                    
                }
            }
            
            return dataSB;
        }
        public static  string getExcelSetting(Dictionary<string, Object> p)
        {
            string sheet_name = "sheet";
            if (p.ContainsKey("sheet_name"))
            {
                sheet_name  = (string)(p["sheet_name"]);
            }
            
           
            string header =        "<!--[if gte mso 9]><xml>" +
                                           "<x:ExcelWorkbook>" +
                                               "<x:ExcelWorksheets>" +
                                                   "<x:ExcelWorksheet>" +
                                                       "<x:Name>" + sheet_name + "</x:Name>" +
                                                       "<x:WorksheetOptions>" +
                                                           "<x:Print>" +
                                                               "<x:ValidPrinterInfo />" +
                                                           "</x:Print>" +
                                                       "</x:WorksheetOptions>" +
                                                   "</x:ExcelWorksheet>" +
                                               "</x:ExcelWorksheets>" +
                                           "</x:ExcelWorkbook>" +
                                       "</xml>" +
                                       "<![endif]-->";
            return header;
           
        }
        public static Result<string>  export(Dictionary<string, Object> p)
        {
            Result<string> res = new Result<string>();
            StringBuilder ex = new StringBuilder();
            ex.Append("<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\">");
            ex.Append(getHtmlMeta(p));
            ex.Append(getHtmlHeader(p));
            ex.Append("<table border=\"1\" style=\"font-size:9pt\">");
            ex.Append(getExcelHeader(p));
            ex.Append(getExcelData(p));
            ex.Append("</table></body></html>");
            string charset = "utf-8";
            if (p.ContainsKey("charset"))
            {
                charset = (string)(p["charset"]);
            }
            string file_path = null;
            if (p.ContainsKey("file_path"))
            {
                file_path = (string)(p["file_path"]);
            }
            else
            {
                res.message = "file_path 不允许为空";
                res.status = "error";
                return res;
            }
            string file_name = null;
            if (p.ContainsKey("file_name"))
            {
                file_name = (string)(p["file_name"]);
            }
            else
            {
                res.message = "file_name 不允许为空";
                res.status = "error";
                return res;
            }
            try
            {
                using (StreamWriter writer = new StreamWriter(file_path + "/" + file_name, false, System.Text.Encoding.GetEncoding(charset), 512))
                {
                    writer.Write(ex.ToString());
                }
            }
            catch(Exception exx)
            {
                res.message = exx.Message;
                res.result = exx.StackTrace;
                res.status = "error";
                return res;
            }
            res.status = "success";
            return res;
        }
       public static void Main(string[] args)
        {
            Dictionary<string, Object> p = new Dictionary<string, object>();
            p.Add("file_name","xx.xls");
            p.Add("file_path", "c:");
            Object[][] data = new Object[2][] { new Object[] { 1, 2, 3 }, new Object[] { 1, 2, 3 } };
            p.Add("excel_data", data);

            export(p);

        }
    }
}

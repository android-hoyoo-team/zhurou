using per.cz.bean;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace per.cz.util
{
   public  class OrderUtil
    {
        public static string import_order0(string jsonParam)
        {
            Console.WriteLine("import_order:" + jsonParam);
            /**
             *  provider:"Microsoft.Jet.OLEDB.4.0"
             *  extended_properties:"Excel 8.0;HDR=Yes;IMEX=2"
             *  data_source:            *
             *  sql:                    *
             */
            Result<Object> result = new Result<object>();
            Dictionary<string, Object> p;
            try
            {
                p = JsonUtils.FromJson<Dictionary<string, Object>>(jsonParam);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.status = "error";
                result.result = ex.StackTrace;
                return result.toJson();
            }
            if (!p.ContainsKey("url") || p["url"] == null || string.IsNullOrEmpty(p["url"].ToString()))
            {
                result.status = "error_url_null";
                result.message = "url is not allow null";
                return result.toJson();
                //throw new ArgumentNullException("url");
            }
            string url = p["url"].ToString().Trim();
            Result<Object> res = ExcelUtils.ReadExcelFromJson(jsonParam);
            if (res.status.Equals("success"))
            {
                DataSet d = res.result as DataSet;
                Console.WriteLine("total_columns:" + d.Tables[0].Columns.Count);
                if (d.Tables[0].Columns.Count < 7)
                {
                    result.status = "error";
                    result.message = "导入的数据列数缺失,需要7列，此数据只有" + d.Tables[0].Columns.Count + "列";
                    return result.toJson();
                }
                if (d.Tables[0].Rows.Count < 1)
                {
                    result.status = "error";
                    result.message = "没有要导入的数据";
                    return result.toJson();
                }
                ArrayList errorList = new ArrayList();
                int total = d.Tables[0].Rows.Count;
                for (int i = 0; i < d.Tables[0].Rows.Count; i++)
                {
                    Object[] s = new Object[9];
                    int tag = 0;
                    s[0] = i + 2;
                    string number = d.Tables[0].Rows[i][0].ToString().Trim();
                    s[1] = number;
                    string batch_number = d.Tables[0].Rows[i][1].ToString().Trim();
                    s[2] = batch_number;
                    string type = d.Tables[0].Rows[i][2].ToString().Trim();
                    s[3] = type;
                    string _note_date = d.Tables[0].Rows[i][3].ToString().Trim();
                    DateTime? note_date = null;
                    s[4] = _note_date;
                    string item_number = d.Tables[0].Rows[i][4].ToString().Trim();
                    s[5] = item_number;
                    string _order_lead_time = d.Tables[0].Rows[i][5].ToString().Trim();
                    DateTime order_lead_time;
                    s[6] = _order_lead_time;
                    string _count = d.Tables[0].Rows[i][6].ToString().Trim();
                    s[7] = _count;
                    if (number.Equals("") && batch_number.Equals("") && type.Equals("") && _note_date.Equals("") && item_number.Equals("") && _order_lead_time.Equals("") && _count.Equals(""))
                    {
                        total--;
                        continue;
                    }
                    int count = 0;
                    if (number == null || number.Equals(""))
                    {
                        s[8] = "订单号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (batch_number == null || batch_number.Equals(""))
                    {
                        s[8] = "订单序号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (_order_lead_time == null || _order_lead_time.Equals(""))
                    {
                        s[8] = "纳期不能为空";
                        errorList.Add(s);
                        continue;
                    }

                    if (item_number == null || item_number.Equals(""))
                    {
                        s[8] = "部品号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (_count == null || _count.Equals(""))
                    {
                        s[7] = "订单数量不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    try
                    {
                        count = Convert.ToInt32(_count);
                        if (count <= 0)
                        {
                            s[8] = "订单数量不能小于等于0[" + _count + "]";
                            errorList.Add(s);
                            continue;
                        }
                    }
                    catch (Exception ex)
                    {
                        s[8] = "订单数量格式不正确[" + _count + "]";
                        errorList.Add(s);
                        continue;
                    }
                    if (_note_date != null && !_note_date.Equals(""))
                    {
                        try
                        {
                            note_date = DateTime.ParseExact(_note_date, "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);
                        }
                        catch (Exception ex)
                        {
                            s[8] = "发注日期格式不正确[" + _note_date + "]必须为[yyyyMMdd]形式";
                            errorList.Add(s);
                            continue;
                        }
                    }
                    try
                    {
                        order_lead_time = DateTime.ParseExact(_order_lead_time, "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);
                    }
                    catch (Exception ex)
                    {
                        s[8] = "发注日期格式不正确[" + _order_lead_time + "]必须为[yyyyMMdd]形式";
                        errorList.Add(s);
                        continue;
                    }
                    Dictionary<string, object> param = new Dictionary<string, object>();
                    param.Add("number", number);
                    param.Add("batch_number", batch_number);
                    param.Add("type", type);
                    param.Add("note_date", note_date == null ? null : ((DateTime)note_date).ToShortDateString());
                    param.Add("item_number", item_number);
                    param.Add("order_lead_time", order_lead_time.ToShortDateString());
                    param.Add("count", count);
                    Result<Object> _res = HttpUtils.http_string_response("post", url, param, null);
                    if (_res.status.Equals("error"))
                    {
                        s[8] = "保存失败，失败信息[" + _res.message + "]";
                        errorList.Add(s);
                        continue;
                    }
                    else
                    {
                        int status = (int)(_res.status);
                        if (status < 200 || status > 300)
                        {
                            s[8] = "保存失败，失败信息[" + _res.message + "]";
                            errorList.Add(s);
                            continue;
                        }
                    }
                    // d.Tables[0].Rows[i]
                }
                result.status = "success";
                if (errorList.Count > 0)
                    result.message = "总共" + total + "条数据，有" + errorList.Count + "执行错误";
                else
                    result.message = "总共" + total + "条数据，全部执行成功";
                Dictionary<string, object> last = new Dictionary<string, object>();
                last.Add("tatal", d.Tables[0].Rows.Count);
                last.Add("error", errorList.Count);
                last.Add("error_list", errorList);

                result.result = last;
                return result.toJson();
            }
            else
            {
                result.status = "error";
                result.message = "读取文件失败，请重试。";
                return res.toJson();
            }
        }
        public static string import_order(string jsonParam)
        {
            Console.WriteLine("import_order:" + jsonParam);
            /**
             *  provider:"Microsoft.Jet.OLEDB.4.0"
             *  extended_properties:"Excel 8.0;HDR=Yes;IMEX=2"
             *  data_source:            *
             *  sql:                    *
             */
            Result<Object> result = new Result<object>();
            Dictionary<string, Object> p;
            try
            {
                p = JsonUtils.FromJson<Dictionary<string, Object>>(jsonParam);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.status = "error";
                result.result = ex.StackTrace;
                return result.toJson();
            }
            if (!p.ContainsKey("url") || p["url"] == null || string.IsNullOrEmpty(p["url"].ToString()))
            {
                result.status = "error_url_null";
                result.message = "url is not allow null";
                return result.toJson();
                //throw new ArgumentNullException("url");
            }
            string url = p["url"].ToString().Trim();
            Result<Object> res = ExcelUtils.ReadExcelFromJson(jsonParam);
            if (res.status.Equals("success"))
            {
                DataSet d = res.result as DataSet;
                Console.WriteLine("total_columns:" + d.Tables[0].Columns.Count);
                if (d.Tables[0].Columns.Count < 7)
                {
                    result.status = "error";
                    result.message = "导入的数据列数缺失,需要7列，此数据只有" + d.Tables[0].Columns.Count + "列";
                    return result.toJson();
                }
                if (d.Tables[0].Rows.Count < 1)
                {
                    result.status = "error";
                    result.message = "没有要导入的数据";
                    return result.toJson();
                }
                ArrayList errorList = new ArrayList();
                ArrayList successList = new ArrayList();
                int total = d.Tables[0].Rows.Count;
                for (int i = 0; i < d.Tables[0].Rows.Count; i++)
                {
                    Object[] s = new Object[9];
                    int tag = 0;
                    s[0] = i + 2;
                    string number = d.Tables[0].Rows[i][0].ToString().Trim();
                    s[1] = number;
                    string batch_number = d.Tables[0].Rows[i][1].ToString().Trim();
                    s[2] = batch_number;
                    string type = d.Tables[0].Rows[i][2].ToString().Trim();
                    s[3] = type;
                    string _note_date = d.Tables[0].Rows[i][3].ToString().Trim();
                    DateTime? note_date = null;
                    s[4] = _note_date;
                    string item_number = d.Tables[0].Rows[i][4].ToString().Trim();
                    s[5] = item_number;
                    string _order_lead_time = d.Tables[0].Rows[i][5].ToString().Trim();
                    DateTime order_lead_time;
                    s[6] = _order_lead_time;
                    string _count = d.Tables[0].Rows[i][6].ToString().Trim();
                    s[7] = _count;
                    if (number.Equals("") && batch_number.Equals("") && type.Equals("") && _note_date.Equals("") && item_number.Equals("") && _order_lead_time.Equals("") && _count.Equals(""))
                    {
                        total--;
                        continue;
                    }
                    int count = 0;
                    if (number == null || number.Equals(""))
                    {
                        s[8] = "订单号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (batch_number == null || batch_number.Equals(""))
                    {
                        s[8] = "订单序号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (_order_lead_time == null || _order_lead_time.Equals(""))
                    {
                        s[8] = "纳期不能为空";
                        errorList.Add(s);
                        continue;
                    }

                    if (item_number == null || item_number.Equals(""))
                    {
                        s[8] = "部品号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (_count == null || _count.Equals(""))
                    {
                        s[7] = "订单数量不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    try
                    {
                        count = Convert.ToInt32(_count);
                        if (count <= 0)
                        {
                            s[8] = "订单数量不能小于等于0[" + _count + "]";
                            errorList.Add(s);
                            continue;
                        }
                    }
                    catch (Exception ex)
                    {
                        s[8] = "订单数量格式不正确[" + _count + "]";
                        errorList.Add(s);
                        continue;
                    }
                    if (_note_date != null && !_note_date.Equals(""))
                    {
                        try
                        {
                            note_date = DateTime.ParseExact(_note_date, "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);
                        }
                        catch (Exception ex)
                        {
                            s[8] = "发注日期格式不正确[" + _note_date + "]必须为[yyyyMMdd]形式";
                            errorList.Add(s);
                            continue;
                        }
                    }
                    try
                    {
                        order_lead_time = DateTime.ParseExact(_order_lead_time, "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);
                    }
                    catch (Exception ex)
                    {
                        s[8] = "发注日期格式不正确[" + _order_lead_time + "]必须为[yyyyMMdd]形式";
                        errorList.Add(s);
                        continue;
                    }
                    Dictionary<string, object> param = new Dictionary<string, object>();
                    param.Add("number", number);
                    param.Add("batch_number", batch_number);
                    param.Add("type", type);
                    param.Add("note_date", note_date == null ? null : ((DateTime)note_date).ToShortDateString());
                    param.Add("item_number", item_number);
                    param.Add("order_lead_time", order_lead_time.ToShortDateString());
                    param.Add("count", count);
                    successList.Add(param);
                    // d.Tables[0].Rows[i]
                }
                result.status = "success";
                if (errorList.Count > 0)
                    result.message = "总共" + total + "条数据，有" + errorList.Count + "错误";
                else
                    result.message = "总共" + total + "条数据";
                Dictionary<string, object> last = new Dictionary<string, object>();
                last.Add("tatal", d.Tables[0].Rows.Count);
                last.Add("error", errorList.Count);
                last.Add("error_list", errorList);
                last.Add("success", successList.Count);
                last.Add("success_list", successList);

                result.result = last;
                return result.toJson();
            }
            else
            {
                result.status = "error";
                result.message = "读取文件失败，请重试。";
                return res.toJson();
            }
        }
        public static string import_orders(string jsonParam)
        {
            Console.WriteLine("import_order:" + jsonParam);
            /**
             *  provider:"Microsoft.Jet.OLEDB.4.0"
             *  extended_properties:"Excel 8.0;HDR=Yes;IMEX=2"
             *  data_source:            *
             *  sql:                    *
             */
            Result<Object> result = new Result<object>();
            Dictionary<string, Object> p;
            try
            {
                p = JsonUtils.FromJson<Dictionary<string, Object>>(jsonParam);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.status = "error";
                result.result = ex.StackTrace;
                return result.toJson();
            }
            if (!p.ContainsKey("url") || p["url"] == null || string.IsNullOrEmpty(p["url"].ToString()))
            {
                result.status = "error_url_null";
                result.message = "url is not allow null";
                return result.toJson();
                //throw new ArgumentNullException("url");
            }
            string url = p["url"].ToString().Trim();
            Result<Object> res = ExcelUtils.ReadExcelFromJson(jsonParam);
            if (res.status.Equals("success"))
            {
                DataSet d = res.result as DataSet;
                Console.WriteLine("total_columns:" + d.Tables[0].Columns.Count);
                if (d.Tables[0].Columns.Count < 7)
                {
                    result.status = "error";
                    result.message = "导入的数据列数缺失,需要7列，此数据只有" + d.Tables[0].Columns.Count + "列";
                    return result.toJson();
                }
                if (d.Tables[0].Rows.Count < 1)
                {
                    result.status = "error";
                    result.message = "没有要导入的数据";
                    return result.toJson();
                }
                ArrayList errorList = new ArrayList();
                ArrayList successList = new ArrayList();

                int total = d.Tables[0].Rows.Count;
                for (int i = 0; i < d.Tables[0].Rows.Count; i++)
                {
                    Object[] s = new Object[9];
                    int tag = 0;
                    s[0] = i + 2;
                    string number = d.Tables[0].Rows[i][0].ToString().Trim();
                    s[1] = number;
                    string batch_number = d.Tables[0].Rows[i][1].ToString().Trim();
                    s[2] = batch_number;
                    string type = d.Tables[0].Rows[i][2].ToString().Trim();
                    s[3] = type;
                    string _note_date = d.Tables[0].Rows[i][3].ToString().Trim();
                    DateTime? note_date = null;
                    s[4] = _note_date;
                    string item_number = d.Tables[0].Rows[i][4].ToString().Trim();
                    s[5] = item_number;
                    string _order_lead_time = d.Tables[0].Rows[i][5].ToString().Trim();
                    DateTime order_lead_time;
                    s[6] = _order_lead_time;
                    string _count = d.Tables[0].Rows[i][6].ToString().Trim();
                    s[7] = _count;
                    if (number.Equals("") && batch_number.Equals("") && type.Equals("") && _note_date.Equals("") && item_number.Equals("") && _order_lead_time.Equals("") && _count.Equals(""))
                    {
                        total--;
                        continue;
                    }
                    int count = 0;
                    if (number == null || number.Equals(""))
                    {
                        s[8] = "订单号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (batch_number == null || batch_number.Equals(""))
                    {
                        s[8] = "订单序号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (_order_lead_time == null || _order_lead_time.Equals(""))
                    {
                        s[8] = "纳期不能为空";
                        errorList.Add(s);
                        continue;
                    }

                    if (item_number == null || item_number.Equals(""))
                    {
                        s[8] = "部品号不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    if (_count == null || _count.Equals(""))
                    {
                        s[7] = "订单数量不能为空";
                        errorList.Add(s);
                        continue;
                    }
                    try
                    {
                        count = Convert.ToInt32(_count);
                        if (count <= 0)
                        {
                            s[8] = "订单数量不能小于等于0[" + _count + "]";
                            errorList.Add(s);
                            continue;
                        }
                    }
                    catch (Exception ex)
                    {
                        s[8] = "订单数量格式不正确[" + _count + "]";
                        errorList.Add(s);
                        continue;
                    }
                    if (_note_date != null && !_note_date.Equals(""))
                    {
                        try
                        {
                            note_date = DateTime.ParseExact(_note_date, "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);
                        }
                        catch (Exception ex)
                        {
                            s[8] = "发注日期格式不正确[" + _note_date + "]必须为[yyyyMMdd]形式";
                            errorList.Add(s);
                            continue;
                        }
                    }
                    try
                    {
                        order_lead_time = DateTime.ParseExact(_order_lead_time, "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);
                    }
                    catch (Exception ex)
                    {
                        s[8] = "发注日期格式不正确[" + _order_lead_time + "]必须为[yyyyMMdd]形式";
                        errorList.Add(s);
                        continue;
                    }
                    Dictionary<string, object> param = new Dictionary<string, object>();
                    /* string parm = "{\"number\":\"" + number+"\",";
                     parm += "\"batch_number\":\"" + batch_number + "\",";
                     parm += "\"type\":\"" + type + "\",";
                     parm += "\"note_date\":"+ note_date == null " + note_date == null ? null : ((DateTime)note_date).ToShortDateString() + "\",";
                     parm += "\"item_number\":\"" + item_number + "\",";
                     parm += "\"order_lead_time\":\"" + order_lead_time.ToShortDateString() + "\",";
                     parm += "\"count\":" + count + "}";
                     if (sb.Length == 0)
                     {
                         sb.Append("{\"objects\":[" + parm);
                     }
                     else {
                         sb.Append("," + parm);
                     }*/
                    param.Add("number", number);
                    param.Add("batch_number", batch_number);
                    param.Add("type", type);
                    param.Add("note_date", note_date == null ? null : ((DateTime)note_date).ToShortDateString());
                    param.Add("item_number", item_number);
                    param.Add("order_lead_time", order_lead_time.ToShortDateString());
                    param.Add("count", count);

                    successList.Add(param);
                    // d.Tables[0].Rows[i]
                }
                Dictionary<string, object> last = new Dictionary<string, object>();
                Dictionary<string, object> pi = new Dictionary<string, object>();
                pi.Add("objects", successList);
                Result<Object> _res = HttpUtils.http_string_response("put", url, JsonUtils.ToJson(pi), null);
                if (_res.status.Equals("error"))
                {
                    _res.status = 0;
                }
                else
                {
                    int status = (int)(_res.status);
                    if (status < 200 || status > 300)
                    {
                    }
                }
                result.status = "success";
                if (errorList.Count > 0)
                    result.message = "总共" + total + "条数据，有" + errorList.Count + "错误";
                else
                    result.message = "总共" + total + "条数据";

                last.Add("tatal", d.Tables[0].Rows.Count);
                last.Add("error", errorList.Count);
                last.Add("error_list", errorList);
                last.Add("import_info", _res);
                last.Add("success", successList.Count);
                last.Add("success_list", successList);

                result.result = last;
                return result.toJson();
            }
            else
            {
                result.status = "error";
                result.message = "读取文件失败，请重试。";
                return res.toJson();
            }
        }
    }
}

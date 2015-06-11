using per.cz.bean;
using per.cz.util;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows;
using System.Windows.Forms;

namespace per.cz.wpfFrame.bridge
{

    [ComVisible(true)]
    // [ComVisibleAttribute(true)]
    public class Bridge
    {
        public static Dictionary<string, string> user_infos = new Dictionary<string, string>();


        public void message_box_show(string s)
        {
            System.Windows.Forms.MessageBox.Show(s);
        }
        public string ajax(string json)
        {
            var s = HttpUtils.http_string_response(json, null).toJson();
            return s;
            // Console.WriteLine(json);

            //Console.WriteLine(HttpUtils.http(json, null).toJson());
        }

        public void save_user_info(string key, string value)
        {
            if (user_infos.ContainsKey(key))
                user_infos.Remove(key);
            user_infos.Add(key, value);
        }
        public string get_user_info(string key)
        {
            if (user_infos.ContainsKey(key))
            {
                return user_infos[key];
            }
            return null;
        }
        private string frame_name;
        private int index = 0;
        public string get_frame_name()
        {
            index++;
            frame_name = "frame_name" + index;
            return frame_name;
        }
        public string http_util_get(string u)
        {
            return HttpUtils.http_get(u);
        }
        public string export_excel(string json, string jsonParam)
        {
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
            Result<Object> res = HttpUtils.http_string_response(json, null);
            Console.WriteLine(res.toJson());
            string _status = res.status.ToString();
            int status = 0;

            try
            {
                status = Convert.ToInt32(_status);
            }
            catch (Exception ex)
            {

            }
            Console.Write(status);
            if (status > 199 && status < 300)
            {
                Dictionary<string, Object> data = JsonUtils.FromJson<Dictionary<string, Object>>("{data:" + res.result + "}");
                Console.WriteLine(data["data"]);
                ArrayList arr = (ArrayList)(data["data"]);
                //return null;
                if (p.ContainsKey("excel_data"))
                {
                    p.Remove("excel_data");
                }
                p.Add("excel_data", data["data"]);
                return ExcelExport.export(p).toJson();
            }
            else
            {
                return res.toJson();
            }
        }

        public string import_order0(string jsonParam)
        {
            return OrderUtil.import_order0(jsonParam);
        }
        public string import_order(string jsonParam)
        {
            return OrderUtil.import_order(jsonParam);
        }
        public string import_orders(string jsonParam)
        {
            return OrderUtil.import_orders(jsonParam);
        }
        public string get_excel_info()
        {
            OpenFileDialog op1 = new OpenFileDialog();
            op1.Filter = "excel(*.xls)|*.xls";
            DialogResult dialogResult = op1.ShowDialog();
            Result<Object> result = new Result<object>();
            if (dialogResult == DialogResult.OK)
            {
                string file = op1.FileName;
                Dictionary<string, Object> info = new Dictionary<string, object>();
                info.Add("info", file);
                Console.WriteLine("import_order_file:" + file);
                // Console.WriteLine("import_order:" + jsonParam);
                Result<Object> res = ExcelUtils.GetExcelTablesName(file);
                if (res.status.Equals("success"))
                {
                    DataTable d = res.result as DataTable;
                    string[] s = new string[d.Rows.Count];
                    for (int i = 0; i < d.Rows.Count; i++)
                    {
                        s[i] = d.Rows[i][2].ToString();
                        // d.Tables[0].Rows[i]
                        Console.WriteLine(d.Rows[i][0]);
                    }
                    info.Add("names", s);
                    result.result = info;
                    result.status = "success";
                    return result.toJson();
                }
                else
                {
                    Console.WriteLine(res.toJson());
                    return res.toJson();
                }
            }
            else
            {
                result.status = "error";
                result.message = "没有选择文件";
                return result.toJson();
            }
        }
        public string downloadFile(string serverUrl, string localFile)
        {
            Console.WriteLine(serverUrl);
            Console.WriteLine(localFile);
            return HttpUtils.downloadFile(serverUrl, localFile);

        }
        public string uploadFile(string serverUrl, string localFile, string new_file_name)
        {
            Console.WriteLine(serverUrl);
            Console.WriteLine(localFile);
            return HttpUtils.uploadFile(serverUrl, localFile, new_file_name, null);

        }
        public string uploadFileByDir(string serverUrl, string localFile, string new_file_name, string dir_name)
        {
            Console.WriteLine(serverUrl);
            Console.WriteLine(dir_name);
            return HttpUtils.uploadFile(serverUrl, localFile, new_file_name, dir_name);

        }
        public void start_process(string process)
        {

            System.Diagnostics.Process.Start(process);
        }
        public string base_directory()
        {
            return System.AppDomain.CurrentDomain.BaseDirectory;
        }
        public static string defaultfilePath;
        /**
         * default_file_path
         */
        public string folder_browser_dialog(string jsonParam)
        {
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
            FolderBrowserDialog dialog = new FolderBrowserDialog();
            if (p.ContainsKey("default_file_path") && p["default_file_path"] != null)
            {
                string dffp = p["default_file_path"].ToString();
                if (!dffp.Trim().Equals(""))
                {
                    defaultfilePath = dffp;
                }

                //首次defaultfilePath为空，按FolderBrowserDialog默认设置（即桌面）选择  
                if (!defaultfilePath.Trim().Equals(""))
                {
                    //设置此次默认目录为上一次选中目录  
                    dialog.SelectedPath = defaultfilePath;
                }
            }

            if (dialog.ShowDialog() == DialogResult.OK)
            {
                //记录选中的目录  
                defaultfilePath = dialog.SelectedPath;
                result.status = "success";
                result.result = defaultfilePath;
                return result.toJson();
            }
            else
            {
                result.status = "cancle";
                return result.toJson();
            }

        }
        public string get_file_size(string fileName)
        {
            Result<Object> result = new Result<object>();
            FileInfo info = new FileInfo(fileName);
            if (info.Exists)
            {
                result.status = "success";
                result.result = info.Length;
                return result.toJson();
            }
            result.message = "文件不存在";
            result.status = "error";
            return result.toJson();

        }
        /*
         * initial_directory
         * filter
         * filter_index
         */
        public string open_filed_dialog(string jsonParam)
        {
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
            OpenFileDialog openFiledDialog = new OpenFileDialog();
            if (p.ContainsKey("initial_directory") && p["initial_directory"] != null)
            {
                openFiledDialog.InitialDirectory = p["initial_directory"].ToString();//"D:\\";
            }
            if (p.ContainsKey("filter") && p["filter"] != null)
            {
                openFiledDialog.Filter = p["filter"].ToString();//"文本文件|*.*|C#文件|*.cs|所有文件|*.*";

            }
            if (p.ContainsKey("filter_index") && p["filter_index"] != null)
            {
                string _filter_index = p["filter_index"].ToString();
                int filter_index = 1;
                try { filter_index = Convert.ToInt32(_filter_index); }
                catch (Exception ex) { }
                openFiledDialog.FilterIndex = filter_index;

            }
            string fname = null;
            if (openFiledDialog.ShowDialog() == DialogResult.OK)
            {
                //打开文件对话框中选择的文件名
                fname = openFiledDialog.FileName;
                result.status = "success";
                result.result = fname;
                return result.toJson();
            }
            else
            {
                result.status = "cancle";
                return result.toJson();
            }

        }
        private delegate void DoTask(Object o);
        private void Start(Object jsonParam)
        {
            //  System.Windows.Application.Current.Dispatcher.Invoke(DispatcherPriority.Background, new DoTask(_open_web), jsonParam);
        }
        //public string get_system_parameters(String jsonParam)
        //{
        //    Dictionary<string, Object> p = new Dictionary<string, object>();
        //    p.Add("primary_screen_width", SystemParameters.PrimaryScreenWidth);
        //    p.Add("primary_screen_height", SystemParameters.PrimaryScreenHeight);
        //    p.Add("workarea_width", SystemParameters.WorkArea.Width);
        //    p.Add("workarea_height", SystemParameters.WorkArea.Height);
        //    p.Add("full_primary_screen_width", SystemParameters.FullPrimaryScreenWidth);
        //    p.Add("full_primary_screen_height", SystemParameters.FullPrimaryScreenHeight);

        //    return JsonUtils.ToJson(p);
        //}

        private int open_web_index = 0;

    }
}

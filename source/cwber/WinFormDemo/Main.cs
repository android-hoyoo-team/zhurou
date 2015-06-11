using com.zy.entity.table;
using per.cz.bean;
using per.cz.frame.bridge;
using per.cz.util;
using Sashulin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Forms;

namespace WinFormDemo
{
    public partial class Main : Form
    {
        public Main()
        {
            InitializeComponent();
            // System.Windows.Forms.Control.CheckForIllegalCrossThreadCalls = false;
        }
        private void Main_Load(object sender, EventArgs e)
        {
            this.Click += new System.EventHandler(this.click);
            ChromeWebBrowserBridge chromeWebBrowserBridge = new ChromeWebBrowserBridge(chromeWebBrowser);
        }

        private void click(object sender, EventArgs e)
        {

        }
        public String test()
        {
            Card c = new Card();
            c.epc = "xxxxxxxx";
            test2();
            return JsonUtils.ToJson(c);
        }
        public void test2()
        {

            ThreadStart thr_start_func = new ThreadStart(First_Thread);
            Console.WriteLine("Creating the first thread ");
            Thread fThread = new Thread(thr_start_func);
            fThread.Name = "first_thread";
            fThread.Start(); //starting the thread
            // chromeWebBrowser.ExecuteScript("alert('executeJavaScript');");

        }

        private void First_Thread()
        {
            Card c = new Card();
            c.epc = "8888888";
            Console.WriteLine("12121221212121");
            chromeWebBrowser.ExecuteScript("bridge_map.test1(" + JsonUtils.ToJson(c) + ")");
        }

        private void button_Click(object sender, EventArgs e)
        {
            Console.WriteLine("cliek");
            Card c = new Card();
            c.epc = "8888888";
            Console.WriteLine("1231231123123123");
            chromeWebBrowser.ExecuteScript("bridge_map.test()");
        }
        /**
         * 获取文件大小
         */
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
        public static string defaultfilePath
            /**
             * 弹出框选择文件夹路径
             * 参数： default_file_path：默认路径
             */ ;
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
        /*
         * 文件弹出框，获取文件
         * initial_directory ：初始化路径
         * filter：//"文本文件|*.*|C#文件|*.cs|所有文件|*.*";
         * filter_index：设置索引
         */
        public string open_file_dialog(string jsonParam)
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
        public string get_system_parameters(String jsonParam)
        {
            Dictionary<string, Object> p = new Dictionary<string, object>();
            p.Add("primary_screen_width", SystemParameters.PrimaryScreenWidth);
            p.Add("primary_screen_height", SystemParameters.PrimaryScreenHeight);
            // p.Add("workarea_width", SystemParameters.WorkArea.Width);
            // p.Add("workarea_height", SystemParameters.WorkArea.Height);
            p.Add("full_primary_screen_width", SystemParameters.FullPrimaryScreenWidth);
            p.Add("full_primary_screen_height", SystemParameters.FullPrimaryScreenHeight);
            Console.WriteLine("xxx");
            return JsonUtils.ToJson(p);
        }
    }
}

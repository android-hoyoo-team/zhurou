using com.zy.entity.table;
using per.cz.frame.bridge;
using per.cz.util;
using Sashulin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            ChromeWebBrowserBridge chromeWebBrowserBridge = new ChromeWebBrowserBridge(chromeWebBrowser);
        }
        public  String test()
        {
            Card c = new Card();
            c.epc = "11231313231";
            test2();
            return JsonUtils.ToJson(c);
        }
        public void test2()
        {
            Card c = new Card();
            c.epc = "8888888";
            Console.WriteLine("1231231123123123");
            chromeWebBrowser.ExecuteScript("alert('executeJavaScript');");
           // chromeWebBrowser.ExecuteScript("bridge_map.test1(" + JsonUtils.ToJson(c) + ")");
        }
    }
}

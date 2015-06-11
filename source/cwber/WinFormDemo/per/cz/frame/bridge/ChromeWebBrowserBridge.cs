using per.cz.bean;
using per.cz.util;
using Sashulin;
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

namespace per.cz.frame.bridge
{

    [ComVisible(true)]
    // [ComVisibleAttribute(true)]
    public class ChromeWebBrowserBridge
    {
        public static Dictionary<string, string> user_infos = new Dictionary<string, string>();
        private ChromeWebBrowser chromeWebBrowser;
        public ChromeWebBrowserBridge(ChromeWebBrowser chromeWebBrowser)
        {
            this.chromeWebBrowser = chromeWebBrowser;
            init_event();
            init();
        }
        private void init_event()
        {
            this.chromeWebBrowser.Load += new System.EventHandler(this.chromeWebBrowser_Load);
        }

        private void chromeWebBrowser_Load(object sender, EventArgs e)
        {
            Console.WriteLine("chromeWebBrowser_Load");
        }
        private void init()
        {
            CSharpBrowserSettings settings = new CSharpBrowserSettings();
            //settings.DefaultUrl = System.IO.Directory.GetParent(System.IO.Directory.GetCurrentDirectory()) + @"\www\html.html";
            settings.DefaultUrl = System.IO.Directory.GetParent(System.IO.Directory.GetCurrentDirectory()) + @"\www\page\login\login.html";
            //settings.DefaultUrl = "www.baidu.com";
            settings.UserAgent = "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19";
            Console.WriteLine(settings.DefaultUrl);
            settings.CachePath = @"C:\temp\caches";
            chromeWebBrowser.Initialize(settings);
        }
    }
}

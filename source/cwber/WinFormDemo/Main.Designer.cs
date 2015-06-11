namespace WinFormDemo
{
    partial class Main
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.main_panel = new System.Windows.Forms.Panel();
            this.chromeWebBrowser = new Sashulin.ChromeWebBrowser();
            this.main_panel.SuspendLayout();
            this.SuspendLayout();
            // 
            // main_panel
            // 
            this.main_panel.Controls.Add(this.chromeWebBrowser);
            this.main_panel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.main_panel.Location = new System.Drawing.Point(0, 0);
            this.main_panel.Name = "main_panel";
            this.main_panel.Size = new System.Drawing.Size(541, 389);
            this.main_panel.TabIndex = 0;
            // 
            // chromeWebBrowser
            // 
            this.chromeWebBrowser.BackColor = System.Drawing.SystemColors.ActiveBorder;
            this.chromeWebBrowser.Dock = System.Windows.Forms.DockStyle.Fill;
            this.chromeWebBrowser.Location = new System.Drawing.Point(0, 0);
            this.chromeWebBrowser.Name = "chromeWebBrowser";
            this.chromeWebBrowser.Size = new System.Drawing.Size(541, 389);
            this.chromeWebBrowser.TabIndex = 0;

            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(541, 389);
            this.Controls.Add(this.main_panel);
            this.Name = "Main";
            this.Text = "Main";
            this.Load += new System.EventHandler(this.Main_Load);
            this.main_panel.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel main_panel;
        private Sashulin.ChromeWebBrowser chromeWebBrowser;
    }
}
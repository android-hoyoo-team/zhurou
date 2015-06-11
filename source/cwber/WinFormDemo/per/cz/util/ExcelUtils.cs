using per.cz.bean;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Text;

namespace per.cz.util
{/*
  * 
  * huang.jilong
  */
    public static class ExcelUtils
    {

        /**
         *  provider:"Microsoft.Jet.OLEDB.4.0"
         *  extended_properties:"Excel 8.0;HDR=Yes;IMEX=2"
         *  data_source:            *
         *  sql:                    *
         */
        public static Result<Object> ReadExcelFromJson(string jsonParam)
        {
            Result<Object> result = new Result<Object>();
            string Provider = "Microsoft.Jet.OLEDB.4.0";
            string ExtendedProperties = "Excel 8.0;HDR=Yes;IMEX=2";
            string Sql = null;
            string DataSource = null;
            Dictionary<string, Object> p = JsonUtils.FromJson<Dictionary<string, Object>>(jsonParam);
            if (p.ContainsKey("provider") && p["provider"] != null && !string.IsNullOrEmpty(p["provider"].ToString().Trim()))
            {
                Provider = p["provider"].ToString().Trim();
                //throw new ArgumentNullException("url");
            }
            if (p.ContainsKey("extended_properties") && p["extended_properties"] != null && !string.IsNullOrEmpty(p["extended_properties"].ToString().Trim()))
            {
                ExtendedProperties = p["extended_properties"].ToString().Trim();
                //throw new ArgumentNullException("url");
            }
            if (p.ContainsKey("data_source") && p["data_source"] != null && !string.IsNullOrEmpty(p["data_source"].ToString().Trim()))
            {
                DataSource = p["data_source"].ToString().Trim();
                //throw new ArgumentNullException("url");
            }
            if (p.ContainsKey("sql") && p["sql"] != null && !string.IsNullOrEmpty(p["sql"].ToString().Trim()))
            {
                Sql = p["sql"].ToString().Trim();
                //throw new ArgumentNullException("url");
            }

            Result<Object> res = ReadExcel(DataSource, Provider, ExtendedProperties, Sql);
            return res;
        }
        //Excel 8.0;HDR=Yes;IMEX=2
        public static Result<Object> ReadExcel(string DataSource, string TSql)
        {
            return ReadExcel(DataSource, "Microsoft.Jet.OLEDB.4.0","Excel 8.0;HDR=Yes;IMEX=2",TSql);
        }
        public static Result<Object> GetExcelTablesNameFromJson(string jsonParam)
        {
            Result<Object> result = new Result<Object>();
            string Provider = "Microsoft.Jet.OLEDB.4.0";
            string ExtendedProperties = "Excel 8.0;HDR=Yes;IMEX=2";
            string DataSource = null;
            Dictionary<string, Object> p = JsonUtils.FromJson<Dictionary<string, Object>>(jsonParam);
            if (p.ContainsKey("provider") && p["provider"] != null && !string.IsNullOrEmpty(p["provider"].ToString().Trim()))
            {
                Provider = p["provider"].ToString().Trim();
                //throw new ArgumentNullException("url");
            }
            if (p.ContainsKey("extended_properties") && p["extended_properties"] != null && !string.IsNullOrEmpty(p["extended_properties"].ToString().Trim()))
            {
                ExtendedProperties = p["extended_properties"].ToString().Trim();
                //throw new ArgumentNullException("url");
            }
            if (p.ContainsKey("data_source") && p["data_source"] != null && !string.IsNullOrEmpty(p["data_source"].ToString().Trim()))
            {
                DataSource = p["data_source"].ToString().Trim();
                //throw new ArgumentNullException("url");
            }

            Result<Object> res = GetExcelTablesName(DataSource, Provider, ExtendedProperties);
            return res;
        }
        public static Result<Object> GetExcelTablesName(string DataSource)
        {
            return GetExcelTablesName(DataSource, "Microsoft.Jet.OLEDB.4.0", "Excel 8.0;HDR=Yes;IMEX=2");
        }
        public static Result<Object> GetExcelTablesName(string DataSource, string Provider, string ExtendedProperties)
        {
            Result<Object> result = new Result<Object>();
            DataTable ds;
            if (DataSource == null || DataSource.Trim().Equals(""))
            {
                result.message = "data_source is not all null";
                result.status = "data_source is null";
                return result;
            }
            string strCon = "Provider=" + Provider + ";Extended Properties='" + ExtendedProperties + "';data source=" + DataSource;
            OleDbConnection myConn = null; ;
            try
            {
                using (myConn = new OleDbConnection(strCon))
                {
                    try
                    {
                        myConn.Open();
                        ds = myConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                    }
                    catch (Exception ex)
                    {
                        result.message = ex.Message;
                        result.status = "error";
                        result.result = ex.StackTrace;
                        return result;
                    }
                   
                    myConn.Close();
                }
            }
            catch (Exception ex)
            {
                if (myConn != null)
                    myConn.Close();

                result.message = ex.Message;
                result.status = "error";
                result.result = ex.StackTrace;
                return result;
            }

            result.status = "success";
            result.result = ds;
            return result;
        }
        public static Result<Object> ReadExcel(string DataSource, string Provider, string ExtendedProperties, string TSql)
        {
            Result<Object> result = new Result<Object>();
            DataSet ds;
            if (DataSource == null || DataSource.Trim().Equals(""))
            {
                result.message = "data_source is not all null";
                result.status = "data_source is null";
                return result;
            }
            if (TSql == null || TSql.Trim().Equals(""))
            {
                result.message = "sql is not all null";
                result.status = "sql is null";
                return result;
            }
            string strCon = "Provider=" + Provider + ";Extended Properties='" + ExtendedProperties + "';data source=" + DataSource;
            OleDbConnection myConn = null; ;
            try
            {
                using (myConn = new OleDbConnection(strCon))
                {
                    string strCom = TSql;
                    myConn.Open();
                    using (OleDbCommand ole_cmd = myConn.CreateCommand())
                    {
                        //类似SQL的查询语句这个[Sheet1$对应Excel文件中的一个工作表]  
                        ole_cmd.CommandText =TSql;
                        OleDbDataAdapter adapter = new OleDbDataAdapter(ole_cmd);
                        ds = new DataSet();
                        adapter.Fill(ds, "Sheet1");
                    }

                    /*方式二
                     * 
                     *
                        OleDbDataAdapter myCommand = new OleDbDataAdapter(strCom, myConn);
                        myCommand.Fill();
                     */
                    myConn.Close();
                } 
            }
            catch (Exception ex)
            {
                if(myConn!=null)
                    myConn.Close();
                
                result.message = ex.Message;
                result.status = "error";
                result.result = ex.StackTrace;
                return result;
            }
           
            result.status = "success";
            result.result = ds;
            return result;
        }
        public static Result<DataSet> ExcelToDataSet(string filename, string TSql)
        {
            Result<DataSet> result = new Result<DataSet>();
            DataSet ds;
            string strCon = "Provider=Microsoft.Jet.OLEDB.4.0;Extended Properties=Excel 8.0;data source=" + filename;
            OleDbConnection myConn = new OleDbConnection(strCon);
            string strCom = TSql;
            try
            {
                myConn.Open();
            }
            catch (Exception e)
            {
                myConn.Close();
                result.message = "文件类型不正确（.xls）";
                result.status = "error";
                return result;
            }

            OleDbDataAdapter myCommand = new OleDbDataAdapter(strCom, myConn);
            //myCommand.s
            Console.WriteLine(TSql);
            ds = new DataSet();
            myCommand.Fill(ds);
            myConn.Close();
            result.status = "success";
            result.result = ds;
            return result;
        }
        //{TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE}
        public static Result<DataTable> findExcelTableNames(string filename)
        {
            Result<DataTable> result = new Result<DataTable>();
            OleDbConnection conn = new OleDbConnection("Provider=Microsoft.Jet.OLEDB.4.0;Extended Properties=Excel 8.0;data source=" + filename);
            conn.Open();
            //获取所有表
            DataTable dtt = null;
            try
            {
                dtt = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                conn.Close();
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                result.status = "error";
                return result;
            }
            result.status = "success";
            result.result = dtt;
            return result;

        }
        public static Result<String[]> findExcelTableNameArray(string filename)
        {
            Result<String[]> result = new Result<string[]>();
            Result<DataTable> res = findExcelTableNames(filename);
            if (res.status == "error")
            {
                result.status = "error";
                return result;
            }
            DataTable data = res.result;
            string[] names = new string[data.Rows.Count];
            for (int i = 0; i < data.Rows.Count; i++)
            {
                names[i] = data.Rows[i][2].ToString().Trim();
            }
            result.status = "success";
            result.result = names;
            return result;
        }
        /*public static void saveExcelFromDataGridView(DataGridView dataGridView1)
        {
            Microsoft.Office.Interop.Excel.Application excel = new Microsoft.Office.Interop.Excel.Application();
            excel.Application.Workbooks.Add(true);
            //列
            for (int k = 0; k < dataGridView1.Rows[0].Cells.Count; k++)
            {
                excel.Cells[1, k + 1] = dataGridView1.Columns[k].HeaderText;
            }
            //数据
            for (int i = 0; i < dataGridView1.Rows.Count - 1; i++)
            {
                for (int j = 0; j < dataGridView1.Rows[0].Cells.Count; j++)
                {
                    excel.Cells[i + 2, j + 1] = dataGridView1.Rows[i].Cells[j].Value.ToString();
                }
            }

            excel.Visible = true;
        }*/
       
    }
}

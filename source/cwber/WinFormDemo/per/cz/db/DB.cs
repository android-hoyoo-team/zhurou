using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using System.Data.Common;
using per.cz.bean;
using System.Data;

namespace per.cz.db
{
    class DB
    {
        public static DbConnection getDbConnection()
        {
            return new MySqlConnection(Config.MySqlUrl);
        }
        private static DbDataAdapter dbDataAdapter;
        private static string sql;
        public static DbDataAdapter getDbDataAdapter(string bb, DbConnection conn)
        {

            if (dbDataAdapter == null)
            {
                sql = bb;
                dbDataAdapter = new MySqlDataAdapter(bb, (MySqlConnection)conn);
            }
            else
            {
                if (sql != bb)
                {
                    sql = bb;
                    dbDataAdapter = new MySqlDataAdapter(bb, (MySqlConnection)conn);
                }
            }
            return dbDataAdapter;
        }
        public static DbCommand getDbCommand()
        {
            return new MySqlCommand();
        }
        public static DbCommandBuilder getDbCommandBuilder(DbDataAdapter sda)
        {
            return new MySqlCommandBuilder((MySqlDataAdapter)sda);
        }
        public static Result<System.Data.DataTable> executeQuery(string sql)
        {
            System.Console.WriteLine(sql);
            Result<System.Data.DataTable> res = new Result<System.Data.DataTable>();
            try
            {
                DbConnection conn = DB.getDbConnection();
                conn.Open();
                System.Data.DataTable table = new System.Data.DataTable();
               // table.Locale = System.Globalization.CultureInfo.InvariantCulture;

                DbDataAdapter sda = DB.getDbDataAdapter(sql, conn);
               // DbCommandBuilder cb = DB.getDbCommandBuilder(sda);
                sda.Fill(table);
                res.status = "success";
                res.result = table;
                return res;
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.ToString());
                res.status = "error";
                res.message = "查询数据库出错[" + sql + "]";
                System.Console.WriteLine("查询数据库出错[" + sql + "]");
                return res;
            }
        }
        public static Result<int> executeInsert(string sql)
        {
            Result<int> res = new Result<int>();
            try
            {
                System.Data.Common.DbConnection conn = DB.getDbConnection();
                conn.Open();
                System.Data.Common.DbCommand cmd = DB.getDbCommand();
                cmd.Connection = conn;
                cmd.CommandText = "SET NAMES utf8";
                cmd.ExecuteNonQuery();
                cmd.CommandText = sql;
                int num=cmd.ExecuteNonQuery();
                conn.Close();
                res.status = "success";
                res.result = num;
                return res;
            }
            catch (Exception e)
            {
                System.Console.WriteLine(sql);
                res.status = "error";
                res.message = "插入数据库出错[" + sql + "]";
                return res;
            }
        }
        public static Result<int> executeUpdate(string sql)
        {
            Result<int> res = new Result<int>();
            try
            {
                System.Data.Common.DbConnection conn = DB.getDbConnection();
                conn.Open();
                System.Data.Common.DbCommand cmd = DB.getDbCommand();
                cmd.Connection = conn;
                cmd.CommandText = "SET NAMES utf8";
                cmd.ExecuteNonQuery();
                cmd.CommandText = sql;
                int num=cmd.ExecuteNonQuery();
                conn.Close();
                res.status = "success";
                res.result = num;
                return res;
            }
            catch (Exception e)
            {
                System.Console.WriteLine(sql);
                res.status = "error";
                res.message = "插入数据库出错[" + sql + "]";
                return res;
            }
        }
        public static Result<int> executeUpdate( DataTable d)
        {
            Result<int> res = new Result<int>();

            try
            {
                DbConnection conn = DB.getDbConnection();
                conn.Open();
                System.Data.DataTable table = new System.Data.DataTable();
                table.Locale = System.Globalization.CultureInfo.InvariantCulture;
                DbDataAdapter sda = dbDataAdapter ;//== null ? DB.getDbDataAdapter(sql, conn) : dbDataAdapter;
                DbCommandBuilder cb = DB.getDbCommandBuilder(sda);
                int row = sda.Update(d);
               // d.AcceptChanges();
                res.status = "success";
                res.result = row;
                return res;
            }
            catch (Exception e)
            {
                res.status = "error";
                res.message = "数据更新错误:[" + d + "]";
                return res;
            }

        }
        public static Result<int> executeDelete(string sql)
        {
            Result<int> res = new Result<int>();
            try
            {
                System.Data.Common.DbConnection conn = DB.getDbConnection();
                conn.Open();
                System.Data.Common.DbCommand cmd = DB.getDbCommand();
                cmd.Connection = conn;
                cmd.CommandText = "SET NAMES utf8";
                cmd.ExecuteNonQuery();
                cmd.CommandText = sql;
               int num= cmd.ExecuteNonQuery();
                conn.Close();
                res.result = num;
                res.status = "success";
                return res;
            }
            catch (Exception e)
            {
                System.Console.WriteLine(sql);
                res.status = "error";
                res.message = "删除数据库出错[" + sql + "]";
                return res;
            }
        }

    }
}

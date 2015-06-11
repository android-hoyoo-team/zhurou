
using com.zy.entity.table;
using per.cz.bean;
using per.cz.db;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.zy.service
{
    class CardService
    {
        /**
         *      public int id;
        public string epc;
        public string tid;
        public string uid;
        public string viewNum;//0-9999 可视化标签号 
        public long addTime;
        public long updateTime;
        public long deadTime;
         */
        public static Result<Card> findCardByEpc(string epc)
        {
            Result<Card> res = new Result<Card>();
            String sql = "SELECT  id,epc,tid,uid,viewNum,addTime,updateTime,deadTime from card  where epc='"+epc+"' and ( deadTime=null or deadTime <now())";
            Result<DataTable> r=DB.executeQuery(sql);
            if (r.status == "error")
            {
                res.status = "error";
                return res;
            }
            DataTable d=r.result;
            if (d.Rows.Count == 0)
            {
                res.status = "success";
                return res;
            }
            Card u = new Card();

            u.id=Convert.ToInt32(d.Rows[0][0]);
            u.epc=Convert.ToString(d.Rows[0][1]);
            u.tid=Convert.ToString(d.Rows[0][2]);
            u.viewNum = Convert.ToString(d.Rows[0][3]);
            u.addTime = Convert.ToInt64(d.Rows[0][4]);
            u.updateTime = Convert.ToInt64(d.Rows[0][5]);
            u.deadTime = Convert.ToInt64(d.Rows[0][6]);
            res.status = "success";
            res.result = u;
            return res;

        }
        public static Result<int> saveCard(Card c)
        {
            Result<int> res = new Result<int>();
            if (c == null)
            {
                res.status = "error";
                res.result = 0;
                return res;
            }
            String sql = "INSERT INTO `card`" +
            "(epc,tid,uid,viewNum,addTime,updateTime,deadTime)" +
            "VALUES ('"+c.epc+"','"+c.uid+"','"+c.viewNum+"',"+c.addTime+","+c.updateTime+","+c.deadTime+")";
            return DB.executeInsert(sql);
        }

        public static Result<int> delCardByEpc(String epc)
        {
            Result<Card> res = new Result<Card>();
            String sql = "update card set deadTime=now() where epc='"+epc+"'";

            Result<int> r = DB.executeUpdate(sql);
            return r;
        }
    }
}

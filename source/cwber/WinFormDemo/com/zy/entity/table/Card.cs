using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.zy.entity.table
{
   public class Card
    {
        public int id;
        public string epc;
        public string tid;
        public string uid;
        public string viewNum;//0-9999 可视化标签号 
        public long addTime;
        public long updateTime;
        public long deadTime;
    }
}

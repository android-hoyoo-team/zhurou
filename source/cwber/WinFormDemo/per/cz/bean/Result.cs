using per.cz.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace per.cz.bean
{
    public class Result<T>
    {
        public Object status = "-1";
        public string message;
        public T result;
        public Dictionary<string, string> header;
        //public string message_format = "text";
        //public string reult_format="text";
        public string toJson()
        {
            return JsonUtils.ToJson(this);
        }

    }
}

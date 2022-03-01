using System;
using System.Collections.Generic;

namespace BaseProject.MyModels
{
    public class BillReport
    {
        public List<string> DateTimeResponse { get; set; } = new List<string>();
        public List<decimal> DataResponse { get; set; } = new List<decimal>();
    }
    public class FilterDate
    {
        public DateTime StartDate { get; set; }
    }

}

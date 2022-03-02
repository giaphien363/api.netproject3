using System.Collections.Generic;

namespace BaseProject.MyModels
{
    public class ClaimReportResponse
    {
        public List<int> Months { get; set; } = new List<int> { 1, 3, 5, 7, 9, 11 };
        public List<int> TotalClaims { get; set; } = new List<int>();
        public List<int> ClaimPending { get; set; } = new List<int>();
        public List<int> ClaimApproval { get; set; } = new List<int>();
        public List<int> ClaimReject { get; set; } = new List<int>();
    }

    public class SquareChartResponse
    {
        public int NoUser { get; set; }
        public int PeUser { get; set; }
        public int NoPolicy { get; set; }
        public int PePolicy { get; set; }
        public int NoClaimCreated { get; set; }
        public int PeClaimCreated { get; set; }
        public int NoBill { get; set; }
        public int PeBill { get; set; }
    }
}

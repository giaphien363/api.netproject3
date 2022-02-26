namespace BaseProject.Common
{
    public enum StatusClaimAction
    {
        CREATE = 1, // 1
        DELETE, // 2
        EDIT, // 3
        APPROVE_BY_MAN, // 4
        REJECT_BY_MAN, // 5
        REJECT_BY_FIN, // 6
        PAY // 7

        /*
         * example
         * get value CREATE:
         * int id = (int) StatusClaimAction.CREATE
         * */
    }
    public enum StatusPolicyOrder
    {
        PENDING = 1, // 1
        APPROVE, // 2
        REJECT, // 3
    }
    
    public enum StatusClaimEmployee
    {
        PENDING = 1, // 1
        APPROVE_BY_MAN, // 2
        PAY, // 3
        REJECT_BY_MAN, // 4
        REJECT_BY_FIN, // 5
    }
}

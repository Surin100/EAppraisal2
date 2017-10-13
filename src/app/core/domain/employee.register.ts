export class EmployeeRegister{
    public Row: number;
    public UserName:string;
    public FullName:string;
    public LM1UserName: string;
    public LM2UserName: string;
    public Email: string;
    public JobTitle: string;
    public DepartmentId: string;
    public EmployeeLvId: string;
    public CompanyId: string;

    constructor(Row: number, UserName:string, FullName:string, LM1UserName: string, LM2UserName:string,
    Email: string, JobTitle: string, DepartmentId: string, EmployeeLvId:string, CompanyId: string){
        this.UserName = UserName;
        this.FullName = FullName;
        this.LM1UserName = LM1UserName;
        this.LM2UserName = LM2UserName;
        this.Email = Email;
        this.JobTitle = JobTitle;
        this.DepartmentId = DepartmentId;
        this.EmployeeLvId = EmployeeLvId;
        this.CompanyId = CompanyId;
        this.Row = Row;
    }
}
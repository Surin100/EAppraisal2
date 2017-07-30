export class LoggedInUser {
    public id: string;
    public access_token: string;
    public userName: string;
    public email: string;
    public fullName: string;
    public employeeLvId: string;
    public jobTitle: string;
    public departmentId: string;
    public departmentEnName: string;
    public companyId: string;
    public companyName: string;
    public roles: string[];
    public departmentList;
    public companyList;
    public categoryList;
    public statusList;


    constructor(access_token: string, userName: string, email: string, fullName: string,employeeLvId: string, jobTitle: string,
        departmentId: string, departmentEnName: string, companyId: string, companyName: string, roles: string[],
        departmentList, companyList, categoryList, statusList
    ) {
        this.access_token = access_token;
        this.userName = userName;
        this.email = email;
        this.fullName = fullName;
        this.employeeLvId = employeeLvId;
        this.jobTitle = jobTitle;
        this.departmentId = departmentId;
        this.departmentEnName = departmentEnName;
        this.companyId = companyId;
        this.companyName = companyName;
        this.roles = roles;
        this.departmentList = departmentList;
        this.companyList = companyList;
        this.categoryList = categoryList;
        this.statusList = statusList;
    }

}
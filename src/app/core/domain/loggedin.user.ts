export class LoggedInUser {
    public id: string;
    public access_token: string;
    public userName: string;
    public email: string;
    public fullName: string;
    public lm1: string;
    public lm2: string;
    public job: string;
    public userTypeId: string;
    public userTitle: string;
    public departmentId: string;
    public departmentEnName: string;
    public companyId: string;
    public companyName: string;
    public roles: string[];
    public departmentList;
    public companyList;
    public categoryList;
    public statusList;


    constructor(access_token: string, userName: string, email: string, fullName: string, lm1: string, lm2: string,
        job: string, userTypeId: string, userTitle: string,
        departmentId: string, departmentEnName: string, companyId: string, companyName: string, roles: string[],
        departmentList, companyList, categoryList, statusList
    ) {
        this.access_token = access_token;
        this.userName = userName;
        this.email = email;
        this.fullName = fullName;
        this.lm1 = lm1;
        this.lm2 = lm2;
        this.job = job;
        this.userTypeId = userTypeId;
        this.userTitle = userTitle;
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
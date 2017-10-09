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
    public reviewerName: string;
    public reviewerTitle: string;
    public roles: string[];
    public departmentList;
    public companyList;
    public categoryList;
    public statusList;
    public companyHRList;
    // public goal1Content: string;
    // public goal2Content: string;
    // public goal3Content: string;
    // public goal4Content: string;


    constructor(access_token: string, userName: string, email: string, fullName: string,employeeLvId: string, jobTitle: string,
        departmentId: string, departmentEnName: string, companyId: string, companyName: string, reviewerName: string, reviewerTitle:string,
        roles: string[], departmentList, companyList, categoryList, statusList, companyHRList
        // goal1Content: string, goal2Content: string, goal3Content: string, goal4Content : string
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
        this.reviewerName = reviewerName;
        this.reviewerTitle = reviewerTitle;
        this.companyHRList = companyHRList;
        // this.goal1Content = goal1Content;
        // this.goal2Content = goal2Content;
        // this.goal3Content = goal3Content;
        // this.goal4Content = goal4Content;
    }

}
export class LoggedInUser {
    public id: string;
    public access_token: string;
    public username: string;
    public fullName: string;
    public email: string;
    public lm1: string;
    public lm2: string;
    public job: string;
    public department: string;
    public company: string;


    constructor(access_token: string, username: string, fullName: string, email: string, lm1: string, lm2:string,
        job:string, department:string, company: string) 
    {
        this.access_token = access_token;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.lm1= lm1;
        this.lm2 = lm2;
        this.job = job;
        this.department = department;
        this.company = company;
    }
    
}
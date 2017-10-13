export class ChangeLineManager{
    public Row: number;
    public UserName: string;
    // public FullName: string;
    public LM1UserName: string;
    public LM2UserName: string;

    constructor(Row:number, UserName: string, LM1UserName: string, LM2UserName: string){
        this.Row = Row;
        this.UserName = UserName;
        // this.FullName = FullName;
        this.LM1UserName = LM1UserName;
        this.LM2UserName = LM2UserName;
    }
}
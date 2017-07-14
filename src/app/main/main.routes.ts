import {Routes} from '@angular/router';
import {MainComponent} from './main.component';

export const mainRoutes: Routes = [
    {path:'',component:MainComponent, children:[
        {path:'',redirectTo:'home', pathMatch:'full'},
        {path:'home', loadChildren:'./home/home.module#HomeModule'},
        {path:'register', loadChildren:'./register/register.module#RegisterModule'},
        {path:'appraisal', loadChildren:'./appraisal/appraisal.module#AppraisalModule'},
        {path:'guideline', loadChildren:'./guideline/guideline.module#GuidelineModule'},
        {path:'smartgoal', loadChildren:'./smartgoal/smartgoal.module#SmartGoalModule'}
    ]}
]
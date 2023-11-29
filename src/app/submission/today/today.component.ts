import {Component} from '@angular/core';
import {SubmissionService} from "../../service/submission.service";
import {Submission} from "../../model/submission";
import {authorized} from "../../utils";

@Component({
    selector: 'app-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.css']
})
export class TodayComponent {

    public submissions: Submission[] = []


    adminMode = false;

    constructor(private service: SubmissionService) {
    }

    ngOnInit(): void {
        if (authorized()) {
            this.adminMode = true
        }
        this.service.getTodaySubmissions().subscribe(data => this.submissions = data.data)
    }
}

import {Component, ElementRef, ViewChild} from '@angular/core';
import {SubmissionService} from "../service/submission.service";
import {Submission} from "../model/submission";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {

  history: any[] = []
  currentIndex = 0;

  preMessage = "🙈";
  nextMessage = "🙈";
  currentMessage = "🙈";


  hasNext = false;
  hasPrev = false;
  submissions: Submission[] = [];
  originalSubmissions: Submission[] = [];

  @ViewChild('topButton') topButtonRef!: ElementRef;

  image = true;
  video = true;

  bottomMessage = "🤖 ~没有更多了~ 🤖";
  img = "assets/welcome.webp";

  constructor(private service: SubmissionService) {
  }

  ngOnInit(): void {
    this.service.getHistory().subscribe((data: any) => {

      this.history = data.data;
      let total = this.history.length;

      if (total > 0) {
        // sort by date YYYY-MM-DD
        this.history = this.history.sort((a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        })
        let last = this.history[total - 1];
        this.currentIndex = total - 1;
        this.hasNext = this.hashNext(this.currentIndex, total);
        this.hasPrev = this.hashPrev(this.currentIndex);

        this.service.getSubmission(last).subscribe((data: any) => {
          this.originalSubmissions = data.data;
          this.filter()
        })

        this.currentMessage = this.history[this.currentIndex];
        this.nextMessage = this.hashNext(this.currentIndex, total) ? "👉👉👉" : "🙈没有了🙈";
        this.preMessage = this.hashPrev(this.currentIndex) ? "👈👈👈" : "🙈没有了🙈";
      }
    })

  }

  hashNext(cur: number, total: number): boolean {
    return cur < total - 1;
  }

  hashPrev(cur: number): boolean {
    return cur > 0;
  }

  setCur(index: number) {
    this.currentIndex = index;
    this.hasNext = this.hashNext(this.currentIndex, this.history.length);
    this.hasPrev = this.hashPrev(this.currentIndex);
    this.currentMessage = this.history[this.currentIndex];
    this.nextMessage = this.hashNext(this.currentIndex, this.history.length) ? "👉👉👉" : "🙈没有了🙈";
    this.preMessage = this.hashPrev(this.currentIndex) ? "👈👈👈" : "🙈没有了🙈";
    this.service.getSubmission(this.history[this.currentIndex]).subscribe((data: any) => {
      this.originalSubmissions = data.data;
      this.filter()
    })

  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }


  filter() {
    if (!this.image && !this.video) {
      this.submissions = []
      this.bottomMessage = "😒 啥都不想看,搬砖去吧 😒";
      this.img = "assets/brick.jpeg";
      return
    }

    this.bottomMessage = "🤖 ~没有更多了~ 🤖";
    this.img = "assets/welcome.webp";

    if (this.image && this.video) {
      this.submissions = this.originalSubmissions
      return
    }


    let tmp = []
    for (let i = 0; i < this.originalSubmissions.length; i++) {
      if (this.originalSubmissions[i].submissionType === 'IMAGE' && this.image) {
        tmp.push(this.originalSubmissions[i])
      } else if (this.originalSubmissions[i].submissionType === 'BILIBILI' && this.video) {
        tmp.push(this.originalSubmissions[i])
      } else if (this.originalSubmissions[i].submissionType === 'VIDEO' && this.video) {
        tmp.push(this.originalSubmissions[i])
      }
    }
    this.submissions = tmp

  }
}

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { IResult } from 'src/interface/question'
@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  questions: IResult[] = []

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      Object.keys(params).map((key) => {
        this.questions.push({
          title: key,
          result: params[key].split('___'),
        })
      })
    })
  }
}

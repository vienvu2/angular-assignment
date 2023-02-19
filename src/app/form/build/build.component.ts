import { Component, Inject, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { IQuestion } from 'src/interface/question'

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import { Router } from '@angular/router'
@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.scss'],
})
export class BuildComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
  ) {}
  answer = this.fb.group({})

  ngOnInit(): void {}
  title = 'assignment'

  questions: IQuestion[] = []

  addNew() {
    const dialogRef = this.dialog.open(DialogNewQuestion)

    dialogRef.afterClosed().subscribe((result) => {
      this.questions = this.questions.concat(result)

      this.questions.forEach((item) => {
        if (item.required) {
          this.answer.addControl(
            item.title,
            new FormControl('', Validators.required),
          )
        } else {
          this.answer.addControl(item.title, new FormControl(''))
        }
      })
    })
  }
  submit(values: any) {
    this.router.navigate(['form', 'answer'], { queryParams: values })
  }
  setValue(name: string, value: string) {
    this.answer.setValue({ [name]: value })
  }
}

@Component({
  selector: 'add-new-question',
  templateUrl: './new-question.html',
})
export class DialogNewQuestion {
  newQuestion

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogNewQuestion>,
    @Inject(MAT_DIALOG_DATA) public data: IQuestion,
  ) {
    this.newQuestion = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      required: [''],
      custom: [''],
      answerList: this.fb.array([]),
    })
  }
  get answerList() {
    return this.newQuestion.controls['answerList'] as FormArray
  }
  get answerListControl() {
    return this.answerList.controls as FormGroup[]
  }

  submit(values: IQuestion | object) {
    this.dialogRef.close({ ...values, id: makeid(10) })
  }
  addNewAnswer() {
    const answerForm = this.fb.group({
      label: ['', Validators.required],
    })
    this.answerList.push(answerForm)
  }

  deleteAnswer(lessonIndex: number) {
    this.answerList.removeAt(lessonIndex)
  }
}

function makeid(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

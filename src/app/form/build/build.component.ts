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

    dialogRef.afterClosed().subscribe((result: IQuestion) => {
      this.questions = this.questions.concat(result)

      if (result.type == 'options' && result.answerList) {
        const group: any = {}
        result.answerList.map((item) => {
          group[item.label] = ['']
        })

        if (result.custom) {
          group.other = ''
        }
        this.answer.addControl(result.title, this.fb.group(group))
      } else {
        this.answer.addControl(
          result.title,
          new FormControl(
            '',
            result.required ? Validators.required : Validators.nullValidator,
          ),
        )
      }

      console.log('this.answer', this.answer.controls)
    })
  }
  submit(values: any) {
    const result: any = {}
    Object.keys(values).map((key) => {
      if (typeof values[key] === 'object') {
        result[key] = this.getDataObj(values[key]).join('___')
      } else {
        result[key] = values[key]
      }
    })
    this.router.navigate(['form', 'answer'], { queryParams: result })
  }

  getDataObj(values: any) {
    const re2 = Object.keys(values)
      .map((k2) => {
        if (k2 == 'other' && values.other) {
          return values.other
        }
        if (values[k2]) {
          return k2
        }
      })
      .filter((a) => a)

    return re2
  }
  setValue(name: string, value: string) {
    this.answer.setValue({ [name]: value })
  }
  checkValidate() {
    //true => failed
    if (this.questions.length == 0) {
      return true
    }
    const questionValidate = this.questions.filter((a) => a.required)
    let result = false
    questionValidate.forEach((question) => {
      const values: any = this.answer.value || {}
      if (question.type == 'text') {
        if (!values[question.title]) {
          result = true
        }
      }

      if (question.type == 'options') {
        if (this.getDataObj(values[question.title]).length == 0) {
          result = true
        }
      }
    })

    return result
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
      type: ['options', Validators.required],
      title: ['', Validators.required],
      required: [false],
      custom: [false],
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

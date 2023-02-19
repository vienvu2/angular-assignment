export interface IQuestion {
  type: 'text' | 'options'
  title: string
  id: string
  required: boolean
  custom: boolean
  answerList?: IAnswer[]
  isOther: boolean
  customText?: string
}
export interface IAnswer {
  label: string
}

export interface IResult {
  title: string
  result: string[]
}

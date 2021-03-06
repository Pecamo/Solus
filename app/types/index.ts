export type ResultNode = StackOverflowResult | IFrameResult;

export enum ResultType {
  StackOverflow = 'StackOverflow',
  IFrame = 'IFrame'
}

export type SOQuestion = {
  tags: Array<string>,
  owner: {
    reputation: number,
    user_id: number,
    user_type: string,
    accept_rate: number,
    profile_image: string,
    display_name: string,
    link: string
  },
  is_answered : boolean,
  view_count : number,
  accepted_answer_id? : number,
  answer_count : number,
  score : number,
  last_activity_date : number,
  creation_date : number,
  last_edit_date? : number,
  question_id : number,
  link : string,
  title : string,
  body: string
};

export type SOAnswer = {
  owner: {
    reputation: number,
    user_id: number,
    user_type: string,
    profile_image: string,
    display_name: string,
    link: string
  },
  is_accepted: boolean,
  score: number,
  last_activity_date: number,
  last_edit_date?: number,
  creation_date: number,
  answer_id: number,
  question_id: number,
  body: string
};

export type StackOverflowResult = {
  type: 'StackOverflow',
  question: SOQuestion,
  answer: SOAnswer,
};

export type LolWikiaResult = {
  type: 'LolWikia'
}

export type IFrameResult = {
  type: ResultType.IFrame,
  href: string,
  title: string,
  querySelector?: string,
};

export type Intent = {
  body?: string,
  end?: number,
  start?: number,
  suggested?: boolean,
  value: string
};

export type SingleOrMultipleIntents = Intent | Array<Intent>;

export type Entities = {[key: string]: SingleOrMultipleIntents;
};

export type Question = {
  entities: Entities,
  intent: string,
  msg_body: string,
  msg_id: string
};

export interface Source {
  handleQuestion: (question: Question) => Promise<Array<ResultNode>>;
  getDisplayName: () => string;
}

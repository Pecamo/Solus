import * as _ from 'lodash';
import {ResultType, SOAnswer, SOQuestion, StackOverflowResult} from '../../../types';

interface Source {

}

type Intent = {
  body?: string,
  end?: number,
  start?: number,
  suggested?: boolean,
  value: string
};

type SingleOrMultipleIntents = Intent | Array<Intent>;

type Entities = {[key: string]: SingleOrMultipleIntents;
};

type Question = {
  entities: Entities,
  intent: string,
  msg_body: string,
  msg_id: string
};

type SimilarAPIResponse = {
  items: Array<{
    tags: Array<string>,
    answers: Array<{
      owner: {
        reputation: number,
        user_id: number,
        accept_rate?: number,
        user_type: string,
        profile_image: string,
        display_name: string,
        link: string
      },
      is_accepted: boolean,
      score: number,
      link: string,
      last_activity_date: number,
      last_edit_date?: number,
      creation_date: number,
      answer_id: number,
      question_id: number,
      body_markdown: string,
      body: string,
    }>
    owner: object,
    is_answered: boolean,
    view_count: number,
    accepted_answer_id?: number,
    answer_count: number,
    score: number,
    link: string,
    last_activity_date: number,
    creation_date: number,
    last_edit_date?: number,
    question_id: number,
    body: string,
    body_markdown: string,
    title: string
  }>,
  has_more: boolean,
  quota_max: number,
  quota_remaining: number
};

enum StackExchangeSite {
  STACKOVERFLOW = 'stackoverflow', // IDEs
  BLENDER = 'blender', // Blender
  ARQADE = 'gaming', // Any video game
  PHOTOGRAPHY = 'photo', // Image-processing softwares
  SUPERUSER = 'superuser', // Terminal
  TEX = 'tex' // Tex-edition software
}

class StackExchangeSource implements Source {

  static host = 'https://api.stackexchange.com';
  static similarPath = '/2.2/similar';
  static answersPath = '/2.2/answers';
  site: StackExchangeSite;

  constructor(site: StackExchangeSite) {
    this.site = site;
  }

  handleQuestion (question: Question): Promise<Array<StackOverflowResult>> {
    return this.getSimilarQuestions(question)
      .then((response) => {
        const nodes = response.items.map((item) => {
          const question: SOQuestion = {
            tags: item.tags,
            owner: item.owner as SOQuestion['owner'],
            is_answered : item.is_answered,
            view_count : item.view_count,
            accepted_answer_id : item.accepted_answer_id,
            answer_count : item.answer_count,
            score : item.score,
            last_activity_date : item.last_activity_date,
            creation_date : item.creation_date,
            last_edit_date : item.last_edit_date,
            question_id : item.question_id,
            link : item.link,
            title : item.title
          };

          let answer: SOAnswer | undefined = undefined;

          if (item.answer_count === 0) {
            return {};
          }

          const sorted = item.answers.sort((a, b) => a.score - b.score);
          answer = sorted[0];

          return {
            question,
            answer,
            type: 'StackOverflow'
          };
        });

        const filtered = nodes.filter(node => !!node);

        return filtered as Array<StackOverflowResult>;
      });
  }

  private getSimilarQuestions(question: Question): Promise<SimilarAPIResponse> {
    // 1. Get the most similar questions
    // 1.1 Format the tags
    const entities = question.entities; // MUTATION LUL
    delete entities['intent'];
    const tags = _.uniq(
      _.flatMapDeep(
        _.values(entities), (entity: SingleOrMultipleIntents) => {
          if (Array.isArray(entity)) {
            return entity.map(singleEntity => singleEntity.value);
          }
          return entity.value;
        }
      )
    );
    // 1.2 Remove non-existing tags
    const validTags = tags.filter(tag => (tag in validTags));
    const query = {
      order: 'desc',
      sort: 'relevance',
      site: this.site,
      filter: '!b1MMEU)j2DncNX',
      /*tagged: question.intent, // Tags are currently disabled to ensure compatibility with all StackExchange sites  */
      title: question.msg_body
    };
    // 1.3 Construct the call
    const queryString = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
    const url = new URL(StackExchangeSource.similarPath, StackExchangeSource.host);
    // 1.4 Actual query
    url.search = queryString;
    return fetch(url.toString())
      .then((response) => {
        return response.json();
      });
  }

  /*
  private getAnswersById(questions: SimilarAPIResponse['items']): Array<StackOverflowResult> {
    if (questions.length === 0) {
      return [];
    }
    const nodes = questions
      .map((question) => {
        if (question.answers.length === 0) {
          return null;
        }
        const sorted = question.answers.sort((a, b) => a.score - b.score);
        const best = sorted[0];
        return {
          question,
          answerId: best.answer_id
        };
      })
      .filter(question => !!question);
    const answerIds = nodes.map(node => node ? node.answerId : null).filter(answer => !!answer);
    //
    const query = {
      order: 'desc',
      sort: 'votes',
      site: this.site,
      filter: '!6PLMObrfJqlhA',
      ids: answerIds.join(';')
    };
    // Construct the call
    const queryString = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
    const url = new URL(StackExchangeSource.similarPath, StackExchangeSource.host);
    // Actual query
    url.search = queryString;
    fetch(url.toString())
      .then((response) => {
        return response.json();
      })
      .then((response: AnswersAPIResponse) => {
        const answersById = _.keyBy(response.items, item => item.answer_id);

        response.items.map(item => {});
      }); */
}

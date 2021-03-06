import * as _ from 'lodash';
import { SOAnswer, SOQuestion, StackOverflowResult, Source, Question, SingleOrMultipleIntents } from '../types';

export type SimilarAPIResponse = {
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
    title: string
  }>,
  has_more: boolean,
  quota_max: number,
  quota_remaining: number
};

export enum StackExchangeSite {
  STACKOVERFLOW = 'stackoverflow', // IDEs
  BLENDER = 'blender', // Blender
  ARQADE = 'gaming', // Any video game
  PHOTOGRAPHY = 'photo', // Image-processing softwares
  SUPERUSER = 'superuser', // Terminal
  TEX = 'tex' // Tex-edition software
}

export class StackExchangeSource implements Source {

  static host = 'https://api.stackexchange.com';
  static similarPath = '/2.2/similar';
  static answersPath = '/2.2/answers';
  site: StackExchangeSite;

  constructor(site: StackExchangeSite) {
    this.site = site;
  }

  getDisplayName() {
    return {
      stackoverflow: 'StackOverflow',
      blender: 'Blender StackExchange',
      gaming: 'Arqade StackExchange',
      photo: 'Photography StackExchange',
      superuser: 'SuperUser StackExchange',
      tex: 'TeX StackExchange'
    }[this.site];
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
            title : item.title,
            body: item.body
          };

          let answer: SOAnswer | undefined;

          if (item.answer_count === 0) {
            return {};
          }

          const sorted = item.answers.sort((a, b) => a.score - b.score);
          answer = sorted[0];

          return {
            question,
            answer,
            type: this.getDisplayName()
          };
        });

        console.log("UNDERSTOOD NODES : ", nodes);

        const filtered = nodes.filter(node => !!node && Object.keys(node).length !== 0);

        return _.take(filtered, 3) as Array<StackOverflowResult>;
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
    // const validTags = tags.filter(tag => (tag in validTags));
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
}

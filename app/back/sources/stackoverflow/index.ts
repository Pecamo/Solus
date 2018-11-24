import * as _ from 'lodash';

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
        user_type: string,
        profile_image: string,
        display_name: string,
        link: string
      },
      is_accepted: true,
      score: number,
      last_activity_date: number,
      last_edit_date: number,
      creation_date: number,
      answer_id: number,
      question_id: number,
      body_markdown: string
    }>
    owner: object,
    is_answered: boolean,
    view_count: number,
    accepted_answer_id: number,
    answer_count: number,
    score: number,
    last_activity_date: number,
    creation_date: number,
    last_edit_date: number,
    question_id: number,
    body_markdown: string,
    link: string,
    title: string
  }>,
  has_more: boolean,
  quota_max: number,
  quota_remaining: number
};

const test: Question = {
  entities: {
    intent: {
      value: 'StackOverflow',
    },
    prog_concept: {
      body: 'PHP loop',
      end: 20,
      start: 12,
      suggested: true,
      value: 'PHP loop'
    }
  },
  intent: 'default_intent',
  msg_body: 'how to do a PHP Loop',
  msg_id: 'q24r5ewf9iuhwq8tr4'
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

  handleQuestion(question: Question) {
    this.getSimilarQuestions(question)
      .then((response) => {
        console.log(response);
        this.getAnswersById(response.items);
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
      filter: '!b1MMEU*.-3EcYn',
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

  private getAnswersById(items: SimilarAPIResponse['items']) {
    items.map(item => {
      console.log(item.answers);
      item.answers.map((answer) => {
        // answer.score;
        // TODO : Loop through answers, take highest voted one
      });
    });
  }
}

import { Source, Question, SingleOrMultipleIntents, Intent, IFrameResult, ResultType, ResultNode } from '../types';

export class LolWikiaSource implements Source {
  static host = 'http://leagueoflegends.wikia.com';
  static suffix = '/wiki/';

  getDisplayName() {
    return 'League of Legends Wikia';
  }

  handleQuestion(question: Question): Promise<Array<IFrameResult>> {
    let page: string = '';
    let title: string = '';
    let selector: string = 'aside';

    if (question.entities.lol_monster) {
      console.log('found: ' + question.entities.lol_monster);
      title = getFirst(question.entities.lol_monster).value;
      page = formatUrl(title);
    }

    if (question.entities.lol_item) {
      console.log('found: ' + question.entities.lol_item);
      title = getFirst(question.entities.lol_item).value;
      page = formatUrl(title);
    }

    if (question.entities.lol_champ) {
      console.log('found: ' + question.entities.lol_champ);
      title = getFirst(question.entities.lol_champ).value;
      page = formatUrl(title);
      selector = '#champinfo-container';
    }

    function formatUrl(title: string): string {
      return title.split(/\s+/gi).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_');
    }

    const url = LolWikiaSource.host + LolWikiaSource.suffix + page;

    const iframeResult: IFrameResult = {
      type: ResultType.IFrame,
      title,
      href: url,
      querySelector: selector,
    };

    const ret: Array<IFrameResult> = [iframeResult];

    return Promise.resolve(ret);
  }
}

function getFirst(entity: SingleOrMultipleIntents): Intent {
  if (Array.isArray(entity)) {
    return entity[0];
  }
  return entity;
}

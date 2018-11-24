interface Source {

}

interface Question {
  responseId: string;
  queryResult: {
    queryText: string,
    action: string,
    parameters: object,
    fulfillmentText: string,
    fulfillmentMessages: Array<{text: any, platform?: string}>,
    outputContexts: Array<{
      name: string,
      lifespanCount: number,
      parameters: object
    }>,
    intent: {
      name: string,
      displayName: string
    },
    intentDetectionConfidence: number,
    diagnosticInfo: object,
    languageCode: string
  };
}

const test2: Question = {
  responseId: '3c1e5a89-75b9-4c3f-b63d-4b1351dd5e32',
  queryResult: {
    queryText: 'book a room',
    action: 'room.reservation',
    parameters: {
      time: '',
      date: '',
      guests: '',
      duration: '',
      location: ''
    },
    fulfillmentText: 'I can help with that. Where would you like to reserve a room?',
    fulfillmentMessages: [
      {
        text: {
          text: [
            'I can help with that. Where would you like to reserve a room?'
          ]
        },
        platform: 'FACEBOOK'
      },
      {
        text: {
          text: [
            'I can help with that. Where would you like to reserve a room?'
          ]
        }
      }
    ],
    outputContexts: [
      {
        name: 'projects/drothaus-cce/agent/sessions/123456789/contexts/e8f6a63e-73da-4a1a-8bfc-857183f71228_id_dialog_context',
        lifespanCount: 2,
        parameters: {
          date: '',
          guests: '',
          duration: '',
          'location.original': '',
          'guests.original': '',
          location: '',
          'date.original': '',
          'time.original': '',
          time: '',
          'duration.original': ''
        }
      },
      {
        name: 'projects/drothaus-cce/agent/sessions/123456789/contexts/room_reservation_dialog_params_location',
        lifespanCount: 1,
        parameters: {
          'date.original': '',
          'time.original': '',
          time: '',
          'duration.original': '',
          date: '',
          guests: '',
          duration: '',
          'location.original': '',
          'guests.original': '',
          location: ''
        }
      },
      {
        name: 'projects/drothaus-cce/agent/sessions/123456789/contexts/room_reservation_dialog_context',
        lifespanCount: 2,
        parameters: {
          'time.original': '',
          time: '',
          'duration.original': '',
          date: '',
          guests: '',
          duration: '',
          'location.original': '',
          'guests.original': '',
          location: '',
          'date.original': ''
        }
      }
    ],
    intent: {
      name: 'projects/drothaus-cce/agent/intents/e8f6a63e-73da-4a1a-8bfc-857183f71228',
      displayName: 'room.reservation'
    },
    intentDetectionConfidence: 1,
    diagnosticInfo: {},
    languageCode: 'en-us'
  }
};

class StackOverflowSource implements Source {

  static host = 'https://api.stackexchange.com';
  static searchPath = '/2.2/search';

  constructor() {

  }

  handleQuestion(question: Question) {
    const url = new URL(StackOverflowSource.searchPath, StackOverflowSource.host);
    const query = {};
    const queryString = '?' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
    url.search = queryString;
    fetch(url.toString())
      .then((response) => {
        return response.json();
      })
      .then((myJson: object) => {
        console.log(JSON.stringify(myJson));
      });
  }
}

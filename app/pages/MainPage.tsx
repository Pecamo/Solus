import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as MicActions from '../actions/mic';
import { RouteComponentProps } from 'react-router';
import { IState } from '../reducers';

import { MicState } from '../reducers/mic';
import {Card, Tag, Text} from '@blueprintjs/core';

const styles = require('./MainPage.scss');

export interface MainPageProps extends RouteComponentProps<any> {
  mic: MicState;
}

interface Result {
  source: string;
  content: string;
}

class MainPage extends React.Component<MainPageProps> {

  render() {
    const input = 'I want to...';
    const bestGuess = '350 gold';

    const lorem = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,' +
        'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
        'It has survived not only five centuries, but also the leap into electronic typesetting,' +
        'remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset' +
        'sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker' +
        'including versions of Lorem Ipsum.';

    const results = [
      { source: 'source1', content: lorem },
      { source: 'source2', content: lorem }
    ];

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          You can see the results of your search query below.
          <Card className={styles.understood}>
            <Text ellipsize={true}>{input}</Text>
          </Card>

          <Text className={styles.best_guess}>Best guess: {bestGuess}</Text>

          <div className={styles.results}>
            {results.map(this.renderResult)}
          </div>
        </div>
      </div>
    );
  }

  private renderResult = (el: Result, index: number) => (
      <Card key={index} className={styles.result}>
        <Tag className={styles.result_source}>
          {el.source}
        </Tag>
        <div className={styles.result_content}>
          {el.content}
        </div>
      </Card>
  )
}

function mapStateToProps(state: IState): Partial<MainPageProps> {
  return {
    mic: state.mic
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<MainPageProps> {
  return bindActionCreators(MicActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(MainPage) as any as React.StatelessComponent<MainPageProps>);

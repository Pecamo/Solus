import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as MicActions from '../actions/mic';
import { RouteComponentProps } from 'react-router';
import { IState } from '../reducers';

import { MicState } from '../reducers/mic';
import { Card, Text, Spinner, Intent, H3, NonIdealState } from '@blueprintjs/core';
import { Result, ResultProps } from './result/Result';

import { ResultNode } from '../types';

const styles = require('./MainPage.scss');

export interface MainPageProps extends RouteComponentProps<any> {
  mic: MicState;
}

enum SearchState {
  INIT,
  SPEAKING,
  FETCHING,
  DONE
}

interface MainPageState {
  pageState: SearchState;
  results: Array<ResultNode>;
}

class MainPage extends React.Component<MainPageProps, MainPageState> {
  readonly state: MainPageState = {
    pageState: SearchState.INIT,
    results: []
  };

  setResults(results: MainPageState['results']) {
    this.state.results = results;
  }

  render() {
    const input = 'I want to...';

    const lorem = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,' +
        'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
        'It has survived not only five centuries, but also the leap into electronic typesetting,' +
        'remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset' +
        'sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker' +
        'including versions of Lorem Ipsum.';

    const results = [
      { source: 'Stack Overflow', content: lorem },
      { source: 'Lol wikia', content: lorem }
    ];

    if (this.state.pageState === SearchState.INIT) {
      return (
          <div className={styles.container}>
            <NonIdealState
                icon="headset"
                title="Speak to search content"
                description="Plug a microphone "
            />
          </div>
      );
    }

    return (
        <div className={styles.container}>
          <div className={styles.content}>
            You can see the results of your search query below.

            <Card className={styles.understood}>
              <Text ellipsize={true}>{input}</Text>
            </Card>

            {this.renderResults(results)}
          </div>
        </div>
    );
  }

  private renderSpinner = () => <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_STANDARD}/>;

  private renderResults = (results: ResultProps[]) => {
    const bestGuess = '350 gold';
    return (
        <div className={styles.results}>
          {this.state.pageState === SearchState.FETCHING ? this.renderSpinner() : (
            <>
              <Text className={styles.best_guess}>Best guess: {bestGuess}</Text>
              {results.map((el: ResultProps, index: number) => <Result key={index} {...el}/>)}
            </>
          )}
        </div>
    );
  }
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

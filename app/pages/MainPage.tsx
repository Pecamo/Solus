import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as MicActions from '../actions/mic';
import { RouteComponentProps } from 'react-router';
import { IState } from '../reducers';

import { MicState } from '../reducers/mic';
import { Card, Intent, NonIdealState, Spinner, Text } from '@blueprintjs/core';
import { Result, ResultProps } from './result/Result';

import { ResultNode, ResultType, StackOverflowResult } from '../types';

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
  searchState: SearchState;
  results: ResultNode[];
}

class MainPage extends React.Component<MainPageProps, MainPageState> {
  readonly state: MainPageState = {
    searchState: SearchState.DONE,
    results: []
  };

  setResults(results: MainPageState['results']) {
    this.state.results = results;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {this.renderContent()}
        </div>
      </div>
    );
  }

  private renderContent = () => {
    const context = 'Stack Overflow';
    const understood = 'I want to...';
    const guess = '350 gold';

    const results: ResultProps[] = [
      {
        source: 'Stack Overflow',
        content: {
          type: ResultType.StackOverflow,
          question: {
            title: 'alors',
            link: 'http://oui.la.vie',
          },
          answer: {
            body_markdown: 'Lol\n```js\nconsole.log("FNU");```'
          }
        } as any as StackOverflowResult,
      },
      {
        source: 'Lol wikia',
        content: {
          type: ResultType.IFrame,
          href: 'https://leagueoflegends.wikia.com/wiki/Cloud_Drake',
          querySelector: 'aside',
        }
      },
      {
        source: 'Lol wikia',
        content: {
          type: ResultType.IFrame,
          href: 'https://leagueoflegends.wikia.com/wiki/Gromp',
          querySelector: 'aside',
        }
      }
    ];

    switch (this.state.searchState) {
      case SearchState.INIT:
        return (
            <NonIdealState
                icon="headset"
                title="Speak to search content"
                description="Plug a microphone and speak to begin"
            />
        );
      case SearchState.SPEAKING:
        return (
          <>
            <Text>Keep speaking! >:3</Text>
            <div>La super barre de Sachdr</div>
          </>
        );
      case SearchState.FETCHING:
        return (
            <>
              {this.renderResultHead(guess, context, understood)}
              {this.renderResults(results, true)}
            </>
        );
      case SearchState.DONE:
        return (
            <>
              {this.renderResultHead(guess, context, understood)}
              {this.renderResults(results, false)}
            </>
        );
      default:
        return null;
    }
  }

  private renderResultHead = (guess: string, context: string, understood: string) => (
      <>
        <Text>Your query for the context {context}:</Text>

        <Card className={styles.understood}>
          <Text ellipsize={true}>{understood}</Text>
        </Card>

        <Text className={styles.best_guess}>Best guess: {guess}</Text>
      </>
  )

  private renderResults = (results: ResultProps[], fetching: boolean) => (
        <div className={styles.results}>
          {fetching
              ? <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_STANDARD}/>
              : results.map((el: ResultProps, index: number) => <Result key={index} {...el}/>)}
        </div>
    );
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

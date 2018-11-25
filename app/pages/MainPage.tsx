import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as MicActions from '../actions/mic';
import { RouteComponentProps } from 'react-router';
import { IState } from '../reducers';

import { MicState } from '../reducers/mic';
import { Button, Card, Intent, Menu, MenuItem, NonIdealState, Popover, Position, Spinner, Text } from '@blueprintjs/core';
import { Result, ResultProps } from './result/Result';

import { ResultNode, ResultType, StackOverflowResult } from '../types';
import { Mic } from "../microphone/mic";

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
	microphone: Mic;

	readonly state: MainPageState = {
		searchState: SearchState.INIT,
		results: []
	};

	setResults(results: MainPageState['results']) {
		this.state.results = results;
	}

  componentDidMount() {
    let elem: HTMLElement = document.querySelector('.mic-icon') as HTMLElement;
    this.microphone = new Mic(elem, () => {
      console.log("volume detected");
      this.setState({ searchState: SearchState.SPEAKING });
    }, (res) => {
      console.log(res);
    });

    this.microphone.init();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Popover className={styles.change_state} content={this.renderMenu()} position={Position.BOTTOM}>
            <Button icon="share" text="Change state" />
          </Popover>
          {this.renderContent()}
        </div>
      </div>
    );
  }

  private renderMenu = () => (
      <Menu>
        <MenuItem text="Init" onClick={this.updateState(SearchState.INIT)}/>
        <MenuItem text="Speaking" onClick={this.updateState(SearchState.SPEAKING)}/>
        <MenuItem text="Fetching" onClick={this.updateState(SearchState.FETCHING)}/>
        <MenuItem text="Done" onClick={this.updateState(SearchState.DONE)}/>
      </Menu>
  );

  private renderContent = () => {
    const context = 'Stack Overflow';
    const understood = 'I want to...';
    const guess = '350 gold';

    const results: ResultProps[] = [
      {
        source: 'Stack Overflow' ,
        content: {
         type : ResultType.StackOverflow,
          question: {
            title: 'alors',
            link: 'http://oui.la.vie',
          },
          answer: {
        body: `<p>Blah blah. Blah? <code>that feature</code>I also usethe <a href="https://github.com/cosmologicon/pygame-text/" rel="nofollow noreferrer"><code>lib</code></a>
        <pre><code class="language-css">p { color: red }</code></pre></p>`
        }
        } as any as StackOverflowResult,
},
    {
       source: 'Lol wikia', content: {
          type: ResultType.IFrame,
          href: 'https://leagueoflegends.wikia.com/wiki/Cloud_Drake',
          querySelector: 'aside',
        }
      },
      {
       source: 'Lol wikia', content: {
          type: ResultType.IFrame,
          href: 'https://leagueoflegends.wikia.com/wiki/Gromp',
          querySelector: 'aside',
        } }
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
              {this.renderResultHead(context, understood)}
              <div className={styles.spinner_container}>
                <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_STANDARD}/>
              </div>
            </>
        );
      case SearchState.DONE:
        return (
            <>
              {this.renderResultHead(context, understood)}
              <Text className={styles.best_guess}>Best guess: {guess}</Text>{this.renderResults(results)}
            </>);
            default:
        return null;
    }
  }

	private renderResultHead = (context: string, understood: string) => (
			<>
				<Text>Your query for the context {context}:</Text>

				<Card className={styles.understood}>
					<Text ellipsize={true}>{understood}</Text>
				</Card>
			</>
	)

  private renderResults = (results: ResultProps[]) => (
        <div className={styles.results}>

              {results.map((el: ResultProps, index: number) => <Result key={index} {...el}/>)}
            </div>
          )

    private updateState = (searchState: SearchState) => () => this.setState({ searchState
  });
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

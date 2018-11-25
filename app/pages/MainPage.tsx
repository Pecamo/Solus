import * as React from 'react';
import * as _ from 'lodash';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as MicActions from '../actions/mic';
import { RouteComponentProps } from 'react-router';
import { IState } from '../reducers';

import { MicState } from '../reducers/mic';
import { Button, Card, Intent, Menu, MenuItem, NonIdealState, Popover, Position, Spinner, Text } from '@blueprintjs/core';
import { Result, ResultProps } from './result/Result';

import { ResultNode, Source } from '../types';
import { Mic } from '../microphone/mic';
import { StackExchangeSite, StackExchangeSource } from '../sources/stackoverflow';
import { toastShowAction } from '../actions/mic';
import ContextHandler from '../ContextHandler';
import { CurrentProcessState } from '../reducers/currentProcess';
import { Context } from '../contexts/allContexts';

const styles = require('./MainPage.scss');

export interface MainPageProps extends RouteComponentProps<any> {
  mic: MicState;
  currentProcess: CurrentProcessState;
  toastShowAction: Function;
}

enum SearchState {
  INIT,
  SPEAKING,
  FETCHING,
  DONE
}

interface MainPageState {
  searchState: SearchState;
  heardQuestion: string;
  results: ResultNode[];
}

class MainPage extends React.Component<MainPageProps, MainPageState> {
  microphone: Mic;
  micDiv: HTMLDivElement;
  curVolDiv: HTMLDivElement;
  thresholdVolDiv: HTMLDivElement;

  contextHandler: ContextHandler;

  readonly state: MainPageState = {
    searchState: SearchState.INIT,
    heardQuestion: '...',
    results: []
  };

  setResults(results: MainPageState['results']) {
    this.state.results = results;
  }

  componentWillMount() {
    this.contextHandler = new ContextHandler();
  }

  componentDidMount() {
    console.log('MY PROPS : ', this.props);
    try {
      this.microphone = new Mic(() => {
        console.log('volume detected');
        this.setState({ searchState: SearchState.SPEAKING });
      }, (res) => {
        if (!('msg_body' in res)) {

          console.log('¯\\_(ツ)_/¯ I didnt understand');
          this.props.toastShowAction({
            message: (<>Sorry, I didn't understand what you meant.</>),
            intent: Intent.WARNING,
            icon: 'mobile-phone',
          });
          this.setState({
            searchState: SearchState.INIT,
          });
          return;
        }
        this.setState({
          searchState: SearchState.FETCHING,
          heardQuestion: res.msg_body
        });
        const process = this.props.currentProcess;
        const context: Context | undefined = ContextHandler.getContextOfProcess(process);
        if (!context) {
          console.error('Error Big Time, Monsieur.');
        }
        const sources: Array<Source> = (context as Context).sources;
        const results = [];
        const promises = sources.map((source) => {
          return source.handleQuestion(res)
            .then((response) => {
              console.log('RESPONSES : ', response);
              _.concat(results, response);
              /* this.setState({
                searchState: SearchState.DONE,
                results: response
              }); */
            });
        });
        Promise.all(promises)
          .then(() => {
            setTimeout(() => {
              console.log("GOTTEN RESULTS ; ", results);
              this.setState({
                results,
                searchState: SearchState.DONE
              });
            }, 500);
          });

      });

      this.microphone.init();
    } catch (e) {
      console.log('crash : ', e);
    }
  }

  componentDidUpdate() {
    if (this.micDiv) {
      // we assume the rest is also initialized
      this.microphone.setElements(this.micDiv, this.curVolDiv, this.thresholdVolDiv);
    }
  }

  render() {
    const { currentProcess } = this.props;
    const currentContext = ContextHandler.getContextOfProcess(currentProcess);
    if (!currentContext) {
      console.error('???');
      return (<div>???</div>);
    }
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Popover className={styles.change_state} content={this.renderMenu()} position={Position.BOTTOM}>
            <Button icon="share" text="Change state" />
          </Popover>
          {this.renderContent(currentContext)}
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

  private renderContent = (currentContext: Context) => {
    const context = currentContext.displayName;
    const understood = this.state.heardQuestion;

    console.log("STATE LA VIE", this.state);
    console.log('RESULTS ? ???????', this.state.results);

    const results = this.state.results.map((result) => {
      return {
        source: 'StackOverflow',
        content: result
      };
    });

    /*
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
            body:
                `<p>Blah blah. Blah? <code>that feature</code>I also use the
<a href="https://github.com/cosmologicon/pygame-text/" rel="nofollow noreferrer"><code>lib</code></a>
<pre><code class="language-css">p { color: red }</code></pre></p>`
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
        source: 'Lol wikia', content: {
          type: ResultType.IFrame,
          href: 'https://leagueoflegends.wikia.com/wiki/Gromp',
          querySelector: 'aside',
        }
      }
    ];*/


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
        return this.renderMic();
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
              <div className={styles.results}>
                {results.map((el: ResultProps, index: number) => <Result key={index} {...el}/>)}
              </div>
            </>
        );
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

  private renderMic = () => (
    <div className={styles.mic_container}>
      <div className={styles.mic_main}>
        <div id={styles.microphone} ref={(ref: HTMLDivElement) => this.micDiv = ref}/>
        <div id={styles.volume}>
          <div id={styles.threshold_volume} ref={(ref: HTMLDivElement) => this.thresholdVolDiv = ref}/>
          <div id={styles.current_volume} ref={(ref: HTMLDivElement) => this.curVolDiv = ref}/>
        </div>
      </div>
      <pre id="result"/>
      <div id="info"/>
      <div id="error"/>
    </div>
  )

  private updateState = (searchState: SearchState) => () => this.setState({ searchState });
}

function mapStateToProps(state: IState): Partial<MainPageProps> {
  return {
    mic: state.mic,
    currentProcess: state.currentProcess
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<MainPageProps> {
  return bindActionCreators(MicActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(MainPage) as any as React.StatelessComponent<MainPageProps>);

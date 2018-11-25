import * as React from 'react';
import { Card, H5, Intent, Spinner, Tag } from '@blueprintjs/core';
import { IFrameResult, ResultNode, ResultType } from '../../types';

const styles = require('./styles.scss');

export interface ResultProps {
  source: string;
  content: ResultNode;
}

export class Result extends React.PureComponent<ResultProps> {
  render() {
    return (
        <Card className={styles.result}>
          <Tag className={styles.source}>
            {this.props.source}
          </Tag>
          {this.renderContent()}
        </Card>
    );
  }

  private renderContent = () => {
    switch (this.props.content.type) {
      case ResultType.StackOverflow:
        return (
          <>
            <H5><a href={this.props.content.question.link}>{this.props.content.question.title}</a></H5>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                // FIXME remove any later
                __html: `<p>${(this.props.content.answer as any).body}</p>`
              }}
            />
          </>
        );
      case ResultType.IFrame:
        return (
          <>
            <H5><a href={this.props.content.href}>{this.props.content.href}</a></H5>
            <ResultFetcher {...this.props.content}/>
          </>
        );
      default:
        return this.props.content;
    }
  }
}

interface ResultFetcherState {
  fetching: boolean;
  html: string;
}

class ResultFetcher extends React.Component<IFrameResult, ResultFetcherState> {
  readonly state: ResultFetcherState = { fetching: true, html: '' };

  async componentDidMount() {
    const res = await fetch(this.props.href);
    if (!res.ok) {
      console.error('Fetch error:', res);
    }

    const parsed: Document = new DOMParser().parseFromString(await res.text() , 'text/html');
    const queried = parsed.querySelector(this.props.querySelector || 'body');

    this.setState({
      fetching: false,
      html: queried ? queried.innerHTML : '',
    });
  }

  render() {
    if (this.state.fetching) {
      return <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_STANDARD}/>;
    }

    return (
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: this.state.html }}/>
    );
  }
}

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
    console.log('la vie cest drôle', this.props);
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
            <H5><a href={this.props.content.question.link}>{this.decodeEntities(this.props.content.question.title)}</a></H5>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: `<p>${this.props.content.answer.body}</p>`
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
        return null;
    }
  }

  private decodeEntities = (() => {
    // this prevents any overhead from creating the object each time
    const element = document.createElement('div');

    // regular expression matching HTML entities
    const entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig;

    return (str: string) => {
      // find and replace all the html entities
      const replaced = str.replace(entity, (m: string): string => {
        element.innerHTML = m;
        return element.textContent || '';
      });

      // reset the value
      element.textContent = '';

      return replaced;
    };
  })();
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

import * as React from 'react';
import { Card, H4, H5, Intent, Spinner, Tag } from '@blueprintjs/core';
import { IFrameResult, ResultNode, ResultType } from '../../types';

import * as hljs from 'highlight.js';

const styles = require('./styles.scss');

export interface ResultProps {
  source: string;
  content: ResultNode;
}

export class Result extends React.PureComponent<ResultProps> {
  componentDidMount() {
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
  }

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
      case ResultType.IFrame:
        // FIXME title
        return (
            <>
              <H4>{this.props.content.href.substr(this.props.content.href.lastIndexOf('/') + 1)}</H4>
              <p>{this.props.content.href}</p>
              <ResultFetcher {...this.props.content}/>
            </>
        );
      default:
        // FIXME: not necessarily a stack exchange source, the content.type should contain the type of render
        return (
          <>
            <H4>{this.decodeEntities(this.props.content.question.title)}</H4>
            <p>{this.props.content.question.link}</p>
            <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: `<p>${this.props.content.answer.body}</p>`
                }}
            />
          </>
      );
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
    // const anchors = queried.querySelector('a').forEach(a => a.removeAttribute('href'));

    this.setState({
      fetching: false,
      html: queried ? queried.innerHTML : '',
    });
  }

  componentDidUpdate() {
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
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

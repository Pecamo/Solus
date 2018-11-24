import * as React from 'react';
import { Card, Tag } from '@blueprintjs/core';

const styles = require('./styles.scss');

export interface ResultProps {
  source: string;
  content: string;
}

export class Result extends React.PureComponent<ResultProps> {
  render() {
    return (
        <Card className={styles.result}>
          <Tag className={styles.source}>
            {this.props.source}
          </Tag>
          <div className={styles.content}>
            {this.props.content}
          </div>
        </Card>
    );
  }
}

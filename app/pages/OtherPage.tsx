import * as React from 'react';

const styles = require('./OtherPage.scss');

export default class OtherPage extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        I'm the other page
      </div>
    );
  }
}

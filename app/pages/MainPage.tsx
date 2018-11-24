import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as MicActions from '../actions/mic';
import { RouteComponentProps } from 'react-router';
import { IState } from '../reducers';

import { MicState } from '../reducers/mic';

const styles = require('./MainPage.scss');
const appStyles = require('../containers/App.scss');

export interface MainPageProps extends RouteComponentProps<any> {
  mic: MicState;
}

class MainPage extends React.Component<MainPageProps> {

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          Hi ! I'm the main page content.
        </div>
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

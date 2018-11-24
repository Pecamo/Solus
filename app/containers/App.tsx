import * as React from 'react';
import {
  FocusStyleManager,
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Dialog,
  Classes, AnchorButton, Text
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { RouteComponentProps } from 'react-router-dom';
import { ToMain } from '../types/ipcMessages';
import { IState } from '../reducers';

FocusStyleManager.onlyShowFocusOnTabs();

const styles = require('./App.scss');

const imgWindowMax = require('../resources/img/window-max.png');
const imgWindowMin = require('../resources/img/window-min.png');
const imgWindowClose = require('../resources/img/window-close.png');
const imgSolusText = require('../resources/img/solus_logo_15_full.png');

export interface AppProps extends RouteComponentProps<any> {
  osType: string;
}

export interface AppState {
  isModalOpen: boolean;
  modalContent: React.ReactNode;
}

export class App extends React.Component<AppProps, AppState> {
  componentWillMount() {
    this.setState({ isModalOpen: false, modalContent: null });
  }

  static minimizeWindow() {
    ipcRenderer.send(ToMain.MINIMIZE);
  }

  static maximizeWindow() {
    ipcRenderer.send(ToMain.MAXIMIZE);
  }

  static closeWindow() {
    ipcRenderer.send(ToMain.CLOSE);
  }

  openModal = (content: React.ReactNode) => {
    this.setState({ isModalOpen: true, modalContent: content });
  }

  openSettingsModal = () => {
    this.openModal((<div>
      <div className={Classes.DIALOG_HEADER}>
        Settings
      </div>
      <div className={Classes.DIALOG_BODY}>
        There is currently nothing to configure.
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Text className={Classes.TEXT_DISABLED}>
          Solus v0.0.1
        </Text>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <AnchorButton
            onClick={this.closeModal}
          >
            Ok
          </AnchorButton>
        </div>
      </div>
    </div>));
  }

  closeModal = () => {
    this.setState({ isModalOpen: false, modalContent: null });
  }

  render() {
    const { osType } = this.props;
    const { isModalOpen, modalContent } = this.state;
    return (
      <div className={`bp3-dark ${styles.container}`}>
        {osType !== 'Linux' && <Navbar className={styles.navBar} fixedToTop={true}>
          <NavbarGroup className={styles.navBarLeft}>
            <NavbarHeading className={`${styles.title}${osType === 'Darwin' ? ` ${styles.osDarwin}` : ''}`}>
              <img
                src={imgSolusText}
                className={styles.logo}
                width="auto"
                height="auto"
              />
            </NavbarHeading>
            <NavbarDivider />
            {/*<NavLink to="/other" activeClassName={styles.activeNavLink}>
              <Button className="bp3-minimal" icon="mobile-phone" text="Other page" />
            </NavLink>*/}
          </NavbarGroup>
          <NavbarGroup className={styles.navBarRight}>
            <Button
              className="bp3-minimal"
              icon="cog"
              onClick={() => this.openSettingsModal()}
            />
            {osType !== 'Darwin' && <button className={`${styles.windowsButton}`} onClick={App.minimizeWindow}><img src={imgWindowMin} /></button>}
            {osType !== 'Darwin' && <button className={`${styles.windowsButton}`} onClick={App.maximizeWindow}><img src={imgWindowMax} /></button>}
            {osType !== 'Darwin' && <button className={`${styles.closeButton} ${styles.windowsButton}`} onClick={App.closeWindow}>
              <img src={imgWindowClose} />
            </button>}
          </NavbarGroup>
        </Navbar>}
        {osType === 'Linux' && <div className={styles.linuxNavBarContainer}><Button
          className="bp3-minimal"
          icon="cog"
          onClick={() => this.openSettingsModal()}
        /></div>}
        <div className={styles.pageContainer}>
          {this.props.children}
        </div>
        <Dialog
          isOpen={isModalOpen}
          onClose={this.closeModal}
          className={Classes.DARK}
        >
          {modalContent}
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state: IState): Partial<AppProps> {
  return {
    osType: state.osType
  };
}

export default (
  connect(mapStateToProps, {})(App)
);

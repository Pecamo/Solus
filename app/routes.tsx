import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';
import MainPage from './pages/MainPage';
import OtherPage from './pages/OtherPage';

const redirect = () => <Redirect from="/" exact={true} to="/main" />;

export default () => (
  <App>
    <Switch>
      <Route path="/" exact={true} render={redirect} />
      <Route path="/main" component={MainPage} />
      <Route path="/other" component={OtherPage} />
    </Switch>
  </App>
);

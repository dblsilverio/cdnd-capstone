import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';

import { Auth0Provider } from "@auth0/auth0-react";

import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './ui/Footer';
import Header from './ui/Header';
import { Container, Jumbotron } from 'react-bootstrap';

import { authConfig } from './config/config'
import PrivateRoute from './components/PrivateRoute';
import Main from './components/Main';
import { Collections } from './components/Collections';
import { CollectionImages } from './components/CollectionImages';

const { callbackUrl, clientId, domain } = authConfig

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider clientId={clientId} redirectUri={callbackUrl} domain={domain}>
      <BrowserRouter>
        <Header />
        <Container>
          <Jumbotron>
            <Switch>
              <Route exact path="/" component={Main} />
              <PrivateRoute exact path="/collections/" component={Collections} />
              <PrivateRoute exact path="/collections/:collectionId" component={CollectionImages} />
            </Switch>
          </Jumbotron>
        </Container>
      </BrowserRouter>
    </Auth0Provider>
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

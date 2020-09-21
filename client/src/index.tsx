import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './ui/Footer';
import Header from './ui/Header';
import { Container, Jumbotron } from 'react-bootstrap';
import Collections from './components/Collections';
import CollectionImages from './components/CollectionImages';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Container>
        <Jumbotron>
          <Switch>
            <Route exact path="/">
              <Collections />
            </Route>
            <Route exact path="/login">
              Login
</Route>
            <Route exact path="/logoff">
              Logoff
</Route>
            <Route exact path="/callback">
              Callback
</Route>
            <Route exact path="/collections/:collectionId">
              <CollectionImages />
            </Route>
          </Switch>
        </Jumbotron>
      </Container>
    </BrowserRouter>
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

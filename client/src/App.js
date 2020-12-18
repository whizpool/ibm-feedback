import React, { Component, } from 'react';
//import logo from './logo.svg';
import './app.scss';
import { Content,HeaderContainer } from 'carbon-components-react';
//import { Route, Switch, Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';


import AppHeader from './components/AppHeader';
import WidgetPage from './content/WidgetPage';
import AdminPage from './content/AdminPage';
import FeedbackPage from './content/FeedbackPage';
import ViewPage from './content/ViewPage';
import EditPage from './content/EditPage';
import RepoPage from './content/RepoPage';


class App extends Component {
  render() {
	   return (
			<div className="container">
			<HeaderContainer
			render={({ isSideNavExpanded, onClickSideNavExpand }) => (
				<>
					<AppHeader isSideNavExpanded={isSideNavExpanded} onClickSideNavExpand={onClickSideNavExpand} />
					<Content className="bx--offset-lg-2">
						<Switch>
							<Route exact path="/" component={WidgetPage} />							
							<Route path="/feedbacks" component={FeedbackPage} />
							<Route path="/admins" component={AdminPage} />
							<Route path="/view/:id" component={ViewPage} />
							<Route path="/edit/:id/:configure" component={EditPage} />
							
							<Route path="/repos" component={RepoPage} />
						</Switch>
					</Content>
				</>
			)}
			/>
			</div>
		);
	}
}

export default App;

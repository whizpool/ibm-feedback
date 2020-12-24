import React, { Component} from 'react';
//import logo from './logo.svg';
import './app.scss';
import { Content,HeaderContainer } from 'carbon-components-react';
//import { Route, Switch, Link } from 'react-router-dom';
import { Route, Switch,Redirect } from 'react-router-dom';
import { connect} from 'react-redux'


import AppHeader from './components/AppHeader';
import WidgetPage from './content/WidgetPage';
import AdminPage from './content/AdminPage';
import FeedbackPage from './content/FeedbackPage';
import ViewPage from './content/ViewPage';
import EditPage from './content/EditPage';
import LoginPage from './content/LoginPage';


const mapStateToProps = (state) => {

	return {
			isLogged: state.auth.isLogged,
			account_id: state.auth.account_id, 
			email: state.auth.email, 
			name: state.auth.name, 
			role: state.auth.role
			
		};
};
const mapDispatchToProps = (dispatch) => {
    return {
        saveLogoutState: (data) => dispatch(data),
    }
}	
	
class App extends Component {
	
	
	onClickSignOut  = (event) => {	
			event.preventDefault();
			this.props.saveLogoutState({type: 'SIGN_OUT'})
	};
	
	componentDidMount() {
    document.title = 'React Login';
  }
	
  render() {
	   return (
			<div className="container">
			<HeaderContainer
			render={({ isSideNavExpanded, onClickSideNavExpand }) => (
				<>
					{this.props.isLogged? <AppHeader isSideNavExpanded={isSideNavExpanded} onClickSideNavExpand={onClickSideNavExpand} onClickSignOut={this.onClickSignOut}  userData = {this.props} /> : "" }
					<Content className={this.props.isLogged? "bx--offset-lg-2" : "fullpage" }>
						<Switch>
							<Route path="/login" component={LoginPage} />
							
							{
								this.props.isLogged ?
								<>
								<Route exact path="/" component={WidgetPage} />							
								<Route path="/feedbacks" component={FeedbackPage} />
								<Route path="/admins" component={AdminPage} />
								<Route path="/view/:id" component={ViewPage} />
								<Route path="/edit/:id/:configure" component={EditPage} />
								</>
								:
									<Redirect to="/login"/>
							}
							
						</Switch>
					</Content>
				</>
			)}
			/>
			</div>
		);
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(App);


import React from 'react';
import {  
	Grid, 
	Row, 
	Column,
	Button,
	TextInput,
	InlineLoading,
	InlineNotification 
} from 'carbon-components-react';
import axios from "axios";
import {connect} from 'react-redux'
import jwt_decode from "jwt-decode";

const mapStateToProps = (state) => {
	return {
		authError: state.auth.authError,
		isLogged: state.auth.isLogged,
		account_id: state.auth.account_id, 
		email: state.auth.email, 
		name: state.auth.name, 
		role: state.auth.role,
		iam_id: state.auth.iam_id		
	};
};

const mapDispatchToProps = (dispatch) => {
    return {			
        saveLoginSateData: (data) => dispatch(data),
    }
}

class LoginPage extends React.Component {
	constructor(props){
		super(props);
		this.state={
			apikey:'',
			errorMessage:false,
		}
	}
	
  	saveData = event => {
		const target = event.target;
		let fieldName = target.name;
		let fieldValue = target.value;
		if (!fieldValue) {
			this.setState({ [fieldName]: fieldValue, [fieldName + "Invalid"]: true });
		} else {
			this.setState({
				[fieldName]: fieldValue,
				[fieldName + "Invalid"]: false
			});
		}
  	};
	
 	LoginIBM = event => {
		event.preventDefault();
		if (!this.state.apikey) {
				this.setState({ apikeyInvalid: true });
		} else {
			this.setState({ 
				isSubmitting: true,
				ariaLive: "Off",
				description: "Submitting" 
			});			
			this.Login();	
		}
	};

	//*********** API ************/
	Login = () => {
		//const dispatch = useDispatch()	
		axios.post(process.env.REACT_APP_API_ENDPOINT+`users/login`,{apikey:this.state.apikey})
		.then((response) => {		
			response = response.data.data	
			var decodedToken = jwt_decode(response.access_token);
			console.log(decodedToken)
			this.props.saveLoginSateData({type: 'LOGIN_SUCCESS', isLogged:true,account_id: response.account_id, email: decodedToken.email, name: decodedToken.name, role: 'Administrator', refresh_token: response.refresh_token, access_token: response.access_token,iam_id:decodedToken.iam_id,api_key:this.state.apikey})
			this.props.history.push("/")				
		}).catch((error) => {
			//console.log(error);
			this.setState({ 
				errorMessage: true,
				isSubmitting: false,
				ariaLive: "Off",
				description: "Submitting" 
			});			
			this.props.saveLoginSateData({type: 'LOGIN_ERROR', message:'Access is denied due to invalid credentials.'})			
		});
	};
	
render() {
    return (
		<Grid style={{padding: "0" }} className="LoginPage">
			<Row>
				<Column sm={12} md={12} lg={12}  className="LoginGrid">
					<h3 >	Login </h3>			
					<hr/> <br/>
					<TextInput
						id="apikey"
						name="apikey"
						value={this.state.apikey || ""}
						onChange={this.saveData}
						labelText=""
						placeholder="Enter your api key"
						style={{ marginBottom: '1rem' }}
						invalid={this.state.apikeyInvalid}
						invalidText="Please enter a api key.."
					/>						
					{
						this.state.isSubmitting || this.state.success ? 
						<InlineLoading
							style={{ marginLeft: '1rem' }}
							description={this.state.description}
							status={this.state.success ? 'finished' : 'active'}
							aria-live={this.state.ariaLive}
						/>
					: 
						<Button kind='primary' onClick={(event) => {this.LoginIBM(event)}}>Login</Button>
					}
						{this.state.errorMessage  ? 
							<InlineNotification
								kind="error"
								subtitle={<span>{this.props.authError}</span>}
								title="Authorization Failed"
						/> : ""
					}
			</Column>						
			</Row>						
		</Grid>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage);

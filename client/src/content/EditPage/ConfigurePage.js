import React from 'react';
import { connect} from 'react-redux'

import {Grid, Row, Column,Button ,ComposedModal,ModalHeader,ModalBody,ModalFooter,InlineLoading,TextInput,Form,Select,SelectItem} from 'carbon-components-react';
import {LogoGithub32 as GitHub, LogoSlack32 as Slack, CheckmarkFilled24 as Verified} from '@carbon/icons-react';

import axios from "axios";

var validUrl = require('valid-url');
let checkFlag = true;

const mapStateToProps = (state) => {
	return {
			isLogged: state.auth.isLogged,
			access_token:state.auth.access_token,
			api_key:state.auth.api_key,
			refresh_token:state.auth.refresh_token,
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

class ConfigurePage extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
		  gitHubModalOpen: false,
		  slackModalOpen: false,
		  gitHubRepodisabled: true,
		  scan: true,
		  api_response: [],
			isSubmitting: false,
		  description: "Submititting",
			deleteRowIndex : 0,
		  ariaLive: false,
		  success : false,
		  RepoListItem : "",
		  gitHubRepoName : "",
		  repo_name : "",
		  repo_ID : "",
		};
	}
	
	closeModal = event => {
		event.preventDefault();
		this.setState({ 
			gitHubModalOpen: false ,
			slackModalOpen: false ,
			gitHubRepodisabled: true ,
			api_response: [],
			RepoListItem : "",
			isSubmitting: false, 
			success: false, 
			ariaLive: "Off", 
			description: "Submitting",
			githuburl: "",
			gitHubPAC: "",
		});
	};
	
	checkForm = () => {
		checkFlag = true;
		if (!this.state.githuburl) {
			this.setState({ githuburlInvalid: true });
			checkFlag = false;
		} else {
			if (!validUrl.isUri(this.state.githuburl)){
				this.setState({ githuburlInvalid: true });
				checkFlag = false;
			}
		}
		if (!this.state.gitHubPAC) {
			this.setState({ gitHubPACInvalid: true });
			checkFlag = false;
		} 
		return checkFlag;
  };
  
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
  
	
	saveForm = event => {
		event.preventDefault();
		if (this.checkForm()) {				
			this.getGitHubRepoList()
		}
	};
	
	VerifyStamped = (type) => {
		var isConnected = false
		if(type.toLowerCase() === "github") {
			isConnected = this.props.widgetData.is_github_connected
		} 
		if(type.toLowerCase() === "slack") {
			isConnected = this.props.widgetData.is_slack_connected
		} 
		return  isConnected ? <Verified style={{ color:"green"}}/> : ''
	
	}
  
  
 /******************** API CALL ***************/
	getGitHubRepoList = event => {
		event.preventDefault();
		if (this.checkForm()) {
			this.setState({ isSubmitting: true });
			
			axios.get(this.state.githuburl+'/user/repos?type=all',{
			headers: {
				'Authorization': `token ${this.state.gitHubPAC}` ,
				'Accept': `application/vnd.github.baptiste-preview+json` 
			}})
			.then(result => {
				var repos = result.data;
				var reposList = repos.map(function(obj) {
										return (
												<SelectItem key={obj.id}
													text={obj.name}
													value={obj.id}
												/>
											)
										});
												
				this.setState({
						RepoListItem: reposList,
						api_response: result.data,
						gitHubRepodisabled: false,
						scan: false,
						isSubmitting: false
				 });
				
			})
			.catch(error =>
				this.setState({
					error,
					isSubmitting: false
				})
			);
		}
	};
  
	saveGitHubData = () => {
		let repos = this.state.api_response;
		let repo = repos.filter(obj => obj.id === parseInt(this.state.gitHubRepoID));
		let RepoName= repo[0].name;
		let RepoUrl= repo[0].html_url;
		let OwnerName= repo[0].owner.login;
		let ApiResponse = JSON.stringify(this.state.api_response);
		this.setState({ isSubmitting:true });
		
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+`widgets/github/`+this.props.recordID,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data : {pac:this.state.gitHubPAC,api_url:this.state.githuburl,api_response:ApiResponse,repo_id:this.state.gitHubRepoID,repo_name:RepoName,repo_url:RepoUrl,repo_owner:OwnerName}
		};
		axios(config)
		.then(response => {
			this.setState({ 
						isSubmitting: false,
						success: true,
						description: "Submitted" 
				});
				
				var widgetUpdateData = this.props.widgetData;
				widgetUpdateData.is_github_connected = true
				widgetUpdateData.repo_id = this.state.gitHubRepoID
				widgetUpdateData.repo_name = RepoName
				this.props.updateWidgetData(widgetUpdateData)
		})
		.catch((error) => {

			this.setState({
				error,
				isLoading: false
			});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
			
	};	
	
	saveSlackData = () => {
		this.setState({ isSubmitting:true });
		
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+`widgets/slack/`+this.props.recordID,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data : {webhook:this.state.webhook,channel:this.state.channelName}
		};
		axios(config)
		.then(response => {
			this.setState({ 
						isSubmitting: false,
						success: true,
						description: "Submitted" 
				});
				
				var widgetUpdateData = this.props.widgetData;
				widgetUpdateData.is_slack_connected = true
				widgetUpdateData.webhook = this.state.webhook
				widgetUpdateData.channelName = this.state.channelName
				this.props.updateWidgetData(widgetUpdateData)
		})
		.catch((error) => {

			this.setState({
				error,
				isLoading: false
			});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
			
	};	
	
	unlinkConnection = (connection_type) => {
		this.setState({ isSubmitting:true });
		
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+`widgets/unlink_connection/`+this.props.recordID,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data : {type:connection_type}
		};
		axios(config)
		.then(response => {
				var widgetUpdateData = this.props.widgetData;
				if(connection_type.toLowerCase() === "github") {
					widgetUpdateData.is_github_connected = false
					widgetUpdateData.repo_id = ""
					widgetUpdateData.repo_name = ""
				}
				if(connection_type.toLowerCase() === "slack") {
					widgetUpdateData.is_slack_connected = false
					widgetUpdateData.webhook = ""
					widgetUpdateData.channelName = ""	
				}
				this.props.updateWidgetData(widgetUpdateData)
				this.setState({ 
						isSubmitting: false,
						success: false,
						description: "Submitted", 
						gitHubRepoID: "" ,
						gitHubPAC: "" ,
						githuburl: "" ,
						api_response: [],
						webhook: "" ,
						channelName: "" ,
				});
		})
		.catch((error) => {

			this.setState({
				error,
				isLoading: false
			});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
			
	};
	
  render() {	  
		
  return (
		<>
			<ComposedModal size="sm" open={this.state.gitHubModalOpen} preventCloseOnClickOutside={true} >
					<ModalHeader>
						<h4>Connect GitHub</h4>
					</ModalHeader>
					<ModalBody style={{ paddingRight: '1rem' }}>
						<>
							<p>Please fill out the following information below in order to connect with GitHub</p><br/>
						</>
						<Form>
							
								<TextInput
								id="githuburl"
								name="githuburl"
								value={this.state.githuburl || ""}
								onChange={this.saveData}
								labelText="URL"
								placeholder="Enter GitHub URL"
								style={{ marginBottom: '1rem' }}
								invalid={this.state.githuburlInvalid}
								invalidText="Please enter a widget name.."
										
								/>
								<TextInput
									id="gitHubPAC"
									name="gitHubPAC"
									value={this.state.gitHubPAC || ""}
									onChange={this.saveData}
									style={{ marginBottom: '1rem' }}
									labelText="Personal Access Token"
									placeholder="e9:f3:29:3f:6r:6g:8l:p8:o9:y3:t9"
									invalid={this.state.gitHubPACInvalid}
									invalidText="Please enter personal access token.."
								/>	
								<Select
											//onChange={(e)=>this.UpdateWidgetRowsValue(e, currentRowIndex,header)}
											defaultValue={(this.state.gitHubRepoID) ? this.state.gitHubRepoID : "placeholder-item"}
											disabled={this.state.gitHubRepodisabled}
											onChange={this.saveData}
											id="gitHubRepoID"							
											name="gitHubRepoID"
											labelText="GitHub repository"
											invalid={this.state.gitHubRepoNameInvalid}
											invalidText="Please select Github repo "
										>
										<SelectItem
											text="GitHub Repo"
											value="placeholder-item"
										/>
										{this.state.RepoListItem}
								</Select>
				
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button kind="secondary" onClick={(event) => {this.closeModal(event)}}>Cancel</Button>
							{
								this.state.scan ? (	
									
										this.state.isSubmitting || this.state.success ? (
											<InlineLoading
												style={{ marginLeft: '1rem' }}
												description={this.state.description}
												status={this.state.success ? 'finished' : 'active'}
												aria-live={this.state.ariaLive}
											/>
										) :
										(
											<Button kind='primary' onClick={(event) => {this.getGitHubRepoList(event)}}>Scan</Button>
										)
									
								):
								(
									
										this.state.isSubmitting || this.state.success ? (
											<InlineLoading
												style={{ marginLeft: '1rem' }}
												description={this.state.description}
												status={this.state.success ? 'finished' : 'active'}
												aria-live={this.state.ariaLive}
											/>
										) :
										(
											<Button kind='primary' onClick={(event) => {this.saveGitHubData(event)}}>Connect</Button>
										)
									
								)								
							}
						
					</ModalFooter>
				</ComposedModal>
				
				<ComposedModal size="sm" open={this.state.slackModalOpen} preventCloseOnClickOutside={true} >
					{/*https://api.slack.com/apps/A01H4QWB63D/incoming-webhooks?*/}
					<ModalHeader>
						<h4>Connect Slack</h4>
					</ModalHeader>
					<ModalBody style={{ paddingRight: '1rem' }}>
						<>
							<p>Please fill out the following information below in order to connect with Slack</p><br/>
						</>
						<Form>
								 <TextInput
											id="WebHook"
											name="webhook"
											value={this.state.webhook || ""}
											onChange={this.saveData}
											labelText="WebHook"
											placeholder="Enter Slack WebHook "
											style={{ marginBottom: '1rem' }}
											invalid={this.state.webhookInvalid}
											invalidText="Please enter a widget name.."
									/>
									<TextInput
										id="channelName"
										name="channelName"
										value={this.state.channelName || ""}
										onChange={this.saveData}
										labelText="Channel Name"
										placeholder="Channel name"
										invalid={this.state.channelNameInvalid}
										invalidText="Please enter a channel name .."
									/>			  
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button kind="secondary" onClick={(event) => {this.closeModal(event)}}>Cancel</Button>
						{this.state.isSubmitting || this.state.success ? (
							<InlineLoading
								style={{ marginLeft: '1rem' }}
								description={this.state.description}
								status={this.state.success ? 'finished' : 'active'}
								aria-live={this.state.ariaLive}
							/>
						) : (
							<Button kind='primary' onClick={(event) => {this.saveSlackData(event)}}>Connect Slack</Button>
						)}
					</ModalFooter>
				</ComposedModal>
				
		 
			<Grid style={{padding: "0",margin: "50px 0 0 0 " }}>
						<Row>
							<Column sm={12} md={6} lg={9}>
								<h3 ><GitHub /> GitHub Connected {this.VerifyStamped('github')} </h3>
										{
											this.props.widgetData.is_github_connected ?
												<div style={{ margin: "10px 0",fontSize: "15px"}}>
													<p>Repo Owner : <strong>{this.props.widgetData.repo_owner}</strong></p> 
													<p style={{ marginTop: ".5rem"}}>Repo Name : <strong>{this.props.widgetData.repo_name}</strong></p>
													<p style={{ margin: "10px 0",fontSize: "15px"}}>
														<Button kind="secondary" onClick={() => {this.unlinkConnection('github');}}>Unlink</Button>
													</p>
												</div>
										
											:
												<div style={{ margin: "10px 0",fontSize: "15px"}}>
												<p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
												</p>
												<p style={{ margin: "10px 0",fontSize: "15px"}}>
													<Button kind="secondary" onClick={() => {this.setState({ gitHubModalOpen: true });}}>Connect GitHub</Button>
												</p>
										</div>
									
									}
							

							</Column>
						</Row>
						<Row >
							<Column sm={12} md={6} lg={9} style={{ margin: "100px 0 0 0"}}>
								<h3 ><Slack /> Slack Connected {this.VerifyStamped('slack')}</h3>
								
								{
											this.props.widgetData.is_slack_connected ?
												<div style={{ margin: "10px 0",fontSize: "15px"}}>
													<p>WebHook : <strong>{this.props.widgetData.webhook}</strong></p> 
													<p style={{ marginTop: ".5rem"}}>Channel Name : <strong>{this.props.widgetData.channelName}</strong></p>
													<p style={{ margin: "10px 0",fontSize: "15px"}}>
														<Button kind="secondary" onClick={() => {this.unlinkConnection('slack');}}>Unlink</Button>
													</p>
												</div>
										
											:
												<div style={{ margin: "10px 0",fontSize: "15px"}}>
												<p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
												</p>
												<p style={{ margin: "10px 0",fontSize: "15px"}}>
													<Button kind="secondary" onClick={() => {this.setState({ slackModalOpen: true });}}>Connect Slack</Button>
												</p>
										</div>	
									}

							</Column>
						</Row>
					</Grid>	
					</>	
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ConfigurePage);
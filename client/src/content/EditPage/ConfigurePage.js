import React from 'react';
import { connect} from 'react-redux'
import {
	Grid, 
	Row,
	Column,
	Button ,
	ComposedModal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	InlineLoading,
	TextInput,
	Form,
	Select,
	SelectItem,
	InlineNotification,
	TileGroup,
 	RadioTile,
} from 'carbon-components-react';
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
			slackUnlink: false, 
			githubUnlink: false, 
			successMessage : "",
			AllRepoListItem : [],
			RepoListItem : "",
			RepoDetail : "",
			gitHubRepoName : "",
			repo_name : "",
			repo_ID : "",
			webhook : "",
			repoIDOption : "repolist",
			page_count : 100,
			page : 1,
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
		let fieldName;
		let fieldValue;		
		if(event === 'repourl' || event ==='repolist') {
			fieldName = "repoIDOption"
			fieldValue = event	
			if(event === 'repourl'){
					this.setState({
							scan: false,
					});					
			}
			if (event === 'repolist' && this.state.RepoListItem === '') {
					this.setState({
							scan: true,
					});
			}
		}
		else {
		const target = event.target;
			fieldName = target.name;
			fieldValue = target.value;
		}
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
	
	showRepoIDSelection = event => {
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
	getGitHubRepoDetail = () => {
  return new Promise(async (resolve, reject) => {
				if (this.checkForm()) {
					axios.get(this.state.gitHubRepoURL,{
					headers: {
						'Authorization': `token ${this.state.gitHubPAC}` ,
						'Accept': `application/vnd.github.baptiste-preview+json` 
					}})
					.then(result => {
						var repos = result.data;
						this.setState({
							RepoDetail: repos,
							api_response: result.data
						})
						resolve(result)
					})
					.catch( (error)   => {
							this.setState({
								error,
								isSubmitting: false
							})
							resolve(error)
						}
					);
				}
		})
	}

	getGitHubRepoList = event => {
		//event.preventDefault();
		event.persist()
		let page_count = this.state.page_count;
		let page = this.state.page;
		
		if (this.checkForm()) {
			this.setState({ isSubmitting: true });			
			axios.get(this.state.githuburl+'/user/repos?type=all&per_page='+page_count+'&page='+page,{
			headers: {
				'Authorization': `token ${this.state.gitHubPAC}` ,
				'Accept': `application/vnd.github.baptiste-preview+json` 
			}})
			.then(result => {
				var repos = result.data;
				//console.log(reposData)
				//var count = 
				var reposData = this.state.AllRepoListItem;
				for(let i=0;i<repos.length;i++){
					reposData.push(repos[i])
				}
				//repos.map(function(obj) {
				//	reposData.push(obj)
				//});		
				if(repos.length < page_count) {				
						var reposList = reposData.map(function(obj) {
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
				} else {
						this.setState({
							page: page+1,
							AllRepoListItem: reposData
						});
						this.getGitHubRepoList(event)
				}
			
			})
			.catch(error =>
				this.setState({
					error,
					isSubmitting: false
				})
			);
		}
	};
  
	saveGitHubData = async () => {
		let repos = this.state.api_response;
		this.setState({invalidURL:false});
		
		let RepoName;
		let RepoUrl;
		let OwnerName;
		let ApiResponse = '';
		let RepoID = this.state.gitHubRepoID;
		let isValidDataToSubmit = true
		this.setState({ isSubmitting:true });
		if (this.state.repoIDOption === 'repolist')	 {		
		let repo = repos.filter(obj => obj.id === parseInt(this.state.gitHubRepoID));
			RepoName= repo[0].name;
			RepoUrl= repo[0].html_url;
			OwnerName= repo[0].owner.login;
			ApiResponse = JSON.stringify(this.state.api_response);
		}  else {	
		
			await this.getGitHubRepoDetail();			
		
			let repo = this.state.RepoDetail
			if(repo) {
				RepoID = repo.name;
				RepoUrl= repo.html_url;
				RepoName = repo.name
				OwnerName = repo.owner.login;
				ApiResponse = JSON.stringify(this.state.api_response);
			} else {
				isValidDataToSubmit = false;
				this.setState({ 
					invalidURL:true
				});
			}
		}			
		if(isValidDataToSubmit) {	
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`widgets/github/`+this.props.recordID,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
				data : {pac:this.state.gitHubPAC,api_url:this.state.githuburl,api_response:ApiResponse,repo_id:RepoID,repo_name:RepoName,repo_url:RepoUrl,repo_owner:OwnerName}
		};
		axios(config)
		.then(response => {				
			var widgetUpdateData = this.props.widgetData;
			widgetUpdateData.is_github_connected = true
			widgetUpdateData.repo_id = this.state.gitHubRepoID
			widgetUpdateData.repo_name = RepoName
			widgetUpdateData.repo_owner = OwnerName
			this.props.updateWidgetData(widgetUpdateData)
			this.setState({ 
				isSubmitting: false,
				gitHubModalOpen: false,
				success: true,
				description: "Submitted" ,						
				successMessage: "You have successfully connected github.",
			});
			setTimeout(() => {
				this.setState({ success: false })
			}, 3000)
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
		}
		
			
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
				
			var widgetUpdateData = this.props.widgetData;
			widgetUpdateData.is_slack_connected = true
			widgetUpdateData.webhook = this.state.webhook
			widgetUpdateData.channelName = this.state.channelName
			this.props.updateWidgetData(widgetUpdateData)
			this.setState({ 
				isSubmitting: false,
				slackModalOpen: false,
				success: true,
				description: "Submitted",
				successMessage: "You have successfully connected slack",
			});
			setTimeout(() => {
				this.setState({ success: false })
			}, 3000)
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
		if(connection_type.toLowerCase() === "slack") {
			this.setState({ isSubmitting:true,githubUnlink:true });	
		}
		if(connection_type.toLowerCase() === "slack") {
			this.setState({ isSubmitting:true,slackUnlink:true });
		}
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
			var success_message = ""
			if(connection_type.toLowerCase() === "github") {
				success_message = "You have successfully unlink github."
			}
			if(connection_type.toLowerCase() === "slack") {
				success_message = "You have successfully unlink slack."
			}
			this.setState({ 
				isSubmitting: false,
				success: true,
				githubUnlink:false,
				slackUnlink:false,
				description: "Submitted", 
				gitHubRepoID: "" ,
				gitHubPAC: "" ,
				githuburl: "" ,
				api_response: [],
				webhook: "" ,
				channelName: "" ,
				successMessage: success_message,
			});			
			setTimeout(() => {
				this.setState({ success: false })
			}, 3000)					
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
			{ this.state.success  ? 
				<InlineNotification
					kind="success"
					title="Success"
					subtitle={this.state.successMessage}
					caption=""
					style={{
						minWidth: "100%",
					}}
				/> : ""
			}	
			<ComposedModal size="sm" open={this.state.gitHubModalOpen} preventCloseOnClickOutside={true} >
				<ModalHeader>
					<h4>Connect GitHub</h4>
				</ModalHeader>
				<ModalBody style={{ paddingRight: '1rem' ,marginBottom:'1rem'}}  className="configModel" >
				{ this.state.invalidURL  ? 
						<InlineNotification
							kind="error"
							title=""
							subtitle='Please check the GitHub URL again'
							caption=""
							style={{
								minWidth: "100%",
							}}
						/> : ""
					}		
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
							helperText="e.g https://api.github.com"
							placeholder="Enter GitHub URL"
							invalid={this.state.githuburlInvalid}
							invalidText="Please enter git api url.."										
						/>
						<br/>
						<TextInput
							id="gitHubPAC"
							name="gitHubPAC"
							value={this.state.gitHubPAC || ""}
							onChange={this.saveData}
							labelText="Personal Access Token"
							placeholder="e9:f3:29:3f:6r:6g:8l:p8:o9:y3:t9"
							invalid={this.state.gitHubPACInvalid}
							invalidText="Please enter personal access token.."
						/>	
						<br/>
						
					<TileGroup
							name="repoIDOption"
							onChange={this.saveData}
							defaultSelected="repolist"
							style={{width:"50%",height:"auto"}}
							legend="GitHub repository selection">
							<RadioTile value="repolist"  id="tile-1" >
								GitHub repository List
							</RadioTile>
							<RadioTile  value="repourl" id="tile-2">
								GitHub repository URL
							</RadioTile>		
						</TileGroup>
						
						{this.state.repoIDOption === 'repolist' ?
						<Select
							defaultValue={(this.state.gitHubRepoID) ? this.state.gitHubRepoID : "placeholder-item"}
							disabled={this.state.gitHubRepodisabled}
							onChange={this.saveData}
							id="gitHubRepoID"							
							name="gitHubRepoID"
							labelText="GitHub repository"
							invalid={this.state.gitHubRepoIDInvalid}
							invalidText="Please select Github repo "
						>
							<SelectItem
								text="GitHub Repo"
								value="placeholder-item"
							/>
							{this.state.RepoListItem}
						</Select>
						: 						
							<TextInput
									id="gitHubRepoURL"
									name="gitHubRepoURL"
									value={this.state.gitHubRepoURL || ""}
									onChange={this.saveData}
									labelText='GitHub repository URL'
									placeholder="https://api.github.com/repos/owner/repo"
									invalid={this.state.gitHubRepoURLInvalid}
									invalidText="Please enter valid gitHub repo url"
								/>	
						}
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button kind="secondary" onClick={(event) => {this.closeModal(event)}}>Cancel</Button>
					{
						this.state.scan ? (	
							
							this.state.isSubmitting ? (
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
							this.state.isSubmitting ? (
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
							placeholder="Enter slack webHook "
							invalid={this.state.webhookInvalid}
							invalidText="Please enter slack webHook.."
						/>
						<br/>
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
					{this.state.isSubmitting ? (
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
									{
											this.state.githubUnlink? 
										<InlineLoading
											style={{ marginLeft: '1rem' }}
											className="statusInputSubmit"
										/>
									: 
									<>
										<Button kind="secondary" onClick={() => {this.unlinkConnection('slack');}}>Unlink</Button>
										</>
									}														
									</p>
								</div>								
						:
							<div style={{ margin: "10px 0",fontSize: "15px"}}>
								<p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
								</p>
									<p style={{ margin: "10px 0",fontSize: "15px"}}>
										{
											this.state.slackUnlink? 
											<InlineLoading
												style={{ marginLeft: '1rem' }}
												className="statusInputSubmit"
											/>
										: 
											<>
											<Button kind="secondary" onClick={() => {this.setState({ slackModalOpen: true });}}>Connect Slack</Button>
											</>
										}
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
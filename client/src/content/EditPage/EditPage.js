import React from 'react'
import { connect} from 'react-redux';
import { 
	Breadcrumb, 
	BreadcrumbItem,
	InlineLoading
} from 'carbon-components-react';
import {  
	Grid, 
	Row, 
	Column,
	Toggle,
	ContentSwitcher,
	Switch,
	TextInput,
	ToastNotification 
} from 'carbon-components-react';
import WidgetTable from "./WidgetTable";
import WidgetTableV2 from "./WidgetTableV2";
import ConfigurePage from "./ConfigurePage";
import SnippetPage from "./SnippetPage";
import SnippetPageV2 from "./SnippetPageV2";
import {Edit24 as Edit ,Save24 as Save } from '@carbon/icons-react';
import axios from "axios";

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

let checkFlag = true;
class EditPage extends React.Component {
	constructor(props) {
		super(props);	
			this.state = {
			widgetName: "",
			widgetURL: "",
			widgetType: "",
			ratingOption: "",
			widgetStatus: true,
			selectedIndex: 0,
			editWigetName: 0,
			editWigetURL: 0,
			dataToSave: {},
			userparams: props.match.params.configure,
			recordID: props.match.params.id,
			isSubmitting: false,
			description: "Submititting",
			ariaLive: false,
			success : false,
			isLoading: true,
			widgetNotFound: false,
			widgetData: "",
			isWidgetNameLoading: false,
			isWidgetURLLoading: false,
		};
		switch(props.match.params.configure) {
			case 'tab-maange':
				this.state.selectedIndex = 0;
			break;
			case 'tab-snippet':
				this.state.selectedIndex = 1;
			break;
			case 'tab-configure':
				this.state.selectedIndex = 2;
			break;
			default:
				this.state.selectedIndex = 0;
		}
	}
	
	toggleProps = () => ({
		labelA: '',
		labelB: '',
	});
	
	checkForm = () => {
		checkFlag = true;
		if (!this.state.widgetName) {
			this.setState({ widgetNameInvalid: true });
			checkFlag = false;
		}
		if (!this.state.widgetURL) {
			this.setState({ widgetURLInvalid: true });
			checkFlag = false;
		} else {
			var widgetURL = this.state.widgetURL;
			if (widgetURL.indexOf("http://") !== 0 && widgetURL.indexOf("https://") !== 0) {
				widgetURL = "https://"+this.state.widgetURL
			}			
			var regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
			if (!regexp.test(widgetURL))
			{
				this.setState({ widgetURLInvalid: true });
				checkFlag = false;
			}		
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
	
	setselectedIndex = (e) => {
		this.setState({ selectedIndex: e });
	}
	 
	showTextBox = (widgetTextBox) => {
		switch(widgetTextBox) {
			case 'widgetName':
				this.setState({ editWigetName: 1 });
			break;
			case 'widgetURL':
				this.setState({ editWigetURL: 1 });
			break;
			default:
				this.setState({ editWigetName: 0 },{ editWigetURL: 0 });
		}
  	}
  
	saveForm = event => {
		event.preventDefault();
		if (this.checkForm()) {
			let dataToSave = {
				widgetname: this.state.widgetName,
				widgeturl: this.state.widgetURL
			};
			this.setState({ dataToSave });
			this.setState({ editWigetURL: 0 });
			this.setState({ editWigetName: 0 });
		}
  	};
	
	SaveTextBox = (widgetTextBox) => {
		if (this.checkForm()) {			
			switch(widgetTextBox) {
				case 'widgetName':				
					this.setState({ editWigetName: 0,isWidgetNameLoading: true });
				break;
				case 'widgetURL':
					this.setState({ editWigetURL: 0 ,isWidgetURLLoading: true});
				break;
				default:
					this.setState({ editWigetName: 0 },{ editWigetURL: 0,isWidgetNameLoading: false,isWidgetURLLoading: false });
			}	
			this.UpdateWidget(widgetTextBox)
		}
  	};
	
	componentDidMount() {
		document.title = process.env.REACT_APP_SITE_TITLE + " Widgets ";
		this.getWidgets();
	}
	
	displayRating  = (rating) => {
		if(rating === "stars"){
			return "Stars"
		} 
		else if(rating === "numeric"){
			return "Number"
		}
		else if(rating === "emoticons"){
			return "Emoticons"
		}
		else if(rating === "thumbs"){
			return "Thumbs up or down"
		}
		
	}
	
	//*********** API ************/	
	UpdateWidget = (widgetTextBox) => {
		let name = this.state.widgetName
		let url = this.state.widgetURL
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`widgets/update/`+this.state.recordID,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
			data : {name:name,url:url}
		};
		axios(config)
		.then(response => {
			switch(widgetTextBox) {
			case 'widgetName':				
					this.setState({ isWidgetNameLoading: false });
			break;
			case 'widgetURL':
				this.setState({ isWidgetURLLoading: false });
			break;
			default:
				this.setState({ isWidgetNameLoading: false },{ isWidgetURLLoading: false });
			}	
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
	
	UpdateWidgetStatus = (e) => {
		this.setState({ isLoading: true });
		var checkBoxValue = e.currentTarget.checked;
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`widgets/status/`,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
			data : {id:this.state.recordID ,status:checkBoxValue}
		};
		axios(config)
		.then(result => {
			this.setState({
				widgetStatus:checkBoxValue,
				isLoading: false,
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
	}
	
	getWidgets = () => {
		//this.setState({ isLoading: true });		
		var config = {
			method: 'get',
			url:process.env.REACT_APP_API_ENDPOINT+`widgets/`+this.state.recordID,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
		};
		axios(config)
		.then(result => {
			var dataObj = result.data.data
			//let columnSize = (dataObj.type === "feedback") ? 4 :3
			this.setState({
				widgetData: dataObj,
				widgetName: dataObj.name,
				widgetURL: dataObj.url,
				widgetStatus: dataObj.status,
				widgetType: dataObj.type,
				ratingOption: dataObj.rating_option,
				isLoading: false,
			});
		})
		.catch((error) => {
			this.setState({
				error,
				isLoading: false,
				widgetNotFound: true
			});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
			if(error.response.status === 404){
				//Do anything
			}
		});		
	};

	updateWidgetData = (widgetData) => {					
		this.setState({
			widgetData: widgetData,
		});
	}


	render() {	
		return (
		<section className="bx--col-lg-13">
			<Breadcrumb>
				<BreadcrumbItem href="/"  >Widgets</BreadcrumbItem>
				<BreadcrumbItem href="#"  isCurrentPage >Edit Widgets</BreadcrumbItem>
			</Breadcrumb>
			<br/>
			{
				this.state.widgetNotFound
			?
				<ToastNotification
					kind="error"
					title=""
					subtitle="No Widget found"
					caption=""
					style={{
						minWidth: "100%",
					}}
				/>
			:
				<Grid style={{padding: "0" }}>
					<Row>
					<Column sm={12} md={12} lg={12} style={{marginBottom: "20px" }}>
						<h3 className="displayFlex">
								<span className={`${this.state.editWigetName === 0  ? "":"hiddenDiv"}`}>			
									{this.state.widgetName}  
								</span>								
								<span className={`${this.state.editWigetName === 1  ? "widgetNameInputText":" hiddenDiv"}`}	 >
									<TextInput
										id="widgetName"
										name="widgetName"
										value={this.state.widgetName || ""}
										onChange={this.saveData}
										labelText=""
										placeholder="Enter widget name"
										invalid={this.state.widgetNameInvalid}
										invalidText="Please enter a widget name.."
										/>
								</span>
								{
									this.state.isWidgetNameLoading ? 
										<InlineLoading
											style={{ marginLeft: '1rem' }}
											className="statusInputSubmit"
										/>
									: 
										<>
											<Edit color="#0f62fe" className={`${this.state.editWigetName === 0  ? "btIcon":"btIcon hiddenDiv"}`} onClick={() => {this.showTextBox("widgetName")}} /> 
											<Save color="#0f62fe" className={`${this.state.editWigetName === 0  ? "btIcon hiddenDiv":"btIcon"}`} onClick={() => {this.SaveTextBox("widgetName")}} /> 
										</>
								}									
							</h3>
					</Column>
						<Column sm={12} md={2} lg={2}>							
							<div style={{ margin: "10px 0",fontSize: "15px"}}  >
									<div style={{ margin: "10px 0",fontSize: "20px"}}><strong>Type</strong></div>															
									<p>{(this.state.widgetType === "feedback" ? "Feedback form" : "Rating widget" )}</p>
								</div>
						</Column>
						{
								this.state.ratingOption ? 												
									<Column sm={12} md={2} lg={2}>							
										<div style={{ margin: "10px 0",fontSize: "15px"}}  >
												<div style={{ margin: "10px 0",fontSize: "20px"}}><strong>Rating option</strong></div>															
												<p>{this.displayRating(this.state.ratingOption)}</p>
											</div>
									</Column>
									: ""
						}
						
						<Column sm={12} md={3} lg={3}>							
							<div style={{ margin: "10px 0",fontSize: "15px"}}>
									<div style={{ margin: "10px 0",fontSize: "20px"}}><strong>URL</strong></div>				
									<p>{this.state.widgetURL}</p>
								</div>
						</Column>
						
						<Column sm={12} md={4} lg={4}>
							<div style={{ margin: "10px 0",fontSize: "20px"}}><strong>Status</strong></div>
							<div style={{ fontSize: "15px"}}>
								<div style={{fontSize: "15px",display: "inline-flex",alignItems: "center"}}>								
										{
											this.state.isSubmitting || this.state.success || this.state.isLoading ? 
												<InlineLoading
													style={{ marginLeft: '1rem' }}
													className="statusInputSubmit"
													description={this.state.description}
													status={this.state.success ? 'finished' : 'active'}
													aria-live={this.state.ariaLive}
												/>
											: 
												<>
												<Toggle size="sm"
													aria-label="toggle button"
													className="statusInputText"
													defaultToggled = {(this.state.widgetStatus) ? true:false}
													onChange={(e)=>this.UpdateWidgetStatus(e)}
													{...this.toggleProps()}
													id={'Toggle_status'}
												/>
												<p>{ (this.state.widgetStatus ) ? "Active" :" inActive" } </p>
											</>
										}									
								</div>
							</div>
						</Column>
					</Row>
					<Row style={{ marginTop: '1rem' }}>
						<Column sm={12} md={6} lg={4}>
							<ContentSwitcher onChange={(e)=>this.setselectedIndex(e.index)} selectedIndex={this.state.selectedIndex} size="md">
								<Switch name="manage"  text="Manage"   />
								<Switch name="snippet"  text="Snippet"   />
								<Switch name="connections"  text="Connections"  />
							</ContentSwitcher>							
						</Column>
					</Row>
					<Row className={`${this.state.selectedIndex === 0  ? "":"hiddenDiv"}`}>
						<Column sm={12} md={12} lg={12}>
							{
								(this.state.widgetType === "feedback")  ? <WidgetTable recordID={this.state.recordID} /> : <WidgetTableV2 recordID={this.state.recordID} />								
							}							
						</Column>
					</Row>
					<Row className={`${this.state.selectedIndex === 1  ? "":"hiddenDiv"}`}>
						<Column sm={12} md={12} lg={12}>
							{
								(this.state.widgetType === "feedback")  ? <SnippetPage 	recordID={this.state.recordID} widgetURL={this.state.widgetURL}/> : <SnippetPageV2 recordID={this.state.recordID} widgetURL={this.state.widgetURL} />								
							}	
						</Column>
					</Row>
					<Row className={`${this.state.selectedIndex === 2  ? "":"hiddenDiv"}`}>
						<Column sm={12} md={12} lg={12}>
							{this.state.widgetData ? 
								<ConfigurePage 
									recordID={this.state.recordID}
									widgetData={this.state.widgetData}
									updateWidgetData={this.updateWidgetData}
								/> : ''
							}
						</Column>
					</Row>						
				</Grid>
			}
		</section>
		);
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(EditPage);
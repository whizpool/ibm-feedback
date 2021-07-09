import React from "react";
//import { connect} from 'react-redux'
import {
  TextInput,  
  TileGroup,
  RadioTile,
	Form
} from "carbon-components-react";


import { 
	Star24 as Star, 
	StarFilled24 as StarFilled, 
	//StarHalf24 as StarHalf, 

	Number_124 as Number1,
	Number_224 as Number2,
	Number_324 as Number3,
	Number_424 as Number4,
	Number_524 as Number5,
	Number_624 as Number6,
	Number_724 as Number7,
	Number_824 as Number8,
	Number_924 as Number9,
	FaceDissatisfied24 as FaceDissatisfied,
	FaceNeutral24 as FaceNeutral, 
	FaceSatisfied24 as FaceSatisfied,
	FaceActivated24 as FaceActivated,
	ThumbsDown24 as ThumbsDown,
	ThumbsUp24 as ThumbsUp,
} from '@carbon/icons-react';

import  SadeFace24 from "../../components/Icons/SadeFace24";
import  Nubmer1024 from "../../components/Icons/Nubmer1024";

import "./index.scss";
import { pkg } from "@carbon/ibm-cloud-cognitive/es/settings"
import { SidePanel } from "@carbon/ibm-cloud-cognitive";

import axios from "axios";
//var validUrl = require('valid-url');
let checkFlag = true;

pkg.component.SidePanel = true;
/*
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
*/
class SidePanelWidget extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
			openSidePanel: false,
			showRatingOption: false,
			disabledButton: true,			
			isLoading: false,
			isSubmitting: false,
			success : false,
			successMessage : "",
			ratingOption : "stars",
		
		};
	}
	
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
		let fieldName;
		let fieldValue;		
		if(event === "rating" || event ==="feedeback") {			
			fieldName = "widgetType"
			fieldValue = event			
			if(event ==="rating") {
				this.setState({
					showRatingOption: true
				})
			} else {
				this.setState({
					showRatingOption: false		
				});
			}		
		} else if(event === "numeric" || event ==="stars" || event ==="emoticons" || event ==="thumbs") {			
			fieldName = "ratingOption"
			fieldValue = event					
		} else {
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
		if (this.state.widgetName && this.state.widgetURL) {
			this.setState({disabledButton:false});			
		}	
	};
	
	saveForm  = (event) => {
		event.preventDefault();			
		if (this.checkForm()) {
			this.setState({ 
				isSubmitting: true,
			});			
			this.createWidgets(this.state.widgetName,this.state.widgetURL,this.state.widgetType,this.state.ratingOption)			
		} 
	};
	
	closeModal = event => {
		event.preventDefault();
		this.setState({ 
				isSubmitting: false,
				disabledButton: true,
				widgetName: "",
				widgetURL: "",
				widgetType: "",
				ratingOption: "",
				showRatingOption: false,
				isLoading: false,
				success : false			
		});
		this.props.updateSidePanelState(false)
	};
	
	/********************** API Function **********************************/
		createWidgets = (name, url,type,rating) => {		
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`widgets/`,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
			data:{name:name,url:url,type:type,rating:rating}
		};		
		axios(config)
		.then(response => {
			this.setState({ 
				isSubmitting: false,
				disabledButton: true,
				widgetName: "",
				widgetURL: "",
				widgetType: "",
				ratingOption: "",
			});
			this.props.updateGridRows(response)
		})
		.catch((error) => {
			this.setState({ 
				isSubmitting: false,
			});	
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
	};
	
  render() {	  
		
  	return (
		<>
				<SidePanel
						open={this.props.openSidePanel}
						onRequestClose={(event) => {this.closeModal(event)}}
						title="Create Widget"
						actions={[						
							{
								label: "Submit",
								disabled: this.state.disabledButton,
								onClick: (event) => {this.saveForm(event);},
								kind: "primary",
								loading:  this.state.isSubmitting
							},
							{
								label: "Cancel",
								onClick: (event) => this.closeModal(event),
								kind: "secondary"
							}
						]}
					>
					<br/>
				 	<Form>
							<TextInput
								id="widgetName"
								name="widgetName"
								value={this.state.widgetName || ""}
								onChange={this.saveData}
								labelText="Widget Name"
								placeholder="Enter widget name"								
								invalid={this.state.widgetNameInvalid}
								invalidText="Please enter a widget name"
							/>
							<br/>
							<TextInput
								id="widgetURL"
								name="widgetURL"
								value={this.state.widgetURL || ""}
								onChange={this.saveData}
								labelText="Feedback URL"
								placeholder="Feedback URL"
								invalid={this.state.widgetURLInvalid}
								invalidText="Please enter a feedback url"
								helperText="The web URL where you plan to collect feedback with this widget. Your widget snippet will only work here."
							/>			
							<br/>							
							<TileGroup
								name="widgetType"
								defaultSelected="feedeback"
								style={{width:"50%"}}
								onChange={this.saveData}
								legend="Type">
								<RadioTile value="feedeback"  id="tile-1" >
									<strong>Feedback form</strong><br /><br />Users launch your custom feedback form from a button
								</RadioTile>
								<RadioTile  value="rating" id="tile-2">
									<strong>Rating widget</strong><br /><br />Users launch your custom feedback form from a button
								</RadioTile>							
							</TileGroup>		
							{this.state.showRatingOption  ? 
							<>
							<br/>							
							<TileGroup
								name="ratingOption"
								onChange={this.saveData}
								defaultSelected="stars"
								style={{width:"50%"}}
								legend="Rating option">
								<RadioTile value="stars"  id="tile-3" >
									<strong>Stars</strong><br /><br /><StarFilled  fill="#f1c21b"/><StarFilled  fill="#f1c21b"/><StarFilled  fill="#f1c21b"/><Star /><Star /><br /><br /><br />
								</RadioTile>
								<RadioTile  value="numeric" id="tile-4">
									<strong>Numeric</strong><br /><br /><Number1 /><Number2 /><Number3 /><Number4 /><Number5 fill="#0f62fe"/><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1024 />
								</RadioTile>			
								<RadioTile value="emoticons"  id="tile-5" >
									<strong>Emoticons</strong><br /><br /><SadeFace24 /><FaceDissatisfied /><FaceNeutral /><FaceSatisfied /><FaceActivated fill="#0f62fe"/>
								</RadioTile>
								<RadioTile  value="thumbs" id="tile-6">
									<strong>Thumbs up or down</strong><br /><br /><ThumbsUp fill="#0f62fe"/><ThumbsDown/>
								</RadioTile>							
							</TileGroup>
							</>	
							 : ""
							}
						</Form>	
        </SidePanel>				
		</>	
    );
  }
}
//<FaceActivated32 /> <FaceDissatisfied32 />  <FaceNeutral32 /> <FaceSatisfied32 />
//export default connect(mapStateToProps,mapDispatchToProps)(SidePanelWidget);
export default SidePanelWidget;
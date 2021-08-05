import React, { useState,useEffect,useCallback  } from 'react';
//import { connect} from 'react-redux'
import {
  Link,
} from "carbon-components-react";

import copy from 'copy-to-clipboard';
import { 
	ArrowRight16 as ArrowRight,
	ArrowLeft16 as ArrowLeft,
	Launch16 as Launch,
	Copy16 as Copy,
	
} from '@carbon/icons-react';

//import  SadeFace24 from "../../components/Icons/SadeFace24";
//import  Nubmer1024 from "../../components/Icons/Nubmer1024";

import "./index.scss";
import { pkg } from "@carbon/ibm-cloud-cognitive/es/settings"
import { SidePanel } from "@carbon/ibm-cloud-cognitive";

import axios from "axios";


import {connect } from 'react-redux'

//import { useHistory } from 'react-router-dom';
import  Rating  from "../../components/Rating/Rating";
//import { Breadcrumb, BreadcrumbItem} from 'carbon-components-react';
//import {  Grid, Row, Column,Button,Loading,ToastNotification } from 'carbon-components-react';
import {  Grid, Row, Column,Loading,ToastNotification } from 'carbon-components-react';
import { useDispatch} from 'react-redux'

//var validUrl = require('valid-url');
//let checkFlag = true;

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





const mapStateToProps = (state) => {
	return {
		access_token:state.auth.access_token,
	};
};

const SidePanelViewFeedback = ({opensidepanel,updatesidepanelstate,access_token,recordid,widgettype}) => {
	
	const dispatch = useDispatch()
	const [rows, setrows] = useState([]);
	const [isLoading, setisLoading] = useState(0);
	const [isNextButtonDisabled, setisNextButtonDisabled] = useState(1);
	const [isPrevButtonDisabled, setisPrevButtonDisabled] = useState(1);
	const [widgetNotFound, setwidgetNotFound] = useState(0);
	
	const getFeedbacks =useCallback((feedbackRecordid) => {	
	
		setisLoading(1)
		var recordID = feedbackRecordid
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`feedbacks/`+recordID,
			headers: {
				'Authorization': 'Bearer '+ access_token
			},
			data:{type:widgettype}
		};
		axios(config)
		.then(result => {
			var feedbackData = result.data.data;		
			var widgetURL = feedbackData.url
			var referralURL = feedbackData.referral_url
			feedbackData.widgetURL = widgetURL.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
			feedbackData.referralURL = referralURL.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
			setrows(feedbackData)
			if(feedbackData.next  > 0 ){
				setisNextButtonDisabled(0)
			} else {
				setisNextButtonDisabled(1)
			}
			if(feedbackData.previous > 0 ){
				setisPrevButtonDisabled(0)
			} else {
				setisPrevButtonDisabled(1)
			}
		})
		.catch((error) => {
			if(error.response && error.response.status === 401){
				dispatch({type: 'SIGN_OUT'})
			}
			if(error.response && error.response.status === 404){
				setwidgetNotFound(1)
				//Do anything
			}
		}).finally(()=>{			
			setisLoading(0)
		});

	}	, [access_token,widgettype,dispatch]);
	
	useEffect(()=>{
			if(isLoading === 0) {
				getFeedbacks(recordid)
			}
	},[recordid,getFeedbacks,isLoading])

 const closeModal= ()=>{	 
	 updatesidepanelstate(false)
 }
	const loadPage = (pageType) => {		
		if(pageType === 'prev') {
			getFeedbacks(rows.previous)
		}
		if(pageType === 'next') {
			getFeedbacks(rows.next)
		}
	}
	
	const formateDateString = (dateStr) => {
			if(dateStr) {
				const today = new Date();		
				let options = {
						hour: 'numeric', minute: 'numeric', second: 'numeric',
						//timeZone: 'Australia/Sydney',
						//timeZoneName: 'short'
				};		
				return (<span>{ (new Intl.DateTimeFormat("en-US").format(today))}<br/><p style={{fontSize:"12px"}}>{ (new Intl.DateTimeFormat('en-US', options).format(today))}</p></span>)
		} else {
			return "";
		}
		
	}
	
  	return(
	  		<SidePanel
					open={opensidepanel}
					onRequestClose= {closeModal}
					title={ (rows.type === "feedback") ? "Feedback form" : "Rating widget"	}	
				>			
				<section className="bx--col-lg-13">
					<div style={{  position: "fixed",top: "61px",width: "100%",zIndex: "10"}}>
								<h2 className="exp--side-panel__title-text" title="Feedback form" aria-hidden="false">{ (rows.type === "feedback") ? "Feedback form" : "Rating widget"	}				
									{ (isLoading === 0)  ?
									<>
									<button title="Previous" style={{ border: "0",cursor:"pointer"}} onClick={(event) => {loadPage('prev')}} disabled={isPrevButtonDisabled === 0  ? false :true}><ArrowLeft  /></button>
									<button  title="Next" style={{ border: "0",cursor:"pointer"}} onClick={(event) => {loadPage('next')}} disabled={isNextButtonDisabled === 0  ? false :true}><ArrowRight /></button>
									</>
									: ""
									}
									
								</h2>
				</div>
			{
				(isLoading === 1)  ?
					<Loading description="Active loading indicator" withOverlay={false}/>
			:

				(widgetNotFound=== 1) ?
					<ToastNotification
							kind="error"
							title=""
							subtitle="No Feedback found"
							caption=""
							style={{
								minWidth: "100%",
							}}
					/>
				:
					<>
					<Grid style={{padding: "0px",height:"80vh" }}>
							<Row>
										<Column style={{paddingTop: "20px" }} sm={12} md={3} lg={3}>
												<span style={{lineHeight: "2" }}><strong>Received</strong></span> <br/> 
												{formateDateString(rows.date)}
										</Column>
										<Column style={{paddingTop: "20px" }} sm={12} md={9} lg={9}>
													<span style={{lineHeight: "1.5" }}><strong>Widget</strong></span><br/>													
													<span style={{display:"flex",alignItems:"center"}}> <Link href={rows.url}><span >{rows.widgetURL} </span><span><Launch  fill="#0f62fe"/></span></Link></span>													
													<span style={{display:"flex",alignItems:"center"}}><Link href={rows.referral_url}><span style={{fontSize:"12px"}}>{rows.referralURL} </span><span><Launch  fill="#0f62fe"/> </span></Link> </span>
											</Column>
							</Row>	
						
							<Row style={{padding: "20px 0 0 0" }}>
									<Column sm={12} md={12} lg={12}><strong>Screenshot</strong></Column>
							</Row>
							<Row>
									<Column sm={12} md={12} lg={12}>
											<div style={{ margin: "10px 0",fontSize: "15px"}}>
												<img
												style={{ width: "100%"}}
												src={rows.screen_shot}
												alt="Screenshot"
											/><br/>
											{/*<a href={rows.screen_shot}  rel="noopener noreferrer" target="_blank">View Image</a>*/}
									</div>
								
									</Column>
								</Row>
								{
									(rows.PhoneNo && rows.EmailAddress) ? 									
									<>
											<Row>
												<Column  sm={12} md={5} lg={5}>
														<span style={{lineHeight: "2" }}><strong>Phone number</strong></span> <br/> 
														{rows.PhoneNo}
												</Column>
												<Column  sm={12} md={7} lg={7}>
															<span style={{lineHeight: "1.5" }}><strong>Email Address</strong></span><br/>													
															{rows.EmailAddress}
													</Column>
											</Row>	
									</> : ""
									
								}
							<Row style={{padding: "20px 0 0 0" }}>
									<Column sm={12} md={12} lg={12}><span style={{lineHeight: "2" }}><strong>User feedback</strong></span><br/>
										<div style={{ fontSize: "15px"}}><Rating type={rows.rating_type} rating={rows.RateUs} /> </div>
									</Column>
							</Row>	
							
							<Row style={{padding: "20px 0 0 0" }}>
									<Column sm={12} md={12} lg={12}><span style={{lineHeight: "2" }}><strong>User comment</strong></span><span style={{paddingLeft:"10px",cursor:"pointer"}}><Copy fill="#0f62fe" onClick={()=>copy(rows.ProvideFeedback)} /></span><br/>
										<span style={{lineHeight: "1.5" }}>{rows.ProvideFeedback}</span>
									</Column>
							</Row>							
					</Grid>
				
					<Row>
							<Column sm={12} md={12} lg={12} >
								
								{ (isLoading === 0)  ?
								<>
								<div style={{float:"left"}}>								
											<button title="Previous" style={{ border: "0",cursor:"pointer"}} onClick={(event) => {loadPage('prev')}} disabled={isPrevButtonDisabled === 0  ? false :true}><ArrowLeft  /></button>
								</div>
								<div style={{float:"right"}}>
										<button  title="Next" style={{ border: "0",cursor:"pointer"}} onClick={(event) => {loadPage('next')}} disabled={isNextButtonDisabled === 0  ? false :true}><ArrowRight /></button>	
								</div>
								</>
								: ""
								}
							</Column>
						</Row>
						</>
						
			}
		</section>
		</SidePanel>				
	);
};
export default connect(mapStateToProps)(SidePanelViewFeedback);
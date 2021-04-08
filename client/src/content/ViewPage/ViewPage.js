import React, { useState } from 'react';
import {connect } from 'react-redux'

import { useHistory } from 'react-router-dom';
import  Rating  from "../../components/Rating/Rating";
import { Breadcrumb, BreadcrumbItem} from 'carbon-components-react';
import {  Grid, Row, Column,Button,Loading,ToastNotification } from 'carbon-components-react';
import { useDispatch} from 'react-redux'
import axios from "axios";

const mapStateToProps = (state) => {
	return {
		access_token:state.auth.access_token,
	};
};

const ViewPage = ({access_token}) => {
	const history = useHistory()
	const dispatch = useDispatch()
	const [rows, setrows] = useState([]);
	const [isLoading, setisLoading] = useState(0);
	const [isNextButtonDisabled, setisNextButtonDisabled] = useState(1);
	const [isPrevButtonDisabled, setisPrevButtonDisabled] = useState(1);
	const [widgetNotFound, setwidgetNotFound] = useState(0);

	const getFeedbacks = () => {
		const currentUrl = window.location.href;
		var recordID = currentUrl.substring(currentUrl.lastIndexOf('/') + 1)
		var config = {
			method: 'get',
			url:process.env.REACT_APP_API_ENDPOINT+`feedbacks/`+recordID,
			headers: {
				'Authorization': 'Bearer '+ access_token
			},
		};
		axios(config)
		.then(result => {
			var feedbackData = result.data.data;
			setisLoading(1)
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
			setisLoading(1)
			if(error.response && error.response.status === 401){
				dispatch({type: 'SIGN_OUT'})
			}
			if(error.response && error.response.status === 404){
				setwidgetNotFound(1)
				//Do anything
			}
		});

	}

	const loadPage = (pageType, id) => {
		setisLoading(0);
		if(pageType === 'prev') {
			history.push('/view/'+rows.previous)
		}
		if(pageType === 'next') {
			history.push('/view/'+rows.next)
		}
	}

	if(isLoading === 0) {
		getFeedbacks()
	}
  	return(
	  	<section className="bx--col-lg-13">
			<Breadcrumb>
				<BreadcrumbItem href="/feedbacks"  >Submitted Feedbacks</BreadcrumbItem>
				<BreadcrumbItem href="#"  isCurrentPage >Detailed Feedback</BreadcrumbItem>
			</Breadcrumb>
			<br/>
			<h4 >Submitted Feedbacks</h4>
			<br/><br/>
			{
				(isLoading === 0)  ?
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
					<Grid style={{padding: "0" }}>
						<Row>
							<Column sm={12} md={4} lg={4}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Name:</strong></div>
								<div style={{ margin: "10px 0",fontSize: "15px"}}>{rows.Name}</div>
							</Column>
							<Column sm={12} md={8} lg={8}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>URL:</strong></div>
								<div style={{ margin: "10px 0",fontSize: "15px"}}>{rows.url}</div>
							</Column>
						</Row>
						<Row>
							<Column sm={12} md={4} lg={4}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Widget ID:</strong></div>
								<div style={{ margin: "20px 0",fontSize: "15px"}}>{rows.widget_id}</div>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Phone number:</strong></div>
								<div style={{ margin: "10px 0",fontSize: "15px"}}>{rows.PhoneNo}</div>
							</Column>
							<Column sm={12} md={8} lg={8}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Screenshot:</strong></div>
								<div style={{ margin: "10px 0",fontSize: "15px"}}>
										<img
										style={{ width: "200px"}}
										src={rows.screen_shot}
										alt="Screenshot"
									/><br/>
										<a href={rows.screen_shot}  rel="noopener noreferrer" target="_blank">View Image</a>
								</div>
							</Column>
						</Row>
						<Row>
							<Column sm={12} md={4} lg={4}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Email Address:</strong></div>
								<div style={{ margin: "20px 0",fontSize: "15px"}}>{rows.EmailAddress}</div>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Time & Date:</strong></div>
								<div style={{ fontSize: "15px"}}>{rows.date}</div>
							</Column>
							<Column sm={12} md={8} lg={8}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Description:</strong></div>
								<div style={{ fontSize: "15px"}}>
									<p style={{ lineHeight: "20px" }}>
										{rows.ProvideFeedback}
									</p>
								</div>
							</Column>
						</Row>
						<Row>
							<Column sm={12} md={4} lg={4}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Rating:</strong></div>
									<div style={{ fontSize: "15px"}}><Rating type={rows.rating_type} rating={rows.RateUs} /> </div>
							</Column>
							<Column sm={12} md={8} lg={8} >
								<div style={{fontSize: "15px",float:"right"}}>
									<Button kind='secondary' onClick={(event) => {loadPage('prev')}} disabled={isPrevButtonDisabled === 0  ? false :true} >Previous</Button>
									<Button kind='secondary' onClick={(event) => {loadPage('next')}} disabled={isNextButtonDisabled === 0  ? false :true} >Next</Button>
								</div>
							</Column>
						</Row>
					</Grid>
			}
		</section>
	);
};
export default connect(mapStateToProps)(ViewPage);

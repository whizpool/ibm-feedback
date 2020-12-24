import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import  Rating  from "../../components/Rating/Rating";
import { Breadcrumb, BreadcrumbItem} from 'carbon-components-react';
import {  Grid, Row, Column,Button,Loading } from 'carbon-components-react';
import { connect} from 'react-redux'
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

const ViewPage = () => {
	const history = useHistory()
	const [rows, setrows] = useState([]);
	const [isLoading, setisLoading] = useState(0);
	const [isNextButtonDisabled, setisNextButtonDisabled] = useState(1);
	const [isPrevButtonDisabled, setisPrevButtonDisabled] = useState(1);
	
	const getFeedbacks = () => {
		//this.setState({ isLoading: true });
		const currentUrl = window.location.href;
		var recordID = currentUrl.substring(currentUrl.lastIndexOf('/') + 1)
		
		
		var config = {
				method: 'get',
				url:process.env.REACT_APP_API_ENDPOINT+`feedbacks/`+recordID,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
		};
		
		axios(config)
		.then(result => {
				setisLoading(1)
				setrows(result.data.data)
				if(rows.next){
					setisNextButtonDisabled(0)
				}
				if(rows.prev){
					setisPrevButtonDisabled(0)
				}
		})
		.catch((error) => {

			setisLoading(1)
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
	}
	
	if(isLoading === 0) {
		getFeedbacks()
	}
  return <section className="bx--col-lg-13">
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
									/>
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
							<Row  >
							<Column sm={12} md={4} lg={4}>
								<div style={{ margin: "20px 0",fontSize: "20px"}}><strong>Rating:</strong></div>
								<div style={{ fontSize: "15px"}}><Rating  type={rows.rating_type} rating={rows.RateUs} /> </div>
							</Column>
							<Column sm={12} md={8} lg={8} >
								<div style={{fontSize: "15px",float:"right"}}> 
									
									<Button kind="secondary" 
										onClick={() => history.push('/view/'+rows.previous)}
										disabled={isPrevButtonDisabled === 0  ? false :true}
									>Previous</Button> 
									<Button kind="secondary"
										onClick={() => history.push('/view/'+rows.next)}
										disabled={isNextButtonDisabled === 0  ? false :true} 
									>Next</Button>
								</div>
								
							</Column>
						</Row>
						
					</Grid>
				}
			</section>
;
};
export default connect(mapStateToProps,mapDispatchToProps)(ViewPage);
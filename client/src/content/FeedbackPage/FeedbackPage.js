import React from 'react';
import { connect} from 'react-redux'
import { 

	Breadcrumb, 
	BreadcrumbItem,
	Row, 
	Column,
	ContentSwitcher,
	Switch,
} from 'carbon-components-react';

/*********** Data GRID ************/
import FeedbackFormView  from "./FeedbackFormView";
import FeedbackRatingView from "./FeedbackRatingView";
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

class FeedbackPage extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
			isLoading: false,
			selectedIndex: 0,
		};
	}


	setselectedIndex = (e) => {
		this.setState({ selectedIndex: e });
	}
	
  /******************** API CALL ******************************/

  	render() {	

 		return (
			<section className="bx--col-lg-13">
				<Breadcrumb>
				<BreadcrumbItem href="/feedbacks"  >Submitted Feedbacks</BreadcrumbItem>
				</Breadcrumb>
				<br/>			
				
				<Row style={{ marginTop: '1rem' }}>
						<Column sm={12} md={6} lg={4}>
							<ContentSwitcher onChange={(e)=>this.setselectedIndex(e.index)} selectedIndex={this.state.selectedIndex} size="md">
								<Switch name="feedback"  text="Feedback forms"   />
								<Switch name="rating"  text="Rating widgets"   />
							</ContentSwitcher>							
						</Column>
					</Row>					
					<Row className={`${this.state.selectedIndex === 0  ? "":"hiddenDiv"}`}>
						<Column sm={12} md={12} lg={12}>
							<FeedbackFormView/>						
						</Column>
					</Row>
					<Row className={`${this.state.selectedIndex === 1  ? "":"hiddenDiv"}`}>
						<Column sm={12} md={12} lg={12}>
							<FeedbackRatingView/>			
						</Column>
					</Row>
				
		 	</section>
   	 	);
  	}
}
export default connect(mapStateToProps,mapDispatchToProps)(FeedbackPage);
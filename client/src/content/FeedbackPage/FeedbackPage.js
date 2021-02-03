import React from 'react';
import { connect} from 'react-redux'
import { 
	DataTable, 
	TableContainer, 
	Table,
	TableHead, 
	TableRow, 
	TableHeader, 
	TableBody, 
	TableCell,
	TableToolbar,
	TableBatchActions,
	TableBatchAction,
	TableToolbarContent,
	TableSelectAll,
	TableSelectRow,
	Breadcrumb, 
	BreadcrumbItem,
	MultiSelect,
	OverflowMenu,
	OverflowMenuItem,
	Pagination,
	DataTableSkeleton,
	ComposedModal,
	ModalBody,
	ModalFooter,
	InlineLoading,
	Button,
	InlineNotification,
	Form,
	TextInput,
	DatePicker,
	DatePickerInput
} from 'carbon-components-react';
import ReadMoreReact from 'read-more-react';
import { TrashCan32 as Delete,SettingsAdjust32 as Filter, Close32 as Close } from '@carbon/icons-react';
import axios from "axios";

/*********** Data GRID ************/
import { columns } from "./TableHeader";
import  Rating  from "../../components/Rating/Rating";
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
			modalOpen: false,
			deleteAllModalOpen: false,
			deleteRowIndex : 0,
			deleteRowID : 0,
			isSubmitting: false,
			description: "Submititting",
			ariaLive: false,
			success : false,
			successMessage:"",
			headers: columns,
			rows: [],
			selectedWidgetRows: [],
			page: 1,
			pageSize: 5,
			dataToSave: {},
			filterModalOpen: false,			
		};
	}
 
  	componentDidMount() {
		this.getFeedbacks();
	} 

	closeModal = event => {
		event.preventDefault();
		this.setState({ 
			modalOpen: false ,
			isSubmitting: false, 
			success: false, 
			deleteRowIndex:0,
			deleteRowID:0,
			ariaLive: "Off", 
			description: "Submitting",
		});
	};
	
  	deleteRow = (event) => {
		event.preventDefault();
		//let gridData = this.state.rows;
		let rowIndex = this.state.deleteRowIndex
		let rowID = this.state.deleteRowID
		//let rowID = gridData[rowIndex].id;
		this.deleteFeedback(rowID,rowIndex)
		
	};
	
	saveData = event => {
		const target = event.target;
		let fieldName = target.name;
		let fieldValue = target.value;
		this.setState({
			[fieldName]: fieldValue,
		});
	};
	
	saveDate = (value,name) => {
		var d = new Date(value);		
		var date_value =  d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
			("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" +
			("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
		this.setState({
			[name]: date_value,
			start_dateInvalid: false,
		});
	};
	
	resetfilters = event => {
		this.setState({
			widget_name: "",
			widget_url: "",
			start_date: "",
			end_date: "",
		});
		
	};
  
	viewRating = (rowIndex, recordID) => {
		var type = ""
		var rating = 0
		var row = (this.state.rows).find(obj => obj.id === recordID)
		if(row) {
			type = row.rating_type
			 rating = row.rating
		}
		return <Rating key={rowIndex} type={type} rating={rating} />
	}
	
  	handleOnHeaderChange  = (e) => {	
		this.setState((state) => {
			const headers = columns.filter((head) => {
				if (e.selectedItems.indexOf(head) > -1 ) { 
					return head
				}
				return ""
			});
			headers.sort(function (a, b) {
				return a.id - b.id;
			});
			const rows = state.rows.map((row) => {
				return {
					...row
				};
			});
			return {
				rows,
				headers
			};
		});
  	};  
	
	deleteAllRecords = (event) =>{
		
		var deleteRowIDs = []
		var widgetRows = this.state.selectedWidgetRows	
		widgetRows.map((row) => (
			deleteRowIDs.push(row.id)
		))
		this.setState({ 
			isSubmitting: true,
			ariaLive: "Off",
			description: "Submitting" 
		});	
		
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`feedbacks/delete_feedbacks`,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
			data:{id:JSON.stringify(deleteRowIDs)}
		};
		
		axios(config)
		.then( () => {
			this.setState({ 
				success: true,
				isSubmitting: false,
				ariaLive: "Off",
				description: "Submitting",
				deleteAllModalOpen: false,
				rows: [],
				successMessage: "You have successfully deleted the feedbacks.",
			});	
			//verify last index.		
			var startItem = (this.state.page - 1) * this.state.pageSize;
			var endItem = startItem + this.state.pageSize;

			var displayedRows = this.state.rows.slice(startItem, endItem);
			if(displayedRows.length === 0 ){
				this.setState({
					page: (this.state.page-1),
					pageSize: this.state.pageSize
				});
			}
			setTimeout(() => {
				this.setState({ success: false })
			}, 3000)		
			this.getFeedbacks();
		})
		.catch((error) => {
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
			this.setState({ 
				isSubmitting: false,
				deleteAllModalOpen: false,
				success: false,
			});	
		});
		
	}
	
  /******************** API CALL ******************************/
  getFeedbacks = () => {
		this.setState({ isLoading: true });		
		let filterData = {}
		if(this.state.widget_name !== ""){
			filterData.name = this.state.widget_name;
		}
		if(this.state.widget_url !== ""){
			filterData.url = this.state.widget_url;
		}		
		if(this.state.start_date !== ""){
			filterData.start_date = this.state.start_date;
		}
		if(this.state.end_date !== ""){
			filterData.end_date = this.state.end_date;
		}		
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`feedbacks/`,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
			data:{filters:filterData}
		};		
		axios(config)
		.then(response => {
			response = response.data.data;			
			this.setState({
				rows: response.list,
				isLoading: false,
				filterModalOpen: false,
			});
		})
		.catch((error) => {
			this.setState({
				error,
				isLoading: false,
				filterModalOpen: false,
			});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
	}; 
  
	deleteFeedback = (rowID,rowIndex) => {
		this.setState({ 
			isSubmitting: true,
			ariaLive: "Off",
			description: "Submitting" 
		});			
		var config = {
			method: 'delete',
			url:process.env.REACT_APP_API_ENDPOINT+`feedbacks/`+rowID,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
		};		
		axios(config)
		.then(response => {
			this.setState({ 
				isSubmitting: false,
				success: true,
				description: "Deleted" ,
				successMessage: "You have successfully deleted the feedback.",
				modalOpen: false,
				deleteRowIndex:0,
			});
			this.getFeedbacks();
			setTimeout(() => {
				this.setState({ success: false })
			}, 3000)
				
		})
		.catch((error) => {
			this.setState({
				error,
				isLoading: false,
				isSubmitting: false,
				success: false,
				modalOpen:false
			});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}	
		});
		
	};
	
  	render() {	
		var startItem = (this.state.page - 1) * this.state.pageSize;
		var endItem = startItem + this.state.pageSize;
		var displayedRows = this.state.rows.slice(startItem, endItem);
		var totalItems = this.state.rows.length;
		//used in paginazion
		var onPageChange = pageChange => {
			this.setState({
				page: pageChange.page,
				pageSize: pageChange.pageSize
			});
		};
 		return (
			<section className="bx--col-lg-13">
				<Breadcrumb>
				<BreadcrumbItem href="/feedbacks"  >Submitted Feedbacks</BreadcrumbItem>
				</Breadcrumb>
				<br/>			
				<ComposedModal size="sm" onClose={this.closeModal} open={this.state.modalOpen} preventCloseOnClickOutside={true} >					
					<ModalBody>
						<p  style={{ fontSize: '2rem',marginTop: '2rem' }}>Are you sure you want to delete it?</p>
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
							<Button kind='danger' onClick={(event) => {this.deleteRow(event)}}>Delete</Button>
						)}
					</ModalFooter>
				</ComposedModal>				
				<ComposedModal size="sm" onClose={this.closeModal} open={this.state.deleteAllModalOpen} preventCloseOnClickOutside={true} >					
					<ModalBody>
						<p  style={{ fontSize: '2rem',marginTop: '2rem' }}>Are you sure you want to delete all these?</p>
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
							<Button kind='danger' onClick={(event) => {this.deleteAllRecords(event)}}>Delete</Button>
						)}
					</ModalFooter>
				</ComposedModal>
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
				{
					this.state.isLoading ?
						<DataTableSkeleton
							columnCount={this.state.headers.length + 1}
							rowCount={10}
							headers={this.state.headers}
						/>
				:	
					<DataTable
					isSortable
					rows={displayedRows} 
					headers={this.state.headers}
					render={({
						rows,
						headers,
						getHeaderProps,
						getSelectionProps,
						getBatchActionProps,
						selectAll,
						selectRow,
						onInputChange,
						getExpandHeaderProps,
						getRowProps,
						getTableContainerProps,
						getTableProps,
						selectedRows,
						getToolbarProps,
						expandRow
					}) => (
							<TableContainer title="Submitted Feedbacks" {...getTableContainerProps()} >
								<TableToolbar aria-label="data table toolbar">
									<TableToolbarContent>
										<div className={`filter-popup ${this.state.filterModalOpen ? 'bg-white' : 'bg-none'}`}>
											{!this.state.filterModalOpen ?
												<Filter onClick={() => this.setState({ filterModalOpen: true })} />
											:
												<Close onClick={() => this.setState({ filterModalOpen: false })} />
											}
											<div className={`filter-popup-content ${this.state.filterModalOpen ? 'd-block' : 'd-none'}`}>
												<Form className="form" autoComplete="off">
													<div className="flexBox">
														<DatePicker dateFormat="m/d/Y" datePickerType="single" 
															onChange={(event) => {this.saveDate(event,"start_date")	}}
															onClick={(event) => {this.saveDate(event,"start_date")	}}
														>
															<DatePickerInput
																id="start_date"
																name="start_date"
																placeholder="mm/dd/yyyy"
																labelText="From"
																type="text"
																invalid={this.state.start_dateInvalid || false }
																invalidText="Please select a valid From date"
															/>
														</DatePicker>
														<DatePicker dateFormat="m/d/Y" datePickerType="single" 
															onChange={(event) => {this.saveDate(event,"end_date")	}}
															onClick={(event) => {this.saveDate(event,"end_date")	}}
														>
															<DatePickerInput
																id="end_date"
																name="end_date"
																placeholder="mm/dd/yyyy"
																onChange={this.saveData}
																labelText="To"
																type="text"
																invalid={this.state.end_dateInvalid || false }
																invalidText="Please select a To From date"
															/>
														</DatePicker>
													</div>
													<div className="flexBox">
														<TextInput
															id="widget_url"
															name="widget_url"
															labelText="URL"
															value={this.state.widget_url || ""}
															onChange={this.saveData}
															placeholder="Enter url"
														/>
														<TextInput
															id="widget_name"
															name="widget_name"
															value={this.state.widget_name || ""}
															labelText="Widget name"
															onChange={this.saveData}
															placeholder="Enter widget name"
														/>
													
													</div>
													<Button kind="secondary" onClick={this.resetfilters} >Reset filters</Button>
													<Button kind="primary" onClick={this.getFeedbacks}>	Apply filters</Button>
												</Form>
											</div>
										</div>
										<div style={{ width: 200 }}>
											<MultiSelect
												onChange={(e)=>this.handleOnHeaderChange(e)}  
												ariaLabel="MultiSelect"
												id="Feedback-multiselect"
												items={columns}
												initialSelectedItems={columns}
												itemToString={(item) => (item ? item.header : '')}
												label="Columns"
											/>
										</div>
									</TableToolbarContent>
									<TableBatchActions {...getBatchActionProps()}>
										<TableBatchAction
											tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
											renderIcon={Delete}
											onClick={() => {this.setState({ selectedWidgetRows: selectedRows,deleteAllModalOpen: true  });}}
											>
											Delete
										</TableBatchAction>
									</TableBatchActions>
								</TableToolbar>
								<Table {...getTableProps()} useZebraStyles size='normal'>
									<TableHead>
										<TableRow>
											<TableSelectAll {...getSelectionProps()} />
												{headers.map((header) => (
													<TableHeader {...getHeaderProps({ header })}>
													{header.header}
													</TableHeader>
												))}
											<TableHeader />
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row,rowIndex) => {
											let dataRowIndex = this.state.pageSize * (this.state.page-1)+ rowIndex
											return <TableRow {...getRowProps({ row })}>
												<TableSelectRow {...getSelectionProps({ row })} />
												{row.cells.map((cell) => {														
													if(cell.info.header === 'rating') {
														return <TableCell key={cell.id} style={{ width: '180px' }}>{this.viewRating(dataRowIndex,row.id)}</TableCell> 
													}
													if(cell.info.header === 'ProvideFeedback') {
														return <TableCell key={cell.id}>
															{
																(cell.value) ? <ReadMoreReact  ideal={25} min={25} text={cell.value} readMoreText='  Read more' /> : cell.value
															}
														</TableCell> 
													}											
													return <TableCell key={cell.id} style={{ width: '180px' }}>{cell.value}</TableCell>
												})}
												<TableCell >
													<OverflowMenu light flipped>
														<OverflowMenuItem itemText="View Feedback" onClick={() => this.props.history.push('/view/'+row.id)}  hasDivider />
														<OverflowMenuItem itemText="Delete" onClick={(event) => { this.setState({ modalOpen: true,deleteRowIndex:dataRowIndex,deleteRowID:row.id, }) }} hasDivider isDelete />
													</OverflowMenu>
												</TableCell>
											</TableRow>
										})}
									</TableBody>
								</Table>
								<Pagination
									backwardText="Previous page"
									forwardText="Next page"
									itemsPerPageText="Items per page:"
									onChange={onPageChange}
									page={1}
									pageNumberText="Page Number"
									pageSize={this.state.pageSize}
									pageSizes={[5, 10, 15]}
									totalItems={totalItems}
								/>	
							</TableContainer>
						)}
					/>
				}
		 	</section>
   	 	);
  	}
}
export default connect(mapStateToProps,mapDispatchToProps)(FeedbackPage);
import React from 'react';
import { connect} from 'react-redux'

import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,TableToolbar,TableBatchActions,TableBatchAction,TableToolbarContent,TableSelectAll,TableSelectRow,Breadcrumb, BreadcrumbItem,MultiSelect,OverflowMenu,OverflowMenuItem,Pagination,TableToolbarMenu,TableToolbarAction,DataTableSkeleton,ComposedModal,ModalBody,ModalFooter,InlineLoading,Button} from 'carbon-components-react';

import { TrashCan32 as Delete,SettingsAdjust32 as Filter } from '@carbon/icons-react';

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
			deleteRowIndex : 0,
		  isSubmitting: false,
		  description: "Submititting",
			 ariaLive: false,
		  success : false,
		  headers: columns,
		  rows: [],
		  page: 1,
		  pageSize: 5,
		  dataToSave: {},
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
			ariaLive: "Off", 
			description: "Submitting",
		});
	};
	
  deleteRow = (event) => {
		event.preventDefault();
		let gridData = this.state.rows;
		let rowIndex = this.state.deleteRowIndex
		let rowID = gridData[rowIndex].id;
		this.deleteFeedback(rowID,rowIndex)
		
	};
  
	viewRating = (rowIndex) => {
		var type = ""
		var rating = 0
		if(this.state.rows[rowIndex]) {
		type = this.state.rows[rowIndex].rating_type
			 rating = this.state.rows[rowIndex].rating
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
  /******************** API CALL ******************************/
  getFeedbacks = () => {
		this.setState({ isLoading: true });
		
		var config = {
				method: 'get',
				url:process.env.REACT_APP_API_ENDPOINT+`feedbacks/`,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
		};
		
		axios(config)
		.then(response => {
				this.setState({
				rows: response.data.data,
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
						description: "Deleted" 
				});
				
				let rows = this.state.rows
				if (rows.length > 0) {
					rows.splice(rowIndex, 1);
					this.setState({ rows});
				}
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
		var dataRowIndex =0;  
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
			
			<ComposedModal size="sm" open={this.state.modalOpen} preventCloseOnClickOutside={true} >
					
					<ModalBody>
						<p  style={{ fontSize: '2rem',marginTop: '2rem' }}>Are you sure you want to delete it?</p>
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
							<Button kind='danger' onClick={(event) => {this.deleteRow(event)}}>Delete</Button>
						)}
					</ModalFooter>
				</ComposedModal>
				
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
          getToolbarProps,
          expandRow
        }) => (
					<TableContainer title="Submitted Feedbacks" {...getTableContainerProps()} >
						<TableToolbar aria-label="data table toolbar">
							<TableToolbarContent>
								 <TableToolbarMenu renderIcon={Filter} >
										<TableToolbarAction  onClick={() => alert('Alert 1')}>
												Action 1
											</TableToolbarAction>
											<TableToolbarAction onClick={() => alert('Alert 2')}>
												Action 2
											</TableToolbarAction>
											<TableToolbarAction onClick={() => alert('Alert 3')}>
												Action 3
										</TableToolbarAction> 
								</TableToolbarMenu>
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
									onClick={() => console.log('clicked')}
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
								{rows.map((row,rowIndex) => (
								<TableRow {...getRowProps({ row })}>
									<TableSelectRow {...getSelectionProps({ row })} />
									{row.cells.map((cell) => {
										dataRowIndex = this.state.pageSize * (this.state.page-1)+ rowIndex
										if(cell.info.header === 'rating') {
											return <TableCell key={cell.id}>{this.viewRating(dataRowIndex)}</TableCell> 
										}
											
										return <TableCell key={cell.id}>{cell.value}</TableCell>
									})}
									<TableCell >
										<OverflowMenu light flipped>
										 <OverflowMenuItem itemText="View Feedback" onClick={() => this.props.history.push('/view/'+row.id)}  hasDivider />
										 <OverflowMenuItem itemText="Delete"
										 onClick={(event) => {
												this.setState({ modalOpen: true,deleteRowIndex:dataRowIndex })	
												}} hasDivider isDelete />
										</OverflowMenu>
									</TableCell>
								</TableRow>
								))}
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
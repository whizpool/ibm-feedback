import React from 'react';
import {connect } from 'react-redux'

import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,TableToolbar,TableBatchActions,TableBatchAction,TableToolbarContent,Button,TableSelectAll,TableSelectRow,Breadcrumb, BreadcrumbItem,MultiSelect,OverflowMenu,OverflowMenuItem,Pagination,TextInput,Form,DataTableSkeleton,Toggle,ComposedModal,ModalHeader,ModalBody,ModalFooter,InlineLoading,InlineNotification} from 'carbon-components-react';

import { TrashCan32 as Delete, Add16 as Add } from '@carbon/icons-react';

import axios from "axios";
/*********** Data GRID ************/
import { columns } from "./TableHeader";


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

class WidgetPage extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
			errorMessage:false,
		  widgetModalOpen: false,
		  deleteModalOpen: false,
		  isLoading: false,
		  isSubmitting: false,
		  description: "Submititting",
			deleteRowIndex : 0,
		  ariaLive: false,
		  success : false,
			updateRowStatus: false,
		  headers: columns,
		  rows: [],
		  currentPage: 1,
		  page: 1,
		  pageSize: 5,
		  rowStatusID: [],
		 
		};
	}
	
	toggleProps = () => ({
		labelA: '',
		labelB: '',
	});

	componentDidMount() {
		this.getWidgets();
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
			if (!validUrl.isUri(this.state.widgetURL)){
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

	closeModal = event => {
		event.preventDefault();
		this.setState({ 
			widgetModalOpen: false ,
			isSubmitting: false, 
			success: false, 
			deleteModalOpen: false,
			deleteRowIndex:0,
			ariaLive: "Off", 
			description: "Submitting",
			widgetName: "",
			widgetURL: "",
		});
	};
	
	
	saveForm = event => {
		event.preventDefault();
		if (this.checkForm()) {
			this.setState({ 
					isSubmitting: true,
					ariaLive: "Off",
					description: "Submitting" 
			});			
			this.createWidgets(this.state.widgetName,this.state.widgetURL)
		}
	};

	deleteRow = (event) => {
		event.preventDefault();
		let gridData = this.state.rows;
		let rowIndex = this.state.deleteRowIndex
		let rowID = gridData[rowIndex].id;
		this.deleteWidgets(rowID,rowIndex)
		
	};
	
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
	/******************** API CALL ***************/
	deleteWidgets = (rowID,rowIndex) => {
		this.setState({ 
				isSubmitting: true,
				ariaLive: "Off",
				description: "Submitting" 
		});	
		
		var config = {
				method: 'delete',
				url:process.env.REACT_APP_API_ENDPOINT+`widgets/`+rowID,
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
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
	};
	
	
	createWidgets = (name, url) => {
		
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+`widgets/`,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data:{name:name,url:url}
		};
		
		axios(config)
		.then(response => {
				let gridData = this.state.rows; 
				gridData.unshift(response.data.data)
				this.setState({ 
						isSubmitting: false,
						success: true,
						description: "Submitted" 
				});
				this.setState((state) => {
					return gridData
				 });
				
		})
		.catch((error) => {
			this.setState({ 
						errorMessage: true,
						isSubmitting: false,
						ariaLive: "Off",
						description: "Submitting" 
					});	
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
	};
	
	getWidgets = () => {
		this.setState({ isLoading: true });
		
		var config = {
				method: 'get',
				url:process.env.REACT_APP_API_ENDPOINT+`widgets/`,
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
	
	UpdateWidgetStatus = (e,rowIndex) => {
		var statusRowIDs = this.state.rowStatusID;
		statusRowIDs.push(rowIndex)
		this.setState({
			rowStatusID:statusRowIDs,
		})	
		
		let gridData = this.state.rows;
		let rowID = gridData[rowIndex].id;
		
		var checkBoxValue = e.currentTarget.checked;
		
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+`widgets/status/`,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data:{id:rowID ,status:checkBoxValue}
		};
		
		axios(config)
		.then(response => {
				let gridData = this.state.rows;
				gridData[rowIndex].status = checkBoxValue
				this.setState({
					 rows:gridData
				});
				var myRowIDs = this.state.rowStatusID;				
				myRowIDs.splice(myRowIDs.indexOf(rowIndex), 1);
				this.setState({
					rowStatusID:myRowIDs,
				});
		})
		.catch((error) => {

			var myRowIDs = this.state.rowStatusID;				
				myRowIDs.splice(myRowIDs.indexOf(rowIndex), 1);
				this.setState({
					rowStatusID:myRowIDs,
				});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
		
	}
	
	ToggleSwitch = (rowIndex) => {

		return (this.state.rowStatusID).indexOf(rowIndex) > -1 ? 
			<InlineLoading
				style={{ marginLeft: '1rem' }}
			/>
		 : 
			(this.state.rows.length > rowIndex ) ? <Toggle
				aria-label="toggle button"
				defaultToggled = {this.state.rows[rowIndex].status}
				onChange={(e)=>this.UpdateWidgetStatus(e, rowIndex)}
				{...this.toggleProps()}
				id={'Toggle_'+rowIndex}
			/> : ''
	}
 
	render() {	  
		var dataRowIndex =0;
		var startItem = (this.state.page - 1) * this.state.pageSize;
		var endItem = startItem + this.state.pageSize;
		var displayedRows = this.state.rows.slice(startItem, endItem);
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
					<BreadcrumbItem href="/"  >Widgets</BreadcrumbItem>
				</Breadcrumb>
				<br/>
				
				<ComposedModal size="sm" open={this.state.widgetModalOpen} preventCloseOnClickOutside={true} >
					<ModalHeader>
						<h4>Create Widget</h4>
					</ModalHeader>
					<ModalBody style={{ paddingRight: '1rem' }}>
						<>
							<p>Please enter widget name.</p><br/>
						</>
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
								labelText="Enter URL"
								placeholder="Enter URL"
								invalid={this.state.widgetURLInvalid}
								invalidText="Please enter a widget url"
							/>			  
						</Form>
						{this.state.errorMessage  ? 
									<InlineNotification
										kind="error"
										subtitle={<span>Unabl to create widget please try again.</span>}
										title="Failed"
									/> : ""
							}
									
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
							<Button kind='primary' onClick={(event) => {this.saveForm(event)}}>Create</Button>
						)}
					</ModalFooter>
				</ComposedModal>	

				<ComposedModal size="sm" open={this.state.deleteModalOpen} preventCloseOnClickOutside={true} >
					
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
						<TableContainer title="Widgets" {...getTableContainerProps()} >
							<TableToolbar aria-label="data table toolbar">
								<TableToolbarContent>
									<div style={{ width: 250 }}>
										<MultiSelect
											onChange={(e)=>this.handleOnHeaderChange(e)}  
											ariaLabel="MultiSelect"
											id="widget-multiselect"
											items={columns}
											initialSelectedItems={columns}
											itemToString={(item) => (item ? item.header : '')}
											label="Columns"
										/>
									</div>
									<Button
										tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
										onClick={() => {this.setState({ widgetModalOpen: true });}}
										renderIcon={Add}
										size="small"
										kind="primary"
									>
										Create New
									</Button>
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
							<Table {...getTableProps()}  size='normal'>
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
											if(cell.info.header === 'status') {
												return <TableCell key={cell.id}>{this.ToggleSwitch(dataRowIndex)}</TableCell> 
											}
											return <TableCell key={cell.id}>{cell.value}</TableCell>
										})}
										<TableCell >
											<OverflowMenu light flipped>
											<OverflowMenuItem itemText="Edit Widget" onClick={() => this.props.history.push('/edit/'+row.id+'/tab-manage')}  hasDivider />
											<OverflowMenuItem itemText="Configure Widget"  onClick={() => this.props.history.push('/edit/'+row.id+'/tab-configure')} hasDivider />
											<OverflowMenuItem itemText="Delete" 
											onClick={(event) => {
												this.setState({ deleteModalOpen: true,deleteRowIndex:dataRowIndex })	
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
								page={this.state.page}
								pageNumberText="Page Number"
								pageSize={this.state.pageSize}
								pageSizes={[5, 10, 15]}
								totalItems={this.state.rows.length}
							/>	
						</TableContainer>
					)}
				/>			
		}
		</section>
		);
  	}
}

export default connect(mapStateToProps,mapDispatchToProps)(WidgetPage);
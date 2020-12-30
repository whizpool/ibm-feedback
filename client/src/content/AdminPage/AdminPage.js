import React from 'react';
import { connect} from 'react-redux'

import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,TableToolbar,TableBatchActions,TableBatchAction,TableToolbarContent,Button,TableSelectAll,TableSelectRow,Breadcrumb, BreadcrumbItem,MultiSelect,OverflowMenu,OverflowMenuItem,Pagination,TextInput,Form,Dropdown,ComposedModal,ModalHeader,ModalBody,ModalFooter,InlineLoading,DataTableSkeleton} from 'carbon-components-react';

import { TrashCan32 as Delete, Add16 as Add } from '@carbon/icons-react';

import axios from "axios";

/*********** Data GRID ************/
import { columns } from "./TableHeader";

let checkFlag = true;

const roles = [
  {
    id: 'Viewer',
    label: 'Viewer',
  },
  {
    id: 'Administrator',
    label: 'Administrator',
  },
];

const mapStateToProps = (state) => {
	return {
			isLogged: state.auth.isLogged,
			access_token:state.auth.access_token,
			api_key:state.auth.api_key,
			refresh_token:state.auth.refresh_token,
			account_id: state.auth.account_id, 
			email: state.auth.email, 
			name: state.auth.name, 
			role: state.auth.role,
			iam_id: state.auth.iam_id
			
		};
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveLogoutState: (data) => dispatch(data),
    }
}	
	

class AdminPage extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
			deleteModalOpen: false,
		  isLoading: false,
		  isSubmitting: false,
		  deleteAllModalOpen: false,
		  description: "Submititting",
		  deleteRowIndex : 0,
		  ariaLive: false,
		  modalOpen: false,
		  headers: columns,
		  rows: [],
		  selectedWidgetRows: [],
		  page: 1,
		  totalItems: 0,
		  pageSize: 5,
		  dataToSave: {},
		};
	}
	
	checkForm = () => {
		checkFlag = true;
		if (!this.state.AdminName) {
			this.setState({ AdminNameInvalid: true });
			checkFlag = false;
		}
		if (!this.state.AdminEmail) {
			this.setState({ AdminEmailInvalid: true });
			checkFlag = false;
		} else {
		}
		if (!this.state.AdminRole) {
			this.setState({ AdminRoleInvalid: true });
			checkFlag = false;
		}
		return checkFlag;
  };
  
  saveData = event => {
		
		let fieldName  = ""
		let fieldValue  = ""
		if(event.selectedItem !== undefined)
		{
			fieldName = "AdminRole";
			fieldValue = event.selectedItem.id;
			
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
  };
  
  saveForm = event => {
		event.preventDefault();
		if (this.checkForm()) {
			this.setState({ 
					isSubmitting: true,
					ariaLive: "Off",
					description: "Submitting" 
			});			
			this.inviteUsers(this.state.AdminName,this.state.AdminEmail,this.state.AdminRole)
		}
  };
	
  deleteRow= (event) => {
		event.preventDefault();		
		let rowIndex = this.state.deleteRowIndex
		this.deleteUser(rowIndex);
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
  componentDidMount() {
		this.getUsers();
	} 
	
	closeModal = event => {
		event.preventDefault();
		this.setState({ 
			deleteModalOpen: false,
			deleteAllModalOpen: false,
			modalOpen: false ,
			isSubmitting: false, 
			success: false, 
			ariaLive: "Off", 
			description: "Submitting",
			name: "",
			email: "",
			role: "",
		});
	};
	
	
	deleteAllRecords = (event) =>{
		
		let gridData = this.state.rows;
		var deleteRowIDs = []
		var widgetRows = this.state.selectedWidgetRows	
		widgetRows.map((row) => {		
			deleteRowIDs.push(gridData.find(obj => obj.id === row.id).iam_id)
		})
		this.setState({ 
				isSubmitting: true,
				ariaLive: "Off",
				description: "Submitting" 
		});	
		
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+`users/delete_users`,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data:{deleteRowIDs}
		};
		
		axios(config)
		.then( () => {
					this.setState({ 
						isSubmitting: false,
						ariaLive: "Off",
						description: "Submitting",
						deleteAllModalOpen: false,
						rows: []
					});	
					this.getUsers();
		})
		.catch((error) => {
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
	
		
	}
	/******************** API CALL ******************************/
  getUsers = () => {
		this.setState({ isLoading: true });
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+`users/`,
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data : {accountid:this.props.account_id}
		};
		axios(config)
		.then(result => {
			result = result.data.data
		
			this.setState({
				rows: result.resources	,
				totalItems: result.total_results	,
				isLoading: false,
			});
		})
		.catch((error) => {
			console.log(error)
			this.setState({
				error,
				isLoading: false
			});
			if(error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
	
	};
	
	inviteUsers = (name, email, role) => {
		var config = {
				method: 'post',
				url:process.env.REACT_APP_API_ENDPOINT+"users/invite",
				headers: { 
					'Authorization': 'Bearer '+this.props.access_token
				},
				data : {name:name,email:email,role:role,accountid:this.props.account_id,apikey:this.props.api_key}
		};
		axios(config)
		.then(response => {
				this.setState({ 
					isSubmitting: false,
					ariaLive: "Off",
					description: "Submitting" ,
					modalOpen: false ,
					success: false, 
					name: "",
					email: "",
					role: "",
				});	
				
				this.getUsers();
				
		})
		.catch((error) => {
			console.log("error")
			console.log(error)
			this.setState({
				error,
				isLoading: false
			});
			if(error.response.status  && error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
	};
	
	
	deleteUser = (rowIndex) => {
		let gridData = this.state.rows;
		let currentRowID = gridData[rowIndex].iam_id;
	
		this.setState({ 
				isSubmitting: true,
				ariaLive: "Off",
				description: "Submitting" 
		});	
		
		var config = {
				method: 'delete',
				url:process.env.REACT_APP_API_ENDPOINT+`users/`+currentRowID,
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
				
				let rows = this.state.rows.slice();
				if (rows.length > 0) {
					rows.splice(rowIndex, 1);
					this.setState({ rows});
				}	
		})
		.catch((error) => {
			this.setState({
				error,
				isLoading: false
			});
			if( error.response.status === 401){
				this.props.saveLogoutState({type: 'SIGN_OUT'})
			}
		});
	};
  render() {	  
		var startItem = (this.state.page - 1) * this.state.pageSize;
		var endItem = startItem + this.state.pageSize;
		var displayedRows = this.state.rows.slice(startItem, endItem);
		var totalItems = this.state.totalItems;
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
			  <BreadcrumbItem href="admins"  >Manage Admins</BreadcrumbItem>
			</Breadcrumb>
			<br/>
			
			<ComposedModal size="sm" onClose={this.closeModal} open={this.state.modalOpen} preventCloseOnClickOutside={true} >
					<ModalHeader>
						<h4>Invite Admin</h4>
					</ModalHeader>
					<ModalBody style={{ paddingRight: '1rem' }}>
						<>
							<p>Please fill out the following information below in order to invite admins</p><br/>
						</>
						<Form>
							<TextInput
									id="adminName"
									name="AdminName"
									value={this.state.AdminName || ""}
													onChange={this.saveData}
									labelText="Admin Name"
									placeholder="Enter name"									
									invalid={this.state.AdminNameInvalid}
									invalidText="Please enter a Admin name"						
								/> <br/>
								<TextInput
									id="email"
									name="AdminEmail"
									value={this.state.AdminEmail || ""}
									onChange={this.saveData}
									labelText="Email Address"
									placeholder="Enter email address"
									invalid={this.state.AdminEmailInvalid}									
									invalidText="Please enter a email address"
								/>
								<br/>
								<Dropdown
										ariaLabel="Dropdown"
										id="admin-role"
										name="AdminRole"
										items={roles}
										label="Role"
										value={this.state.AdminRole || ""}
										onChange={this.saveData}
										titleText="Role"
										direction="top"
										invalid={this.state.AdminRoleInvalid}
										invalidText="Please select admin role"	
									/>				  
						</Form>
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
							<Button kind='primary' onClick={(event) => {this.saveForm(event)}}>Invite</Button>
						)}
					</ModalFooter>
				</ComposedModal>
				
				<ComposedModal size="sm" onClose={this.closeModal} open={this.state.deleteModalOpen} preventCloseOnClickOutside={true} >
					
					<ModalBody>
						<p  style={{ fontSize: '2rem',marginTop: '2rem' }}>Are you sure you want to delete it.</p>
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
		
				<ComposedModal size="sm" onClose={this.closeModal} open={this.state.deleteAllModalOpen} preventCloseOnClickOutside={true} >
					
					<ModalBody>
						<p  style={{ fontSize: '2rem',marginTop: '2rem' }}>Are you sure you want to delete all these?</p>
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
							<Button kind='danger' onClick={(event) => {this.deleteAllRecords(event)}}>Delete</Button>
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
          selectedRows,
          expandRow
        }) => (
					<TableContainer title="Manage Admins" {...getTableContainerProps()} >
						<TableToolbar aria-label="data table toolbar">
							<TableToolbarContent>
								<div style={{ width: 200 }}>
									<MultiSelect
										onChange={(e)=>this.handleOnHeaderChange(e)}  
										ariaLabel="MultiSelect"
										id="Admin-multiselect"
										items={columns}
										initialSelectedItems={columns}
										itemToString={(item) => (item ? item.header : '')}
										label="Columns"
									/>
								</div>
								<Button
									tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
									onClick={() => {this.setState({ modalOpen: true });}}
									renderIcon={Add}
									size="small"
									kind="primary"
								>
									Invite Admin
								</Button>
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
								{rows.map((row,rowIndex) => (
								<TableRow {...getRowProps({ row })}>
									<TableSelectRow {...getSelectionProps({ row })} />
									{row.cells.map((cell) => (
									<TableCell key={cell.id}>{cell.value}</TableCell>
									))}
									<TableCell >
										<OverflowMenu light flipped>
										 <OverflowMenuItem itemText="Edit Admin" onClick={() => this.props.history.push('/edit/'+row.id)}  hasDivider />
										 <OverflowMenuItem itemText="Delete" 
										 onClick={(event) => {
												this.setState({ deleteModalOpen: true,deleteRowIndex:rowIndex })	
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
export default connect(mapStateToProps,mapDispatchToProps)(AdminPage);
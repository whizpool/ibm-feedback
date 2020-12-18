import React from 'react';


import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,TableToolbar,TableBatchActions,TableBatchAction,TableToolbarContent,Button,TableSelectAll,TableSelectRow,Breadcrumb, BreadcrumbItem,MultiSelect,OverflowMenu,OverflowMenuItem,Pagination,TextInput,Form,Dropdown,ComposedModal,ModalHeader,ModalBody,ModalFooter,InlineLoading,DataTableSkeleton} from 'carbon-components-react';

import { TrashCan32 as Delete, Add16 as Add } from '@carbon/icons-react';

import axios from "axios";

/*********** Data GRID ************/
//import { rowData } from "./TableDummyData";
import { columns } from "./TableDummyHeader";

let checkFlag = true;

const roles = [
  {
    id: 'viewer',
    label: 'Viewer',
  },
  {
    id: 'admin',
    label: 'Admin',
  },
];

export default class AdminPage extends React.Component {
	
	constructor(props) {
		super(props);	
		this.state = {
		  isLoading: false,
		  isSubmitting: false,
		  description: "Submititting",
			deleteRowIndex : 0,
		  ariaLive: false,
		  modalOpen: false,
		  headers: columns,
		  rows: [],
		  page: 1,
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
			//this.createUsers(this.state.AdminName,this.state.AdminEmail,this.state.AdminRole)
		}
  };
  
  deleteRow= (event,rowIndex,rowID) => {
		event.preventDefault();
		let rows = this.state.rows.slice();
		if (rows.length > 0) {
			rows.splice(rowIndex, 1);
			this.setState({ rows});
		}	
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
	
	/******************** API CALL ******************************/
  getUsers = () => {
		/*
		this.setState({ isLoading: true });
		axios.get(process.env.REACT_APP_API_ENDPOINT+`users/`)
		.then(result => {
			this.setState({
				rows: result.data.data,
				isLoading: false,
			});
		})
		.catch(error =>
			this.setState({
			error,
			isLoading: false
			})
		);
		*/
	};
	
	createUsers = (name, email, role) => {
		//First need to call IBM 		
		axios.post(process.env.REACT_APP_API_ENDPOINT+`users/`,{name:name,email:email,role:role})
			.then((response) => {			
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
			
			}, (error) => {
				console.log(error);
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
			  <BreadcrumbItem href="admins"  >Manage Admins</BreadcrumbItem>
			</Breadcrumb>
			<br/>
			
			<ComposedModal size="sm" open={this.state.modalOpen} preventCloseOnClickOutside={true} >
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
									style={{ marginBottom: '1rem' }}
									invalid={this.state.AdminNameInvalid}
									invalidText="Please enter a Admin name.."						
								/>
								<TextInput
									id="email"
									name="AdminEmail"
									value={this.state.AdminEmail || ""}
									onChange={this.saveData}
									labelText="Email Address"
									placeholder="Enter email address"
									invalid={this.state.AdminEmailInvalid}
									style={{ marginBottom: '1rem' }}
									invalidText="Please enter a email address.."
								/>
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
										invalidText="Please select admin role.."	
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
									{row.cells.map((cell) => (
									<TableCell key={cell.id}>{cell.value}</TableCell>
									))}
									<TableCell >
										<OverflowMenu light flipped>
										 <OverflowMenuItem itemText="Edit Admin" onClick={() => this.props.history.push('/edit/'+row.id)}  hasDivider />
										 <OverflowMenuItem itemText="Delete" 
										 onClick={(event) => {
											this.deleteRow(event,rowIndex,row.id)		
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
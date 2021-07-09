import React, { PureComponent } from 'react';
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
	DataTableSkeleton,
	InlineLoading,
	Toggle,
	Tooltip,
	TextInput,
	InlineNotification,
	Row, 
	Column,
	Button	
} from 'carbon-components-react';
//Draggable32 as Draggable,
import { Help16 as Help} from '@carbon/icons-react';
import axios from "axios";
import { columnsV2 } from "./TableHeader";
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

class WidgetTableV2 extends PureComponent {
	
	constructor(props) {
		super(props);
		this.state = {
			rows: [],
			dragIndex: -1,
			draggedIndex: -1,
			rowStatusID: [],
			isSubmitting: false,
			description: "Submititting",
			ariaLive: false,
			success : false,
			successMessage : "",
			isLoading: false,
			disabledButton: true,		
		};
		this.columns = columnsV2;
  	}
	
	componentDidMount() {
		this.getWidgetsQuestion();
	}
	
	toggleProps = () => ({
		labelA: '',
		labelB: '',
	});
	
	ToggleSwitch = (RowIndex, header) => {
		var rowIndex = RowIndex - 1
		return (this.state.rowStatusID).indexOf(rowIndex) > -1 ? 
			<InlineLoading
				style={{ marginLeft: '1rem' }}
			/>
		 : 
			(this.state.rows.length > rowIndex ) ? <Toggle size="sm"
				aria-label="toggle button"
				defaultToggled = {this.state.rows[rowIndex][header]}
				onChange={(e)=>this.UpdateWidgetRowsValue(e, rowIndex,header,true)}
				{...this.toggleProps()}
				id={'Toggle_'+rowIndex+header}
		/> : ''
	}

	UpdateWidgetRowsValue = (e,rowIndex,header, checkBox=false) => {
		//var fieldName = e.target.name;
		var elementValue = "";
		if(checkBox){
			elementValue = e.currentTarget.checked;
		} else {
			elementValue =  e.target.value;
		}		
		
		let gridData = this.state.rows;
		if(header === "display_text"){
			gridData[rowIndex]["display_text_value"] = elementValue
		}
		gridData[rowIndex][header] = elementValue
		this.setState({
			 rows:gridData
		});
	}
	
	CreateElement = (rowIndex, header, cellID) => {
		var currentRowIndex = rowIndex;//-1;
		var ratingHTML = []
		var row = this.state.rows[currentRowIndex]
		
		switch(header){
			case "id":			
				if(row.tooltip){					
					ratingHTML.push(<div key={cellID}>{row.name}&nbsp;
						<Tooltip
						direction="bottom"
						tabIndex={0}
						triggerText=""
						renderIcon={Help}
					><p>{row.tooltip}</p></Tooltip>
					</div>)
					
				} else {
					ratingHTML.push(<div key={cellID}>{row.name}</div>)
				}
			break;
			case "display_text":
				ratingHTML.push(<span key={cellID}>
					<TextInput
							id={row.id}
							name={row.name}
							labelText=""
							placeholder={row.display_text}
							defaultValue={row.display_text_value}
							onChange={(e)=>this.UpdateWidgetRowsValue(e, currentRowIndex,header,false)}
							/>
				</span>)
				break;
			default:	
				ratingHTML.push("")
				break;
			
		}
		return ratingHTML
	}
	
	checkForm = () => {
		checkFlag = true;		
		//Add validation checks 
		return checkFlag;
 	 };
	
	saveWidget = event => {
		event.preventDefault();
		if (this.checkForm()) {
			this.setState({ 
				isSubmitting: true,
				ariaLive: "Off",
				description: "Submitting" 
			});			
			this.createWidgetsQuestion()
		}
	};
	/******************** API CALL ***************/
	getWidgetsQuestion = () => {
		
		this.setState({ isLoading: true });
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`widgets/question`,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
			data :{id:this.props.recordID, type:"rating"}
		};
		axios(config)
		.then(result	 => {
			var response = result.data.data;
			this.setState({
				rows: response.question,
				RatingValue: response.ratingvalue,
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
	
	createWidgetsQuestion = (name, url) => {
		var config = {
			method: 'post',
			url:process.env.REACT_APP_API_ENDPOINT+`widgets/update_question`,
			headers: { 
				'Authorization': 'Bearer '+this.props.access_token
			},
			data : {id:this.props.recordID,rows:JSON.stringify(this.state.rows)}
		};
		axios(config)
		.then(result => {
			this.setState({ 
				isSubmitting: false,
				success: true,
				description: "Submitted" ,
				successMessage: "Your data has been saved successfully.",
			});
			this.getWidgetsQuestion()
			setTimeout(() => {
				this.setState({ success: false })
			}, 3000)
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
	return 	(		
		<>
			{ 
				this.state.success  ? 
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
						columnCount={this.columns.length + 1}
						rowCount={10}
						headers={this.columns}
				/>
			:
				<DataTable
					rows={this.state.rows}
					headers={this.columns}
					render={({
						rows,
						headers,
						getHeaderProps,
						getRowProps,
						getTableProps,
					}) => (
					<TableContainer
						title=""
						description="">
						<Table {...getTableProps()}>
							<TableHead>
								<TableRow>         
									{headers.map(header => (									
											<TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
									))}				
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row,rowIndex) => (
									<TableRow key={rowIndex} style={{ display: this.state.rows[rowIndex]["is_editable"] ? "" : "none"  }}>										
										{row.cells.map((cell) => {
											if(cell.info.header === 'is_required' || cell.info.header === 'is_active') {
												return <TableCell key={cell.id}>{this.ToggleSwitch(rowIndex+1,cell.info.header)}</TableCell> 
											}
											return <TableCell key={cell.id}>{this.CreateElement(rowIndex,cell.info.header,cell.id)}</TableCell> 
										})}
								</TableRow>
								))}
						</TableBody>
						</Table>
					</TableContainer>				
				)}
				/>
			}
			<Row>
				<Column sm={12} md={12} lg={12} style={{ textAlign:"left",paddingTop:'1rem'}}>
					<div>
					{
						this.state.isSubmitting  ? 
						<InlineLoading
							style={{ marginLeft: '1rem' }}
							description={this.state.description}
							status={this.state.success ? 'finished' : 'active'}
							aria-live={this.state.ariaLive}
						/>
						: 
						<Button kind='primary' onClick={(event) => {this.saveWidget(event)}} 	 >Save</Button>
					}
					
					</div>
				</Column>
			</Row>
		</>
  	);
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(WidgetTableV2);
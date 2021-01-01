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
	Select,
	SelectItem
	
} from 'carbon-components-react';

import {   Row, Column,Button } from 'carbon-components-react';


//Draggable32 as Draggable,
import { DragVertical16 as DragVertical, Help16 as Help, Subtract24 as Subtract
} from '@carbon/icons-react';
import axios from "axios";

import { columns } from "./TableHeader";
let checkFlag = true;

const closest = function(el, selector, rootNode) {
  rootNode = rootNode || document.body;
  //console.log('rootNode:', rootNode);
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector;
  //   console.log('matchesSelector:', matchesSelector);
  while (el) {
    const flagRoot = el === rootNode;
    if (flagRoot || matchesSelector.call(el, selector)) {
      if (flagRoot) {
        el = null;
      }
      break;
    }
    el = el.parentElement;
  }
 
  return el;
};

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

class WidgetTable extends PureComponent {
	
	constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      rows: [],
      dragIndex: -1,
      draggedIndex: -1,
			rowStatusID: [],
			isSubmitting: false,
		  description: "Submititting",
		  ariaLive: false,
		  success : false,
			isLoading: false,
			RatingValue: "",
			
    };
    this.columns = columns;
  }

	onMouseDown(e) {
    //console.log('onMouseDown');
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', true);
      target.ondragstart = this.onDragStart;
      target.ondragend = this.onDragEnd;
    }
  }

  onDragStart(e) {
    //console.log('onDragStart');
    const target = this.getTrNode(e.target);
    if (target) {
      e.dataTransfer.effectAllowed = 'move';
      //console.log('target.parentElement:', target.parentElement);
      target.parentElement.ondragenter = this.onDragEnter;
      target.parentElement.ondragover = function(ev) {
        ev.preventDefault();
        return true;
      };
      const dragIndex = target.rowIndex - 1;
      //console.log('dragIndex:', dragIndex);
      this.setState({ dragIndex, draggedIndex: dragIndex });
    }
  }

  onDragEnter(e) {
    const target = this.getTrNode(e.target);
    //console.log('onDragEnter TR index:', target.rowIndex - 1);
    this.setState({
      draggedIndex: target ? target.rowIndex - 1 : -1,
    });
  }

  onDragEnd(e) {
    //console.log('onDragEnd');
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', false);
      target.ondragstart = null;
      target.ondragend = null;
      target.parentElement.ondragenter = null;
      target.parentElement.ondragover = null;
      this.changeRowIndex();
    }
  }

  getTrNode(target) {
   
    return closest(target, 'tr');
  }

  changeRowIndex() {
    const result = {};
    const currentState = this.state;
    //console.log('currentState:', currentState);
    result.dragIndex = result.draggedIndex = -1;
    if (
      currentState.dragIndex >= 0 &&
      currentState.dragIndex !== currentState.draggedIndex
    ) {
      const { dragIndex, draggedIndex, rows: oldData } = currentState;
      const rows = [...oldData];
      //       const data = oldData;
      const item = rows.splice(dragIndex, 1)[0];
      rows.splice(draggedIndex, 0, item);
      result.rows = rows;
      result.dragIndex = -1;
      result.draggedIndex = -1;
    }
    this.setState(result);
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
			(this.state.rows.length > rowIndex ) ? <Toggle
				aria-label="toggle button"
				defaultToggled = {this.state.rows[rowIndex][header]}
				onChange={(e)=>this.UpdateWidgetRowsValue(e, rowIndex,header,true)}
				{...this.toggleProps()}
				id={'Toggle_'+rowIndex+header}
			/> : ''
	}

	UpdateWidgetRowsValue = (e,rowIndex,header, checkBox=false) => {
		var fieldName = e.target.name;
		var elementValue = "";
		if(checkBox){
			elementValue = e.currentTarget.checked;
		} else {
			elementValue =  e.target.value;
		}
		
		if(fieldName === "RatingValue")	{
				if (!elementValue) {
					this.setState({ [fieldName]: elementValue, [fieldName + "Invalid"]: true });
				} else {
					this.setState({
						[fieldName]: elementValue,
						[fieldName + "Invalid"]: false
					});
				}
		
		}
		let gridData = this.state.rows;
		if(header === "display_text"){
			gridData[rowIndex]["display_text_value"] = elementValue
		}
		gridData[rowIndex][header] = elementValue
		//console.log(gridData)
		this.setState({
			 rows:gridData
		});
	}
	
	CreateElement = (rowIndex, header, cellID) => {
		var currentRowIndex = rowIndex-1;
		var ratingHTML = []
		var row = this.state.rows[currentRowIndex]
		var limitOption = <p key={cellID} style={{textAlign: "center"}}><Subtract /></p>;
		if(row && row.limit > 0 ) {
			limitOption = <div key={cellID} style={{ float: "left",display:"flex",alignItems:"center"}}><TextInput
					id="characters"
					type="number"
					style={{width:"100px"}}
					labelText=""
					name="characters"
					size="sm"
					defaultValue={row.limit}		
					onChange={(e)=>this.UpdateWidgetRowsValue(e, currentRowIndex,'limit',false)}
			  />
				<span className="maxCharacters" >&nbsp;Maximum Characters </span> 
				</div>
		}
		switch(header){
			case "name":
					ratingHTML.push(<div key={cellID}>{row.name}&nbsp;
						<Tooltip
							direction="bottom"
							tabIndex={0}
							triggerText=""
							renderIcon={Help}
						><p>{row.tooltip}</p></Tooltip>
						</div>)
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
			case "option_id":
				if(row.options.length > 0 ){
					var ratingOptions = [] 
					for(var j =0 ; j < row.options.length;j++) {
								var Options = row.options[j];
								ratingOptions.push(<SelectItem key={j}
										text={Options.label}
										value={Options.id}
									/>
							)
					}					
					ratingHTML.push( <div key={cellID} >
						<Select
							onChange={(e)=>this.UpdateWidgetRowsValue(e, currentRowIndex,header)}
							defaultValue={(row.option_id) ? row.option_id : "placeholder-item"}
							id="widget-rating"
							name="RatingValue"
							invalid={this.state.RatingValueInvalid}
							invalidText="Please select rating"
							labelText=""
						>
						<SelectItem
							disabled
							hidden
							value="placeholder-item"
							text="Select Rating"
						/>
						{ratingOptions}
						</Select>
						</div>)
					
				} else {
					ratingHTML.push( limitOption)
				}
				
					break;
			default:	
					ratingHTML.push("")
					break;
			
		}
		return ratingHTML
	}
	
	checkForm = () => {
		checkFlag = true;		
		if (!this.state.RatingValue) {
			this.setState({ RatingValueInvalid: true });
			checkFlag = false;
		}
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
				data :{id:this.props.recordID}
		};
		axios(config)
		.then(result => {
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
						success: false,
						description: "Submitted" 
				});
			this.getWidgetsQuestion()
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
    return (
		
		<>
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
          title="  "
          description="  ">
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>             
								<TableHeader />
                {headers.map(header => (									
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
	
              </TableRow>
            </TableHead>
            <TableBody>
								{rows.map((row,rowIndex) => (
									<TableRow key={rowIndex} className="widgetsRow">
										<TableCell key={rowIndex++}>
												<span>
														{(this.state.dragIndex >= 0 &&
															this.state.dragIndex !== this.state.draggedIndex &&
															rowIndex === this.state.draggedIndex &&
															<span
																className={`drag-target-line ${this.state.draggedIndex <
																	this.state.dragIndex
																	? 'drag-target-top'
																	: ''}`}
															/>) ||
															''}
														<DragVertical className="drag-handle"
															draggable="false" onMouseDown={this.onMouseDown} />
													</span>
										</TableCell>
										{row.cells.map((cell) => {
											if(cell.info.header === 'is_required' || cell.info.header === 'is_active') {
												return <TableCell key={cell.id}>{this.ToggleSwitch(rowIndex,cell.info.header)}</TableCell> 
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
					<Column sm={12} md={12} lg={12} style={{ textAlign:"right",paddingTop:'1rem'}}>
						<div>
						{
							this.state.isSubmitting || this.state.success ? 
							<InlineLoading
								style={{ marginLeft: '1rem' }}
								description={this.state.description}
								status={this.state.success ? 'finished' : 'active'}
								aria-live={this.state.ariaLive}
							/>
						 : 
							<Button kind='primary' onClick={(event) => {this.saveWidget(event)}}>Save</Button>
						}
						</div>
					</Column>
				</Row>
		</>
  );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WidgetTable);
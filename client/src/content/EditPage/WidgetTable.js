import React, { PureComponent } from 'react';
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

const closest = function(el, selector, rootNode) {
  rootNode = rootNode || document.body;
  console.log('rootNode:', rootNode);
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector;
  //   console.log('matchesSelector:', matchesSelector);
  while (el) {
    const flagRoot = el === rootNode;
    //     console.log('flagRoot:', flagRoot);
    if (flagRoot || matchesSelector.call(el, selector)) {
      if (flagRoot) {
        el = null;
        //         console.log('flagRoot set el to null:', el);
      }
      //       console.log('break!');
      break;
    }
    el = el.parentElement;
    //     console.log('el = el.parentElement:', el);
  }
  //   console.log('closest:', el);
  //el.setAttribute('style', 'border: 50px solid red;');
  return el;
};

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
    };
    this.columns = columns;
  }

	onMouseDown(e) {
    console.log('onMouseDown');
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', true);
      target.ondragstart = this.onDragStart;
      target.ondragend = this.onDragEnd;
    }
  }

  onDragStart(e) {
    console.log('onDragStart');
    const target = this.getTrNode(e.target);
    if (target) {
      //       e.dataTransfer.setData('Text', '');
      e.dataTransfer.effectAllowed = 'move';
      console.log('target.parentElement:', target.parentElement);
      target.parentElement.ondragenter = this.onDragEnter;
      target.parentElement.ondragover = function(ev) {
        //         console.log('Tbody ondragover:',ev)
        //         ev.target.dataTransfer.effectAllowed = 'none'
        ev.preventDefault();
        return true;
      };
      const dragIndex = target.rowIndex - 1;
      console.log('dragIndex:', dragIndex);
      this.setState({ dragIndex, draggedIndex: dragIndex });
    }
  }

  onDragEnter(e) {
    const target = this.getTrNode(e.target);
    console.log('onDragEnter TR index:', target.rowIndex - 1);
    this.setState({
      draggedIndex: target ? target.rowIndex - 1 : -1,
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd');
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
    //     console.log('dragContainer:', this.refs.dragContainer)
    //     return closest(target, 'tr', this.refs.dragContainer.tableNode);
    return closest(target, 'tr');
  }

  changeRowIndex() {
    const result = {};
    const currentState = this.state;
    console.log('currentState:', currentState);
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
		//console.log(this.state.rows[rowIndex][header])
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
		console.log(gridData)
		this.setState({
			 rows:gridData
		});
	}
	
	CreateElement = (rowIndex, header, cellID) => {
		var currentRowIndex = rowIndex-1;
		var ratingHTML = []
		var row = this.state.rows[currentRowIndex]
		//console.log(this.state.rows[rowIndex][header])
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
					ratingHTML.push( <div key={cellID} ><Select
							onChange={(e)=>this.UpdateWidgetRowsValue(e, currentRowIndex,header)}
							defaultValue={(row.option_id) ? row.option_id : ""}
							id="widget-rating"
							name="widgetrating"
							labelText=""
						>
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
	
	
	
	saveWidget = event => {
		event.preventDefault();
			this.setState({ 
					isSubmitting: true,
					ariaLive: "Off",
					description: "Submitting" 
			});			
			this.createWidgetsQuestion()
	};
	/******************** API CALL ***************/
	getWidgetsQuestion = () => {
		
		this.setState({ isLoading: true });
		axios.post(process.env.REACT_APP_API_ENDPOINT+`widgets/question`,{id:this.props.recordID})
		.then(result => {
			//console.log(result.data.data)
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
	};
	
	createWidgetsQuestion = (name, url) => {
		console.log(JSON.stringify(this.state.rows))
		axios.post(process.env.REACT_APP_API_ENDPOINT+`widgets/update_question`,{id:this.props.recordID,rows:JSON.stringify(this.state.rows)})
			.then((response) => {			
				this.setState({ 
						isSubmitting: false,
						success: false,
						description: "Submitted" 
				});
				
			
			}, (error) => {
				console.log(error);
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
									<TableRow key={rowIndex} >
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

export default WidgetTable;

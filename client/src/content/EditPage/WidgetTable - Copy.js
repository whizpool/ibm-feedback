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
	Dropdown,
	TextInput,
	NumberInput
} from 'carbon-components-react';
//Draggable32 as Draggable,
import { DragVertical16 as DragVertical
} from '@carbon/icons-react';
import axios from "axios";
import { rowData } from "./TableDummyData";
import { columns } from "./TableHeader";

import { Help16 as Help, Subtract24 as Subtract
} from '@carbon/icons-react';

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
			isLoading: false,
      data: [],
      rows: [],
			rowStatusID: [],
      dragIndex: -1,
      draggedIndex: -1,
    };
    this.columns = columns;
  }
	
	componentDidMount() {
		this.getWidgetsQuestion();
	}
	
	toggleProps = () => ({
		labelA: '',
		labelB: '',
	});
	
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
    //console.log('onDragStart');
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
      //console.log('dragIndex:', dragIndex);
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
      const { dragIndex, draggedIndex, data: oldData } = currentState;
      const data = [...oldData];
      //       const data = oldData;
      const item = data.splice(dragIndex, 1)[0];
      data.splice(draggedIndex, 0, item);
      result.rows = data;
      result.dragIndex = -1;
      result.draggedIndex = -1;
    }
    this.setState(result);
  }
	
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
				//onChange={(e)=>this.UpdateWidgetStatus(e, rowIndex)}
				{...this.toggleProps()}
				id={'Toggle_'+rowIndex}
			/> : ''
	}
	
	CreateElement = (rowIndex, header) => {
		var ratingHTML = []
		var row = this.state.rows[rowIndex - 1]
		//console.log(this.state.rows[rowIndex][header])
		var limitOption = "";
		if(row && row.limit > 0 ) {
			limitOption = <><div style={{ float: "left",display:"flex",alignItems:"center"}}><NumberInput
				id="characters"
				className="numberTextInput"
				name="characters"
				size="sm"
				value={row.limit}			
			  />
				<span className="maxCharacters" >&nbsp;Maximum Characters </span> 
				</div> </>
		}
		switch(header){
			case "name":
				ratingHTML.push(<div key={row.id}>{row.name}&nbsp;
						<Tooltip
							direction="bottom"
							tabIndex={0}
							triggerText=""
							renderIcon={Help}
						><p>{row.tooltip}</p></Tooltip>
						</div>)
					break;
			case "display_text":
				ratingHTML.push(<div key={row.id}><TextInput
								id={row.name}
								name={row.name}
								labelText=""
								placeholder={row.display_text}	
								/>
						</div>)
					break;
			case "option_id":
				if(row.option_id > 0 ){
			
					ratingHTML.push( <div key={row.id} style={{ width: '200px' }}><Dropdown
						ariaLabel="Dropdown"
						id="widget-rating"
						name="widgetrating"
						items={row.options}
						label="Ratings"
						className="widget-ratings"
						titleText=""
					/></div>)
					
				} else {
					ratingHTML.push( limitOption)
				}
				
					break;
			default:	
					ratingHTML.push( <div key={row.id}></div>)
					break;
			
		}
		return ratingHTML
		/*
		return (this.state.rowStatusID).indexOf(rowIndex) > -1 ? 
			<InlineLoading
				style={{ marginLeft: '1rem' }}
			/>
		 : 
			(this.state.rows.length > rowIndex ) ? <Toggle
				aria-label="toggle button"
				defaultToggled = {this.state.rows[rowIndex][header]}
				//onChange={(e)=>this.UpdateWidgetStatus(e, rowIndex)}
				{...this.toggleProps()}
				id={'Toggle_'+rowIndex}
			/> : ''
			*/
	}
	
	/******************** API CALL ***************/
	getWidgetsQuestion = () => {
		
		//const currentUrl = window.location.href;
		//var recordID = currentUrl.substring(currentUrl.lastIndexOf('/') + 1)
	//	console.log(recordID)
		this.setState({ isLoading: true });
		axios.post(process.env.REACT_APP_API_ENDPOINT+`widgets/question`,{id:1})
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
											//else if(cell.info.header === 'name' || cell.info.header === 'is_active') {
												return <TableCell key={cell.id}>{this.CreateElement(rowIndex,cell.info.header)}</TableCell> 
											//}
											return <TableCell key={cell.id}>{cell.value}</TableCell>
										})}
										
								</TableRow>
								))}
							</TableBody>
          </Table>
        </TableContainer>
      )}
    />
		}
		</>
  );
  }
}

export default WidgetTable;

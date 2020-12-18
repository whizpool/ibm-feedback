
import React from 'react';
import { Toggle,TextInput,NumberInput,Tooltip,Dropdown} from 'carbon-components-react';

import { Help16 as Help, Subtract24 as Subtract
} from '@carbon/icons-react';


const toggleProps = () => ({
  labelA: '',
  labelB: '',
});

const ratings = [
  {
    id: 'stars',
    label: '5 Stars',
  },
  {
    id: 'Number',
    label: '1 to 5 Number',
  },
	{
    id: 'Smily',
    label: 'Smily Face',
  },
];


export const rowData = [
  {
    id: '1',
    type: <>Provide Feedback&nbsp;<Tooltip
      direction="bottom"
      tabIndex={0}
      triggerText=""
			renderIcon={Help}
    >
      <p>
        This is some tooltip text. This box shows the maximum amount of text that should appear inside. If more room is needed please use a modal instead.
      </p></Tooltip></>,
    display_text: <TextInput
				id="provide_feedback"
				name="provide_feedback"
				labelText=""
				placeholder="Provide Feedback"				
			  />,
    active: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled
      id="provide_feedback_active"
    />,
		required: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled
      id="provide_feedback_required"
    />,
		extra_option:  <><div style={{ float: "left",display:"flex",alignItems:"center"}}><NumberInput
				id="characters"
				className="numberTextInput"
				name="characters"
				size="sm"
				value="250"				
			  />
				<span className="maxCharacters" >&nbsp;Maximum Characters </span> 
				</div> </>,
		order:"0"
  },
 {
    id: '2',
    type: <>Phone No&nbsp;<Tooltip
      direction="bottom"
      tabIndex={0}
      triggerText=""
			renderIcon={Help}
    >
      <p>
        This is some tooltip text. This box shows the maximum amount of text that should appear inside. If more room is needed please use a modal instead.
      </p></Tooltip></>,
    display_text: <TextInput
				id="phoneno"
				name="phoneno"
				labelText=""
				placeholder="Phone No"
			  />,
    active: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
      id="phoneno_active"
    />,
		required: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
      id="phoneno_required"
    />,
		extra_option: <p style={{textAlign: "center"}}><Subtract /><Subtract /></p>,
		order:"0"
  },
	{
    id: '3',
    type: <>Name&nbsp;<Tooltip
      direction="bottom"
      tabIndex={0}
      triggerText=""
			renderIcon={Help}
    >
      <p>
        This is some tooltip text. This box shows the maximum amount of text that should appear inside. If more room is needed please use a modal instead.
      </p></Tooltip></>,
    display_text: <TextInput
				id="Name"
				name="Name"
				labelText=""
				placeholder="Name"
			  />,
    active: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled
      id="name_active"
    />,
		required: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled
      id="name_required"
    />,
		extra_option: <p style={{textAlign: "center"}}><Subtract /><Subtract /></p>,
		order:"0"
  },
  {
    id: '4',
    type: <>Email Address&nbsp;<Tooltip
      direction="bottom"
      tabIndex={0}
      triggerText=""
			renderIcon={Help}
    >
      <p>
        This is some tooltip text. This box shows the maximum amount of text that should appear inside. If more room is needed please use a modal instead.
      </p></Tooltip></>,
    display_text: <TextInput
				id="emailaddress"
				name="emailaddress"
				labelText=""
				placeholder="Email Address"
			  />,
    active: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled	
      id="emailaddress_active"
    />,
		required: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled
      id="emailaddress_required"
    />,
		extra_option: <p style={{textAlign: "center"}}><Subtract /><Subtract /></p>,
		order:"0"
  },
	{
    id: '5',
    type: <>Rate Us&nbsp;<Tooltip
      direction="bottom"
      tabIndex={0}
      triggerText=""
			renderIcon={Help}
    >
      <p>
        This is some tooltip text. This box shows the maximum amount of text that should appear inside. If more room is needed please use a modal instead.
      </p></Tooltip></>,
    display_text: <TextInput
				id="rateus"
				name="rateus"
				labelText=""
				placeholder="Rate Us"
			  />,
    active: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled
      id="rateus_active"
    />,
		required: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
			defaultToggled
      id="rateus_required"
    />,
		extra_option: <div style={{ width: '200px' }}><Dropdown
						ariaLabel="Dropdown"
						id="widget-rating"
						name="widgetrating"
						items={ratings}
						label="Ratings"
						className="widget-ratings"
						titleText=""
					/></div>,
		order:"0"
  },
  
];

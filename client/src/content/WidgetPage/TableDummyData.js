
import React from 'react';
import { Toggle} from 'carbon-components-react';

const toggleProps = () => ({
  labelA: '',
  labelB: '',
});


export const rowData = [
  {
    URL: 'https://www.whizpool.com/',
    id: '1',
    name: 'IBM Cloud Widget 01',
    date: '07 / 20 / 2020 01:02:30',
    cname: 'John Doe',
    status: <Toggle
	  {...toggleProps()}
      aria-label="toggle button"
      id="toggle-1"
    />,
  },
  {
    URL: 'https://www.whizpool.com/',
    id: '2',
    name: 'IBM Cloud Widget 02',
    date: '07 / 20 / 2020 01:02:30',
    cname: 'John Doe',
    status: <Toggle
      aria-label="toggle button"
      defaultToggled
	  {...toggleProps()}
      id="toggle-1"
    />,
  },
  {
    URL: 'https://www.whizpool.com/',
    id: '3',
    name: 'IBM Cloud Widget 03',
    date: '07 / 20 / 2020 01:02:30',
    cname: 'John Doe',
    status: <Toggle
      aria-label="toggle button"
      defaultToggled
	  labelA= ''
	  labelB= ''
      id="toggle-1"
    />,
  },
  {
    URL: 'https://www.whizpool.com/',
    id: '4',
    name: 'IBM Cloud Widget 04',
    date: '07 / 20 / 2020 01:02:30',
    cname: 'John Doe',
    status: <Toggle
      aria-label="toggle button"
      defaultToggled
	  {...toggleProps()}
      id="toggle-1"
    />,
  },
  {
    URL: 'https://www.whizpool.com/',
    id: '5',
    name: 'IBM Cloud Widget 05',
    date: '07 / 20 / 2020 01:02:30',
    cname: 'John Doe',
    rule: 'Round robin',
    status:<Toggle
      aria-label="toggle button"
      defaultToggled
	  {...toggleProps()}
      id="toggle-1"
    />,
  },
  {
    URL: 'https://www.whizpool.com/',
    id: 'f',
    name: 'IBM Cloud Widget 06',
    date: '07 / 20 / 2020 01:02:30',
    cname: 'John Doe',
    rule: 'DNS delegation',
    status: <Toggle
      aria-label="toggle button"
      defaultToggled
	  {...toggleProps()}
      id="toggle-1"
    />,
  },
];

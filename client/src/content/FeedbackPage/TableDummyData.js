import React from "react";

import { Star24 as Star, StarFilled24 as StarFilled, FaceDissatisfied24 as FaceDissatisfied,
FaceNeutral24 as FaceNeutral, 
FaceSatisfiedFilled24 as FaceSatisfiedFilled,
NumberSmall_424 as NumberSmall4,
NumberSmall_524 as NumberSmall5,
Number_124 as Number1,
Number_224 as Number2,
Number_324 as Number3,
} from '@carbon/icons-react';

/* import { Star24 as Star, StarFilled24 as StarFilled, StarHalf24 as StarHalf, FaceDissatisfied24 as FaceDissatisfied,
FaceNeutral24 as FaceNeutral, 
FaceSatisfied24 as FaceSatisfied,
FaceSatisfiedFilled24 as FaceSatisfiedFilled,
FaceNeutralFilled24 as FaceNeutralFilled,
FaceDissatisfiedFilled24 as FaceDissatisfiedFilled,

NumberSmall_124 as NumberSmall1,
NumberSmall_224 as NumberSmall2,
NumberSmall_324 as NumberSmall3,
NumberSmall_424 as NumberSmall4,
NumberSmall_524 as NumberSmall5,
Number_124 as Number1,
Number_224 as Number2,
Number_324 as Number3,
Number_424 as Number4,
Number_524 as Number5,

} from '@carbon/icons-react' */;

export const rowData = [
  {
    id: '1',
    date: '2020/05/07 01:03:35',
    rating: <span><StarFilled /><StarFilled /><StarFilled /><Star /><Star /></span>,
    url: 'whizpool.com',
    name: 'IBM Cloud Widget',
    email: 'johndoe@ymail.com',
  },
	{
    id: '2',
    date: '2020/05/07 01:03:35',
    rating: <span><b><Number1 /><Number2 /><Number3 /></b><NumberSmall4 /><NumberSmall5 /></span>,
    url: 'whizpool.com',
    name: 'IBM Cloud Widget',
    email: 'johndoe@ymail.com',
  },
	{
    id: '3',
    date: '2020/05/07 01:03:35',
    rating: <span><FaceDissatisfied /> <FaceNeutral /> <FaceSatisfiedFilled /></span>,
    url: 'whizpool.com',
    name: 'IBM Cloud Widget',
    email: 'johndoe@ymail.com',
  },
	{
    id: '4',
    date: '2020/05/07 01:03:35',
    rating: <span><StarFilled /><StarFilled /><StarFilled /><Star /><Star /></span>,
    url: 'whizpool.com',
    name: 'IBM Cloud Widget',
    email: 'johndoe@ymail.com',
  },
	{
    id: '5',
    date: '2020/05/07 01:03:35',
		rating: <span><b><Number1 /><Number2 /><Number3 /></b><NumberSmall4 /><NumberSmall5 /></span>,
    url: 'whizpool.com',
    name: 'IBM Cloud Widget',
    email: 'johndoe@ymail.com',
  },
	{
    id: '6',
    date: '2020/05/07 01:03:35',
		rating: <span><FaceDissatisfied /> <FaceNeutral /> <FaceSatisfiedFilled /></span>,
    url: 'whizpool.com',
    name: 'IBM Cloud Widget',
    email: 'johndoe@ymail.com',
  },
 
];

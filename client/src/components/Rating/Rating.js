import React from 'react';


import { 
	Star24 as Star, 
	StarFilled24 as StarFilled, 
	StarHalf24 as StarHalf, 
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
	FaceDissatisfied24 as FaceDissatisfied,
	FaceSatisfiedFilled24 as FaceSatisfiedFilled,
	FaceNeutral24 as FaceNeutral, 
	FaceNeutralFilled24 as FaceNeutralFilled,
	FaceSatisfied24 as FaceSatisfied,
	FaceDissatisfiedFilled24 as FaceDissatisfiedFilled,
} from '@carbon/icons-react';

const Rating = ({type,rating}) => {
		var ratingHTML = []
		if(type === 'star') {
			for(var i =1 ; i <= 5;i++) {
				if(i < rating)
					ratingHTML.push(<span key={i}><StarFilled /></span>)
				else if( parseInt(rating)+1 === i)
					ratingHTML.push(<span key={i}><StarHalf /></span>)
				else
					ratingHTML.push(<span key={i}><Star /></span>)
			}
		}	
		if(type === 'number') {
			
			switch(parseInt(rating)) {
				case 1:
					ratingHTML.push(<span key={rating}><Number1 /><NumberSmall2 /><NumberSmall3 /><NumberSmall4 /><NumberSmall5 /></span>)				
					break;
				case 2:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><NumberSmall3 /><NumberSmall4 /><NumberSmall5 /></span>)				
					break;	
				case 3:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><NumberSmall4 /><NumberSmall5 /></span>)				
					break;
				case 4:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><NumberSmall5 /></span>)				
					break;
				case 5:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /></span>)	
					break;
				 default:
							ratingHTML.push(<span key={rating}><NumberSmall1 /><NumberSmall2 /><NumberSmall3 /><NumberSmall4 /><NumberSmall5 /></span>)
						 break;	
			}
		}	
		if(type === 'smiley') {
				
				switch(parseInt(rating)) {
					case 1:
						ratingHTML.push(<><span key={rating}><FaceDissatisfiedFilled /></span><span><FaceNeutral /></span><span><FaceSatisfied /></span></>)
						break;	
					case 2:
							ratingHTML.push(<><span key={rating}><FaceDissatisfied /></span><span><FaceNeutralFilled /></span><span><FaceSatisfied /></span></>)
							break;
					 case 3:
							ratingHTML.push(<><span key={rating}><FaceDissatisfied /></span><span><FaceNeutral /></span><span><FaceSatisfiedFilled /></span></>)
							break;
					 default:
							ratingHTML.push(<><span key={rating}><FaceDissatisfied /></span><span><FaceNeutral /></span><span><FaceSatisfied /></span></>)
						 break;
				}						 
			
		}
		return ratingHTML
};

export default Rating;
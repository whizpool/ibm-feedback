import React from 'react';

import  SadeFace32 from "../../components/Icons/SadeFace32";
import  Nubmer1032 from "../../components/Icons/Nubmer1032";

import { 
	Star24 as Star, 
	StarFilled24 as StarFilled, 
	Number_132 as Number1,
	Number_232 as Number2,
	Number_332 as Number3,
	Number_432 as Number4,
	Number_532 as Number5,
	Number_632 as Number6,
	Number_732 as Number7,
	Number_832 as Number8,
	Number_932 as Number9,
	FaceDissatisfied32 as FaceDissatisfied,
	FaceNeutral32 as FaceNeutral, 
	FaceSatisfied32 as FaceSatisfied,
	FaceActivated32 as FaceActivated,
	ThumbsDown32 as ThumbsDown,
	ThumbsUp32 as ThumbsUp,
	FaceDissatisfiedFilled32 as FaceDissatisfiedFilled,
	FaceNeutralFilled32 as FaceNeutralFilled,
	FaceSatisfiedFilled32 as FaceSatisfiedFilled,

} from '@carbon/icons-react';

const Rating = ({type,rating}) => {
		var ratingHTML = []	
		if(type === 'stars' || type === 'star') {
			for(var i =1 ; i <= 5;i++) {
				if(i <= rating)
					ratingHTML.push(<span key={i}><StarFilled fill="#f1c21b"/></span>)
				else
					ratingHTML.push(<span key={i}><Star /></span>)
			}
		}	
		if(type === 'numeric') {			
			switch(parseInt(rating)) {
				case 1:
					ratingHTML.push(<span key={rating}><Number1 fill="#0f62fe"/><Number2 /><Number3 /><Number4 /><Number5 /><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1032 /></span>)				
					break;
				case 2:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 fill="#0f62fe"/><Number3 /><Number4 /><Number5 /><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1032 /></span>)				
					break;	
				case 3:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 fill="#0f62fe"/><Number4 /><Number5 /><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1032 /></span>)				
					break;
				case 4:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 fill="#0f62fe"/><Number5 /><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1032 /></span>)				
					break;
				case 5:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 fill="#0f62fe"/><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1032 /></span>)	
					break;	
				case 6:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /><Number6 fill="#0f62fe"/><Number7 /><Number8 /><Number9 /><Nubmer1032 /></span>)	
					break;
				case 7:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /><Number6 /><Number7 fill="#0f62fe"/><Number8 /><Number9 /><Nubmer1032 /></span>)	
					break;
				case 8:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /><Number6 /><Number7 /><Number8 fill="#0f62fe"/><Number9 /><Nubmer1032 /></span>)	
					break;
				case 9:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /><Number6 /><Number7 /><Number8 /><Number9 fill="#0f62fe"/><Nubmer1032 /></span>)	
					break;
				case 10:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1032 fill="#0f62fe"/></span>)	
					break;					
				 default:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /><Number6 /><Number7 /><Number8 /><Number9 /><Nubmer1032 /></span>)
				  break;	
			}	
		}
		if(type === 'number') {
			
			switch(parseInt(rating)) {
				case 1:
					ratingHTML.push(<span key={rating}><Number1 fill="#0f62fe"/><Number2 /><Number3 /><Number4 /><Number5 /></span>)				
					break;
				case 2:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 fill="#0f62fe"/><Number3 /><Number4 /><Number5 /></span>)				
					break;	
				case 3:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 fill="#0f62fe"/><Number4 /><Number5 /></span>)				
					break;
				case 4:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 fill="#0f62fe"/><Number5 /></span>)				
					break;
				case 5:
					ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 fill="#0f62fe"/></span>)	
					break;
				 default:
							ratingHTML.push(<span key={rating}><Number1 /><Number2 /><Number3 /><Number4 /><Number5 /></span>)
						 break;	
			}
		}	
		if(type === 'smiley') {
				
				switch(parseInt(rating)) {
					case 1:
						ratingHTML.push(<span key={rating}><FaceDissatisfiedFilled /><FaceNeutral /><FaceSatisfied /></span>)
						break;	
					case 2:
							ratingHTML.push(<span key={rating}><FaceDissatisfied /><FaceNeutralFilled /><FaceSatisfied /></span>)
							break;
					 case 3:
							ratingHTML.push(<span key={rating}><FaceDissatisfied /><FaceNeutral /><FaceSatisfiedFilled /></span>)
							break;
					 default:
							ratingHTML.push(<span key={rating}><FaceDissatisfied /><FaceNeutral /><FaceSatisfied /></span>)
						 break;
				}						 
			
		}
		
		if(type === 'emoticons') {
				
				switch(parseInt(rating)) {
					case 1:
						ratingHTML.push(<span key={rating}><SadeFace32 fill="#0f62fe"/><FaceDissatisfied /><FaceNeutral /><FaceSatisfied /><FaceActivated /></span>)
						break;	
					case 2:
							ratingHTML.push(<span key={rating}><SadeFace32 /><FaceDissatisfied  fill="#0f62fe"/><FaceNeutral /><FaceSatisfied /><FaceActivated/></span>)
							break;
					 case 3:
							ratingHTML.push(<span key={rating}><SadeFace32 /><FaceDissatisfied /><FaceNeutral fill="#0f62fe"/><FaceSatisfied /><FaceActivated /></span>)
							break; 
						case 4:
							ratingHTML.push(<span key={rating}><SadeFace32 /><FaceDissatisfied /><FaceNeutral /><FaceSatisfied fill="#0f62fe"/><FaceActivated /></span>)
							break;
						case 5:
							ratingHTML.push(<span key={rating}><SadeFace32 /><FaceDissatisfied /><FaceNeutral /><FaceSatisfied /><FaceActivated fill="#0f62fe"/></span>)
							break;
					 default:
							ratingHTML.push(<span key={rating}><SadeFace32 /><FaceDissatisfied /><FaceNeutral /><FaceSatisfied /><FaceActivated /></span>)
						 break;
				}						 
			
		}
		if(type === 'thumbs') {				
				switch(parseInt(rating)) {
					case 1:
						ratingHTML.push(<span key={rating}><ThumbsUp fill="#0f62fe"/><ThumbsDown/></span>)
						break;	
					case 2:
							ratingHTML.push(<span key={rating}><ThumbsUp /><ThumbsDown  fill="#0f62fe"/></span>)
							break;				
					 default:
							ratingHTML.push(<span key={rating}><ThumbsUp/><ThumbsDown/></span>)
						 break;
				}						 
			
		}
		return ratingHTML
};

export default Rating;
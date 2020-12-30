import React from 'react';
import { CodeSnippet  } from 'carbon-components-react';
import copy from 'copy-to-clipboard';


//var recordID = currentUrl.substring(currentUrl.lastIndexOf('/') + 1)
		
	/*	
const codeSnippet = `@mixin grid-container {
  width: 100%;
  padding-right: padding(mobile);
  padding-left: padding(mobile);
  @include breakpoint(bp--xs--major) {
    padding-right: padding(xs);
    padding-left: padding(xs);
  }
}
$z-indexes: (
  modal : 9000,
  overlay : 8000,
  dropdown : 7000,
  header : 6000,
  footer : 5000,
  hidden : - 1,
  overflowHidden: - 1,
  floating: 10000
);`; */

const SnippetPage = ({recordID,widgetURL}) => {
	var BaseURL = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port : '');
	
	
var codeSnippet = `<link rel="stylesheet" href="	https://unpkg.com/carbon-components/css/carbon-components.min.css" >
<script src="https://unpkg.com/carbon-components/scripts/carbon-components.min.js"></script>
<link rel="stylesheet" href="${BaseURL}/style.css">
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>  
<button  id='feedback' class='bx--btn bx--btn--primary'  type='submit'>Feedback</button> 
<div class='feedback-box'>
 <div class="content"><a class='close' href="#">x</a>
	<div id='widgetHTML'></div>
 </div>
</div>
<script>(function($) {	var feedback=$(".feedback-box");$("#feedback").on("click",function(){feedback.addClass("show")}),$(".close").on("click",function(){feedback.removeClass("show")});
$.post('${process.env.REACT_APP_API_ENDPOINT}feedbacks/getmywidget',{id:${recordID},url:'${widgetURL}'}).done(function(e){$("#widgetHTML").html(e.data),$("#widget_id").val(${recordID})});})(jQuery);</script>`

  return (
					<>
						<div>
							
							<CodeSnippet id="copy" type="multi" onClick={()=>copy(codeSnippet)}  >
									{codeSnippet}
							</CodeSnippet>
						</div>
					</>		
     
  );
};

export default SnippetPage;

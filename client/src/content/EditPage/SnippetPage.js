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
	
var encodedString = btoa(JSON.stringify({id:recordID,url:widgetURL}));
//let string = Buffer.from(b64Encodedstring, 'base64').toString()
	
var codeSnippet = `<link rel="stylesheet" href="	https://unpkg.com/carbon-components/css/carbon-components.min.css" >
<script src="https://unpkg.com/carbon-components/scripts/carbon-components.min.js"></script>
<script type="text/javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<link rel="stylesheet" href="${BaseURL}/inapp.css">
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="${BaseURL}/inapp.js"></script>  
<button  id='feedback'  class='bx--btn bx--btn--primary inappfeedback' data-html2canvas-ignore type='submit'>Feedback</button> 
<div class='feedback-box' id='feedback-box' data-html2canvas-ignore>
 <div class="content"><a class='close' href="#">x</a>
	<div id='widgetHTML'></div>
 </div>
</div>
<script>(function($) {
$.post('${process.env.REACT_APP_API_ENDPOINT}feedbacks/getmywidget/${encodedString}').done(function(e){$("#widgetHTML").html(e.data)});})(jQuery);</script>`

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

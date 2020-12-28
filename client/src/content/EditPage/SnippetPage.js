import React from 'react';
import { CodeSnippet  } from 'carbon-components-react';


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
	
	var codeSnippet = `<link rel="stylesheet" href="	https://unpkg.com/carbon-components/css/carbon-components.min.css" >
	<script src="https://unpkg.com/carbon-components/scripts/carbon-components.min.js"></script>
	<link rel="stylesheet" href="https://inapp-feedback.doctors-finder.com/style.css">
	<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	`;
	codeSnippet +=  "<script>var BaseUrl ='https://inapp-feedback.doctors-finder.com/api/v1/feedbacks';var widget_id="+recordID+";var widget_url='"+widgetURL+"';</script>";
	codeSnippet += `<button  id='feedback' class='bx--btn bx--btn--primary'  type='submit'>Feedback</button> <div class='feedback-box'><div class="content"><a class='close' href="#">x</a><div id='widgetHTML'></div></div></div></div>`;
	codeSnippet +=  '<script>(function($) {	var feedback=$(".feedback-box");$("#feedback").on("click",function(){feedback.addClass("show")}),$(".close").on("click",function(){feedback.removeClass("show"),setTimeout(function(){feedback.removeClass("show-confirm").find("textarea").val(""),console.log("reset")},1e3)}),$.post(BaseUrl+"/getmywidget",{id:widget_id,url:widget_url}).done(function(e){$("#widgetHTML").html(e.data),$("#widget_id").val(widget_id)});})(jQuery);</script>'
  return (
					<>
						<div>
							<CodeSnippet type="multi">
									{codeSnippet}
							</CodeSnippet>
						</div>
					</>		
     
  );
};

export default SnippetPage;

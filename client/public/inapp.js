(function($) {		
    $(document).on("click", ".inappfeedback" , function() { 
		
			var feedback = document.getElementById("feedback-box");

        screenshot('image');
				feedback.classList.add("show")
    }), 
		$(document).on("click", ".close" , function() { 
				var feedback = document.getElementById("feedback-box");
				feedback.classList.remove("show")
    });		
		function screenshot(imageID){
			html2canvas(document.body).then(function(e) {
				document.getElementById(imageID).value=e.toDataURL("image/jpeg",.9)
		 });
	 }		
})(jQuery);
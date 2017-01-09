jCalendar.prototype.Dhide = function(){
	var jCalendar = document.querySelector('#jCalendar');
	if(jCalendar !== null){
		jCalendar.parentNode.removeChild(jCalendar);
	}
}
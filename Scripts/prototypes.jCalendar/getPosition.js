jCalendar.prototype.DgetPosition = function(){
	var target_width = this.target.offsetWidth;
	var target_height = this.target.offsetHeight;
	
	var offset_top_of_screen = target_height + 2;
	var offset_left_of_screen = 2;
	
	var obj = this.target;
	
	if(obj.offsetParent){
		do{
			offset_left_of_screen += obj.offsetLeft;
			offset_top_of_screen += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	
	
	return {"offsetTop" : offset_top_of_screen, "offsetLeft" : offset_left_of_screen};
};
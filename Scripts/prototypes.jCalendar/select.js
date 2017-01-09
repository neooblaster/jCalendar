jCalendar.prototype.Dselect = function(date){
	/** DATE PARSING **/
	date = date.split('.');
	
	var day = parseInt(date[0]);
	var month = parseInt(date[1]);
	var year = parseInt(date[2]);
	
	
	/** UPDATE DATA **/
	this.selected = new Date(year, month, day, 0, 0, 0, 0);
	
	
	/** RIGHT FORMATING DATE **/
	day = (day < 10) ? '0'+day : day;
	month += 1;
	month = (month < 10) ? '0'+month : month;
	date = day+'/'+month+'/'+year;
	
	
	/** TRIGGERING **/
	this.target.value = date;
	this.hide();
	
	if(this.target.onchange !== null){
		this.target.onchange();
	}
};
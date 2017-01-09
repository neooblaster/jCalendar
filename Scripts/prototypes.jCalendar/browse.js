jCalendar.prototype.Dbrowse = function(action){
	/** Action : prev, now, next**/	
	console.log(action);
	/** Récupération de la date selectionnee **/
	var date_day = this.date.getDate();
	var date_month = this.date.getMonth();
	var date_year = this.date.getFullYear();	
	
	var new_year = date_year;
	var new_month = date_month;
	
	switch(action){
		case 'prev':
			if((date_month - 1) < 0){
				new_month = 11;
				new_year--;
			} else {
				new_month--;
			}
			this.date = new Date(new_year, new_month, 1, 0, 0, 0, 0);
			this.setTitle();
			this.weeksView();
		break;
		case 'now':
			this.date = new Date();
			this.selected = new Date();
			this.select(this.date.getDate()+'.'+this.date.getMonth()+'.'+this.date.getFullYear());
		break;
		case 'next':
			if((date_month + 1) > 11){
				new_month = 0;
				new_year++;
			}else {
				new_month++;
			}
			this.date = new Date(new_year, new_month, 1, 0, 0, 0, 0);
			this.setTitle();
			this.weeksView();
		break;
	}
	
	
	return true;
};
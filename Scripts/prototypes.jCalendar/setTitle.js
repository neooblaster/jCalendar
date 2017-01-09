jCalendar.prototype.DsetTitle = function(){
	document.querySelector('#jCalendar_head_date').innerHTML = this.date.getMonthName('fr-FR')+' '+this.date.getFullYear();
};
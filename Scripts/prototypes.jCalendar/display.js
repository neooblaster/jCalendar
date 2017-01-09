jCalendar.prototype.Ddisplay = function(){
	/** Rechercher si un jCalendar existe **/
	var jCalendar = document.querySelector('#jCalendar');
	var display = false;
	
	/** Si aucun calendrier n'existe, on l'affiche **/
	if(jCalendar == null){
		display = true;
	} 
	/** Sinon **/
	else {
		var jCalendarId = jCalendar.getAttribute('jCalendar');
		var thisId = this.target.getAttribute('jCalendar');
		
		/** Si les ID diffère, on kill le jCalendar trouvé et on créer celui de l'input this**/
		if(jCalendarId !== thisId){
			jCalendar.parentNode.removeChild(jCalendar);
			display = true;
		}
		/** Sinon on ferme le calendar **/
		else {
			this.hide();
		}
	}
	
	/** Construction (affichage) du calendrier **/
	if(display){
		var offsets = this.getPosition();
		var offsetTop = offsets.offsetTop;
		var offsetLeft = offsets.offsetLeft;

		var calendar = document.createElement('div');
			calendar.setAttribute('id', 'jCalendar');
			calendar.setAttribute('onselectstart', 'return false;'); // Disabled userSelect on IE et Chrome
			calendar.setAttribute('style', '-moz-user-select: none; top: '+offsetTop+'px; left: '+offsetLeft+'px;');	// Disabled userSelect on FF

			var calendar_head = document.createElement('div');
				calendar_head.setAttribute('id', 'jCalendar_head');

				var calendar_head_date = document.createElement('div');
					calendar_head_date.setAttribute('id', 'jCalendar_head_date');
					calendar_head_date.setAttribute('title', 'Afficher les mois');

				var calendar_head_prev = document.createElement('div');
					calendar_head_prev.setAttribute('id', 'jCalendar_head_prev');
					calendar_head_prev.setAttribute('title', 'Mois Précédent');
					calendar_head_prev.onclick = this.browse.bind(this, 'prev');

				var calendar_head_now = document.createElement('div');
					calendar_head_now.setAttribute('id', 'jCalendar_head_now');
					calendar_head_now.setAttribute('title', 'Aujourd\'hui');
					calendar_head_now.onclick = this.browse.bind(this, 'now');

				var calendar_head_next = document.createElement('div');
					calendar_head_next.setAttribute('id', 'jCalendar_head_next');
					calendar_head_next.setAttribute('title', 'Mois Suivant');
					calendar_head_next.onclick = this.browse.bind(this, 'next');

				var calendar_head_clear = document.createElement('div');
					calendar_head_clear.setAttribute('id', 'jCalendar_head_clear');
					calendar_head_clear.setAttribute('title', "Effacer et fermer");
					calendar_head_clear.onclick = this.clear.bind(this);

				var calendar_head_close = document.createElement('div');
					calendar_head_close.setAttribute('id', 'jCalendar_head_close');
					calendar_head_close.setAttribute('title', 'Fermer');
					calendar_head_close.onclick = this.hide.bind(this);

			var calendar_content = document.createElement('div');
				calendar_content.setAttribute('id', 'jCalendar_content');

				calendar_head.appendChild(calendar_head_date);
				calendar_head.appendChild(calendar_head_prev);
				calendar_head.appendChild(calendar_head_now);
				calendar_head.appendChild(calendar_head_next);
				calendar_head.appendChild(calendar_head_clear);
				calendar_head.appendChild(calendar_head_close);
			calendar.appendChild(calendar_head);
			calendar.appendChild(calendar_content);

		document.body.appendChild(calendar);

		this.setTitle();
		this.weeksView();
	}
};
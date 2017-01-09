/** Constructeur du calendrier sous sa forme, semaines du mois (vue des semaines) **/
jCalendar.prototype.DweeksView = function(){
	/** DECLARATION DES PROPRIETES ET VARIABLE **/
	var host_content = document.querySelector('#jCalendar #jCalendar_content');
	var days_name = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	var days_header = new Array('lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.');
	var decalage = {'Monday' : 0, 'Tuesday' : 1, 'Wednesday' : 2, 'Thursday' : 3, 'Friday' : 4, 'Saturday' : 5, 'Sunday' : 6};	
	
	/** PURGE DE L'ANCIEN CALENDRIER (S'il y en a un) **/
	host_content.innerHTML = '';
	
	
	/** TRAITEMENT DES DONNEES **/
		/** > Données de la date du jour **/
		var today_day = this.today.getDate();
		var today_month = this.today.getMonth();
		var today_year = this.today.getFullYear();
		
		/** > Données de la date donnée **/
		var date_day = this.date.getDate();
		var date_month = this.date.getMonth();
		var date_year = this.date.getFullYear();
		var date_days = this.date.getDaysInMonth();
	
		/** > Donnée de la date selectionnée **/
		var selected_day = this.selected.getDate();
		var selected_month = this.selected.getMonth();
		var selected_year = this.selected.getFullYear();
		var selected_days = this.selected.getDaysInMonth();
		
		/** > Donnée du premier jour du mois de la date donnée **/
		var first_day = new Date(date_year, date_month, 1, 0, 0, 0, 0);
		var first_day_name = days_name[first_day.getDay()];
		
		/** > Calcul du nombre de ligne qui constituent le calendar du mois de la date donnée **/
		var total_rows = Math.ceil((date_days + decalage[first_day_name]) / 7) + 1;
		
		/** > Initialisation des données pour la création du calendrier **/
		var void_cell_done = 0;
		var days_processed = 1;
	
	
	
	/** CONSTRUCTION DU CALENDRIER **/
		/** > Création du tableau **/
		var table = document.createElement('table');
			table.setAttribute('id', 'weeksView');
		
		/** > Parcourir le tableau sur le nombre de ligne calculée **/
		for(var w = 0; w < total_rows; w++){
			/** > Création d'une ligne **/
			var w_row = document.createElement('tr');
			
			/** > Générer les cellules sur 7 jour **/
			for(var d = 0; d < 7; d++){
				/** > Création de la cellule **/
				var w_row_cell = document.createElement('th');
				
				/** > Si c'est la premier ligne -> Entete du tableau avec les jours **/
				if(w === 0){
					w_row_cell.innerHTML = days_header[d];
				} 
				/** > Sinon, ce sont les numéros de jour **/
				else {
					/** Si le nombre de cellule vide créées est inférieur au décalage en faire une autre **/
					if(void_cell_done < decalage[first_day_name]){
						w_row_cell.setAttribute('class', 'jvoid');
						void_cell_done++;
					} 
					/** Sinon Si le nombre de jour traité est inférieur au jour dans le mois, on ajoute un jour **/
					else if(days_processed <= date_days){
						var cell_class = '';
						var oc_date = days_processed+'.'+date_month+'.'+date_year;
						
						/** RECHERCHE POUR AFFICHAGE DE L'ENCADRÉ DU JOUR EN COURS **/
						if((days_processed === today_day) && (date_month === today_month && date_year === today_year)){
							cell_class += 'jtoday';
						}
						
						/** RECHERCHE POUR AFFICHAGE DU JOUR SELECTIONNE **/
						if((days_processed === selected_day) && (date_month === selected_month && date_year === selected_year)){
							cell_class += ' jselected';
						}
						
						/** Dans tous les cas, on y insère le jour et on incrémente le compteur des jours traités **/
						w_row_cell.setAttribute('class', cell_class);
						//w_row_cell.setAttribute('onclick', 'MOTEUR.CALENDAR.select(\''+oc_date+'\');');
						w_row_cell.onclick = this.select.bind(this, oc_date);
						w_row_cell.innerHTML = days_processed;
						days_processed++;
					} 
					/** Sinon, le reste ce sont des cases vide **/
					else {
						w_row_cell.setAttribute('class', 'jvoid');
					}
				}
				
				/** > Insérer la cellule dans la ligne**/
				w_row.appendChild(w_row_cell);
			}
			/** > Insérer la ligne dans le tableau **/
			table.appendChild(w_row);
		}
	/** > Insérer le tableau dans le calendrier **/
	host_content.appendChild(table);
};
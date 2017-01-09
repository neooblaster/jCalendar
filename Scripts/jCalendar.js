/** ----------------------------------------------------------------------------------------------------------------------- 
/** ----------------------------------------------------------------------------------------------------------------------- 
/** ---																																						---
/** --- 											----------------------------------------------- 											---
/** ---														{ j C a l e n d a r . j s }															---
/** --- 											----------------------------------------------- 											---
/** ---																																						---
/** ---		AUTEUR 	: Nicolas DUPRE																												---
/** ---																																						---
/** ---		RELEASE	: 20.10.2016																													---
/** ---																																						---
/** ---		VERSION	: 3.2.1																															---
/** ---																																						---
/** ---																																						---
/** --- 														-----------------------------															---
/** --- 															 { C H A N G E L O G } 																---
/** --- 														-----------------------------															---
/** ---																																						---
/** ---																																						---
/** ---																																						---
/** ---			- [Ajout de la fermeture du calendrier sur une tabulation]																---
/** ---																																						---
/** ---																																						---
/** ---		VERSION 3.2.1 : 20.10.2016																												---
/** ---		--------------------------																												---
/** ---			- Modification des déclenchements des évenements:																			---
/** ---				Utilisation de l'objet Event+dispatchEvent au lieu de la propriété concernée									---
/** ---																																						---
/** ---																																						---
/** ---		VERSION 3.2 : 31.08.2016																												---
/** ---		------------------------																												---
/** ---			- Correction de la méthode Browse, dans le cas "Next" lorsqu'on était le dernier jour du mois				---
/** ---			Exemple dans le cas ou on était le 31 Aout, le mois de septembre ayant 30 jour									---
/** ---			Se basé sur la seule incrémentation du mois donnais le 31 septembre 2016, soit le 1 Octobre 2016 (30 + 1)---
/** ---			>  Si le jour de la date selection est le dernier jour du mois, alors calculer le "new_day"					---
/** ---																																						---
/** ---		VERSION 3.1 : 08.08.2016																												---
/** ---		------------------------																												---
/** ---			- Mise à jour de la méthode clear() afin de déclencher l'event onchange lorsqu'on l'utilise					---
/** ---																																						---
/** ---		VERSION 3.0 : 22.04.2016																												---
/** ---		------------------------																												---
/** ---			- Ajout d'une variable permettant de définir les comportements par défaut											---
/** ---			- Aggregation des prototypes																										---
/** ---			- Ajout de la vue Mois et de la vue Années																					---
/** ---			- Prise en charge de la langue à l'aide d'un nouvel attribut															---
/** ---			- Extension de la souplesse des attribut (insenbile à la casse)														---
/** ---																																						---
/** ---		VERSION 2.2 : 25.01.2016																												---
/** ---		------------------------																												---
/** ---			- Correction de la partie d'indentification de la date selectionnée :												---
/** ---																																						---
/** ---		VERSION 2.1 : 15.09.2015																												---
/** ---		------------------------																												---
/** ---			- Implémentation d'attributs de configuration :																				---
/** ---				- focus-after-select	:	Indique si l'on rend le focus après la selection										---
/** ---																																						---
/** ---		VERSION 2.0 : 14.03.2015																												---
/** ---		------------------------																												---
/** ---			- Création d'un convertisseur pour implémenter jCalendar dans la page Web											---
/** ---				-> Récupère et convertis les inputs type jCalendar en input text avec affihage en onclick et onfocus	---
/** ---			- Mise a jour de la méthode display pour afficher imédiatement un calendrier sur un autre input				---
/** ---			  en fermant celui qui est eventuellement ouvert																			---
/** ---																																						---
/** ---		VERSION 1.1 :																																---
/** ---		-------------																																---
/** ---			- Correction des pointages des methodes pour une utilisation imédiate sans passer par des variables		---
/** ---																																						---
/** ---		VERSION 1.0 :																																---
/** ---		-------------																																---
/** ---			- Première release																													---
/** ---																																						---
/** --- 												---------------------------------------------											---
/** ---														{ LISTE DES ATTRIBUTS ADMISSIBLE }													---
/** --- 												---------------------------------------------											---
/** ---																																						---
/** ---																																						---
/** ---		Format : 	Attribut_name	[TypeOf]		(Values{default_value})																---
/** ---		--------------------------------------------------------------																---
/** ---																																						---
/** ---		•  focus-after-select	[String]		({true}|false)																				---
/** ---		•  lang						[String]		({en-EN}|fr-FR|es-ES|de-DE|it-IT|ru-RU)											---
/** ---		•  offsetTop				[String]		({0}, [0-9]{0,})																			---
/** ---		•  offsetLeft				[String]		({0}, [0-9]{0,})																			---
/** ---																																						---
/** ---																																						---
/** --- 											-----------------------------------------------------										---
/** --- 												{ L I S T E      D E S      M E T H O D E S } 											---
/** --- 											-----------------------------------------------------										---
/** ---																																						---
/** ---		GETTERS :																																	---
/** ---	    ---------																																	---
/** ---																																						---
/** ---			- [Pub] get_blocks_vars																												---
/** ---																																						---
/** ---		SETTERS :																																	---
/** ---	    ---------																																	---
/** ---																																						---
/** ---			- [Pub] set_blocks_vars																												---
/** ---																																						---
/** ---		OUTPUTTERS :																																---
/** ---	    ------------																																---
/** ---																																						---
/** ---			- [Pub] debugPath																														---
/** ---																																						---
/** ---		WORKERS :																																	---
/** ---	    ---------																																	---
/** ---																																						---
/** ---			- [Pub] cleansing_render_env																										---
/** ---																																						---
/** -----------------------------------------------------------------------------------------------------------------------
/** ----------------------------------------------------------------------------------------------------------------------- **/
/** Config Default Behavior of Attributes **/
jCalendar_config = {
	"default_language": "fr-fr"
};



/** CREATION DE LA CLASSE jCalendar **/
function jCalendar(target){
	/** -------------------------------------------------------------------------------------------------------------------- **
	/** ---																																					--- **
	/** ---												Déclaration des propriétés de l'instance												--- **
	/** ---																																					--- **
	/** -------------------------------------------------------------------------------------------------------------------- **/
	var self = this;			// Cloisonnement
	
	self.clock = null;		// 			:: Variable contenant le timer qui refresh la date du jour (today)
	self.date = null;			// Date		:: Date séléctionnée sur laquelle la construction du calendier s'effectue
	self.selected = null;	// Date		:: Date selectionnée précédement, dans le champs
	self.timer = null;		// 			:: Fonction ayant pour but de mettre à jour la date du jour
	self.today = null;		// Date		:: Date du jour - Sert pour des comparaisons
	self.target = null;		// Object	:: Donnée relative à l'objet HTMLInputElement cible
	self.scale = "week";		// String	:: Echelle de temps pour la visualisaiton : {week}|month|year
	
	self.texts = {
		"clear_and_close": {
			"fr-fr": "Effacer et fermer", 
			"en-en": "Clear and close", 
			"es-es": "Ver y cercaa",
			"de-de": "Klare und Schließen",
			"it-it": "Visualizza e vicino",
			"ru-ru": "Просмотр и закрыть"
		},
		"close": {
			"fr-fr": "Fermer", 
			"en-en": "Close", 
			"es-es": "Cerca",
			"de-de": "Schließen",
			"it-it": "Vicino",
			"ru-ru": "близко"
		},
		"next_month": {
			"fr-fr": "Mois suivant", 
			"en-en": "Next month", 
			"es-es": "Mes próximo",
			"de-de": "Nächsten Monat",
			"it-it": "Mese prossimo",
			"ru-ru": "Следующий месяц"
		},
		"prev_month": {
			"fr-fr": "Mois précédent", 
			"en-en": "Previous month",
			"es-es": "Mes anterior",
			"de-de": "Vorheriger Monat",
			"it-it": "Mese precedente",
			"ru-ru": "Предыдущий месяц"
		},
		"show_months": {
			"fr-fr": "Afficher les mois", 
			"en-en": "Show months",
			"es-es": "Ver mes",
			"de-de": "Monat anzeigen",
			"it-it": "Vista mese",
			"ru-ru": "Просмотр месяца"
		},
		"show_years": {
			"fr-fr": "Afficher les années", 
			"en-en": "Show years",
			"es-es": "Mostrar años",
			"de-de": "Zeige Jahre",
			"it-it": "Mostra anni",
			"ru-ru": "Показать лет"
		},
		"today": {
			"fr-fr": "Aujourd'hui", 
			"en-en": "Today",
			"es-es": "Hoy",
			"de-de": "Heute",
			"it-it": "Oggi",
			"ru-ru": "Сегодня"
		},
		"days_headers": {
			"fr-fr": ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"], 
			"en-en": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
			"es-es": ["Lun","Mar","Mie","Jue","Vie","Sáb","Dom"],
			"de-de": ["Mon","Die","Mit","Don","Fre","Sam","Son"],
			"it-it": ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"],
			"ru-ru": ["Пон","Вто","Сре","Чет","Пят","Суб","Вос"]
		},
		"year": {
			"fr-fr": "Année", 
			"en-en": "Year",
			"es-es": "Año",
			"de-de": "Jahr",
			"it-it": "Anno",
			"ru-ru": "Год"
		},
		"months_name": {
			"fr-fr" : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
			"en-en" : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			"es-es" : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			"de-de" : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
			"it-it" : ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
			"ru-ru" : ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
		}
	};
	
	self.availLang = ["en-en", "fr-fr", "es-es", "de-de", "it-it", "ru-ru"];
	
	
	/** -------------------------------------------------------------------------------------------------------------------- **
	/** ---																																					--- **
	/** ---												Déclaration des méthodes de l'instance													--- **
	/** ---																																					--- **
	/** -------------------------------------------------------------------------------------------------------------------- **/
	/** Méthode de navigatiion dans la vue du calendrier **/
	self.browse = function(action){
		/** Action : prev, now, next**/	
		/** Récupération de la date selectionnee **/
		var date_day = self.date.getDate();
		var date_month = self.date.getMonth();
		var date_year = self.date.getFullYear();	
		
		var new_year = date_year;
		var new_month = date_month;
		var new_day = date_day;
		
		/** Gestion de la navigation **/
		switch(action){
			case 'prev':
				/** Gestion de l'échelle **/
				switch(self.scale){
					case 'week':
						if((date_month - 1) < 0){
							new_month = 11;
							new_year--;
						} else {
							new_month--;
						}
					break;
					case 'month':
						new_year = date_year - 1;
					break;
					case 'year':
						new_year = date_year - 25;
					break;
				}
				
				/** Si le jour du mois en cours est le dernier, alors le positionner sur le dernier du mois à définir **/
				if(self.date.isLastDay()){
					new_day = new Date(new_year, (new_month + 1), 0).getDate();
				}
				
				self.date = new Date(new_year, new_month, new_day, 0, 0, 0, 0);
				self.setTitle();
				self.setView();
			break;
			case 'now':
				self.date = new Date();
				self.selected = new Date();
				self.select(self.date.getDate()+'.'+self.date.getMonth()+'.'+self.date.getFullYear());
			break;
			case 'next':
				/** Gestion de l'échelle **/
				switch(self.scale){
					case 'week':
						if((date_month + 1) > 11){
							new_month = 0;
							new_year++;
						}else {
							new_month++;
						}
					break;
					case 'month':
						new_year = date_year + 1;
					break;
					case 'year':
						new_year = date_year + 25;
					break;
				}
				
				/** Si le jour du mois en cours est le dernier, alors le positionner sur le dernier du mois à définir **/
				if(self.date.isLastDay()){
					new_day = new Date(new_year, (new_month + 1), 0).getDate();
				}
				
				self.date = new Date(new_year, new_month, new_day, 0, 0, 0, 0);
				self.setTitle();
				self.setView();
			break;
		}
		return true;
	};
	
	/** Méthode de remize à zéro du champs **/
	self.clear = function(){
		/** Effacer le contenu de l'input cible **/
		self.target.HTMLElement.value = "";
		self.hide();
		
		var event = new Event('change');
		self.target.HTMLElement.dispatchEvent(event);
	};
	
	/** Fonction d'affichage **/
	self.display = function(){
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
			var thisId = self.target.attributes.id;
			
			/** Si les ID diffère, on kill le jCalendar trouvé et on créer celui de l'input this**/
			if(jCalendarId !== thisId){
				jCalendar.parentNode.removeChild(jCalendar);
				display = true;
			}
			/** Sinon on ferme le calendar **/
			else {
				self.hide();
			}
		}
		
		/** Construction (affichage) du calendrier **/
		if(display){
			var offsets = self.getPosition();
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
						calendar_head_date.setAttribute('title', self.texts['show_months'][self.target.attributes.lang]);
		
					var calendar_head_prev = document.createElement('div');
						calendar_head_prev.setAttribute('id', 'jCalendar_head_prev');
						calendar_head_prev.setAttribute('title', self.texts['prev_month'][self.target.attributes.lang]);
						calendar_head_prev.onclick = function(){self.browse('prev');}
		
					var calendar_head_now = document.createElement('div');
						calendar_head_now.setAttribute('id', 'jCalendar_head_now');
						calendar_head_now.setAttribute('title', self.texts['today'][self.target.attributes.lang]);
						calendar_head_now.onclick = function(){self.browse('now');}
		
					var calendar_head_next = document.createElement('div');
						calendar_head_next.setAttribute('id', 'jCalendar_head_next');
						calendar_head_next.setAttribute('title', self.texts['next_month'][self.target.attributes.lang]);
						calendar_head_next.onclick = function(){self.browse('next');}
		
					var calendar_head_clear = document.createElement('div');
						calendar_head_clear.setAttribute('id', 'jCalendar_head_clear');
						calendar_head_clear.setAttribute('title', self.texts['clear_and_close'][self.target.attributes.lang]);
						calendar_head_clear.onclick = function(){self.clear();};
		
					var calendar_head_close = document.createElement('div');
						calendar_head_close.setAttribute('id', 'jCalendar_head_close');
						calendar_head_close.setAttribute('title', self.texts['close'][self.target.attributes.lang]);
						calendar_head_close.onclick = function(){self.hide();};
		
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
		
			self.setTitle();
			self.setView();
		}
	};
	
	/** Méthode de calcul de positionnement du calendrier **/
	self.getPosition = function(){
		/** Récupération des propriétés du bouton **/
		var target_width = self.target.HTMLElement.offsetWidth;
		var target_height = self.target.HTMLElement.offsetHeight;
		
		/** Initialisation de l'offset de position **/
		var offset_top_of_screen = target_height + self.target.attributes.offsetTop;
		var offset_left_of_screen = self.target.attributes.offsetLeft;
		
		/** Début du calcul de position **/
		var obj = self.target.HTMLElement;
		
		if(obj.offsetParent){
			do{
				offset_left_of_screen += obj.offsetLeft;
				offset_top_of_screen += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		
		return {"offsetTop" : offset_top_of_screen, "offsetLeft" : offset_left_of_screen};
	};
	
	/** Méthode pour fermer le calendrier **/
	self.hide = function(){
		var jCalendar = document.querySelector('#jCalendar');
		if(jCalendar !== null){
			jCalendar.parentNode.removeChild(jCalendar);
		}
	};
	
	/** Méthode de sélection de la date **/
	self.select = function(date){
		/** DATE PARSING **/
		date = date.split('.');
		
		var day = parseInt(date[0]);
		var month = parseInt(date[1]);
		var year = parseInt(date[2]);
		
		
		/** UPDATE DATA **/
		self.selected = new Date(year, month, day, 0, 0, 0, 0);
		
		
		/** RIGHT FORMATING DATE **/
		day = (day < 10) ? '0'+day : day;
		month += 1;
		month = (month < 10) ? '0'+month : month;
		date = day+'/'+month+'/'+year;
		
		
		/** TRIGGERING **/
		self.target.HTMLElement.value = date;
		self.hide();
		
		var event = new Event('change');
		self.target.HTMLElement.dispatchEvent(event);
	};
	
	/** Méthode de définition de la date interne (date de navigation) **/
	self.setDate = function(date){
		/** Découpage de la date **/
		date = date.split('.');
		
		var day = parseInt(date[0]);
		var month = parseInt(date[1]);
		var year = parseInt(date[2]);
		
		/** Mise à jour de la date **/
		self.date = new Date(year, month, day, 0, 0, 0, 0);
	};
	
	/** Méthode de changement d'échelle de temps **/
	self.setScale = function(scale){
		self.scale = scale;
		
		self.setTitle();
		self.setView();
	};
	
	/** Méthode de gestion du titre du calendrier (Mois / Année) **/
	self.setTitle = function(){
		var head_date = document.querySelector('#jCalendar_head_date');
		
		switch(self.scale){
			case 'week':
				head_date.textContent = self.date.getMonthName(self.target.attributes.lang)+' '+self.date.getFullYear();
				head_date.onclick = function(){self.setScale('month');};
				head_date.setAttribute('title', self.texts['show_months'][self.target.attributes.lang]);
			break;
			case 'month':
				head_date.textContent = self.date.getFullYear();
				head_date.onclick = function(){self.setScale('year');};
				head_date.setAttribute('title', self.texts['show_years'][self.target.attributes.lang]);
			break;
			case 'year':
				var date = self.date.getFullYear();
				head_date.textContent = (date - 12)+' - '+(date + 12);
				head_date.setAttribute('title', "");
			break;
		}
	};
		
	/** Gestionnaire des vues **/
	self.setView = function(){
		/** DECLARATION DES PROPRIETES ET VARIABLE **/
		var host_content = document.querySelector('#jCalendar #jCalendar_content');
		var days_name = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
		var decalage = {'Monday' : 0, 'Tuesday' : 1, 'Wednesday' : 2, 'Thursday' : 3, 'Friday' : 4, 'Saturday' : 5, 'Sunday' : 6};
		
		/** PURGE DE L'ANCIEN CALENDRIER (S'il y en a un) **/
		host_content.innerHTML = '';
		
		/** TRAITEMENT DES DONNEES **/
		/** > Données de la date du jour **/
		var today_day = self.today.getDate();
		var today_month = self.today.getMonth();
		var today_year = self.today.getFullYear();
		
		/** > Données de la date donnée **/
		var date_day = self.date.getDate();
		var date_month = self.date.getMonth();
		var date_year = self.date.getFullYear();
		var date_days = self.date.getDaysInMonth();
		
		/** > Donnée de la date selectionnée **/
		var selected_day = self.selected.getDate();
		var selected_month = self.selected.getMonth();
		var selected_year = self.selected.getFullYear();
		var selected_days = self.selected.getDaysInMonth();
		
		switch(self.scale){
			/** Les semaines du mois selectionné **/
			case 'week':
				/** TRAITEMENT DES DONNEES **/
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
							w_row_cell.innerHTML = self.texts['days_headers'][self.target.attributes.lang][d];
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
								w_row_cell.onclick = function(date){self.select(date)}.bind('', oc_date);
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
			break;
				
			/** Les mois de l'année selectionné **/
			case 'month':
				var month = 0;
				var table = document.createElement('table');
					table.setAttribute('id', 'monthsView');
				
				for(var r = 0; r < 4; r++){
					var row = document.createElement('tr');
					
					for(var c = 0; c < 3; c++){
						var cell = document.createElement('th');
							/** Ecriture du mois **/
							cell.textContent = self.texts['months_name'][self.target.attributes.lang][month];
						
							/** Gestion de la classe si c'est le mois de la date du jour **/
							if(today_year === date_year && today_month === month){
								cell.classList.add('jtoday');
							}
						
							/** Gestion de la classe si c'est le mois de la date selectionnée **/
							if(date_year === selected_year && selected_month === month){
								cell.classList.add('jselected');
							}
						
							/** Calcul de la date correspondante **/
							var date = date_day+'.'+month+'.'+date_year; 
							cell.onclick = function(date){self.setDate(date); self.setScale('week');}.bind('', date);
						
						row.appendChild(cell);
						month++;
					}
					
					table.appendChild(row);
				}
				
				host_content.appendChild(table);
			break;
				
			/** Vue sur les années **/
			case 'year':
				var year_processed = -12;
				var table = document.createElement('table');
					table.setAttribute('id', 'yearsView');
				
				for(var r = 0; r < 5; r++){
					var row = document.createElement('tr');
					
					for(var c = 0; c < 5; c++){
						var cell = document.createElement('th');
							/** Ecriture du mois **/
							var cell_year = date_year + year_processed;
							cell.textContent = cell_year;
						
							/** Gestion de la classe si c'est le mois de la date du jour **/
							if(today_year === cell_year){
								cell.classList.add('jtoday');
							}
						
							/** Gestion de la classe si c'est le mois de la date selectionnée **/
							if(cell_year === selected_year){
								cell.classList.add('jselected');
							}
						
							/** Calcul de la date correspondante **/
							var date = date_day+'.'+date_month+'.'+cell_year; 
							cell.onclick = function(date){self.setDate(date); self.setScale('month');}.bind('', date);
						
						row.appendChild(cell);
						year_processed++;
					}
					
					table.appendChild(row);
				}
				
				host_content.appendChild(table);
			break;
		}
	};
	
	
	
	/** -------------------------------------------------------------------------------------------------------------------- **
	/** ---																																					--- **
	/** ---													Execution interne de l'instance														--- **
	/** ---																																					--- **
	/** -------------------------------------------------------------------------------------------------------------------- **/
	/** Lecture des attribut de l'input **/
	var fas = target.attributes.find(/focus-after-select/gi);
	var jCalendarId = target.attributes.find(/jcalendar/gi);
	var lang = target.attributes.find(/lang/gi);
	var att_offsetTop = target.attributes.find(/offsetTop/gi);
	var att_offsetLeft = target.attributes.find(/offsetLeft/gi);
	
	self.target = {
		HTMLElement: target,
		attributes: {
			focus_after_select: ((fas === 'true' || fas === undefined || fas === '') ? true : false),
			id: jCalendarId,
			lang: ((lang === undefined) ? jCalendar_config.default_language : (self.availLang.lastIndexOf(lang.toLowerCase()) > -1) ? lang.toLowerCase() : jCalendar_config.default_language),
			offsetTop: ((att_offsetTop !== undefined && parseInt(att_offsetTop) !== NaN) ? parseInt(att_offsetTop) : 0),
			offsetLeft: ((att_offsetLeft !== undefined && parseInt(att_offsetLeft) !== NaN) ? parseInt(att_offsetLeft) : 0)
		}
	};
	
	/** HACK DE LA CLASSE DATE -> AJOUT D'UNE METHODE RETOURNANT LE NOMBRE DE JOUR DANS LE MOIS **/
	Date.prototype.getDaysInMonth = function(){	
   	return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
	};
	
	/** HACK DE LA CLASSE DATE -> AJOUT D'UNE METHODE RETOURNANT UN BOOLEAN INDIQUAND SI C'EST LE DERNIER JOUR DU MOIS **/
	Date.prototype.isLastDay = function(){
		return this.getDaysInMonth() === this.getDate();
	};
	
	/** HACK DE LA CLASSE DATE -> AJOUT D'UNE METHODE RETOURNANT LE MOIS DANS LA VERSION DONNEE **/
	Date.prototype.getMonthName = function(lang){
		lang = lang.toLowerCase();
		
		this.months_name = {
			"en-en" : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			"es-es" : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			"de-de" : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
			"fr-fr" : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
			"it-it" : ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
			"ru-ru" : ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
		};
		
		return this.months_name[lang][this.getMonth()];
	};
	
	/** Analyser la valeur saisie dans le champs input **/
	var date_pattern = /^[0-2][0-9]|3[0-1][-./]0[1-9]|1[0-2][-./][0-9]{2,4}$/gi;
	
	if(date_pattern.test(self.target.HTMLElement.value)){
		var selected_day = self.target.HTMLElement.value.substr(0, 2);
		var selected_month = self.target.HTMLElement.value.substr(3, 2);
		var selected_year = self.target.HTMLElement.value.substr(6, 4);
		self.selected = new Date(selected_year, (selected_month - 1), selected_day, 0, 0, 0, 0);
		self.date = new Date(selected_year, (selected_month - 1), selected_day, 0, 0, 0, 0);
	} 
	else {
		self.selected = new Date();
		self.date = new Date();
	}
		
	/** Maintenant - Ajourd'hui **/
	self.today = new Date();
	
	return self;
}



/** -------------------------------------------------------------------------------------------------------------------- **
/** ---																																					--- **
/** ---										Programme de conversion des input de type jCalendar										--- **
/** ---																																					--- **
/** -------------------------------------------------------------------------------------------------------------------- **/
function jCalendarConverter(){
	if(document.readyState === 'complete'){
		var inputs = document.querySelectorAll('input[type="jCalendar"]');
		
		for(var i = 0; i < inputs.length; i++){
			inputs[i].setAttribute('type', 'text');
			inputs[i].setAttribute('readonly', '');
			inputs[i].classList.add('jCalendar');
			inputs[i].setAttribute('jCalendar', i);
			//inputs[i].addEventListener('click', function(src){new jCalendar(src).display();}.bind(this, inputs[i]));
			inputs[i].addEventListener('focus', function(src){new jCalendar(src).display();}.bind('', inputs[i]));
		}
	}
}



/** -------------------------------------------------------------------------------------------------------------------- **
/** ---																																					--- **
/** ---												Greffe du convertisseur sur le document 												--- **
/** ---																																					--- **
/** -------------------------------------------------------------------------------------------------------------------- **/
document.addEventListener('readystatechange', jCalendarConverter);



/** -------------------------------------------------------------------------------------------------------------------- **
/** ---																																					--- **
/** ---															Plugin NamedNodeMap																--- **
/** ---																																					--- **
/** -------------------------------------------------------------------------------------------------------------------- **/
/** Extension de fonctionnalité du constructeur NamedNodeMap pour rechercher des attributs avec insensiblité à la casse **/
/** Return STRING | UNDEFINED **/
NamedNodeMap.prototype.find = function(regExpFind){
	var output = undefined;
	
	for(var i = 0; i < this.length; i++){
		if(regExpFind.test(this[i].localName)){
			output = this[i].value;
			break;
		}
	}
	
	return output;
};

/** Return ARRAY **/
NamedNodeMap.prototype.findAll = function(regExpFind){
	var output = [];
	
	for(var i = 0; i < this.length; i++){
		if(regExpFind.test(this[i].localName)){
			output.push(this[i].value);
		}
	}
	
	return output;
};
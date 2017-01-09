<?php
	function loadCSS($output="echo", $path="CSS"){
		/** 1. Scanner le dossier $path **/
			$scan = scandir($path, 1);
			$scan = sortScandir($scan);
		
		/** 2. Traitement du dossier **/
			switch($output){
				/** Type de sortie : echo --- Générée une link directement dans le fichier executant la fonction **/
				case 'echo':
					for($i = 2; $i < count($scan); $i++){
						if(!is_dir($path.'/'.$scan[$i])){
							$media = explode('_', $scan[$i]);
							$media = explode('.', $media[1]);
			
							echo "<link rel=\"stylesheet\" href=\"".$path."/$scan[$i]\" type=\"text/css\" media=\"$media[0]\">\r\t";
						}
					}
				break;
				
				/** Type de sortie : Array --- Générée un tableau de donnée organisée **/
				case 'Array':
					$CSSs = Array();
				
					for($i = 2; $i < count($scan); $i++){
						if(!is_dir($path.'/'.$scan[$i])){	
							$media = explode('_', $scan[$i]);
							$media = explode('.', $media[1]);
							
							$CSSs[] = Array(
								"CSS_FILE" => $path.'/'.$scan[$i],
								"CSS_MEDIA" => $media[0]
							);
						}
					}
				
					return $CSSs;
				break;
			}
	}
	
	function loadScriptsJS($output="echo", $path="Scripts"){
		/** 1. Scanner le dossier $path **/
			$scan = scandir($path, 1);
			$scan = sortScandir($scan);
		
		/** 2. Traitement du dossier **/
			switch($output){
				/** Type de sortie : echo --- Générée une link directement dans le fichier executant la fonction **/
				case 'echo':
					for($i = 2; $i < count($scan); $i++){
						if(!is_dir($path.'/'.$scan[$i])){
							echo "<script type=\"text/javascript\" src=\"".$path."/$scan[$i]\"></script>\r\t";
						}
					}
				break;
				
				/** Type de sortie : Array --- Générée un tableau de donnée organisée **/
				case 'Array':
					$CSSs = Array();
				
					for($i = 2; $i < count($scan); $i++){
						if(!is_dir($path.'/'.$scan[$i])){
							$CSSs[] = Array(
								"SCRIPT_FILE" => $path.'/'.$scan[$i]
							);
						}
					}
				
					return $CSSs;
				break;
			}
	}

	function sortScandir($scan){
	# 1. Convertion en array associatif
	$assoc = Array();

	for($i = 0; $i < count($scan); $i++){
		$assoc[strtolower($scan[$i])] = $i;
	}
	
	# 2. Triage 
	ksort($assoc);
	
	# 3. Retourner $scan tri銉$scanSorted = Array();
	
	foreach($assoc as $key){
		$scanSorted[] = $scan[$key];
	}
	
	# 4. Retourner le resultat
	return $scanSorted;
}
?>

<html>
	<head>
		<meta charset="utf-8" />
		<?php
			loadCSS();
			loadScriptsJS();
			loadScriptsJS('echo', 'Scripts/prototypes.jCalendar');
		?>
<!-- 		<link rel="stylesheet/less" type="text/css" href="LESS/jCalendar.less" /> -->
<!-- 		<script src="https://mco-scheduler-dev.viseo.net/Scripts/Common/less.min.js"></script> -->
	</head>
	<body>
		
		<h1>
			Input with onclick invocation to jcalendar
		</h1>
		
		<input type="jCalendar" offsetTop="10" offsetLeft="20" focus-after-select="true" value="default"/>
		
		<input type="jCalendar" lang="en-en" offsetTop="10" offsetLeft="20" focus-after-select="true" value="en-en"/>
		
		<input type="jCalendar" lAng="fr-fr" value="fr-fr" onchange="console.log('date changed');"/>
		
		<input type="jCalendar" laNg="de-de" value="de-de"/>
		
		<input type="jCalendar" lanG="ru-ru" value="ru-ru"/>
		
		<input type="jCalendar" LANG="it-it" value="it-it"/>
		
		<input type="jCalendar" LaNG="es-es" value="es-es"/>
		
	</body>
</html>













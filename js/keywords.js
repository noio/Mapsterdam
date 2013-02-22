var category_keywords = {
'criminaliteit':['crimin', 'dader', 'aangehouden', 'aanhouden', 'in hechtenis', 'politie ','politieagent', 'politieauto', 'politieman', 'politievrouw', 'politiemannen', 'politie-eenheid', 'motorpolitie', 'autoriteiten', 'misbruik', 'misdaad', 'fraude', 'misbruikt', 'Openbaar Ministerie', 'gearresteerd', 'arresteren', 'arrestatie', 'motoragent', 'agent', 'arrestatie', 'hoerenbuurt', 'hoeren', 'prostitutie', 'vermoorde', 'vermoord', 'slachtoffers', 'slachtoffer', 'verdenking', 'aangifte', 'misdrij', 'gevangenis', 'drugshandel', 'moordenaar', 'drugs handelen', 'gewapende', 'wapens', 'vermis', 'ongeluk', 'ongeval', 'gewonden', 'schietpartij', 'kraken', 'kraker', 'kraak', 'bedreigd', 'gewond', 'cannabis', 'joint'],

'fietsendiefstal':['fietsendiefstal'],

'straatroof':['gestolen', 'dief','stelen', 'zakkenrollerij', 'zakkenrollen', 'beroofd', 'geroofd', 'straatroof', 'winkelen', 'shoplifting', 'straatrovers', 'portemonnee', 'overvalle'],

'inbraak':['inbraak', 'inbraken', 'winkeldiefstal'],

'straatgeweld':['geweld', 'klappen', 'vechten', 'gevecht', 'bloed', 'door het lint', 'relschopper', 'rellen', 'onrust', 'hooligan', 'straatgeweld'],

'bevolking':['bevolking', 'samenleving', 'inwoners', 'bezoekers', 'allochto', 'autotochto', 'discriminatie', 'discriminer', 'discrimin'],

'bevolkingsdichtheid':['inwoners', 'Amsterdammers'],

'Marrokanen':['marroka', 'marokko'],

'Surinamers':['surina','hindoesta'],

'Molukkers':['molluk'],

'Turken':['turk'],

'Nederlanders':['Nederlander', 'Nederlanders', 'Nederlandse bevolking', 'autotochto'],

'Educatie':['MBO', 'HAVO', ' HvA', ' UvA', ' VWO ', ' HBO', 'universiteit', 'vrije universiteit', 'studie', 'studeren', 'student', 'scholier', 'afstudeer', 'accreditatie', 'onderwijsinspectie', 'opleiding', 'school', 'middelbare', 'academi', 'lyceum','scholi'],

'Inkomen': ['Inkomen', 'Salaris', 'beloning', 'premie', 'rijk', 'welgesteld', 'loon', 'verdienste', 'rente', 'aandeelhouders', 'ondernemers', 'bonus', 'FNV', 'armoede'],

'Werkloosheid': ['Werkloos', 'Werkloos', 'werklozen', 'Arbeidsongeschikt', 'WAO', 'CAO', 'CWI', 'Uitzend', 'uitkering', 'sociale voorziening', 'failliet', 'faillisement', 'rente', 'vakbond', 'FNV', 'beroep'],

'Woningprijs':['Huizenmarkt', 'nieuwbouw','Koopwoning', 'Huurwoning', 'woningbouwcorporatie', 'economie', 'rochdale', 'huurder', 'grondprijs', 'de key', 'krak', 'kraak'],

};

var categories = {'criminaliteit':['criminaliteit'], 'fietsendiefstal':['criminaliteit'], 'straatroof': ['criminaliteit'], 'inbraak': ['criminaliteit'], 'straatgeweld':['criminaliteit'],'bevolking':['populatie'],'bevolkingsdichtheid':['populatie'], 'Marrokanen':['populatie'], 'Surinamers':['populatie'], 'Molukkers':['populatie'], 'Turken':['populatie'], 'Nederlanders':['populatie'], 'Educatie':['opleiding'], 'Inkomen':['inkomen'], 'Werkloosheid':['werkloosheid'], 'Woningprijs':['inkomen']};

function findCategories(text){
	var output = [];
	var positions = [];
	var newText = text;
	
	for (var category in category_keywords) {
		for (var i=0; i<category_keywords[category].length; i++) {
				//console.log(text.toLowerCase().indexOf(category_keywords[category][i].toLowerCase()))
				if(newText.toLowerCase().indexOf(category_keywords[category][i].toLowerCase())>=0)
				{
					//console.log('Found word: ' + category_keywords[category][i] + ' in category ' + category)
					output = output.concat(categories[category]);
					positions.push(newText.toLowerCase().indexOf(category_keywords[category][i].toLowerCase()));					
				}
			}
	}
	
	// Emphasize all words
	newText = emphasizeWords(newText, positions);
	
    // TODO Return categories whose keywords are in the text.
    return {'categories':output, 'text':newText};
}

function emphasizeWords(text, positions){
	
	textDone = '';
	textToDo = text;
	lastPos = 0;
	
	//console.log('textToDo' + textToDo);
	
	for(var i = 0; i < positions.length;  i++) {
		result = emphasizeWord(textToDo, positions[i] - lastPos);
		
		textDone = textDone + result['part1'];
		
		textToDo = textToDo.substr(result['endPos']);
		
		//console.log('result' + result['endPos']);
		//console.log('TextDone' + textDone);
		//console.log('textToDo' + textToDo);
		lastPos = lastPos + result['endPos'];
	}
	
	text = textDone + textToDo;
	
	return text;
}

function emphasizeWord(text, pos){
	
	if(text.substr(0, pos).lastIndexOf(' ') < pos)
	{
		startPos = text.substr(0, pos).lastIndexOf(' ') + 1;
	} else {
		startPos = pos;
	}
	
	if(text.substr(pos).indexOf(' ') > -1) {
		endPos = pos + text.substr(pos).indexOf(' ');
	} else {
		endPos = text.length;	
	}
	
	partBefore = text.substr(0, startPos);
	partAfter = text.substr(endPos);
	
	part1 = partBefore + '<EM class="keyword">' + text.substr(startPos, endPos - startPos) + '</EM>';
	
	return {'part1':part1, 'part2':partAfter, 'endPos':endPos};
}
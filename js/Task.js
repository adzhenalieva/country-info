		$(function() {
			var makeTranslation = function(object, keyName){
				for(var key in object){
					if (key === keyName){
						keyName = object[key];
					}
				};
				return keyName;
			};
			var preloader = $('#preloader');
			$(document).ajaxStart(function(){
				preloader.show();
			});
			var dictionary = {
				"name": "Название", 
				"topLevelDomain": "Домен",
				"borders": "Границы",
				"alpha2Code": "Двухзначный код", 
				"alpha3Code" : "Трехзначный код",
				"callingCodes": "Телефонный код", 
				"capital": "Столица",
				"altSpellings": "Альтернативные названия", 
				"region": "Регион", 
				"subregion": "Субрегион", 
				"population": "Население", 
				"latlng": "Коррдинаты",
				"demonym": "Этнохороним",
				"area": "Площадь", 
				"gini": "Джини коэффициент",
				"timezones": "Часовой пояс",
				"nativeName": "Локальное название", 
				"numericCode": "Код", 
				"currencies": "Валюты",
				"languages": "Языки",
				"translations": "Переводы",
				"flag": "Флаг",
				"regionalBlocs": "Региональные блоки",
				"cioc": "Краткое название"
			};
			var subDictionary = {
				"iso639_1": "название 1",
				"iso639_2": "название 2",
				"name": "Международное название",
				"nativeName": "локальное название",
				"code": "код",
				"symbol":"символ"
			}
			$('#show').on('click', function(){
				$('#countryInfo').html($('<span class="map">'));
				var countryName = $('#country-name').val();
				$.ajax({
					method: 'GET',
					url: "https://restcountries.eu/rest/v2/name/" + countryName,
					success: function (response){
						var country = response[0];
						for(var key in country){
							var value = country[key];

							if(key === 'altSpellings' || key === 'borders'){
								value = country[key].join(",  ");
							};
							if(key === 'flag'){
								value = $('<img class="flag">').attr('src', country[key]);
							};
							if(key === 'latlng'){
								var latlng = country[key];
								var map = $('<div id="map">');
								$('.map').html(map);

								var mymap = L.map('map').setView(latlng, 5);

								L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
									maxZoom: 19,
									attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								}).addTo(mymap);

								var marker = L.marker(latlng).addTo(mymap);
								value = $('.map');
							};
							if(key === 'currencies' || key === 'languages'){
								var keyArray = country[key];
								var keyObj = keyArray[0];
								var parentP = $('<p class="subname">');
								for(var values in keyObj) {
									var secondValue = keyObj[values];
									var span = $('<span>');
									values = makeTranslation(subDictionary, values);
									span.append(values, ': ', secondValue, ';   ');
									parentP.append(span);
								};
								value = parentP;
							};
							if( key === 'translations'){
								var keyArray = country[key];
								var parentP = $('<p class="subname">');
								for(var value in keyArray){
									var secondValue = keyArray[value];
									var span = $('<span>');
									span.append(value, ': ', secondValue, ';   ');
									parentP.append(span);
								};
								value = parentP;
							};
							if(key === 'regionalBlocs'){
								key = '';
							};
							key = makeTranslation(dictionary, key);
							var p = $('<p>');
							var span = $('<span class="name">');
							span.append(key);
							p.append(span, '   ', value);
							$('#countryInfo').append(p);
							$('#country-name').val('');
						};
					},
					error: function(xhr){
						if(xhr.status === 404){
							alert('Incorrect name of country was entered. Try again');
						} else{
							alert('Error ' + xhr.status + '.');
						}
					},
					complete: function() {preloader.hide()}
				});
			});
		});
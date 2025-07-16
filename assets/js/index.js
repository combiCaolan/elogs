//set vars to order columns
if (typeof Property_to_use === 'undefined' || Property_to_use === null) {
	Property_to_use = 't';
	t_order = 'asc';
}
if (typeof t_order === 'undefined' || t_order === null) {
	t_order = 'asc';
}
if (typeof e_order === 'undefined' || e_order === null) {
	e_order = 'asc';
}
if (typeof d_order === 'undefined' || d_order === null) {
	d_order = 'asc';
}
t_symbol = '+';
e_symbol = '+';
d_symbol = '+';

/**START**/
document.getElementById('UsernameLocal').innerHTML = sessionStorage.getItem('elogsloggedinusername');
document.getElementById('AccessLevel').innerHTML = sessionStorage.getItem('AccessLevel_disp');
/**END**/

//Close These Logs Logic
function CloseLogs() {
	sessionStorage.removeItem("Log");
	sessionStorage.removeItem("LogStructure");
	sessionStorage.removeItem("LanguageFile");
	sessionStorage.removeItem("SerialNumber");
	sessionStorage.removeItem("TruckModel");
	sessionStorage.removeItem("MasterArray");
	sessionStorage.removeItem("LogStructure_Dict");
	sessionStorage.removeItem("FileName");
	location.reload();
}

function NewCode() {
	try {
		LogStructure_Dict = JSON.parse(sessionStorage.getItem('LogStructure_Dict'));
	}
	catch (err) {
		console.log('LogStructure_Dict faulted');
	}
	if (sessionStorage.getItem('MasterArray') == null) {
		MasterArray = [];
		sessionStorage.setItem('MasterArray', JSON.stringify(MasterArray));
	}
	else {
		MasterArray = JSON.parse(sessionStorage.getItem('MasterArray'));
	}
	ArrayReadLogs();
}


function compareValues(key, order = 'asc') {
	return function innerSort(a, b) {
		if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0;
		}

		const varA = (typeof a[key] === 'string')
			? a[key].toUpperCase() : a[key];
		const varB = (typeof b[key] === 'string')
			? b[key].toUpperCase() : b[key];

		let comparison = 0;
		if (varA > varB) {
			comparison = 1;
		} else if (varA < varB) {
			comparison = -1;
		}
		return (
			(order === 'desc') ? (comparison * -1) : comparison
		);
	};
}

function Order_by_property(new_property) {
	Property_to_use = new_property;
	if (Property_to_use == 't') {
		if (t_order == 'asc') {
			t_order = 'desc';
		} else {
			t_order = 'asc';
		}
		order_is = t_order;
	} else if (Property_to_use == 'e') {
		if (e_order == 'asc') {
			e_order = 'desc';
		} else {
			e_order = 'asc';
		}
		order_is = e_order;
	} else if (Property_to_use == 'd') {
		if (d_order == 'asc') {
			d_order = 'desc';
		} else {
			d_order = 'asc';
		}
		order_is = d_order;
	} else {
		Property_to_use = 't';
		t_order = 'desc';
		order_is = t_order;
	}
	MasterArray.sort(compareValues(Property_to_use, order_is));
	Draw_Table();
}

/**
 * Reads logs from sessionStorage, parses them, registers the log via AJAX, and populates MasterArray.
 * No hidden form or submit is used.
 */
function ArrayReadLogs() {
	LogFile_ini = sessionStorage.getItem('Log');
	counter = 0;
	if (LogFile_ini.split('\n')[counter][0] != '#') {
		alert('Warning: Machine model and serial number not available!');
		if (LogFile_ini.split('\n')[0].split(';')[7] != 'undefined') {
			LogFile = '#0;500;na;0;0;0;\n' + sessionStorage.getItem('Log');
		}
		else {
			LogFile = '#0;200;na;0;0;0;\n' + sessionStorage.getItem('Log');
		}
	}
	else {
		LogFile = sessionStorage.getItem('Log');
	}

	if (LogFile.split('\n')[counter][0] != '#') {
		alert('Warning: log file header format missing!');
		location.reload();
		return;
	}

	while (LogFile.split('\n')[counter]) {
		CurrentId++;
		if (LogFile.split('\n')[counter][0] == '#') {
			ConfigLine = LogFile.split('\n')[counter].replace('#', '');

			FileType = ConfigLine.split(';')[1];
			TruckModel = ConfigLine.split(';')[2];
			TruckModelP = document.createElement('p');
			TruckModelP.setAttribute('id', 'LogInfoText');
			TruckModelP.innerHTML = 'Machine Model : ' + TruckModel;
			SerialNumber = ConfigLine.split(';')[3];
			if (sessionStorage.getItem('SerialNumber') == null) {
				sessionStorage.setItem('SerialNumber', SerialNumber);
			} else {
				if (Number(SerialNumber) != Number(sessionStorage.getItem('SerialNumber'))) {
					alert('Warning: log files are from two different machines!');
				}
			}

			sessionStorage.setItem('TruckModel', TruckModel);

			SerialNumberP = document.createElement('p');
			SerialNumberP.setAttribute('id', 'LogInfoText');
			SerialNumberP.innerHTML = 'Truck Serial Number : ' + SerialNumber;

			document.getElementById('CombiLogLine').innerHTML = '';
			document.getElementById('CombiLogLine').appendChild(TruckModelP);
			document.getElementById('CombiLogLine').appendChild(SerialNumberP);

			document.title = 'Combilift - eLog Viewer - ' + SerialNumber;
			counter++;
		}

		ActionCode = Number(LogFile.split('\n')[counter].split(';')[1]);
		utcSeconds = Number(LogFile.split('\n')[counter].split(';')[0]);
		Line = {};
		Line["t"] = utcSeconds;
		Line["tl"] = 'TimeStamp';

		//FORM FOR LOG REGISTRATION
		EmptyDiv = document.createElement('div');
		EmptyDiv.setAttribute('style', 'display:none;')

		Form = document.createElement('form');
		Form.setAttribute('action', 'includes/openfile.php');
		Form.setAttribute('method', 'POST');
		Form.setAttribute('name', 'LogRegForm');

		Model = document.createElement('input');
		Model.type = 'text';
		Model.setAttribute('name', 'Model');
		Model.value = TruckModel;

		Form.appendChild(Model);

		FileName = document.createElement('input');
		FileName.type = 'text';
		FileName.setAttribute('name', 'FileName');

		SerialNumber_form = document.createElement('input');
		SerialNumber_form.type = 'text';
		SerialNumber_form.setAttribute('name', 'SerialNumber');
		SerialNumber_form.value = SerialNumber;

		Form.appendChild(SerialNumber_form);

		UserName = document.createElement('input');
		UserName.type = 'text';
		UserName.setAttribute('name', 'Username');
		UserName.value = sessionStorage.getItem('elogsloggedinusername');

		Form.appendChild(UserName);

		Useremail = document.createElement('input');
		Useremail.type = 'text';
		Useremail.setAttribute('name', 'Useremail');
		Useremail.value = sessionStorage.getItem('elogsloggedinemail');

		Form.appendChild(Useremail);

		AccessLevel = document.createElement('input');
		AccessLevel.type = 'text';
		AccessLevel.setAttribute('name', 'AccessLevel');
		AccessLevel.value = sessionStorage.getItem('AccessLevel');

		Form.appendChild(AccessLevel);

		ActionInput = document.createElement('input');
		ActionInput.type = 'text';
		ActionInput.setAttribute('name', 'ActionInput');
		ActionInput.value = 'Opened File' + FileType;

		Form.appendChild(ActionInput);

		SubmitForm = document.createElement('input');
		SubmitForm.type = 'submit';

		Form.appendChild(SubmitForm);

		EmptyDiv.appendChild(Form);

		//Parsing the data		
		if (FileType != '500') {

			Scale = ScaleDictionary[ActionCode];
			Units = UnitsDictionary[ActionCode];
			Description = DescriptionDictionary[ActionCode];

			try {
				if (Scale[0] == '*') {
					//means do the Log Key
					ShowValue = Units;
				} else {
					//Value is going to be the original value from log file
					Value = Number(LogFile.split('\n')[counter].split(';')[1]) * Number(Scale);

					ShowValue = Value.toFixed(2) + ' ' + Units;
				}
			} catch (err) {
				ShowValue = 'NA';
			}

			Line["e"] = ShowValue;
			Line["el"] = 'Log Event';

			ShowValue = undefined;

			fourthCounter = 2;

			while (LogFile.split('\n')[counter].split(';')[fourthCounter] != undefined) {
				Scale = ScaleDictionary[LogStructure_Dict[ActionCode][fourthCounter]];
				Units = UnitsDictionary[LogStructure_Dict[ActionCode][fourthCounter]];
				Label = LabelDictionary[LogStructure_Dict[ActionCode][fourthCounter]];
				try {
					if (Scale[0] == '*') {
						//means do the Log Key
						ShowValue = Units;
					} else {
						if (Scale[0] == '!') {
							KeyVariable = LogStructure_Dict[ActionCode][fourthCounter] + '_' + LogFile.split('\n')[counter].split(';')[fourthCounter];
							ShowValue = LogKey[KeyVariable];
						} else {
							//Value is going to be the original value from log file
							Value = Number(LogFile.split('\n')[counter].split(';')[fourthCounter]) * Number(Scale);

							ShowValue = Value.toFixed(2) + ' ' + Units;
						}

						property_str = 'v' + fourthCounter;
						Line[property_str] = ShowValue;
						property_str = 'vl' + fourthCounter;
						Line[property_str] = Label;
					}
				} catch (err) {
					ShowValue = ' ';
				}
				fourthCounter++;
			}

			//Creating Description 
			Line["desc"] = Description;

			if (AccessLvlCode >= Number(LogStructure_Dict[ActionCode][1])) {
				MasterArray.push(Line);
			}

		} else {
			TypeOne = [36, 37, 38, 39, 40];
			TypeTwo = [2, 3, 4, 5];

			DeviceId = Number(LogFile.split('\n')[counter].split(';')[1]);
			if (TypeOne.includes(DeviceId)) {
				ActionCode = 'Curtis_TP' + '_' + LogFile.split('\n')[counter].split(';')[2];
			} else if (TypeTwo.includes(DeviceId)) {
				ActionCode = 'Curtis_S';
			} else if (DeviceId == 50) {
				ActionCode = 'TT_PLC' + '_' + LogFile.split('\n')[counter].split(';')[2];
			}

			if (ActionCode == 'Curtis_S') {
				bit_ptr = 0;

				while (bit_ptr < 32) {
					bit_mask = 2 ** bit_ptr;
					masked_result = LogFile.split('\n')[counter].split(';')[4] & bit_mask;
					ActionCode = 'Curtis_S';
					if (masked_result > 0) {
						//fault is valid
						bit_ptr_final = bit_ptr + 1;
						ActionCode = ActionCode + '_' + bit_ptr_final;

						Scale = ScaleDictionary[ActionCode];
						Units = UnitsDictionary[ActionCode];
						Description = DescriptionDictionary[ActionCode];

						try {
							if (Scale[0] == '*') {
								//means do the Log Key
								ShowValue = Units;
							} else {
								ShowValue = ' invalid ';
							}
						} catch (err) {
							ShowValue = 'NA';
						}

						Line["e"] = ShowValue;
						Line["el"] = 'Log Event';

						ShowValue = undefined;

						//Device
						Device_str = 'Device_' + LogFile.split('\n')[counter].split(';')[1];
						Line["d"] = UnitsDictionary[Device_str];
						Line["dl"] = 'Device';

						//Creating Description 
						Line["desc"] = Description;

						if (AccessLvlCode >= Number(LogStructure_Dict[ActionCode][1])) {
							MasterArray.push(Line);
						}
						Line = {};
						Line["t"] = utcSeconds;
						Line["tl"] = 'TimeStamp';

					}
					bit_ptr++;

				}

				bit_ptr = 0;

				while (bit_ptr < 32) {
					bit_mask = 2 ** bit_ptr;
					masked_result = LogFile.split('\n')[counter].split(';')[5] & bit_mask;
					ActionCode = 'Curtis_S';
					if (masked_result > 0) {
						//fault is valid
						bit_ptr_final = bit_ptr + 33;
						ActionCode = ActionCode + '_' + bit_ptr_final;
						Scale = ScaleDictionary[ActionCode];
						Units = UnitsDictionary[ActionCode];
						Description = DescriptionDictionary[ActionCode];

						try {
							if (Scale[0] == '*') {
								//means do the Log Key
								ShowValue = Units;
							} else {
								ShowValue = ' invalid ';
							}
						} catch (err) {
							ShowValue = 'NA';
						}

						Line["e"] = ShowValue;
						Line["el"] = 'Log Event';

						ShowValue = undefined;

						//Device
						Device_str = 'Device_' + LogFile.split('\n')[counter].split(';')[1];
						Line["d"] = UnitsDictionary[Device_str];
						Line["dl"] = 'Device';

						//Creating Description 
						Line["desc"] = Description;

						if (AccessLvlCode >= Number(LogStructure_Dict[ActionCode][1])) {
							MasterArray.push(Line);
						}
						Line = {};
						Line["t"] = utcSeconds;
						Line["tl"] = 'TimeStamp';

					}
					bit_ptr++;

				}

			}
			else {
				Scale = ScaleDictionary[ActionCode];
				Units = UnitsDictionary[ActionCode];
				Description = DescriptionDictionary[ActionCode];

				try {
					if (Scale[0] == '*') {
						//means do the Log Key
						ShowValue = Units;
					} else {
						//Value is going to be the original value from log file
						Value = Number(LogFile.split('\n')[counter].split(';')[1]) * Number(Scale);
						ShowValue = Value.toFixed(2) + ' ' + Units;
					}
				} catch (err) {
					ShowValue = 'NA';
				}

				Line["e"] = ShowValue;
				Line["el"] = 'Log Event';

				ShowValue = undefined;

				//Device
				Device_str = 'Device_' + LogFile.split('\n')[counter].split(';')[1];

				Line["d"] = UnitsDictionary[Device_str];
				Line["dl"] = 'Device';

				fourthCounter = 2;

				while (LogFile.split('\n')[counter].split(';')[fourthCounter] != undefined) {
					Scale = ScaleDictionary[LogStructure_Dict[ActionCode][fourthCounter]];
					Units = UnitsDictionary[LogStructure_Dict[ActionCode][fourthCounter]];
					Label = LabelDictionary[LogStructure_Dict[ActionCode][fourthCounter]];
					try {
						if (Scale[0] == '*') {
							//means do the Log Key
							ShowValue = Units;
						} else {
							if (Scale[0] == '!') {
								KeyVariable = LogStructure_Dict[ActionCode][fourthCounter] + '_' + LogFile.split('\n')[counter].split(';')[fourthCounter];
								ShowValue = LogKey[KeyVariable];
							} else {
								//Value is going to be the original value from log file
								Value = Number(LogFile.split('\n')[counter].split(';')[fourthCounter + 2]) * Number(Scale);

								ShowValue = Value.toFixed(2) + ' ' + Units;
							}
							property_str = 'v' + fourthCounter;
							Line[property_str] = ShowValue;
							property_str = 'vl' + fourthCounter;
							Line[property_str] = Label;
						}
					} catch (err) {
						ShowValue = ' ';
					}
					fourthCounter++;
				}

				//Creating Description 
				Line["desc"] = Description;

				if (AccessLvlCode >= Number(LogStructure_Dict[ActionCode][1])) {
					MasterArray.push(Line);
				}
				Line = {};

			}
		}
		counter++;
	}

	sessionStorage.setItem('MasterArray', JSON.stringify(MasterArray));
	SubmitForm.click();
}


function Draw_Table() {

	draw_counter = 0;
	Number_of_Rows = MasterArray.length;

	try {
		Full_Table.remove();
	} catch (err) { }

	if (Property_to_use == 't') {
		e_symbol = ' ';
		d_symbol = ' ';
		if (t_order == 'asc') {
			t_symbol = ' ▲';
		} else {
			t_symbol = ' ▼';
		}
	} else if (Property_to_use == 'e') {
		t_symbol = ' ';
		d_symbol = ' ';
		if (e_order == 'asc') {
			e_symbol = ' ▲';
		} else {
			e_symbol = ' ▼';
		}
	} else if (Property_to_use == 'd') {
		t_symbol = ' ';
		e_symbol = ' ';
		if (d_order == 'asc') {
			d_symbol = ' ▲';
		} else {
			d_symbol = ' ▼';
		}
	} else {
		t_symbol = '+';
		e_symbol = '+';
		d_symbol = '+';
	}

	//Create Table before user Populates it
	Full_Table = document.createElement('table');
	Full_Table.setAttribute('id', 'Full_TableId');

	//Create first TH - useful for using as fixed element for moving elements * realigning elements
	document.getElementById('LogUserLog').appendChild(Full_Table);
	tr = document.createElement('thead');
	tr.setAttribute('id', 'FirstTR');

	//header row to be created
	th = document.createElement('th');
	th.setAttribute('id', 'TimeStampth1');
	th.setAttribute('onclick', 'Order_by_property("t")');
	th.innerHTML = 'TimeStamp' + t_symbol;
	tr.appendChild(th);

	th = document.createElement('th');
	th.setAttribute('id', 'CodeStampth1');
	th.setAttribute('onclick', 'Order_by_property("e")');
	th.innerHTML = 'Event' + e_symbol;
	tr.appendChild(th);

	th = document.createElement('th');
	th.setAttribute('id', 'Sourceidth1');
	th.setAttribute('onclick', 'Order_by_property("d")');
	th.innerHTML = 'Device' + d_symbol;
	tr.appendChild(th);

	th = document.createElement('th');
	th.setAttribute('id', 'Val1th');
	th.innerHTML = 'Val 1';
	tr.appendChild(th);

	th = document.createElement('th');
	th.setAttribute('id', 'Val2th');
	th.innerHTML = 'Val 2';
	tr.appendChild(th);

	th = document.createElement('th');
	th.setAttribute('id', 'Val3th');
	th.innerHTML = 'Val 3';
	tr.appendChild(th);

	th = document.createElement('th');
	th.setAttribute('id', 'Val4th');
	th.innerHTML = 'Val 4';
	tr.appendChild(th);

	th = document.createElement('th');
	th.setAttribute('id', 'ActionCodeth');
	th.innerHTML = 'Action Code';
	tr.appendChild(th);

	Full_Table.appendChild(tr);

	//draw the data rows
	while (draw_counter < Number_of_Rows) {

		//new row to display
		tr = document.createElement('tr');

		//timestamp value and label
		LogTime = new Date(0);
		LogTime.setUTCSeconds(MasterArray[draw_counter].t);
		CombiDate = LogTime.getDate();

		if (CombiDate.toString()[1] == undefined) {
			CombiDate = '0' + CombiDate.toString();
		}
		CombiMonth = Number(LogTime.getMonth()) + 1;
		if (CombiMonth.toString()[1] == undefined) {
			CombiMonth = '0' + CombiMonth.toString();
		}
		CombiMinutes = LogTime.getMinutes();
		if (CombiMinutes.toString()[1] == undefined) {
			CombiMinutes = '0' + CombiMinutes.toString();
		}

		CombiTime = CombiDate + '/' + CombiMonth + '/' + LogTime.getFullYear() + ' ' + LogTime.getHours() + ':' + CombiMinutes;

		PTag = document.createElement('td');
		PTag.setAttribute('id', 'ParagraphTimeStamp');
		PTag.setAttribute('title', MasterArray[draw_counter].tl);
		PTag.innerHTML = CombiTime;
		tr.appendChild(PTag);

		//Log event value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].e != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].e;
				td.appendChild(Text);
				td.setAttribute('title', MasterArray[draw_counter].el);
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		}

		//Device value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].d != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].d;
				td.appendChild(Text);
				td.setAttribute('title', MasterArray[draw_counter].dl);
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		}

		// Value1 value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].v2 != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].v2;
				td.appendChild(Text);
				td.setAttribute('title', MasterArray[draw_counter].vl2);
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		}

		// Value2 value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].v3 != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].v3;
				td.appendChild(Text);
				td.setAttribute('title', MasterArray[draw_counter].vl3);
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		}

		// Value3 value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].v4 != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].v4;
				td.appendChild(Text);
				td.setAttribute('title', MasterArray[draw_counter].vl4);
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		}

		// Value4 value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].v5 != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].v5;
				td.appendChild(Text);
				td.setAttribute('title', MasterArray[draw_counter].v5l);
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		}

		// Action value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].a != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].a;
				td.appendChild(Text);
				td.setAttribute('title', MasterArray[draw_counter].a);
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
				tr.appendChild(td);
			} catch (err) {
				console.log('ERROR');
			}
		}

		// Description value and label
		td = document.createElement('td');
		Text = document.createElement('p');
		Text.setAttribute('style', 'margin:0;');
		if (MasterArray[draw_counter].desc != undefined) {
			try {
				Text.innerHTML = MasterArray[draw_counter].desc;
				td.appendChild(Text);
				td.setAttribute('title', 'description');
			} catch (err) {
				console.log('ERROR');
			}
		} else {
			try {
				Text.innerHTML = ' ';
				td.appendChild(Text);
				td.setAttribute('title', 'empty');
			} catch (err) {
				console.log('ERROR');
			}
		}

		//append row to the table
		tr.setAttribute('onclick', 'if(document.getElementsByClassName("clickedon")[0] != undefined){ document.getElementsByClassName("clickedon")[0].removeAttribute("class"); try{ this.setAttribute("class","clickedon"); }catch(err){} }else{ this.setAttribute("class","clickedon"); } InfoLine("' + draw_counter + '");');

		if (typeof EpochStartTime === 'undefined' || EpochStartTime == null || EpochStartTime === 'NaN') {
			if (typeof EpochEndTime === 'undefined' || EpochEndTime == null || EpochEndTime === 'NaN') {
				Full_Table.appendChild(tr);
			} else if (Number(MasterArray[draw_counter].t) <= EpochEndTime) {
				Full_Table.appendChild(tr);
			}
		}
		else if (Number(MasterArray[draw_counter].t) >= EpochStartTime) {
			if (typeof EpochEndTime === 'undefined' || EpochEndTime == null || EpochEndTime === 'NaN') {
				Full_Table.appendChild(tr);
			} else if (Number(MasterArray[draw_counter].t) <= EpochEndTime) {
				Full_Table.appendChild(tr);
			}
		}
		draw_counter++;
	} // end while loop
}// end function

//Export Results Logic
function ExportViewable() {
	ExportThisFile = 'Date: ' + today + '\n' + 'Model: ' + TruckModel + '\n' + 'Serial: ' + SerialNumber;
	draw_counter = 0;
	Number_of_Rows = MasterArray.length;
	Name_for_file = TruckModel + '_' + SerialNumber + '_' + today + '_exported_logs.csv';
	while (draw_counter < Number_of_Rows) {

		Include_this_line = false;

		if (typeof EpochStartTime === 'undefined' || EpochStartTime == null || EpochStartTime === 'NaN') {
			if (typeof EpochEndTime === 'undefined' || EpochEndTime == null || EpochEndTime === 'NaN') {
				Include_this_line = true;
			} else if (Number(MasterArray[draw_counter].t) <= EpochEndTime) {
				Include_this_line = true;
			}
		}
		else if (Number(MasterArray[draw_counter].t) >= EpochStartTime) {
			if (typeof EpochEndTime === 'undefined' || EpochEndTime == null || EpochEndTime === 'NaN') {
				Include_this_line = true;
			} else if (Number(MasterArray[draw_counter].t) <= EpochEndTime) {
				Include_this_line = true;
			}
		}

		if (Include_this_line == true) {

			//timestamp value and label
			LogTime = new Date(0);
			LogTime.setUTCSeconds(MasterArray[draw_counter].t);
			CombiDate = LogTime.getDate();

			if (CombiDate.toString()[1] == undefined) {
				CombiDate = '0' + CombiDate.toString();
			}
			CombiMonth = Number(LogTime.getMonth()) + 1;
			if (CombiMonth.toString()[1] == undefined) {
				CombiMonth = '0' + CombiMonth.toString();
			}
			CombiMinutes = LogTime.getMinutes();
			if (CombiMinutes.toString()[1] == undefined) {
				CombiMinutes = '0' + CombiMinutes.toString();
			}

			CombiTime = CombiDate + '/' + CombiMonth + '/' + LogTime.getFullYear() + ' ' + LogTime.getHours() + ':' + CombiMinutes;

			NewLine = MasterArray[draw_counter].tl + ';' + CombiTime + ';';

			if (MasterArray[draw_counter].e != undefined) {
				NewLine = NewLine + MasterArray[draw_counter].el + ';' + MasterArray[draw_counter].e + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}
			if (MasterArray[draw_counter].d != undefined) {
				NewLine = NewLine + MasterArray[draw_counter].dl + ';' + MasterArray[draw_counter].d + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}
			if (MasterArray[draw_counter].v2 != undefined) {
				NewLine = NewLine + MasterArray[draw_counter].vl2 + ';' + MasterArray[draw_counter].v2 + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}
			if (MasterArray[draw_counter].v3 != undefined) {
				NewLine = NewLine + MasterArray[draw_counter].vl3 + ';' + MasterArray[draw_counter].v3 + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}
			if (MasterArray[draw_counter].v4 != undefined) {
				NewLine = NewLine + MasterArray[draw_counter].vl4 + ';' + MasterArray[draw_counter].v4 + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}
			if (MasterArray[draw_counter].v5 != undefined) {
				NewLine = NewLine + MasterArray[draw_counter].vl5 + ';' + MasterArray[draw_counter].v5 + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}
			if (MasterArray[draw_counter].a != undefined) {
				NewLine = NewLine + MasterArray[draw_counter].al + ';' + MasterArray[draw_counter].a + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}
			if (MasterArray[draw_counter].desc != undefined) {
				NewLine = NewLine + 'Description' + ';' + MasterArray[draw_counter].desc + ';';
			} else {
				NewLine = NewLine + ';' + ';';
			}

			ExportThisFile = ExportThisFile + '\n' + NewLine;
			sessionStorage.setItem('Export_data', ExportThisFile);
			sessionStorage.setItem('Export_filename', Name_for_file);
		}
		draw_counter++;
	}

	WebdownloadFile(Name_for_file, ExportThisFile);
}

//MAIN FUNCTION - WHEN USER OPENS LOG FILE
function ReadLogs() {

	RemoveAttrcounter = 2;
	while (document.getElementsByTagName('TR')[RemoveAttrcounter] != undefined) {
		document.getElementsByTagName('TR')[RemoveAttrcounter].remove();
		RemoveAttrcounter++;
	}

	if (document.getElementsByTagName('TR').length > 2) {
		TableElementLength = document.getElementsByTagName('TR').length;
		TableElementLengthFindThis = TableElementLength - 1;
		CurrentId = Number(document.getElementsByTagName('TR')[TableElementLengthFindThis].getAttribute('id'));
	} else {
		CurrentId = 0;
	}

	NewCode();
}


//display info in the left side bar
function InfoLine(id) {

	// Get the <ul> element with id="InfoAboutLine"
	var list = document.getElementById("InfoAboutLine");
	// As long as <ul> has a child node, remove it
	while (list.hasChildNodes()) {
		list.removeChild(list.firstChild);
	}

	//timestamp value and label
	LogTime = new Date(0);
	LogTime.setUTCSeconds(MasterArray[id].t);
	CombiDate = LogTime.getDate();

	if (CombiDate.toString()[1] == undefined) {
		CombiDate = '0' + CombiDate.toString();
	}
	CombiMonth = Number(LogTime.getMonth()) + 1;
	if (CombiMonth.toString()[1] == undefined) {
		CombiMonth = '0' + CombiMonth.toString();
	}
	CombiMinutes = LogTime.getMinutes();
	if (CombiMinutes.toString()[1] == undefined) {
		CombiMinutes = '0' + CombiMinutes.toString();
	}

	CombiTime = CombiDate + '/' + CombiMonth + '/' + LogTime.getFullYear() + ' ' + LogTime.getHours() + ':' + CombiMinutes;

	info_time = document.createElement('p');
	info_time.setAttribute('id', 'InfoAboutLabel');
	info_time.innerHTML = MasterArray[id].tl + ':';
	document.getElementById('InfoAboutLine').appendChild(info_time);

	info_time = document.createElement('p');
	info_time.setAttribute('id', 'InfoAboutResult');
	info_time.innerHTML = CombiTime;
	document.getElementById('InfoAboutLine').appendChild(info_time);

	if (MasterArray[id].el != undefined) {
		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutLabel');
		info_time.innerHTML = MasterArray[id].el + ':';
		document.getElementById('InfoAboutLine').appendChild(info_time);

		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutResult');
		info_time.innerHTML = MasterArray[id].e;
		document.getElementById('InfoAboutLine').appendChild(info_time);
	}

	if (MasterArray[id].dl != undefined) {
		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutLabel');
		info_time.innerHTML = MasterArray[id].dl + ':';
		document.getElementById('InfoAboutLine').appendChild(info_time);

		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutResult');
		info_time.innerHTML = MasterArray[id].d;
		document.getElementById('InfoAboutLine').appendChild(info_time);
	}

	if (MasterArray[id].vl2 != undefined) {
		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutLabel');
		info_time.innerHTML = MasterArray[id].vl2 + ':';
		document.getElementById('InfoAboutLine').appendChild(info_time);

		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutResult');
		info_time.innerHTML = MasterArray[id].v2;
		document.getElementById('InfoAboutLine').appendChild(info_time);
	}


	if (MasterArray[id].vl3 != undefined) {
		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutLabel');
		info_time.innerHTML = MasterArray[id].vl3 + ':';
		document.getElementById('InfoAboutLine').appendChild(info_time);

		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutResult');
		info_time.innerHTML = MasterArray[id].v3;
		document.getElementById('InfoAboutLine').appendChild(info_time);
	}

	if (MasterArray[id].vl4 != undefined) {
		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutLabel');
		info_time.innerHTML = MasterArray[id].vl4 + ':';
		document.getElementById('InfoAboutLine').appendChild(info_time);

		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutResult');
		info_time.innerHTML = MasterArray[id].v4;
		document.getElementById('InfoAboutLine').appendChild(info_time);
	}

	if (MasterArray[id].vl5 != undefined) {
		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutLabel');
		info_time.innerHTML = MasterArray[id].vl5 + ':';
		document.getElementById('InfoAboutLine').appendChild(info_time);

		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutResult');
		info_time.innerHTML = MasterArray[id].v5;
		document.getElementById('InfoAboutLine').appendChild(info_time);
	}

	//NOT SHOWING ACTION. ADD BLOCK IF NEEDED
	if (MasterArray[id].desc != undefined) {
		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutLabel');
		info_time.innerHTML = 'Description:';
		document.getElementById('InfoAboutLine').appendChild(info_time);

		info_time = document.createElement('p');
		info_time.setAttribute('id', 'InfoAboutResult');
		info_time.innerHTML = MasterArray[id].desc;
		document.getElementById('InfoAboutLine').appendChild(info_time);
	}

}

AccessLvlCode = Number(sessionStorage.getItem('AccessLevel'));

$(document).ready(function () {
	$("#SearchInput").on("keyup", function () {
		var value = $(this).val().toLowerCase();
		document.querySelectorAll("#TableId tr").forEach(tr => {
			tr.style.display = tr.textContent.toLowerCase().includes(value) ? '' : 'none';
		});
	});
});

/*Start Function For User To Be Able To Read File*/
function InitialReadFile(Type) {
	var input = document.createElement('input');
	input.type = 'file';
	input.setAttribute('accept', '.csv');
	input.onchange = e => {
		//getting a hold of the file reference
		var file = e.target.files[0];
		// setting up the reader
		var reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		// here we tell the reader what to do when it's done reading
		reader.onload = readerEvent => {
			var data = readerEvent.target.result;
			console.log(data);
			// this is the content of the file
			if (input.value.split('.')[input.value.split('.').length - 1] != 'csv') {
				alert('Please only open valid a log file');
				return;
			}
			if (sessionStorage.getItem('Log') != null) {
				CurrentLog = sessionStorage.getItem('Log');
				sessionStorage.setItem('Log', data);// CurrentLog + '\n' + data);
				document.getElementById('LogInputButtonCall').removeAttribute('disabled');
				document.getElementById('DropDownLog').removeAttribute('disabled');
				sessionStorage.setItem('FileName', input.value.split('\\')[input.value.split('\\').length - 1]);
				ReadLogs();
			} else {
				sessionStorage.setItem('Log', data);
				document.getElementById('LogInputButtonCall').removeAttribute('disabled');
				document.getElementById('DropDownLog').removeAttribute('disabled');
				sessionStorage.setItem('FileName', input.value.split('\\')[input.value.split('\\').length - 1]);
				ReadLogs();
			}
			if (data == '') {
				alert('Log File is empty');
				return;
			}
		}
	}
	input.click();
}
/*End Function For User To Be Able To Read File*/


//Function for changing Language
function LanguageChange(PreferredLanguage) {
	CurrentLanguage = sessionStorage.getItem('Language');
	if (PreferredLanguage != CurrentLanguage) {
		sessionStorage.setItem('Language', PreferredLanguage);
		location.reload();
	}
}

//From To Filter Logic
function SearchFilterTime() {

	if (document.getElementById('StarterTime').value == "") {
		delete EpochStartTime;
	} else {
		StartTime = new Date(document.getElementById('StarterTime').value);
		EpochStartTime = StartTime.getTime() / 1000;
	}

	if (document.getElementById('EndTime').value == "") {
		delete EpochEndTime;
	} else {
		EndTime = new Date(document.getElementById('EndTime').value);
		EpochEndTime = (EndTime.getTime() / 1000) + 86400;
	}

	Draw_Table();
}

//From To Filter Logic
function ClearFilterTime() {
	document.getElementById('StarterTime').value = "";
	document.getElementById('EndTime').value = "";

	delete EpochStartTime;
	delete EpochEndTime;

	Draw_Table();
}


//Makes elements that do not meet Query invisible
function FilterSearch(Query) {
	var value = Query.toLowerCase();
	document.querySelectorAll("#TableId tr").forEach(tr => {
		tr.style.display = tr.textContent.toLowerCase().includes(value) ? '' : 'none';
	});
}

//Reads definition of log and fits on the left side bar
function PopUpDefinition(CodeName, Elementid) {

	if (document.getElementsByClassName('ClickedOn')[0] != undefined) {
		document.getElementsByClassName('ClickedOn')[0].removeAttribute('class');
	}

	document.getElementById(Elementid.toString()).setAttribute('class', 'ClickedOn');
	document.getElementById('InfoAboutLine').innerHTML = '';
	counter = 0;
	while (document.getElementById(Elementid).childNodes[counter] != undefined) {
		console.log(document.getElementById(Elementid).childNodes[counter].innerHTML);
		Label = document.createElement('label');
		Label.setAttribute('id', document.getElementById(Elementid).childNodes[counter].innerHTML);
		Label.innerHTML = document.getElementById(Elementid).childNodes[counter].getAttribute('title') + ' :';
		Label.setAttribute('id', 'InfoAboutLabel');

		if (document.getElementsByTagName('TH')[counter].innerHTML == 'Code') {
			Name = document.createElement('h4');
		} else {
			Name = document.createElement('p');
		}

		Name.innerHTML = document.getElementById(Elementid).childNodes[counter].innerHTML;
		Name.setAttribute('id', 'InfoAboutResult');

		if (document.getElementById(Elementid).childNodes[counter].getAttribute('title') != 'undefined' && document.getElementById(Elementid).childNodes[counter].innerHTML != ' ') {
			if (document.getElementsByTagName('TH')[counter].innerHTML != 'Code' && document.getElementById(Elementid).childNodes[counter].getAttribute('title') != null) {
				document.getElementById('InfoAboutLine').appendChild(Label);
			}
			document.getElementById('InfoAboutLine').appendChild(Name);
		}
		counter++;
	}

	try {
		Definition = document.createElement('p');
		Definition.setAttribute('id', 'DefinitionTag');
		Definition.innerHTML = DefinitionDictionary[Number(CodeName.split(';')[1])];
		document.getElementById('InfoAboutLine').appendChild(Definition);
	} catch (err) {
		Definition = document.createElement('p');
		Definition.setAttribute('id', 'DefinitionTag');
		Definition.innerHTML = 'Description for this log type is not available';
		document.getElementById('InfoAboutLine').appendChild(Definition);
	}
}


/**
 * Sends log export data to the server using AJAX instead of form submission.
 * @param {string} filename - The name of the file.
 * @param {string} text - The file contents.
 */
function WebdownloadFile(filename, text) {
	// Prepare the data to send
	// const data = {
	// 	Model: TruckModel,
	// 	FileName: filename,
	// 	SerialNumber: SerialNumber,
	// 	Username: sessionStorage.getItem('elogsloggedinusername'),
	// 	Useremail: sessionStorage.getItem('elogsloggedinemail'),
	// 	AccessLevel: sessionStorage.getItem('AccessLevel'),
	// 	ActionInput: 'Exported Results',
	// 	ExportData: text
	// };


	var blob = new Blob([text], { type: 'text/plain' });
	var link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	link.click();

}

if (sessionStorage.getItem('MasterArray') == null) {
	//Removing ability for user to click Close these Logs - before Logs have been opened
	document.getElementsByClassName('CloseTheseLogs')[0].removeAttribute('onclick');
	document.getElementsByClassName('CloseTheseLogs')[0].setAttribute('style', 'background:lightgray;');
}
else {

	try {
		MasterArray;
	}
	catch (err) {
		MasterArray = JSON.parse(sessionStorage.getItem('MasterArray'));
	}

	if (MasterArray[0] !== undefined) {

		document.getElementById('InstructionsText').setAttribute('style', 'display:none;');
		document.getElementsByClassName('CloseTheseLogs')[0].setAttribute('onclick', 'CloseLogs()');
		document.getElementsByClassName('CloseTheseLogs')[0].removeAttribute('style');
		document.getElementById('StarterTime').removeAttribute('disabled');
		document.getElementById('EndTime').removeAttribute('disabled');
		document.getElementById('SearchFilterBTN').removeAttribute('disabled');
		document.getElementById('ClearFilterBTN').removeAttribute('disabled');
		document.getElementsByClassName('ExportResultsButton')[0].removeAttribute('disabled');

		TruckModel = sessionStorage.getItem('TruckModel');
		SerialNumber = sessionStorage.getItem('SerialNumber');

		TruckModelP = document.createElement('p');
		TruckModelP.setAttribute('id', 'LogInfoText');
		TruckModelP.innerHTML = 'Machine Model : ';

		TruckModelResult = document.createElement('p');
		TruckModelResult.setAttribute('id', 'LogInfoText');
		TruckModelResult.innerHTML = TruckModel;

		SerialNumberP = document.createElement('p');
		SerialNumberP.setAttribute('id', 'LogInfoText');
		SerialNumberP.innerHTML = 'Truck Serial Number : ';

		SerialNumberPValue = document.createElement('p');
		SerialNumberPValue.setAttribute('id', 'LogInfoText');
		SerialNumberPValue.innerHTML = SerialNumber;

		document.getElementById('CombiLogLine').innerHTML = '';
		document.getElementById('CombiLogLine').appendChild(TruckModelP);
		document.getElementById('CombiLogLine').appendChild(TruckModelResult);
		document.getElementById('CombiLogLine').appendChild(SerialNumberP);
		document.getElementById('CombiLogLine').appendChild(SerialNumberPValue);
		document.title = 'Combilift - eLog Viewer - ' + SerialNumber;

		Draw_Table();
	}

}
//Start setting values to time inputs
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

if (dd < 10) {
	dd = '0' + dd
}

if (mm < 10) {
	mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("StarterTime").setAttribute("max", today);
document.getElementById("EndTime").setAttribute("max", today);

document.addEventListener('DOMContentLoaded', () => {
	const sidebar = document.getElementById('SideMenu');
	const handle = document.getElementById('SidebarResizeHandle');
	let isResizing = false;

	handle.addEventListener('mousedown', function (e) {
		isResizing = true;
		document.body.style.cursor = 'ew-resize';
		e.preventDefault();
	});

	document.addEventListener('mousemove', function (e) {
		if (!isResizing) return;
		let newWidth = e.clientX - sidebar.getBoundingClientRect().left;
		newWidth = Math.max(200, Math.min(newWidth, 600)); // min/max width
		sidebar.style.width = newWidth + 'px';
	});

	document.addEventListener('mouseup', function () {
		if (isResizing) {
			isResizing = false;
			document.body.style.cursor = '';
		}
	});
});


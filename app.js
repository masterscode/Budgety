//=============BUDGET CONTROLLER================================
var budgetController = (function() {
	var Expenses = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	Expenses.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
		this.percentage = Math.round((this.value / totalIncome) * 100)
		}else{ this.percentage = -1; }

	}

	Expenses.prototype.getPercentage = function(){
		return this.percentage;
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			expenses: [],
			income: []
		},
		totals: { income: 0, expenses: 0 },
		budget: 0,
		percentage: -1
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(elem) {
			sum += elem.value;
		});
		data.totals[type] = sum;
	};

	return {
		addItem: function(type, description, value) {
			var newItem, id;
			id = 0;
			//create new id
			if (data.allItems[type].length > 0) {
				id = data.allItems[type][data.allItems[type].length - 1].id + 1;
				//id = (data.allItems[type].length - 1 )+ 1; my own method of generating the id
			}

			//create new item object based on the type - income or expenses
			if (type === 'expenses') {
				newItem = new Expenses(id, description, value);
			} else if (type === 'income') {
				newItem = new Income(id, description, value);
			}

			data.allItems[type].push(newItem);
			return newItem;
		},
		deleteItem: function(type, id) {
			var ids = data.allItems[type].map(function(currentElem) {
				return currentElem.id;
			});
			var index = ids.indexOf(id);
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},
		calculateBudget: function() {
			//calculate total income and expenses
			calculateTotal('expenses');
			calculateTotal('income');
			//calculate the budget: income - expenses
			data.budget = data.totals.income - data.totals.expenses;
			//calculate the percentage of income that we spent
			if (data.totals.income > 0) {
				data.percentage = Math.round((data.totals.expenses / data.totals.income) * 100);
			} else {
				data.percentage = 0;
			}
		},
		calculatePercentages: function(){
			data.allItems.expenses.forEach(function(currentValue){
				currentValue.calcPercentage()
			})
		},
		getPercentages: function(){
			var allPercentages = data.allItems.expenses.map(function(currentValue){
				return currentValue.getPercentage();
			})
			return allPercentages;
		},
		getBudget: function() {
			return {
				budget: data.budget,
				totalIncome: data.totals.income,
				totalExpenses: data.totals.expenses,
				percentage: data.percentage
			};
		},
		testData: function() {
			console.log(data);
		}
	};
})();

//=====================UI CONTROLLER=============================
var UIController = (function() {
	// var DomStrings = {inputType : "[name='type']", description : "[name='desc']", value: "[name='value']"}
	return {
		getInput: function() {
			return {
				type: document.querySelector("[name='type']").value,
				description: document.querySelector("[name='description']").value,
				value: parseFloat(document.querySelector("[name='value']").value)
			};
		},
		addListItem: function(obj, type) {
			var html, newHTML, element;
			//create html strings with placeholders text
			if (type === 'income') {
				element = '.income-list';
				html =
					'<div class="income" id="income-%id%"><div class="description">%description%</div><div class="value">%value%</div><button class="delete-button">x</button></div>';
			} else if (type === 'expenses') {
				element = '.expenses-list';
				html =
					'<div class="expenses" id="expenses-%id%"><div class="description">%description%</div><div class="value">%value%</div><button class="delete-button">x</button></div>';
			}
			//replace placeholder text with actual data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', obj.value);
			//insert html into the dom

			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},
		clearFields: function() {
			var allInputFields = document.querySelectorAll('input');
			allInputFields.forEach(function(elem) {
				elem.value = '';
			});
			allInputFields[0].focus();
		},
		deleteListItem:function(selectorID){
			var element = document.getElementById(selectorID);
			element.parentNode.removeChild(element)
		},
		displayBudget: function(obj) {
			document.querySelector('#totalIncome').textContent = obj.totalIncome;
			document.querySelector('#totalExpenses').textContent = obj.totalExpenses;
			document.querySelector('#totalBudget').textContent = obj.budget;
			if(obj.percentage > 0){
				document.querySelector('#percentage').innerText = obj.percentage + '%';
			}
		}
	};
})();

//====================CONTROLLER============================
var controller = (function(budgetCtrl, uiCtrl) {
	var setupEventListeners = function() {
		document.querySelector('button').addEventListener('click', uiCtrlAddItem);

		document.addEventListener('keypress', (event) => {
			if (event.keyCode === 13) {
				uiCtrlAddItem();
			}
		});

		document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
	};

	var ctrlDeleteItem = function(event) {
		var itemID = event.target.parentNode.id;

		if (itemID) {
			var splitID = itemID.split('-');
			var type = splitID[0];
			var ID = parseInt(splitID[1]);

			//1. delete the item from the data structure
			budgetCtrl.deleteItem(type, ID)
			//2. delete the item from the ui
			uiCtrl.deleteListItem(itemID);


			//3. update and show the new budget
			updateBudget();
			//4. calculate and update percentages
			updatePercentages();
		}
	};

	var updateBudget = function() {
		//1. calculate the budget
		budgetCtrl.calculateBudget();
		//2. return the budget
		var budget = budgetCtrl.getBudget();
		//3. display the budget on the ui
		uiCtrl.displayBudget(budget);
	};

	var updatePercentages = function(){
		// calculate the percentages 
		var percentages = budgetCtrl.getPercentages();
		// read percentage from the budget controller
		// update the ui with the new percentages
	};

	var uiCtrlAddItem = function() {
		//1. get the field input data
		var inputs = uiCtrl.getInput();
		if (inputs.description !== '' && !isNaN(inputs.value) && inputs.value > 0) {
			//2. add the item to the budget controller
			var newItem = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);
			//3. add the items to the ui
			uiCtrl.addListItem(newItem, inputs.type);
			//4.0 clear all fields
			uiCtrl.clearFields();
			//5. calculate and update budget
			updateBudget();
		}
	};

	return {
		init: function() {
			console.log('application has started!!');
			UIController.displayBudget({ budget: 0, totalIncome: 0, totalExpenses: 0, percentage: -1 });
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();

 //=============BUDGET CONTROLLER================================
 var budgetController = (function(){
    
    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            expenses: [],
            income: []
        },
        totals:{income:0, expenses:0 }
    }

    return{
        addItem: function(type, description, value){
            var newItem, id;
            id = 0;
            //create new id
            if(data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
                //id = (data.allItems[type].length - 1 )+ 1; my own method of generating the id
            }

            //create new item object based on the type - income or expenses
            if(type === 'expenses'){
                newItem = new Expenses(id, description, value);
            }else if(type === 'income'){
                newItem = new Income(id, description, value);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        testData: function(){
            console.log(data)
        }
       
    }

})();
    

//=====================UI CONTROLLER=============================
var UIController = (function(){
    // var DomStrings = {inputType : "[name='type']", description : "[name='desc']", value: "[name='value']"}
    return{
        getInput: function(){
            return{
            type:  document.querySelector("[name='type']").value,
            description: document.querySelector("[name='description']").value,
            value: document.querySelector("[name='value']").value
            }
        },
        addListItem: function(obj, type){
            var html, newHTML, element;
            //create html strings with placeholders text
            if(type === 'income'){
            element = '.income-list';
            html = '<div class="income" id="income-%id%"><div class="description">%description%</div><div class="value">%value%</div><button class="delete-button">x</button></div>';
            }
            else if(type === 'expenses'){
            element = '.expenses-list';
            html =  '<div class="expenses" id="expenses-%id%"><div class="description">%description%</div><div class="value">%value%</div><button class="delete-button">x</button></div>';
            }
            //replace placeholder text with actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            //insert html into the dom 

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
             
        }
    };
})();



//====================CONTROLLER============================
var controller = (function(budgetCtrl, uiCtrl){
   var setupEventListeners = function(){
    document.querySelector('button').addEventListener('click', uiCtrlAddItem)
    
    document.addEventListener('keypress', (event)=>{
        if (event.keyCode === 13) uiCtrlAddItem();
    });
   }
    var uiCtrlAddItem = function(){
        //1. get the field input data
        var inputs  = uiCtrl.getInput();
        //2. add the item to the budget controller
        var newItem = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);
        //3. add the items to the ui
        uiCtrl.addListItem(newItem, inputs.type)
        //4. calculate the budget
        // 5. display the budget on the ui
    }

    return {
        init: function(){
            console.log('application has started!!');
        setupEventListeners();
        }
    }
   

})(budgetController, UIController);

controller.init();
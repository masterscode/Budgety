 //=============BUDGET CONTROLLER================================
 var budgetController = (function(){
    
})();



//=====================UI CONTROLLER=============================

var UIController = (function(){
    //
})();












//====================CONTROLLER============================
var controller = (function(budgetCtrl, uiCtrl){
    var uiCtrlAddItem = function(){
        console.log('it works')
        //1. get the field input data
        //2. add the item to the budget controller
        //3. add the items to the ui
        //4. calculate the budget
        // 5. display the budget on the ui
    }
    document.querySelector('button').addEventListener('click', ()=> { 
        //
    })
    
    document.addEventListener('keypress', (event)=>{
        if (event.keyCode === 13) uiCtrlAddItem();
    })
})(budgetController, UIController);
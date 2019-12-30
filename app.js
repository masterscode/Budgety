 var budgetController = (function(){
     var x = 23;
     var add = function(a){
         return x + a;
     }
    

     return {
         publicTest : function(b){
            return add(b);
         }
     }
})();



//=====================UI CONTROLLER=============================

var UIController = (function(){
    //
})();












//====================CONTROLLER============================
var controller = (function(budgetCtrl, uiCtrl){
    var z = budgetCtrl.publicTest(5);
    return {
        anotherPublicTest : function(){
            console.log(z);
        }
    }
})(budgetController, UIController);
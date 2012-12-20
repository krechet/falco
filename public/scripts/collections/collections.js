BirdsCollection = Backbone.Collection.extend({
    
    model : BirdModel,
    
    url : '/birds',
    
    initialize : function(){
    }
});
define([
    'backbone',
    'models/model'
    ], function(Backbone, BirdModel){

        BirdsCollection = Backbone.Collection.extend({
    
            model : BirdModel,
    
            url : '/birds',
    
            initialize : function(){
            }
        });

        return BirdsCollection;
    });
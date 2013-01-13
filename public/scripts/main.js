requirejs.config({
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        }
    }
    ,
    paths: {
        jquery: 'libs/jquery-1.8.3.min',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        openlayers: 'libs/OpenLayers',
        templates: 'templates'
    }

});

requirejs([
    'app',
    ], function(App){
        App.initialize();
    });

    /*$(function(){
    
    
    
});
     */

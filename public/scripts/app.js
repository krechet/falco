var app = app || {};

define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'views/app',
  'views/login',
  'collections/collections',
  'views/birds',
  'views/birdDetails',
  'views/loader',
  'views/bird'
], function($, _, Backbone, AppRouter, AppView, LoginView, BirdsCollection, BirdsView, BirdDetailsView, AjaxLoader, BirdView){
  var initialize = function(){
      
    
    app.view = new AppView();
   
    app.loginView = new LoginView();
    app.loginView.check();
    app.loginView.render();
    
    app.birds = new BirdsCollection(); 
    
    app.birdsView = new BirdsView();
    
    app.birdDetailsView = new BirdDetailsView();

    app.birds.on('sync', function(){
        app.birdsView.render();
         
    });   
    
    app.loader = new AjaxLoader();
    
    app.loader.show();
     
    app.birds.fetch({
        async:false
    });
    
    app.loader.hide();
    
    app.router = new AppRouter;
    Backbone.history.start();
    
  };
  return {
    initialize: initialize
  };
});

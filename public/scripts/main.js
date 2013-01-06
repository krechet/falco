$(function(){
    
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
    
    
});


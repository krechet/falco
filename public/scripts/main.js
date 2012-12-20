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
     
    app.birds.fetch({
        async:false
    });
    
    app.router = new AppRouter;
    Backbone.history.start();
    
    
});


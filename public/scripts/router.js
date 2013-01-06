var AppRouter = Backbone.Router.extend({
    routes: {
        "birds/:id": "showBird",
        
        "page/:n" : "gotoPage",
        "" : "index",

        "*actions": "defaultRoute" // Backbone will try match the route above first
    },
    
    index : function(){
        this.gotoPage(0);
//        app.birdsView.show();    
    },
    
    gotoPage : function(n){
        app.birdsView.curPage = n;
        app.birdsView.showCurrentPage();
        //        app.birdsView.render();
        app.birdsView.show();
    },
    
    showBird : function(id){
        if(app.birdDetailsView.model.get('_id') != id){
            app.loader.showRelative('bb'+id);
            app.birdDetailsView.model.set({
                _id:id
            });
            app.birdDetailsView.model.fetch({
                async:false
            });
            app.loader.hide();
        }
        app.birdDetailsView.show();
        
    }
});

BirdDetailsView = Backbone.View.extend({
    el : '#birdDetails',
   
    initialize : function(){
        _.bindAll(this, 'render', 'modelChange');
       
        BirdDetailsModel = Backbone.Model.extend({
            urlRoot : '/birds',
            idAttribute : '_id'
        });       
        
        this.model = new BirdDetailsModel();
        this.model.on('sync', this.modelChange );
    },

    modelChange : function(){
        this.render();  
    },

    render : function(){
        this.$el.html(_.render('birdDetails',this.model.toJSON()));
        $('h2').addClass('dontend');
        $('#bdDescription').columnize({
            width:240, 
            lastNeverTallest: true
        });
        return this;
    },
   
    show : function(){
        app.view.show('birdDetails');
    }
   
});

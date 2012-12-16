
var app = app || {};


_.render = 

    function renderTpl(tmpl_name, tmpl_data) {
        if ( !_.render.tmpl_cache ) { 
            _.render.tmpl_cache = {};
        }

        if ( ! _.render.tmpl_cache[tmpl_name] ) {
            var tmpl_dir = '/templates';
            var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

            var tmpl_string;
            $.ajax({
                url: tmpl_url,
                method: 'GET',
                async: false,
                success: function(data) {
                    tmpl_string = data;
                }
            });

            _.render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
        }

        return _.render.tmpl_cache[tmpl_name](tmpl_data);
    }

BirdModel = Backbone.Model.extend({
    defaults : {
        name : '',
        order : '',
        genus : '',
        subgenus : '',
        family : '',
        species : '',
        image : '',
        description : ''
    },
    
    idAttribute : '_id'
});

BirdsCollection = Backbone.Collection.extend({
    
    model : BirdModel,
    
    url : '/birds',
    
    initialize : function(){
    }
});


BirdView = Backbone.View.extend({
    
    tagName : 'div',
    className : 'birdBlock',
    model : BirdModel,
    
    events : {
        'click .delBird' : function(e){ 
            e.stopPropagation();
            if(confirm('Delete?')){
                this.model.destroy();
                this.remove();
                app.birdsView.show();            
                
            }
        },
        'click' : function(){

            window.location.href = '#/birds/'+this.model.id;
        }
    },
    
    init : function(){
    /*        this.model.on('destroy', function(){
            console.log('removing element');
            this.remove();
        });*/
    },
    
    render : function(){
        //        this.$el.html(this.tpl(this.model.toJSON())); 
        this.$el.html(_.render('birdBlock',this.model.toJSON())); 
        return this;
    }
});



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

BirdsView = Backbone.View.extend({
    el : '#birdList',
    

    
    initialize : function(){
        _.bindAll(this,'render');
        
    //        this.on('click .delBird', function(){ console.log('del');})
    },
    
    
    
    render : function(){
        _(app.birds.models).each(function(item){
            var birdView = new BirdView({
                model:item
            });
            var html = birdView.render().el;
            this.$el.append(html);
        }, this);
        
        return this;
    },
    
    show : function(){
        app.view.show('birdList');
        return this;
    }

});

var AppView = Backbone.View.extend({
        
    el : '#contentContainer',
    
    show : function(mode){
        // get offset of the div
        
        var m = '0px';
        if(mode=='birdList')
            m = '1px';
        else if(mode=='birdDetails'){
            m = '-933px';
        }
        
        $('#birdsContainer').animate({
            marginLeft : m
        }, 300, 'swing');
    }
    
});

var AppRouter = Backbone.Router.extend({
    routes: {
        "birds/:id": "showBird",
        "" : "index",
        "*actions": "defaultRoute" // Backbone will try match the route above first
    },
    
    index : function(){
        app.birdsView.show();    
    },
    
    showBird : function(id){
        app.birdDetailsView.model.set({
            _id:id
        });
        app.birdDetailsView.model.fetch({
            async:false
        });
        app.birdDetailsView.show();
        
    }
});


$(function(){
    
    app.view = new AppView();
   

    
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



var app = app || {};

BirdModel = Backbone.Model.extend({
    defaults : {
        name : '',
        order : '',
        genus : '',
        subgenus : '',
        family : '',
        species : '',
        image : ''
    }
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
    tpl : _.template("<p><img src='/images/birds/th_<%= image %>'></p>\
        <p><%= name %></p>\
        <p><%= order %></p>\
        <p><%= family %></p>\
        <p><%= genus %></p>\
        <p><%= subgenus %></p>\
        <p><%= species %></p>\
        "
        ),
    
    render : function(){
       this.$el.html(this.tpl(this.model.toJSON())); 
       return this;
    }
});

BirdsView = Backbone.View.extend({
    el : '#birdsContainer',
    
    init : function(){
        _.bindAll(this,'render');
    },
    
    render : function(){
        _(app.birds.models).each(function(item){
            var birdView = new BirdView({model:item});
            var html = birdView.render().el;
           this.$el.append(html);
        }, this);
    }
});

var AppView = Backbone.View.extend({
        
    el : '#contentContainer'
    
});

$(function(){
    
   app.birds = new BirdsCollection(); 
   app.birdsView = new BirdsView();
     
   app.birds.fetch();
   app.birds.on('sync', function(){
       app.birdsView.render();
   });   
   
    
    console.log('loaded');
    
});


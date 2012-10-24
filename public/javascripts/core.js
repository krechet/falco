
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
        'click .delBird' : function(){ 
            if(confirm('Delete?')){
                this.model.destroy();
                this.remove();
            }
        },
        'click' : function(){
            //route
            $('#birdsContainer').animate({marginLeft : '-940px'}, 300, 'swing', function(){
                this.css('margin-left', '940px')
                    .css('display','none');
            }); 
        }
    },
    
    init : function(){
/*        this.model.on('destroy', function(){
            console.log('removing element');
            this.remove();
        });*/
    },
    
    tpl : _.template("<div style='height:120; width:200;background:url(/images/birds/th_<%= image %>) no-repeat'><img style='z-index:100' src='/images/frame120.png'></div>\
        <table class='birdProps'>\
        <tr><td>Order</td><td><%= order %></td></tr>\
        <tr><td>Family</td><td><%= family %></td></tr>\
        <tr><td>Genus</td><td><%= genus %></td></tr>\
        <tr><td>Subgenus</td><td><%= subgenus %></td></tr>\
        <tr><td>Species</td><td><%= species %></td></tr></table>\
        <div class='itemOps'>\
<a href='javascript:void(0)' class='delBird'>del</a>\
<a href='/birds/<%= _id %>/edit' class='editlBird'>edt</a>\
    </div>\
    <div class='birdName'><%= name %></div>\
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
        
//        this.on('click .delBird', function(){ console.log('del');})
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
   
   $('#birdsContainer').animate({marginLeft : '3px'}, 300, 'swing'); 
    
});


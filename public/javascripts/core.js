
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
        'click .editBird' : function(e){
            e.stopPropagation();
            window.location.href = '/birds/'+this.model.id+'/edit'
        },
        'click' : function(e){
            window.location.href = '#/birds/'+this.model.id;
        },
        'mouseenter' : function(e){
            if(app.loginView.user.role=='admin')
                $(this.$el).find('.itemOps').css('display','block');
        },
        'mouseleave' : function(e){
            $(this.$el).find('.itemOps').css('display','none');
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
        this.delegateEvents();
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
    
    curPage : 0,
    totalPages : 0,
    
    initialize : function(){
        _.bindAll(this,'render','getModelMetrics');
        
        app.birds.on('reset', this.getModelMetrics);
        
        $('.pgnPrev').click($.proxy(this.prevPage, this));
        $('.pgnNext').click($.proxy(this.nextPage, this));
        
    },
    
    events : {
        "click .pgnNext" : "nextPage",
        "click .pgnPrev" : "prevPage"
    },

    getModelMetrics : function(){
        var cnt = app.birds.models.length; 
        this.curPage = 0;
        this.totalPages = Math.ceil(cnt/8);
    },
    
    showCurrentPage : function(){
        var m = -874*this.curPage+'px';
        
        $("#birdList").animate({
            marginLeft : m
        }, 300, 'swing');        
        
        window.location.href = '#/page/'+this.curPage;
    },
    
    nextPage : function(){
        this.curPage++;
        if(this.curPage>=this.totalPages)
            this.curPage = this.totalPages-1;
        
        this.showCurrentPage();
        
    },
    
    prevPage : function(){
        this.curPage--;
        if(this.curPage<0)
            this.curPage = 0;
        
        this.showCurrentPage();
    },
    
    render : function(){
        
        this.$el.html('');
        
        /*        for(var i=this.curPage*8; i<(this.curPage+1)*8 && i<app.birds.models.length; i++){
            var birdView = new BirdView({
                model:app.birds.models[i]
            });
            var html = birdView.render().el;
            this.$el.append(html);
          
        }
  */      
        this.$el.css('width',256*app.birds.models.length + 'px');
        
        var board = $("<div style='float:left;width:874px;height:560px;'></div>");
        
        var cnt = 0;
        
        _(app.birds.models).each(function(item){
            var birdView = new BirdView({
                model:item
            });
            var html = birdView.render().el;
            //            this.$el.append(html);
            board.append(html);
            if(++cnt>7){
                this.$el.append(board);
                board = $("<div style='float:left;width:874px;height:560px;'></div>");
            }
        }, this);
        
        // this.$el.append(board);
        return this;
    },
    
    show : function(){
        app.view.show('birdList');
        return this;
    }

});

LoginView = Backbone.View.extend({
    el : '#login',
    user : {},
    
    events : {
        "click .submit" : function (e){
            this.login();
        },
        
        "click .logout" : function(e){
            this.logout();
            this.render();
        }
    },
    initialize : function(){
        _.bindAll(this,'render');
        
        
    },   
    render : function(){
        if(!this.user.role)
            $(this.$el).html('<p>User <input id="username"></p><p>Password <input id="password" type="password"></p><p><a class="submit" href="javascript:void(0);">Enter</a></p>');
        else
            $(this.$el).html('<p>Logged as '+this.user.role+'</p><p><a class=logout href="javascript:void(0)">Logout</a></p>');
    },
   
    check : function(){
        
        $.ajax({
            type : 'get',
            url : '/user',
            dataType : 'json',
            context : this
        }).done(function(res){
            if(res.user && res.user.role)
            {
                this.user = res.user;
            }
            else{
                this.user = {};
            }
            this.render();

        })        
       
    },
    
    login : function(){
        $.ajax({
            type : 'post',
            url : '/login',
            data : {
                username : $(this.$el).find('#username').val(),
                password : $(this.$el).find('#password').val()
            },
            dataType : 'json',
            context : this
        }).done(function(res){
            if(res.role)
            {
                this.user = res;
                this.render();
            }
        })
    },
    
    logout : function(){
        $.ajax({
            type : 'get',
            url : '/logout',
            context : this
            
        }).done(function(res){
            this.user = {};
            this.render();
        })
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
            m = '-874px';
        }
        
        $('#birdsContainer').animate({
            marginLeft : m
        }, 300, 'swing');
    }
    
});

var AppRouter = Backbone.Router.extend({
    routes: {
        "birds/:id": "showBird",
        
        "page/:n" : "gotoPage",
        "" : "index",

        "*actions": "defaultRoute" // Backbone will try match the route above first
    },
    
    index : function(){
        app.birdsView.show();    
    },
    
    gotoPage : function(n){
        app.birdsView.curPage = n;
        app.birdsView.showCurrentPage();
        //        app.birdsView.render();
        app.birdsView.show();
    },
    
    showBird : function(id){
        if(app.birdDetailsView.model.get('_id') != id){
            app.birdDetailsView.model.set({
                _id:id
            });
            app.birdDetailsView.model.fetch({
                async:false
            });
        }
        app.birdDetailsView.show();
        
    }
});


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


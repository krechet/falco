define([
    'jquery',
    'backbone'
    ], function(){
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

        return LoginView;
    });


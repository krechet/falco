define([
    'backbone',
    'models/model',
    'text!templates/birdBlock.html'
    ], function(Backbone, BirdDetailsModel, BirdBlockTpl){

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
                this.$el.html(_.template(BirdBlockTpl,this.model.toJSON())); 
                this.delegateEvents();
                return this;
            }
        });

        return BirdView;
    });


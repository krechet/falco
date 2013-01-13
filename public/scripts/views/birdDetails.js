define([
    'backbone',
    'models/model',
    'text!templates/birdDetails.html',
    'libs/jquery.columnizer.min',
    'mapper'
    ], function(Backbone,BirdDetailsModel, BirdDetailsTpl, Columnizer, Mapper){


        BirdDetailsView = Backbone.View.extend({
            el : '#birdDetails',
            mapper : null,
   
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
                var json = this.model.toJSON();
                this.$el.html(_.template(BirdDetailsTpl,json));
                $('h2').addClass('dontend');
                $('#bdDescription').columnize({
                    width:240, 
                    lastNeverTallest: true
                });

                if(this.mapper){
                    this.mapper.map.destroy();
                    delete this.mapper;
                }
                this.mapper = new Mapper('rangesMap');
                this.mapper.init();
        
                if(json.ranges)
                    this.mapper.loadFromString(json.ranges);
        
                return this;
            },
   
            show : function(){
                app.view.show('birdDetails');
            }
   
        });

        return BirdDetailsView;

    });
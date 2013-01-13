define([
    'backbone'
    ], function(){


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
                        cnt = 0;
                    }
                }, this);
        
                this.$el.append(board);
        
                // this.$el.append(board);
                return this;
            },
    
            show : function(){
                app.view.show('birdList');
                return this;
            }

        });

        return BirdsView;
    });
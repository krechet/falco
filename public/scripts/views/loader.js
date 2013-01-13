define([
    'jquery'
    ], function(){
        function AjaxLoader(){
    
            this.$el = $('<div id="ajaxLoader"/>');
            this.$el.append('<img src="/images/335s.gif"/>');
    
            $('body').append(this.$el);
    
            this.show = function(){
                this.$el.show();
            };
    
            this.showRelative = function(board){
                var off = $('#'+board).offset();
                off.top += 236;
                off.left += 186;
                this.$el.css(off).show();
            };
    
            this.hide = function(){
                this.$el.hide();
            };
        };

        return AjaxLoader;

    });



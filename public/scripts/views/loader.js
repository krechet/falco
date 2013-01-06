function AjaxLoader(){
    
    this.$el = $('<div id="ajaxLoader"/>');
    this.$el.append('<img src="/images/335.gif"/>');
    
    $('body').append(this.$el);
    
    this.show = function(){
        this.$el.show();
    };
    
    this.hide = function(){
        this.$el.hide();
    };
}


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
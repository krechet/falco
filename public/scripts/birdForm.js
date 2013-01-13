requirejs.config({
    paths: {
        jquery: 'libs/jquery-1.8.3.min',
        openlayers: 'libs/OpenLayers'
    }

});

var app = {};

requirejs(['jquery','mapper'],
    function($, Mapper){
            app.mapper = new Mapper('edMap');
            app.mapper.init('edit');
            $('form').submit(function(){
                $('#ranges').val(app.mapper.toString());
                return true;
            });
    
            if($('#ranges').val().length>0){
                app.mapper.loadFromString($('#ranges').val());
            }
    });


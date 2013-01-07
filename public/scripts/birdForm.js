$(function(){
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


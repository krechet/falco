BirdModel = Backbone.Model.extend({
    defaults : {
        name : '',
        order : '',
        genus : '',
        subgenus : '',
        family : '',
        species : '',
        image : '',
        description : '',
        ranges : ''
    },
    
    idAttribute : '_id'
});
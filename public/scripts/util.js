_.render = 

    function renderTpl(tmpl_name, tmpl_data) {
        if ( !_.render.tmpl_cache ) { 
            _.render.tmpl_cache = {};
        }

        if ( ! _.render.tmpl_cache[tmpl_name] ) {
            var tmpl_dir = '/templates';
            var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

            var tmpl_string;
            $.ajax({
                url: tmpl_url,
                method: 'GET',
                async: false,
                success: function(data) {
                    tmpl_string = data;
                }
            });

            _.render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
        }

        return _.render.tmpl_cache[tmpl_name](tmpl_data);
    }



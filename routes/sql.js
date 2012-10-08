
/*
 * GET home page.
 */

exports.index = function(req, res){
    
    db.query('select * from indicators',
        function(err, results, fields){
            res.render('sql', {
                    records : results,
                    title : 'SQL 1'
            });
        }
    );
        
};


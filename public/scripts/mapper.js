define([
    'libs/openlayers/OpenLayers'
    ], function(){

        var Mapper = function(elName){
    
            var map, polygonControl, polygonlayer;
    
            this.init = function(mode){
                this.map = new OpenLayers.Map(elName);
            
                var wmsLayer = new OpenLayers.Layer.WMS( "OpenLayers WMS", 
                    "http://vmap0.tiles.osgeo.org/wms/vmap0?", {
                        layers: 'basic'
                    }); 

                this.polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");

                this.map.addLayers([wmsLayer, this.polygonLayer]);
        
                if(mode=='edit'){
                    this.map.setCenter(new OpenLayers.LonLat(0, 0), 1);
                    this.map.addControl(new OpenLayers.Control.LayerSwitcher());
                    this.map.addControl(new OpenLayers.Control.MousePosition());

                    polyOptions = {
                        sides: 4
                    };
        
                    this.polygonControl = new OpenLayers.Control.DrawFeature(this.polygonLayer,
                        OpenLayers.Handler.RegularPolygon,
                        {
                            handlerOptions: polyOptions
                        });
            
                    this.map.addControl(this.polygonControl);
            
        
                    this.polygonControl.activate()
                    this.setOptions({
                        irregular:true
                    });        
                }else {
                    this.map.setCenter(new OpenLayers.LonLat(0, 14), 1);
                }
            
            /*        document.getElementById('noneToggle').checked = true;
        document.getElementById('irregularToggle').checked = false;*/
            }
    
            this.setOptions = function(options) {
                this.polygonControl.handler.setOptions(options);
            }
    
            this.setSize = function(fraction) {
                var radius = fraction * map.getExtent().getHeight();
                this.polygonControl.handler.setOptions({
                    radius: radius,
                    angle: 0
                });
            }
    
            this.toString = function(){
                //        var geoJSON = new OpenLayers.Format.GeoJSON();
        
                var wkt = new OpenLayers.Format.WKT();
                var features = this.polygonLayer.features;
                //      var geoJSONText = '';
                //        var collection = new OpenLayers.Geometry.Collection();
                //        collection.addComponents(features);
                /*        if(features.length>0){
            geoJSONText.write(collection);
            alert(geoJSONText);
        }*/
                return wkt.write(features);
            };
    
            this.loadFromString = function(str){
                var wkt = new OpenLayers.Format.WKT();
                this.polygonLayer.addFeatures(wkt.read(str));
            //        var geometry = geoJSON.read(geoJSONText, 'Geometry');
            }
    
            this.clear = function(){
                this.polygonLayer.removeAllFeatures();
            }
    
        };

        return Mapper;

    });




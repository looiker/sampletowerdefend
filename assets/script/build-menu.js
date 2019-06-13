import global from './global';

cc.Class({
    extends: cc.Component,

    properties: {
 
    },

 

    onLoad: function()
    {},
    buttonClick:function(event,coustomData)
    {
        cc.log("button click" + coustomData);
        global.event.fire("build_tower",coustomData);
    },


   
   
});

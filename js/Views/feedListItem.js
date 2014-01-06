/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.FeedsListItemView = Backbone.View.extend({

	tagName: "li",

	//define multiple templates to render them depending of tab type
	templatejson: _.template($("#tpl-json-feed-list-item").html()),
	templaterss: _.template($("#tpl-rss-feed-list-item").html()),
	templatefile: _.template($("#tpl-file-feed-list-item").html()),

	initialize: function(options){
		//while constructing chose template according to passed options
		this.template = this['template' + options.type];
		this.type = options.type;
	},

	render: function (){
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}
});



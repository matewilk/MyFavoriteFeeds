/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.FeedsListView = Backbone.View.extend({

	tagName: 'ul',

	initialize: function(options){
		//get type of tab passed from model to chose proper templete
		this.type = options.type;
		this.model.bind("reset", this.render, this);
	},

	render: function(eventName){
		var self = this;
		_.each(this.model.models, function(tab){
			$(this.el).append(new app.FeedsListItemView({model: tab, type: self.type}).render().el) //<<---pass type to feedListItemView to select template
		},this);
		return this;
	}
});



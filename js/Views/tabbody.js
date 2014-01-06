/**
 * Created with JetBrains WebStorm.
 * User: Wolfie-Home
 * Date: 06.05.13
 * Time: 19:00
 * To change this template use File | Settings | File Templates.
 */

//js/views/tabbody.js

var app = app || {};

app.TabBodyView = Backbone.View.extend({

	tagName: "div",

	template: _.template($('#item-body-template').html()),

	events: {

	},

	initialize: function(){
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.toggleVisible);
		this.toggleVisible();
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	//hidding and showing tabbody according to isActive property from model
	toggleVisible: function(){
		this.$el.toggleClass('hidden', !this.model.isActive());
	}
});
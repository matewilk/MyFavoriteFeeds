/**
 * Created with JetBrains WebStorm.
 * User: Wolfie-Home
 * Date: 05.05.13
 * Time: 22:40
 * To change this template use File | Settings | File Templates.
 */

//js/views/tab.js

var app = app || {}

app.TabView = Backbone.View.extend({

	tagName: 'li',

	template: _.template($('#item-template').html()),

	//events on activate and destroy
	events: {
		'click .destroy': 'clear',
		'click': 'activate'
	},

	initialize: function(){
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'visible', this.setActiveCssClass);
		//initialize all tabs with inactive css class
		this.$el.addClass('inactive');
	},

	//initial render of tab - render model to html and add proper css class to active tab
	//append TabBodyView as subview
	//also create view property of model which store this view to use after feeds success load
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		this.subview = new app.TabBodyView({model: this.model});
		this.$el.append(this.subview);
		this.model.view = this;
		if(this.model.get('active')){
			this.$el.removeClass('inactive').addClass('active');
		}
		return this;
	},

	//destroy model on click element with .destroy class
	clear: function(e){
		e.preventDefault();
		this.model.destroy();
		e.stopPropagation();
	},

	//activation of tab, setting model property according to toggleIsActive method from model
	activate: function(e){
		this.model.set('active', this.model.toggleIsActive());
		this.model.loadContent(this.model);
	},

	//self explonatory
	setActiveCssClass: function(){
		this.$el.toggleClass('active', this.model.isActive());
		this.$el.toggleClass('inactive', !this.model.isActive());
	}
});
/**
 * Created with JetBrains WebStorm.
 * User: Wolfie-Home
 * Date: 05.05.13
 * Time: 22:32
 * To change this template use File | Settings | File Templates.
 */

//js/views/app.js

app.AppView = Backbone.View.extend({

	el: '#app-main',

	events: {
		'click #add-tab-btn': 'createTab'
	},

	initialize: function(){
		this.$input = this.$("#tab-name");
		this.$type = this.$("#tab-type");
		this.$url = this.$("#feed-url");
		this.listenTo(app.Tabs, 'add', this.addTab);
		this.listenTo(app.Tabs, 'change:active', this.setActive);

		app.Tabs.fetch();
	},

        //method invoked when the add tab button is clicked
	addTab: function(tab){
		console.log('add tab');
		var tabView = new app.TabView({model: tab});
		$('#tabs-list').append(tabView.render().el);

		tab.loadContent(tab);
	},

	createTab: function(){
		console.log('create tab');
		//validate input fields
		if(this.$type.val() !== "" && this.$input.val() !== ""){
                    var tab = app.Tabs.create({
                            title: this.$input.val().trim(),
                            type: this.$type.val().trim(),
                            url: this.$url.val().trim()
                    });
                    tab.toggleIsActive();
                    this.$input.val('');
		}
		
		tab.loadContent(tab);
	},

	setActive: function(tab){
		tab.trigger('visible');
	}
});
/**
 * Created with JetBrains WebStorm.
 * User: Wolfie-Home
 * Date: 05.05.13
 * Time: 22:27
 * To change this template use File | Settings | File Templates.
 */

//js/models/tab.js

var app = app || {}

app.Tab = Backbone.Model.extend({
	defaults: {
		title: 'default title',
		type: '',
		content: '',
		url: '',
		no: 5,
		active: false
	},

	//dynamic url for each tab
	url: function(){
		return this.get('url');
	},

	//loads feeds from the given url; appending needed views to tabbody after loading content from url
	loadContent: function(tab){
		console.log('load content')
		var url = this.url();
		//simple factory method that retrieves collection instance based on feed type
		this.contentCollection = app.TabsContent.instance.get(this.get('type'), url);
		var self = this;
		//$('#loader').show();
		this.contentCollection.fetch({
			error: function () {
				alert("error!!");
			},
			success: function () {
				console.log('load content success')
				self.feedsListView = new app.FeedsListView({model: self.contentCollection, type: tab.get('type')});
				$('#tabs-content').append($(tab.view.subview.el).html(self.feedsListView.render().el));
			}
		})
//			.complete(function () {
//			//$('#loader').hide();
//		});
	},

	//sets model property and returns it, to determine if tab or tabbody should be active
	//also deactivating others
	toggleIsActive: function(){
		app.Tabs.each(function(item){
			if(item == this){
				this.save({active: true});
			} else {
				item.save({active: false});
			}
		}, this);
		return this.isActive();
	},

	isActive: function(){
		var active = this.get('active');
		return active;
	}
});
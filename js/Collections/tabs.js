/**
 * Created with JetBrains WebStorm.
 * User: Wolfie-Home
 * Date: 05.05.13
 * Time: 22:29
 * To change this template use File | Settings | File Templates.
 */

//js/collections/tabs.js

var app = app || {}

var TabList = Backbone.Collection.extend({

	model: app.Tab,

	localStorage: new Backbone.LocalStorage('tab-list')
});

app.Tabs = new TabList();
/**
 * Created with JetBrains WebStorm.
 * User: Wolfie-Home
 * Date: 07.05.13
 * Time: 16:06
 * To change this template use File | Settings | File Templates.
 */

//js/Collections/tabscontent.js

var app = app || {};

app.TabsContent = Backbone.Collection.extend({
	model: app.TabContent,

	parse: function(response) {
		return response;
	}
});

//factory method to get proper instance
app.TabsContent.instance = (function(){
	
	var objInstances = {};
	
	 return {
        "get": function(name, url) {

            if (!objInstances[name])
            {
                objInstances[name] = new app.TabsContent[name]([],{url: url});
            }

            return objInstances[name];
        }
    };
	
})();

app.TabsContent.json = app.TabsContent.extend({

	initialize: function(){
		//names of months are incorrect as
		//json feed returns that
		this.months = ['Januar',
			'Februar',
			'Mars',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
	},

	sync: function(method, model, options) {
		var that = this;
		var params = _.extend({
			type: 'GET',
			dataType: 'jsonp',
			url: that.url,
			processData: false
		}, options);

		return $.ajax(params);
		
	},

	//sort result by datetime
	comparator: function(item){
		//extract date from model
		var date = item.get('date');
		//extract month string from date
		var month = item.get('date').match(/( .*? )/g);
		//trim month string
		var trimMonth = month[0].replace(/^\s+|\s+$/g, '');
		//replace month string with number from months array and create new string
		var newDate = date.replace(trimMonth, this.months.indexOf(trimMonth));
		//create javascript date from string
		var jsDate = new Date(newDate + ' ' + item.get('time'));
		//return to sort by time
		return -jsDate.getTime();
	}
});

app.TabsContent.rss = app.TabsContent.extend({

	parse: function(response) {
		return response.responseData.feed.entries;
	},

	sync: function(method, model, options) {
		var that = this;

		var params = _.extend({
			type: 'GET',
			dataType: 'jsonp',
			//use of external api to parse rss feed
			url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+that.url+"&num=100",
			processData: false
		}, options);

		return $.ajax(params);
	},

	//sort result by publish date
	comparator: function(item){
		var jsDate = new Date(item.get('publishedDate'));
		return -jsDate.getTime();
	}
});

app.TabsContent.file = app.TabsContent.extend({

	parse: function(response){
		var data = [];
		//cut file into lines
        var lines = response.split("\n");
		var ipCount = {};
		var fileCount = {};
		
		for(var i = 0; i < lines.length; i++){
			if(lines[i].length > 1){
				//extract all needed data from line 
				var regex = /([(\d\.)]+) - - \[(.*?)\] "(.*?)" (\d+) (\d+) "(.*?)" "(.*?)"/;
				var regResp = regex.exec(lines[i]);
				//create variables with data from line
				var path = regResp[3];
				var traffic = regResp[5];
				var host = new RegExp(/http?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i).exec(path)[0];
				//extract filename from url
				var file = new RegExp( /([^/]*) HTTP/g ).exec(path)[1];
				file.replace(/(\?.*$)|(\&.*$)/,"");
				file = file.split(";").pop();

				data = this.addDataRecord(data, host, traffic, file)
				
				
			}
		}

		//sort by traffic
		data.sort(this.sortByTraffic);
		//splice to only five items
		data.splice(5);
		
		this.sortAndSpliceFiles(data);
		
		
		
		return data;
	},

	addDataRecord: function(data, host, traffic, file){
		//check if record object is already in data array
		var result = $.grep(data, function(element){ return element.host === host});

		//if not than add one
		if(result.length === 0){
			var files = {};
			files[file] = 1;
			data.push({
				host: host,
				traffic: parseInt(traffic),
				files: files
			});
			return data;
		//else if it is one, update its attributes
		} else if (result.length === 1){
			result[0].traffic += parseInt(traffic);
			if(file !== "")
				result[0].files[file] = result[0].files[file] ? result[0].files[file]+1 : 1
		} else {
			//just checking if there is no error
			console.log('multiple items found');
		}

		return data;
	},
	
	//sort function to sort result by ip occurrences
	sortByTraffic: function(a, b){
		if(a.traffic < b.traffic)
			return 1;
		if(a.traffic > b.traffic)
			return -1;
		return 0;
	},
	
	//sort and splice files names and occurrences count
	sortAndSpliceFiles: function(data){
		$.each(data, function(index, item){
			var sortable = [];
			for (var file in item.files)
				sortable.push([file, item.files[file]]);
			
			sortable.sort(function(a, b) {return b[1] - a[1]});
			sortable.splice(5);
			
			var files = {}
			$.each(sortable, function(index, item){
				files[item[0]] = item[1];	
			});
			item.files = files;
		});
	},
	
	sync: function(method, model, options){
		var that = this;
		var params = _.extend({
			method: 'POST',
			url: that.url
		}, options);
		
		return $.ajax(params);
	},
	
	comparator: function(item){
		return item.get('title');
	}

})
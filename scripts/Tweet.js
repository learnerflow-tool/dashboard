function Tweet(id, text, author, date, sect_id , category, location, section_title, comment, target_uri) {
	this.text = text;
	this.author = author;
	this.id = id;
	this.date = date;
	this.sect_id = sect_id;
	this.category = category;
	this.location = location;
	this.section_title = section_title;
	this.comment = comment;
	this.target_uri = target_uri;
}

/**
 * Method to wrap a tweet json object. 
 * @param tweet
 * @returns
 */
Tweet.prototype.wrap = function(tweet) {
	this.text = tweet.text;
	this.author = tweet.author;
	this.id = tweet.tweet_id;
	this.date = tweet.tweet_date;
	this.sect_id = tweet.topicid;
	this.category = tweet.type;
	this.location = tweet.location;
	this.section_title = tweet.sect_Title;
	this.comment = tweet.comment;
	this.target_uri = tweet.target_uri;
}


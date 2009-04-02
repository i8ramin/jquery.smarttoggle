/*
 * Custom jQuery event mousenear
 * Works be defining a proximity around any dom element
 *
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 */
(function($) {

$.fn.extend({
	mousenear: function(f, settings) {
		settings = $.extend({
			trigger: 'top,right,bottom,left',
			proximity: 50
		}, settings || {});
		
		return this.each(function() {
			var self = $(this),
					pageX, pageY,
					topTrigger, rightTrigger, bottomTrigger, leftTrigger;
					
			self.bind('mousenear', f, settings);
			
			$(document).mousemove(function(e) {
				pageX = e.pageX; pageY = e.pageY;

				topTrigger = Math.round(self.offset().top);
				rightTrigger = Math.round(self.offset().left) + self.outerWidth();
				bottomTrigger = Math.round(self.offset().top) + self.outerHeight();
				leftTrigger = Math.round(self.offset().left);

				var hotspots = { 
					top: pageY > (topTrigger - settings.proximity) && pageY <= topTrigger && pageX >= leftTrigger && pageX <= rightTrigger,
					right: pageX <= (rightTrigger + settings.proximity) && pageX > rightTrigger && pageY >= topTrigger && pageY <= bottomTrigger,
					bottom: pageY <= (bottomTrigger + settings.proximity) && pageY > bottomTrigger && pageX >= leftTrigger && pageX <= rightTrigger,
					left: pageX > (leftTrigger - settings.proximity) && pageX <= leftTrigger && pageY >= topTrigger && pageY <= bottomTrigger
				};

				$.each(settings.trigger.split(','), function(i, v) {
					if(hotspots[v]) { f.apply(self, [e, settings]); return false; }
				});
			});
		});
	}
});

/*global jQuery */
})(jQuery);
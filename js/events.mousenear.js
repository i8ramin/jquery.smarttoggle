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

jQuery.event.special.mousenear = {
	setup: function(data, namespaces) {
		jQuery(document).bind('mousemove', { elem: this, settings: data }, jQuery.event.special.mousenear.handler);
	},
	teardown: function(namespaces) {
		jQuery(document).unbind('mousemove', jQuery.event.special.mousenear.handler);
	},
	handler: function(event) {
		var $elem = jQuery(event.data.elem),
				settings = event.data.settings,
				args = arguments,
				pageX, pageY,
				topTrigger, rightTrigger, bottomTrigger, leftTrigger;
		
		settings = $.extend({
			trigger: 'top,right,bottom,left',
			proximity: 50
		}, settings || {});
		
		pageX = event.pageX; pageY = event.pageY;
		
		topTrigger = Math.round($elem.offset().top);
		rightTrigger = Math.round($elem.offset().left) + $elem.outerWidth();
		bottomTrigger = Math.round($elem.offset().top) + $elem.outerHeight();
		leftTrigger = Math.round($elem.offset().left);
		
		var hotspots = { 
			top: pageY > (topTrigger - settings.proximity) && pageY <= topTrigger && pageX >= leftTrigger && pageX <= rightTrigger,
			right: pageX <= (rightTrigger + settings.proximity) && pageX > rightTrigger && pageY >= topTrigger && pageY <= bottomTrigger,
			bottom: pageY <= (bottomTrigger + settings.proximity) && pageY > bottomTrigger && pageX >= leftTrigger && pageX <= rightTrigger,
			left: pageX > (leftTrigger - settings.proximity) && pageX <= leftTrigger && pageY >= topTrigger && pageY <= bottomTrigger
		};
		
		// set event type to "mousenear"
		event.type = "mousenear";
		
		$.each(settings.trigger.split(','), function(i, v) {
			// let jQuery handle the triggering of "mousenear" event handlers
			if(hotspots[v]) { jQuery.event.handle.apply($elem[0], args); return false; }
		});
	}
};

/*global jQuery */
})(jQuery);
/*
 * Custom jQuery event mousenear
 * Works be defining a proximity around any dom element
 *
 * KNOWN LIMITATION: You can only define this one time on the page. Binding mousenear
 *              again will override the previous one.
 *
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 */
(function($) {
/*global jQuery, document */

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
				pageX, pageY, prevCoords = $elem.data('prevCoords') || {},
				topTrigger, rightTrigger, bottomTrigger, leftTrigger;
		
		settings = $.extend({
			trigger: 'top,right,bottom,left',
			proximity: 50,
			directional: false
		}, settings || {});
		
		pageX = event.pageX; pageY = event.pageY;
		
		$elem.data('prevCoords', { x:pageX, y:pageY });
		
		topTrigger = Math.round($elem.offset().top);
		rightTrigger = Math.round($elem.offset().left) + $elem.outerWidth();
		bottomTrigger = Math.round($elem.offset().top) + $elem.outerHeight();
		leftTrigger = Math.round($elem.offset().left);
		
		var hotspots = { 
			top: (settings.directional ? (prevCoords.y < pageY) : true) && pageY > (topTrigger - settings.proximity) && pageY <= topTrigger && pageX >= leftTrigger && pageX <= rightTrigger,
			right: (settings.directional ? (prevCoords.x > pageX) : true) && pageX <= (rightTrigger + settings.proximity) && pageX > rightTrigger && pageY >= topTrigger && pageY <= bottomTrigger,
			bottom: (settings.directional ? (prevCoords.y > pageY) : true) && pageY <= (bottomTrigger + settings.proximity) && pageY > bottomTrigger && pageX >= leftTrigger && pageX <= rightTrigger,
			left: (settings.directional ? (prevCoords.x < pageX) : true) && pageX > (leftTrigger - settings.proximity) && pageX <= leftTrigger && pageY >= topTrigger && pageY <= bottomTrigger
		};
		
		// set event type to "mousenear"
		event.type = "mousenear";
		
		$.each(settings.trigger.split(','), function(i, v) {
			if(hotspots[v]) { jQuery.event.handle.apply($elem[0], args); return false; }
		});
	}
};

})(jQuery);
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

var mousenearCount = 0;

$.event.special.mousenear = {
	setup: function(data, namespaces) {
		var elem = this, $elem = $(this);
		
		$elem.data('mousenearCount', ++mousenearCount);
		$(document).bind('mousemove.mousenear-' + $elem.data('mousenearCount'), function(e) {
			var settings = data,
					args = arguments,
					pageX = e.pageX, pageY = e.pageY, prevCoords = $elem.data('prevCoords') || {},
					triggers = {}, hotspots = {}, limits = {};

			settings = $.extend({
				trigger: 'top,right,bottom,left',
				proximity: 50,
				directional: false,
				mousenearleave: false
			}, settings || {});
			
			$elem.data('prevCoords', { x:pageX, y:pageY });
			
			triggers = $.event.special.mousenear._defineTriggers($elem);
			hotspots = $.event.special.mousenear._defineHotspots($elem, settings, triggers, prevCoords, pageX, pageY);
			limits = $.event.special.mousenear._defineLimits(triggers, pageX, pageY);
			
			e.type = 'mousenear';
			$.each(settings.trigger.split(','), function(i, v) {
				e.proximity = 1 - (limits[v] / settings.proximity);
				if(hotspots[v]) {
					$elem.data('mousenearActive', true);
					$.event.handle.apply(elem, args);
					return false;
				} else {
					if(elem !== e.target && settings.mousenearleave && $.isFunction(settings.mousenearleave) && $elem.data('mousenearActive')) {
						$elem.data('mousenearActive', false);
						settings.mousenearleave.apply(elem, args);
					}
				}
			});
		});
	},
	teardown: function(namespaces) {
		var elem = this, $elem = $(this);
		$(document).unbind('mousemove.mousenear-' + $elem.data('mousenearCount'));
	},
	_defineHotspots: function(elem, settings, triggers, prevCoords, pageX, pageY) {
		return { 
			top: (settings.directional ? (prevCoords.y < pageY) : true) && pageY >= (triggers.top - settings.proximity) && pageY <= triggers.top && pageX >= triggers.left && pageX <= triggers.right,
			right: (settings.directional ? (prevCoords.x > pageX) : true) && pageX <= (triggers.right + settings.proximity) && pageX >= triggers.right && pageY >= triggers.top && pageY <= triggers.bottom,
			bottom: (settings.directional ? (prevCoords.y > pageY) : true) && pageY <= (triggers.bottom + settings.proximity) && pageY >= triggers.bottom && pageX >= triggers.left && pageX <= triggers.right,
			left: (settings.directional ? (prevCoords.x < pageX) : true) && pageX >= (triggers.left - settings.proximity) && pageX <= triggers.left && pageY >= triggers.top && pageY <= triggers.bottom
		};
	},
	_defineTriggers: function(elem) {
		return {
			top: Math.round(elem.offset().top),
			right: Math.round(elem.offset().left) + elem.outerWidth(),
			bottom: Math.round(elem.offset().top) + elem.outerHeight(),
			left: Math.round(elem.offset().left)
		}
	},
	_defineLimits: function(triggers, pageX, pageY) {
		return {
			top: Math.abs(pageY - triggers.top),
			right: Math.abs(pageX - triggers.right),
			bottom: Math.abs(pageY - triggers.bottom),
			left: Math.abs(pageX - triggers.left)
		}
	}
};

$.fn.mousenear = function(fn, opts) {
	opts = opts || {};
	return fn ? this.bind('mousenear', opts, fn) : this.trigger('mousenear');
};

$.fn.hovernear = function(fnOver, fnOut, opts) {
	opts = $.extend({
		mousenearleave: fnOut
	}, opts || {});
	return this.bind('mousenear', opts, fnOver);
};


})(jQuery);
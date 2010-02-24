/*
 * Special blur event that can be applied to just about
 * any element.
 *
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 */
(function($) {
/*global jQuery, document */

var blurCount = 0;

$.event.special.blurany = {
	setup: function(data, namespaces) {
		var elem = this, $elem = $(this);
		
		$elem.data('blurcount', ++blurCount);
		$(document).bind('click.blur-' + $elem.data('blurcount'), function(e) {			
			if(elem !== e.target && elem !== e.target.offsetParent && $.inArray(elem, $(e.target).parents()) == -1) {
				e.type = 'blurany';
				$.event.handle.apply(elem, arguments);
			}
		});
	},
	teardown: function(namespaces) {
		var elem = this, $elem = $(this);
		$(document).unbind('click.blur-' + $elem.data('blurcount'));
	}
};

$.fn.blurany = function(fn) {
	return fn ? this.bind('blurany', fn) : this.trigger('blurany');
};

})(jQuery);
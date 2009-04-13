/*
 * Smart Toggle 1.0
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 *  effects.core.js
 */
(function($) {
/*global jQuery, document, setTimeout, clearTimeout, handleBlur, isOpen */

$.fn.smarttoggle = function() {
	var self = this,
			options = $.extend({
				toggler: $('.ui-toggle', this),
				content: $('.ui-content', this),
				blur: true,
				easing: 'easeOutBounce',
				direction: 'up',
			  duration: 1000
			}, arguments[1] || {}),
			args = this._normalizeArguments(arguments, options, 'toggle');
			
	return this.each(function() {
		options.toggler.bind('click', function() {
			options.content.toggle.apply(options.content, args);
		})._disableSelection();
		
		if(options.blur) {
			handleBlur(options, args);
		}
	});
};

function isOpen(el) {
	return !$(el).is(':hidden');
}

function handleBlur(options, args) {
	var el = options.content;
	$(document).bind('click.smarttoggle', function(e) {
		if(isOpen(el) && !(options.toggler == e.target || el[0] == e.target || $.inArray(el[0], $.makeArray($(e.target).parents())) != -1)) {
			el.toggle.apply(el, args);
		}
  });
}

//Extend the methods of jQuery
$.fn.extend({
	//Save old methods
	_effect: $.fn.effect,
	
	effect: function(fx, options, speed, callback) {
		// make this thing a bit smarter
		if(this.data('isBusy')) { return; }
		this.data('isBusy', true);
		
		var self = this,
				origCallback = callback;
				
		callback = function() {
			self.data('isBusy', false);
			if($.isFunction(origCallback)) { origCallback.apply(this, arguments); }
		};
		return this._effect.apply(this, arguments);
	},
	_disableSelection: function() {
		return this
			.attr('unselectable', 'on')
			.css('MozUserSelect', 'none')
			.bind('selectstart.ui', function() { return false; });
	},
	_normalizeArguments: function(a, o, m) {
		//either comes from options.duration or the secon/third argument
		var speed = a[1] && a[1].constructor != Object ? a[1] : (o.duration ? o.duration : a[2]),
				callback = o.callback || ( $.isFunction(a[1]) && a[1] ) || ( $.isFunction(a[2]) && a[2] ) || ( $.isFunction(a[3]) && a[3] );
		speed = $.fx.off ? 0 : typeof speed === "number" ? speed : $.fx.speeds[speed] || $.fx.speeds._default;		
		if(m) { o.mode = m; }
		return [a[0], o, speed, callback];
	}
});

})(jQuery);
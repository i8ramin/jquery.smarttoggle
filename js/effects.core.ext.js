/*
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 */
(function($) {

$.fn.extend({
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
	_normalizeArguments: function(a, o) {
		var speed = a[1] && a[1].constructor != Object ? a[1] : (o.duration ? o.duration : a[2]),
				callback = o.callback || ( $.isFunction(a[1]) && a[1] ) || ( $.isFunction(a[2]) && a[2] ) || ( $.isFunction(a[3]) && a[3] );
		speed = $.fx.off ? 0 : typeof speed === "number" ? speed : $.fx.speeds[speed] || $.fx.speeds._default;		
		return [a[0], o, speed, callback];
	},
	_isOpen: function() {
		return !this.is(':hidden');
	}
});

})(jQuery);
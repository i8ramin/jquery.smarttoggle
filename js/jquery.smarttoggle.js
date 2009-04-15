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

var smarttoggleCount = 0;

$.fn.smarttoggle = function() {
	var args = arguments,
			self = this;
			
	return this.each(function() {
		var me = $(this),
				toggler = $('.ui-toggle', this),
				content = $('.ui-content', this),
				mode = self._setMode(content),
				options = $.extend({
					toggler: toggler,
					content: content,
					steps: $('.step', this),
					contentHidden: true,
					mode: mode,
					blur: true,
					easing: 'easeOutBounce',
					direction: 'up',
				  duration: 1000
				}, args[1] || {});
		args = self._normalizeArguments(args, options);

		// it helps to implicitly set the width when direction = 'left' or 'right'
		// and we are floating things. for example for menus
		if(options.direction == 'left' || options.direction == 'right') {
			content.width(content.outerWidth());
		}
		// should we hide the content area on load? important to do this
		// after we get/set the width
		if(options.contentHidden) { 
			if(options.steps.length > 0) {
				options.steps.each(function() {
					var step = $(this);
					step.data('width', step.outerWidth());
				});
			}
			content.hide(); 
		}
		
		if(options.blur) {
			me.data('smarttoggleCount', smarttoggleCount++);
			handleBlur(me, options, args);
		}
		
		toggler.bind('click', function() {
			if(options.steps.length > 0) {
				console.log(options.steps.eq(0).data('width'));
			}
			
			content.toggle.apply(content, args);
			if(options.blur) {
				handleBlur(me, options, args);
			}
		})._disableSelection();
	});
};

function isOpen(el) {
	return !$(el).is(':hidden');
}

function handleBlur(me, options, args) {
	var content = options.content,
			count = me.data('smarttoggleCount');
			
	$(document).bind('click.smarttoggle-' + count, function(e) {
		if(isOpen(content) && !(options.toggler[0] == e.target || content[0] == e.target || $.inArray(content[0], $.makeArray($(e.target).parents())) != -1)) {
			content.toggle.apply(content, args);
			$(document).unbind('click.smarttoggle-' + count);
		}
		return false;
  });
}

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
	_setMode: function(el) {
		return el.is(':hidden') ? 'show' : 'hide';
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
	}
});


})(jQuery);
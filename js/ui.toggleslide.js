/*
 * ToggleSlide 1.0
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 *	ui.core.js
 *  effects.core.js
 */
(function($) {

var ToggleSlide = {
  _init: function() {
    var self = this,
        options = this.options,
				direction = this.options.direction || 'up',
				ref = (direction == 'up' || direction == 'down') ? 'marginTop' : 'marginLeft';

    if(this.options.disabled) {
      this.element.addClass('ui-disabled');
      return false;
    }

    this.uiToggle = $(options.toggle, this.element).disableSelection();
    this.uiContent = $(options.content, this.element);
    
    this._isBusy = false;
    this._isOpen = options.closeOnLoad || !options.contentHidden;

		this.element.css({overflow: 'hidden'});
    
    if(options.closeOnLoad) {
      this._uiClose();
    } else {
			if(options.contentHidden) {
				if(options.effectType == 'slide2') {
					this.uiContent.css(
						ref, -(ref == 'marginTop' ? this.uiContent.outerHeight() : this.uiContent.outerWidth())
					);
				}
				this.uiContent.hide();
				this._isOpen = false;
			}
		}
    
    if(options.toggleEvent === 'hover') {
      this.uiToggle.bind('mouseover', function(e, data) {
        self._uiOpen(e, data);
      });
    } else {        
      this.uiToggle.bind(options.toggleEvent, function(e, data) {
          if(self._isOpen) { self._uiClose(e, data); } else { self._uiOpen(e, data); }
      });
    }
    
    if(options.closeOnLeave || options.toggleEvent === 'hover') {
      this.element.hover(
        function(e, data) {
					/*global clearTimeout */
          if(self.uiCloseTimeout) { clearTimeout(self.uiCloseTimeout); }
        },
        function(e, data) {
          self._uiClose(e, data);
        }
      );
    }
    
    this.element.bind('open.toggleslide', function(e, data) {
      self._uiOpen(e, data);
    });
    
    this.element.bind('close.toggleslide', function(e, data) {
      self._uiClose(e, data);
    });
  },
  destroy: function() {
    if(!this.element.data('toggleslide')) { return; }
		
    this.element
      .removeData("toggleslide")
      .unbind(".toggleslide");
  },
  _uiOpen: function(e, data) {
    var me = this, o = this.options;
    
    if(me._isBusy || me._isOpen || o.disabled) { return false; }
    
    me._isBusy = true;
    me._trigger('openStart', e, me);
		/*global setTimeout */
    me.uiOpenTimeout = setTimeout(function() {
      me.uiContent.show(o.effectType, { direction: o.direction, mode: 'show', easing: o.easing }, o.speed, function() {
        me._isOpen = !(me._isBusy = false);
        me._trigger('openStop', e, me);
         
        if(o.closeOnBlur) {
					/*global document */
          $(document).bind('click.toggleslide', function(e, data) {
            $(this).unbind('click.toggleslide');
            me._uiClose(e, data);
          });
        }
      });
    }, data || 0);
  },
  _uiClose: function(e, data) {
    var me = this, o = this.options;
    /*global setTimeout */
    me.uiCloseTimeout = setTimeout(function() {
      if(me._isOpen && !me._isBusy) {
        me._isBusy = true;
        me._trigger('closeStart', e, me);
        
        me.uiContent.hide(o.effectType, { direction: o.direction, mode: 'hide', easing: o.easing }, o.speed, function() {
          me._isOpen = me._isBusy = false;
          me._trigger('closeStop', e, me);
        });
      }
    }, data || (e && /click/.test(e.type) ? 0 : o.closeDelay));
  },
  _trigger: function(type, e, ui) {
		return $.widget.prototype._trigger.call(this, type, e, ui);
	}
};


$.widget("ui.toggleslide", ToggleSlide);
$.ui.toggleslide.defaults = {
  wrapper: '.ui-toggleslide',
  content: '.ui-content',
  toggle: '.ui-toggle',
  toggleEvent: 'hover',
	contentHidden: true,
  closeOnLoad: false,
  closeOnLeave: false,
  closeOnBlur: false,
  closeDelay: 500,
  direction: 'up',
  easing: 'swing',
  speed: 500,
  effectType: 'slide2'
};

jQuery.fn.extend({
	mousenear: function(fn) {
		var clientX, clientY, pageX, pageY,
				proximity = 30;
		
		return this.each(function() {
			var self = $(this),

					topTrigger = Math.round(self.offset().top),
					rightTrigger = Math.round(self.offset().left + self.outerWidth()),
					bottomTrigger = Math.round(self.offset().top + self.outerHeight()),
					leftTrigger = Math.round(self.offset().left);
					
			$(document).bind('mousemove', function(e) {
				clientX = e.clientX;
				clientY = e.clientY;
				pageX = e.pageX;
				pageY = e.pageY;
				
				topTrigger = Math.round(self.offset().top);
				rightTrigger = Math.round(self.offset().left + self.outerWidth());
				bottomTrigger = Math.round(self.offset().top + self.outerHeight());
				leftTrigger = Math.round(self.offset().left);

				if(pageY <= bottomTrigger + proximity && pageY > bottomTrigger) {
					fn.apply(self);
				}
			});
		});
	}
});

/*global jQuery */
})(jQuery);
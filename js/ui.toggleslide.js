/*
 * SlieMenu 1.0
 *
 * Copyright (c) 2009 Ramin Bozorgzadeh (http://www.getintothis.com)
 *
 * Depends:
 *  jquery-1.3.2.js
 *	ui.core.js
 *  effects.core.js
 *  effects.slide.js
 */
(function($) {
  
var ToggleSlide = {
  _init: function() {
    var self = this,
        options = this.options;

    if(this.options.disabled) {
      this.element.addClass("ui-disabled");
      return false;
    }
        
    this._isBusy = false;
    
    this.uiContent = this.element.find('.' + options.contentClass);
    this.uiToggle = this.element.find('.' + options.toggleClass).disableSelection();
    
    options.hideOnLoad && this.uiContent.hide();
    
    this._isOpen = this.uiContent.css('display') === 'block';
    
    if(options.toggleEvent === 'hover') {
      this.uiToggle.bind('mouseover', function(e, data) {
        self._uiOpen(e, data);
      });
    } else {        
      this.uiToggle.bind(options.toggleEvent, function(e, data) {
          self._isOpen ? self._uiClose(e, data) : self._uiOpen(e, data);
      });
    }
    
    if(options.closeOnLeave || options.toggleEvent === 'hover') {
      this.element.hover(
        function(e, data) {
          self.uiCloseTimeout && clearTimeout(self.uiCloseTimeout);
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
		if(!this.element.data('toggleslide')) return;
		
		this.element
			.removeData("toggleslide")
			.unbind(".toggleslide");
	},
  _uiOpen: function(e, data) {
    var me = this, o = this.options;
    
    if(me._isBusy || me._isOpen || o.disabled) return false;
    
    me._isBusy = true;
    me._trigger('openStart', e, me);

    me.uiOpenTimeout = setTimeout(function() {
      me.uiContent.show('slide', { direction: o.direction, easing: o.easing }, o.speed, function() {
        me._isOpen = !(me._isBusy = false);
        me._trigger('openStop', e, me);
      
        if(o.closeOnBlur) {
          $(document).bind('click.toggleslide', function(e) {
            $(this).unbind('click.toggleslide');
            me._uiClose(e);
          });
        }
      });
    }, data || 0);
  },
  _uiClose: function(e, data) {
    var me = this, o = this.options;
    
    me.uiCloseTimeout = setTimeout(function() {
      if(me._isOpen && !me._isBusy) {
        me._isBusy = true;
        me._trigger('closeStart', e, me);
        
        me.uiContent.hide('slide', { direction: o.direction, easing: o.easing }, o.speed, function() {
          me._isOpen = me._isBusy = false;
          me._trigger('closeStop', e, me);
        });
      }
    }, data || (e && /click/.test(e.type) ? 0 : o.closeDelay));
  },
  _trigger: function(type, e, ui) {
		return $.widget.prototype._trigger.call(this, type, e, ui);
	},
};


$.widget("ui.toggleslide", ToggleSlide);
$.ui.toggleslide.defaults = {
  wrapperClass: 'ui-toggleslide',
  contentClass: 'ui-content',
  toggleClass: 'ui-toggle',
  toggleEvent: 'hover',
  hideOnLoad: true,
  closeOnLeave: true,
  closeOnBlur: false,
  closeDelay: 500,
  direction: 'up',
  easing: 'swing',
  speed: 500
};

})(jQuery);
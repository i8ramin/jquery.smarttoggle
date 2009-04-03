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

var SmartToggle = {
  _init: function() {
    var self = this,
        options = this.options,
				vAttr = 'marginTop',
				hAttr = 'marginLeft',
				direction = this.options.direction || 'up',
				ref = (direction == 'up' || direction == 'down') ? vAttr : hAttr;

		$(this.element).css({overflow: 'hidden'});

    this.uiToggle = $(options.toggle, this.element).disableSelection();
    this.uiContent = $(options.content, this.element);
    
    this._isBusy = false;
    this._isOpen = options.closeOnLoad || !options.contentHidden;

		if(options.adjustToggleHeight) {
			this.uiToggle.height(this.element.outerHeight());
		}

    if(options.closeOnLoad) {
      this._uiClose();
    } else {
			if(options.contentHidden) {
				if(options.effectType == 'slide2') {
					this.uiContent.css(
						ref, -(ref == vAttr ? this.uiContent.outerHeight() : this.uiContent.outerWidth())
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
      this.uiToggle.add(this.uiContent).hover(
        function(e, data) {
					/*global clearTimeout */
          if(self.uiCloseTimeout) { clearTimeout(self.uiCloseTimeout); }
        },
        function(e, data) {
          self._uiClose(e, data);
        }
      );
    }
    
    this.element.bind('open.smarttoggle', function(e, data) {
      self._uiOpen(e, data);
    });
    
    this.element.bind('close.smarttoggle', function(e, data) {
      self._uiClose(e, data);
    });
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
          $(document).bind('click.smarttoggle', function(e, data) {
            $(this).unbind('click.smarttoggle');
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


$.widget("ui.smarttoggle", SmartToggle);
$.ui.smarttoggle.defaults = {
  wrapper: '.ui-smarttoggle',
  content: '.ui-content',
  toggle: '.ui-toggle',
  toggleEvent: 'hover',
	adjustToggleHeight: false,
	contentHidden: true,
  closeOnLoad: false,
  closeOnLeave: true,
  closeOnBlur: true,
  closeDelay: 500,
  direction: 'up',
  easing: 'swing',
  speed: 500,
  effectType: 'slide2'
};


/*global jQuery */
})(jQuery);
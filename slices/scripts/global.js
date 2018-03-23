/*
** @name: script.js
** @type: custom javascript/jQuery code
*/

/** 
* Cache DOM elements(nodes) into jQuery objects
* Declare define global variables
*/

var winResizer = null;
var winDelay = 10;
var $dom = $('html, body');
var $header = $('#mastHead');
var $footer = $('#colophon');

var headerHeight = $header.outerHeight();

// Passing parameters to self invoking functions as an alias to "window", "document", "body" and "jQuery" objects
;(function(w, d, $, undefined) {
	// == Use strict
	"use strict";

	/** !
	* Add classes to page body when DOM and window is ready
	*/

	$(function() {
		$('body').addClass('content-loaded');
		// $header.css({visibility: 'visible'});
	});

	w.onload = function() {
		$('body').addClass('page-loaded');
	};

	/**
	 * Sticy header
	 */
	$(w).on('scroll', function() {
		var winScrollPer = $(this).scrollTop();
		if ( winScrollPer >= headerHeight) {
			$header.addClass('header-is-stuck');
		} else {
			$header.removeClass('header-is-stuck');
		}
	});

	/**
	* Add data-user-agent attribute to root of the DOM
	*/

	d.documentElement.setAttribute("data-useragent",  navigator.userAgent);
	d.documentElement.setAttribute("data-platform", navigator.platform );

	/**
	* Add heloper class on DOM element on window resize
	*/
	function activateResizeHandler() {	    
	    var resizeClass = 'resize-active',
	    flag, timer;

	    var removeClassHandler = function() {
	      flag = false;
	      d.documentElement.classList.remove(resizeClass);

	    };

	    var resizeHandler = function() {
	      if(!flag) {
	        flag = true;
	        d.documentElement.classList.add(resizeClass);
	      }
	      clearTimeout(timer);
	      timer = setTimeout(removeClassHandler, 10);
	    };
	    $(w).on('resize orientationchange', resizeHandler);
  	};

  	// == activateResizeHandler code
	activateResizeHandler();

	/**
	* Placeholder script
	*/
	w.placeholderEffect = function(input)  {
	    if($(input).length === 0) return;
	    input.each( function(){
	        var meInput = $(this);
	        var placeHolder = $(meInput).attr('placeholder');
	        $(meInput).focusin(function(){
	            $(meInput).attr('placeholder','');
	        });
	        $(meInput).focusout(function(){
	            $(meInput).attr('placeholder', placeHolder);
	        });
	    });
	}

	w.placeholderEffect($('.form-control'));

	/**
	* Mobile menu
	*/
	$('.navbar-toggler').on('click', function(e) {
		$(this).toggleClass('opened');
		$('body').toggleClass('menu-opened');
		$('.' + $(this).attr('data-target')).toggleClass('shown');
		e.preventDefault();
	});

	/**
	*  == Actions on window resize 
	*/
	$(w).on('resize', function() {
		if(winResizer == null) clearTimeout(winResizer);
		setTimeout(function() {

			// == activateResizeHandler code
			activateResizeHandler();

			// == Update header height
			headerHeight = $header.outerHeight();
		}, winDelay);
	});

})(window, document, jQuery, undefined); // IIFE
(function($){
	$.fn.ATSlider = function(){
		var config, 
		slider = $(this), 
		length=slider.find('> *').length, 
		container,
		current=0, 
		x=0, 
		playTimeout, 
		items,
		dots=false;

		slider.addClass("ATSlider");
		init(arguments);

		function init(args){
			config={
				width : slider.outerWidth(true),
				height : slider.outerHeight(true),
				circle : true,
				buttons : false,
				transition:'slideX',
				speed : 500,
				easing : "swing",
				autoPlay : true,
				hoverStop : true,
				step : 1,
				interval : 3000,
				beforeChange : false,
				afterChange : false,
			};

			$.extend(config,args[0]);

			length=slider.find('> *').length;
			var list= slider.html();
			slider.html('');
			slider.append('<div class="ATContainer"></div>');
			container = slider.find('.ATContainer');
			container.append(list);
			items = container.find("> *");
			items.addClass('ATitem').css({'display':'none'});
			items.eq(0).show(0);
			
			if (!container.find('.current').length){
				for (var i = 0;i<config.step;i++){
					items.eq(i).addClass('current');
				}
			}
			container.find('.current').each(function(index){
				$(this).css({'margin-left' : config.width*index});
			});

			if (config.autoPlay){
				play();
				if (config.hoverStop){
					slider.on('mouseenter', function(){
						stop();
					});
					slider.on('mouseleave', function(){
						play();
					});
				}
			}
			renderButtons();
			resizeListener();
		}

		function resizeListener(){
			$(window).resize(function(){
		        config.width = slider.outerWidth(true);
		        console.log(config.width);
		    });
		}
		function renderButtons(){
			function render (type){
				switch (type){
					case "transparent":
						slider.append('<a class="ATprevTrans ATprev" href="#"></a><a class="ATnextTrans ATnext" href="#"></a>');
						slider.find('.ATprevTrans').on('click',function(e){
							e.preventDefault();
							goPrev();
						});
						slider.find('.ATnextTrans').on('click',function(e){
							e.preventDefault();
							goNext();
						});
					break;
					case "arrows":
						if (!slider.find('.ATprevArrow, .ATnextArrow').length){
							slider.append('<a class="ATprevArrow ATprev" href="#"><</a><a class="ATnextArrow ATnext" href="#">></a>');
						}
						slider.find('.ATprevArrow').on('click',function(e){
							e.preventDefault();
							goPrev();
						});
						slider.find('.ATnextArrow').on('click',function(e){
							e.preventDefault();
							goNext();
						});
					break;
					case "dots":
						slider.append('<div class="ATdots"><div class="ATContainer"></div></div>');
						dots = slider.find(".ATdots .ATContainer");
						for (var i = 0; i<length; i++){
							dots.append('<a href="#" data-slide="'+i+'"></a>');
						}
						slider.find('.ATdots a:first-child').addClass('current');
						dots.find('a').on('click',function(e){
							e.preventDefault();
							go($(this).data('slide'));
						});
				}
			}

			if (config.buttons){
				if (typeof config.buttons==="string"){
					render(config.buttons);
				}
				if (typeof config.buttons==="object"){
					for (var i in config.buttons){
						render(config.buttons[i]);
					}
				}
				if (!config.circle){					
					slider.find('.ATprev').fadeOut(0);
				}
			}
		}

		function play (){
			var interval=next().data('interval')?parseInt(next().data('interval')):config.interval;
	    	playTimeout = setTimeout(function(){goNext();play();}, interval);
	    }
	    function stop(){
	    	clearInterval(playTimeout);
	    }
		function prev(){
			if (arguments.length){
				return items.eq((arguments[0]-config.step+length)%length);
			}
			return items.eq((current-config.step+length)%length);
		}		
		function next(){
			if (arguments.length){
				return items.eq((arguments[0]+config.step+length)%length);
			}
			return items.eq((current+config.step+length)%length);
		}
	   	function goNext (){
			go((current+config.step)%length);
	    }
	    function goPrev (){
			go((current-config.step+length)%length);
	    }
	    function beforeChange(){
	    	if (config.beforeChange){
	    		config.beforeChange();
	    	}
	    }
	    function afterChange(){
	    	if (config.afterChange){
	    		config.afterChange();
	    	}
	    }
		function animate(nextIndex){
			var i, item, direction, currentItems, nextItems, nextItem, transition, speed;
			currentItems = container.find('.current');
			direction=(currentItems.index()<nextIndex?1:-1);
			nextItem = items.eq(nextIndex);
			for (i = 0;i<config.step;i++){
				items.eq((nextIndex+i)%length).addClass('next');
			}
			nextItem.show(0);
			nextItems = container.find('.next');
			transition = items.eq(nextIndex).data('transition')?nextItem.data('transition'):config.transition;
			speed = items.eq(nextIndex).data('speed')?parseInt(nextItem.data('speed')):config.speed;
			currentItems.endTransition=function(){
				$(this).each(function(index){
					$(this).removeClass('current');
				});
			};
			nextItems.endTransition=function(){
				$(this).each(function(index){
					$(this).removeClass('next').addClass('current');
				});
			};
			if (typeof transition=="string"){
				switch (transition){
					case 'slideX':
						currentItems.each(function(index){
							$(this).animate({'margin-left' : direction*(-$(this).outerWidth(true)*(config.step-index))+'px'},speed,config.easing,function(){
								currentItems.endTransition();
							});
						});
						nextItems.each(function(index){
							$(this).css({'margin-left' : direction*(config.width*(index+config.step))});
							$(this).animate({'margin-left' : direction*(config.width*index)+'px'},speed,config.easing,function(){
								afterChange($(this));
								nextItems.endTransition();
							});
						});
					break;
				}
			} else if (typeof transition=="function"){
				transition(currentItems,nextItems,{direction:direction,speed:speed});
			}
			current=nextIndex;
		}
	    function go (item){
	    	if (!items.is(':animated')){
	    		var ant=current;
	    	 	if (config.circle){
	    	 		var der = (length+item-current)%length;
	    	 		var izq = (item-current-length)%length;
		    		var steps=Math.abs(der)<=Math.abs(izq)?der:izq;
					current=(length+item)%length;
				} else {
					current=Math.max(0,Math.min(item,length-1));
					if (x<=0){
						slider.find('.ATprev').fadeIn();
					}
					if (x>=-length){
						slider.find('.ATprev').fadeOut();
					}
					if (x<=container.width()-config.width*length){
						slider.find('.ATnext').fadeOut();
					}
					if (x>container.width()-config.width*length){
						slider.find('.ATnext').fadeIn();
					}
				}
		    	beforeChange();
		    	slider.find('.ATdots a').removeClass('current');
		    	slider.find('.ATdots a').eq((current+length)%length).addClass('current');
		    	animate(item);
			}
	    }

		return {
			config:config,
			go:go,
			next:goNext,
			prev:goPrev,
			play:play,
			stop:stop,
			items:items
		};
	};
}(jQuery));
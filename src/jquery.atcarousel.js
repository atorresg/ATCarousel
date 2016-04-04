(function($){
	$.fn.ATCarousel = function(){
		var config, 
		carousel = $(this), 
		length=carousel.find('> *').length, 
		container,
		current=0, 
		x=0, 
		playTimeout, 
		items,
		dots=false;

		carousel.addClass("ATCarousel");
		init(arguments);

		function init(args){
			config={
				width : carousel.outerWidth(false),
				height : carousel.outerHeight(false),
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

			length=carousel.find('> *').length;
			var list= carousel.html();
			carousel.html('');
			carousel.append('<div class="ATContainer"></div>');
			container = carousel.find('.ATContainer');
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
					carousel.on('mouseenter', function(){
						stop();
					});
					carousel.on('mouseleave', function(){
						play();
					});
				}
			}
			renderButtons();
			resizeListener();
		}
		function update(){
	        config.width = carousel.outerWidth(false);
	        config.height = carousel.outerHeight(false);
		}
		function resizeListener(){
			$(window).resize(function(){
		        update();
		    });
		}
		function renderButtons(){
			function render (type){
				switch (type){
					case "transparent":
						carousel.append('<a class="ATprevTrans ATprev" href="#"></a><a class="ATnextTrans ATnext" href="#"></a>');
						carousel.find('.ATprevTrans').on('click',function(e){
							e.preventDefault();
							goPrev();
						});
						carousel.find('.ATnextTrans').on('click',function(e){
							e.preventDefault();
							goNext();
						});
					break;
					case "arrows":
						if (!carousel.find('.ATprevArrow, .ATnextArrow').length){
							carousel.append('<a class="ATprevArrow ATprev" href="#"><</a><a class="ATnextArrow ATnext" href="#">></a>');
						}
						carousel.find('.ATprevArrow').on('click',function(e){
							e.preventDefault();
							goPrev();
						});
						carousel.find('.ATnextArrow').on('click',function(e){
							e.preventDefault();
							goNext();
						});
					break;
					case "dots":
						carousel.append('<div class="ATdots"><div class="ATContainer"></div></div>');
						dots = carousel.find(".ATdots .ATContainer");
						for (var i = 0; i<length; i++){
							dots.append('<a href="#" data-slide="'+i+'"></a>');
						}
						carousel.find('.ATdots a:first-child').addClass('current');
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
					carousel.find('.ATprev').fadeOut(0);
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

					case 'xFade':
					currentItems.fadeOut(500,function(){
						currentItems.endTransition();
					});
					nextItems.css('display','none').fadeIn(500,function(){
						nextItems.endTransition();
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
						carousel.find('.ATprev').fadeIn();
					}
					if (x>=-length){
						carousel.find('.ATprev').fadeOut();
					}
					if (x<=container.width()-config.width*length){
						carousel.find('.ATnext').fadeOut();
					}
					if (x>container.width()-config.width*length){
						carousel.find('.ATnext').fadeIn();
					}
				}
		    	beforeChange();
		    	carousel.find('.ATdots a').removeClass('current');
		    	carousel.find('.ATdots a').eq((current+length)%length).addClass('current');
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
(function($){
	$.fn.ATSlider = function(){
		var config, 
		slider = $(this), 
		length=slider.find('img').length, 
		container, 
		current=0, 
		x=0, 
		playTimeout, 
		ul,
		dots=false;

		slider.addClass("ATSlider");
		init(arguments);

		function test(){
			console.log(config);
		}

		function init(args){
			function vf(){}
			config={
				width:slider.find('ul').outerWidth(true),
				totalWidth: slider.find('ul').outerWidth(true)*length,
				circle:true,
				buttons:false,
				speed:500,
				easing:"swing",
				autoPlay:true,
				hoverStop:true,
				step:1,
				interval:1,
				beforeChange:vf,
				afterChange:vf,
			};

			$.extend(config,args[0]);

			slider.append('<div class="ATContainer"></div>');
			container = slider.find('.ATContainer');
			length=slider.find('li').length;
			var list= slider.find('ul').html();
			container.append('<ul>'+list+(config.circle?list:'')+'</ul>');
			slider.find('> ul').remove();
			ul = container.find("ul");
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
		}

		function renderButtons(){
			function render (type){
				switch (type){
					case "transparent":
						slider.append('<a class="ATprevTrans" href="#"></a><a class="ATnextTrans" href="#"></a>');
						slider.find('.ATprevTrans').on('click',function(e){
							e.preventDefault();
							prev();
						});
						slider.find('.ATnextTrans').on('click',function(e){
							e.preventDefault();
							next();
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
			}
		}

		function play (){
	    	playTimeout = setTimeout(function(){next();play();}, config.interval*1000);
	    }
	    function stop(){
	    	clearInterval(playTimeout);
	    }
	   	function next (){
			go(current+config.step);
	    }
	    function prev (){
			go(current-config.step);
	    }
	    function beforeChange(){
	    	config.beforeChange();
	    }
	    function afterChange(){
	    	config.afterChange();
	    }
	    function go (item){
	    	if (!ul.is(':animated')){
	    	 	if (config.circle){
	    	 		var der = (length+item-current)%length;
	    	 		var izq = (item-current-length)%length;
		    		var steps=Math.abs(der)<=Math.abs(izq)?der:izq;
					x-=config.width*steps;
				    if (x<=-config.totalWidth-config.width){
						ul.css('margin-left', x+config.totalWidth+config.width*steps);
						x+=config.totalWidth;
					}
				    if (x>=-config.width){
						ul.css('margin-left', x-config.totalWidth+config.width*steps);
						x-=config.totalWidth;
					}
					current=(length+item)%length;
				} else {
					current=Math.max(0,Math.min(item,length-1));
					x=-config.width*current;
					if (x<=0){
						//$($path+' > .ant').fadeIn();
					}
					if (x>=-length){
						//$($path+' > .ant').fadeOut();
					}
					if (x<=container.width()-config.width*(length-1)){
						//$($path+' > .sig').fadeOut();
					}
					if (x>container.width()-config.width*(length-1)){
						//$($path+' > .sig').fadeIn();
					}
				}
		    	beforeChange();
		    	slider.find('.ATdots a').removeClass('current');
		    	slider.find('.ATdots a').eq(current%length).addClass('current');
				ul.animate({marginLeft: x+'px'},config.speed,config.easing,afterChange);
			}
	    }

		return {
			test:test,
			go:go,
			next:next,
			prev:prev,
			play:play,
			stop:stop,
			ul:ul
		};
	};
}(jQuery));
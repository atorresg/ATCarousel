(function($){
	$.fn.ATSlider = function(){
		var config, 
		slider = $(this), 
		length=slider.find('img').length, 
		container, 
		current=0, 
		x=0, 
		playTimeout, 
		ul;

		slider.addClass("ATSlider");
		init(arguments);

		function test(){
			console.log(config);
		}

		function init(args){
			function vf(){};
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
					});				}
			}
			renderButtons();

		}
		function renderButtons(){
			function render (type){
				switch (type){
					case "transparent":
						slider.append('<a class="prevTrans" href="#"></a><a class="nextTrans" href="#"></a>');
						$('.prevTrans').on('click',function(e){
							e.preventDefault();
							prev();
						});
						$('.nextTrans').on('click',function(e){
							e.preventDefault();
							next();
						});
					break;
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
		    	//$($path).find('.dots a').removeClass('actual');
		    	//$($path).find('.dots a').eq($item%$config.length).addClass('actual');
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
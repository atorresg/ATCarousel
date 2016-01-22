(function($){
	$.fn.ATSlider = function(){
		var config, slider, length, args, container;
		slider=$(this);
		slider.addClass("ATSlider");
		length=slider.find('img').length;
		args = arguments;
		init();

		function test(){
			console.log(config);
		}

		function init(){
			config={
				width:slider.find('ul').outerWidth(true),
				totalWidth: 0,
				circle:true,
				buttons:false,
				speed:500,
				easing:"swing",
				autoPlay:true,
				hoverStop:true
			};

			if ( args.length>0 && typeof args[0]==="object"){
				for (var i in args[0]){
					config[i]=args[0][i];
				}
			}
			slider.append('<div class="ATContainer"></div>');
			container = slider.find('.ATContainer');
			var list= slider.find('ul').html();
			container.append('<ul>'+list+(config.circle?list:'')+'</ul>');
			slider.find('ul').remove();
			if (config.circle===true){

			}
		}

		return {
			test:test
		};
	};
}(jQuery));
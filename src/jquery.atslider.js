(function($){
	$.fn.ATSlider = function(){
		var config, slider;
		slider=$(this);
		console.log(arguments);
		init();

		function test(){
			console.log(slider.find('img').length);
		}
		function init(){
			slider.addClass("ATSlider");
		}
		return {
			test:test
		}
	}
}(jQuery));
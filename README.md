# ATSlider - A simple and versatile jquery plugin slider

## Features

- easy implementation
- 3 button types (transparent, arrows and dots). More types on upcoming versions (thumbnails, numbers, etc)
- multiple options to customize (speed, easing, circle, autoplay, stop on hover and more)
- customizable callbacks bafore and after animation is complete (more on upcoming versions)

## Install

- link css and js after jquery in your project
- put an ul element with the slides (they can be <img> <a> or any element, just make sure they are or contain an <img>)
- put that ul inside a div and apply the plugin to that selector 
```js
$(selector).ATSlider({options});
```
- if you want to extend control over the slider after initiated assign a var to it

## Options

- **width** (default: width of the ul) assign a css width to the ul or pass this parameter an integer value
- **totalWidth** (default: total width of the chained slides) do not touch this. I will consider to leave it as a private var instead of config value
- **circle** (default: true) if you want to have an infinite loop or just play all slides 1 time
- **buttons** (default: false) it can be a string or an object with multiple values. Possible values: "transparent", "arrows", "dots
- **speed** (default: 500) value in miliseconds for the animation
- **easing** (default: "swing") easing function
- **autoPlay** (default: true) do I need to explain this?
- **hoverStop** (default: true) slider will stop while the cursor is over the slider
- **step** (default: 1) how many slides will pass in each step. This makes sense if you want to, for example, show multiple slides at a time (modify width option or ul css width in order you can make it wide enough to show them).
- **interval** (default: 3) seconds between each animation
- **beforeChange** (default: false) callback function before each animation (I am not glad with the name...)
- **afterChange** (default: false) callback function after each animation (I am not glad with the name...)

## TODO
- More callbacks
- "data-" atributes for li elements in order to customice animations for each slide individually
- More button types
- More animation posibilities (cross-fading, tiles, etc)

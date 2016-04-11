# ATCarousel - A simple and versatile jquery plugin carousel

## Features

- easy implementation
- 3 button types (transparent, arrows and dots). More types on upcoming versions (thumbnails, numbers, etc)
- multiple options to customize (speed, easing, circle, autoplay, stop on hover and more)
- customizable callbacks before and after the animation is completed (more on upcoming versions)

## Install

- link css and js after jquery in your project
- put an element with the slides (they can be <img> <a> or any element, just make sure they are or contain an <img>)
- apply the plugin to that selector 
```js
$(selector).ATCarousel({options});
```
- if you want to extend control over the slider after initiated assign a var to it

## Options

- **width** (default: width of the ul) assign a css width to the ul or pass to this parameter an integer value
- **totalWidth** (default: total width of the chained slides) do not touch this. I will consider to leave it as a private var instead of config value
- **circle** (default: true) if you want to have an infinite loop or just play all slides 1 time
- **buttons** (default: false) it can be a string or an object with multiple values. Possible values: "transparent", "arrows", "dots
- **speed** (default: 500) value in miliseconds for the animation
- **easing** (default: "swing") easing function
- **autoPlay** (default: true) do I need to explain this?
- **hoverStop** (default: true) slider will stop while the cursor is over it
- **step** (default: 1) number of slides will pass in each step. This makes sense if you want to, for example, show multiple slides at a time (modify the width option or ul css width in order to make it wide enough to show them).
- **interval** (default: 3000) miliseconds between each animation
- **beforeChange** (default: false) callback function before each animation (I am not glad with the name...)
- **afterChange** (default: false) callback function after each animation (I am not glad with the name...)
- **transition** (default: 'slideX') animation function for transitioning between slides. This can be (at the moment) 'slideX' or a custom function where the following variables will be provided: (current Item, next Item, and an object with {direction: (1 forward, -1 backward) and speed in milliseconds)}

## TODO
- More callbacks
- More button types
- More animation transitions

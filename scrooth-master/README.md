# scrooth
Smooth scrolling effect (while using mouse wheel). No jQuery or other unnecessary stuff needed.

## Why?
I needed that, and I was unable to find proper one. All of them were using heavier plugins like jQuery, Tween, etc. So i wrote my own, decided to share it.

## Usage
Just include `scrooth.js` in your file, and later initialize it with:
```
const scroll = new Scrooth();
```

## Params
There is some stuff that you can change:
```
const scroll = new Scrooth({
  element: window,
  strength: 10,
  acceleration: 1.5,
  deceleration: 0.975,
});
```

Those are defaults. I wont be describing each one, because you already know what they're doing, just by reading the names.
Hope it'll do work!

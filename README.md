# Micro:bit SH1106 OLED Extension

A graphics and text extension for SH1106 128×64 I2C OLED displays on the BBC micro:bit.

This extension was designed for classroom use with beginner-friendly blocks as well as more advanced drawing tools.

---

## Open in MakeCode

Open this project in MakeCode:

[https://gbhobbytech.github.io/1106-oled-test/](https://gbhobbytech.github.io/1106-oled-test/)

---

# Supported Hardware

Tested with:

- SH1106 OLED controller
- 128×64 resolution
- 1.3 inch I2C OLED display
- BBC micro:bit

Example display label:

```text
1.3" IIC v2.1
```

## Important

This extension is designed for **SH1106** displays.

It is **not intended for SSD1306 displays**.

The SH1106 uses a different internal memory layout and requires different addressing.

---

# Wiring

| OLED Pin | micro:bit Pin |
|---|---|
| VCC | 3V |
| GND | GND |
| SDA | P20 |
| SCL | P19 |

Tested using:
- direct edge connector wiring
- micro:bit V2

## Notes

- Some breakout boards may behave differently.
- The display was tested successfully using the micro:bit I2C pins directly.

---

# Use as Extension

This repository can be added as an extension in MakeCode.

1. Open [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. Create a **New Project**
3. Open **Extensions**
4. Search for:

```text
https://github.com/gbhobbytech/1106-oled-test
```

5. Import the extension

---

# Edit This Project

To edit this repository directly in MakeCode:

1. Open [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. Click **Import**
3. Click **Import URL**
4. Paste:

```text
https://github.com/gbhobbytech/1106-oled-test
```

5. Click **Import**

---

# Beginner Example

```blocks
initialise OLED
show text "HELLO" x 10 y 20 size 2
```

This is the easiest way to get started.

---

# Advanced Example

```blocks
initialise OLED
clear drawing

draw rectangle x 0 y 0 width 127 height 63 on true
draw circle x 64 y 32 radius 20 on true
draw text "OLED" x 40 y 10 size 1 on true

update OLED
```

---

# Understanding the Graphics System

This extension uses a framebuffer graphics system.

## Simple Workflow

```text
clear → draw → update OLED
```

Drawing blocks modify memory first.

`update OLED` sends the completed image to the screen.

This allows:
- combining shapes
- layering text
- animation
- smoother graphics

---

# Block Groups

## Basic

- initialise OLED
- show text

## Drawing

- draw line
- draw rectangle
- draw circle
- draw solid circle

## Advanced

- clear drawing
- draw text
- plot pixel
- fill screen
- update OLED

---

# Features

Current features include:

- scalable text
- line drawing
- rectangle drawing
- circle drawing
- filled circles
- framebuffer graphics
- beginner-friendly blocks
- advanced graphics workflow

---

# Known Limitations

- Designed specifically for SH1106 displays
- No bitmap/image support yet
- No sprite system yet
- Full-screen refresh only

---

# Future Ideas

Possible future additions:

- bitmap drawing
- image import
- sprite support
- graph plotting
- scrolling text
- animation helpers
- contrast adjustment
- invert display
- partial screen updates

---

# Credits

Developed as part of a classroom-focused OLED graphics project for the BBC micro:bit.

Built using:
- MakeCode
- TypeScript
- SH1106 I2C OLED hardware

---

## Metadata

Used for MakeCode search and rendering.

```html
<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>
makeCodeRender(
    "{{ site.makecode.home_url }}",
    "{{ site.github.owner_name }}/{{ site.github.repository_name }}"
);
</script>
```

* for PXT/microbit


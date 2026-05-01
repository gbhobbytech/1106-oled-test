namespace oled {
    const OLED_ADDR = 0x3C
    const OFFSET = 2
    let buffer = pins.createBuffer(1024)
    let started = false

    function cmd(c: number) {
        let b = pins.createBuffer(2)
        b[0] = 0x00
        b[1] = c
        pins.i2cWriteBuffer(OLED_ADDR, b)
    }

    function data(buf: Buffer) {
        let out = pins.createBuffer(buf.length + 1)
        out[0] = 0x40
        for (let i = 0; i < buf.length; i++) {
            out[i + 1] = buf[i]
        }
        pins.i2cWriteBuffer(OLED_ADDR, out)
    }

    function setPage(page: number) {
        cmd(0xB0 | page)
        cmd(OFFSET & 0x0F)
        cmd(0x10 | ((OFFSET >> 4) & 0x0F))
    }

    //% block="initialise OLED"
    export function init(): void {
        basic.pause(100)

        cmd(0xAE)
        cmd(0xD5); cmd(0x80)
        cmd(0xA8); cmd(0x3F)
        cmd(0xD3); cmd(0x00)
        cmd(0x40)
        cmd(0xA1)
        cmd(0xC8)
        cmd(0xDA); cmd(0x12)
        cmd(0x81); cmd(0x7F)
        cmd(0xD9); cmd(0x22)
        cmd(0xDB); cmd(0x20)
        cmd(0xA4)
        cmd(0xA6)
        cmd(0xAF)

        cmd(0xAF)

        started = true
        clear()
        show()
        
    }

    //% block="clear OLED buffer"
    export function clear(): void {
        for (let j = 0; j < 1024; j++) {
            buffer[j] = 0
        }
    }

    //% block="show OLED"
    export function show(): void {
        if (!started) {
            init()
        }

        for (let page = 0; page < 8; page++) {
            setPage(page)

            let row = pins.createBuffer(128)
            for (let x = 0; x < 128; x++) {
                row[x] = buffer[page * 128 + x]
            }

            data(row)
        }
    }

    //% block="plot OLED pixel x %x y %y on %on"
    //% x.min=0 x.max=127 y.min=0 y.max=63
    export function pixel(x: number, y: number, on: boolean): void {
        if (x < 0 || x > 127 || y < 0 || y > 63) {
            return
        }

        let page2 = Math.idiv(y, 8)
        let index = page2 * 128 + x
        let mask = 1 << (y % 8)

        if (on) {
            buffer[index] = buffer[index] | mask
        } else {
            buffer[index] = buffer[index] & ~mask
        }
    }
    //% block="draw line x0 %x0 y0 %y0 x1 %x1 y1 %y1"
    export function line(x0: number, y0: number, x1: number, y1: number): void {
        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1
        let err = dx + dy

        while (true) {
            pixel(x0, y0, true)

            if (x0 == x1 && y0 == y1) break

            let e2 = 2 * err

            if (e2 >= dy) {
                err += dy
                x0 += sx
            }

            if (e2 <= dx) {
                err += dx
                y0 += sy
            }
        }
    }
    //% block="draw rectangle x %x y %y w %w h %h"
    export function rect(x: number, y: number, w: number, h: number): void {
        line(x, y, x + w, y)
        line(x, y, x, y + h)
        line(x + w, y, x + w, y + h)
        line(x, y + h, x + w, y + h)
    }
    //% block="fill OLED buffer %on"
    export function fill(on: boolean): void {
        let value = on ? 0xFF : 0x00

        for (let k = 0; k < 1024; k++) {
            buffer[k] = value
        }
    }
}

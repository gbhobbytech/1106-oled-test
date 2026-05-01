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
    const font5x7: number[] = [
        0x00, 0x00, 0x00, 0x00, 0x00, // space
        0x00, 0x00, 0x5F, 0x00, 0x00, // !
        0x00, 0x07, 0x00, 0x07, 0x00, // "
        0x14, 0x7F, 0x14, 0x7F, 0x14, // #
        0x24, 0x2A, 0x7F, 0x2A, 0x12, // $
        0x23, 0x13, 0x08, 0x64, 0x62, // %
        0x36, 0x49, 0x55, 0x22, 0x50, // &
        0x00, 0x05, 0x03, 0x00, 0x00, // '
        0x00, 0x1C, 0x22, 0x41, 0x00, // (
        0x00, 0x41, 0x22, 0x1C, 0x00, // )
        0x14, 0x08, 0x3E, 0x08, 0x14, // *
        0x08, 0x08, 0x3E, 0x08, 0x08, // +
        0x00, 0x50, 0x30, 0x00, 0x00, // ,
        0x08, 0x08, 0x08, 0x08, 0x08, // -
        0x00, 0x60, 0x60, 0x00, 0x00, // .
        0x20, 0x10, 0x08, 0x04, 0x02, // /
        0x3E, 0x51, 0x49, 0x45, 0x3E, // 0
        0x00, 0x42, 0x7F, 0x40, 0x00, // 1
        0x42, 0x61, 0x51, 0x49, 0x46, // 2
        0x21, 0x41, 0x45, 0x4B, 0x31, // 3
        0x18, 0x14, 0x12, 0x7F, 0x10, // 4
        0x27, 0x45, 0x45, 0x45, 0x39, // 5
        0x3C, 0x4A, 0x49, 0x49, 0x30, // 6
        0x01, 0x71, 0x09, 0x05, 0x03, // 7
        0x36, 0x49, 0x49, 0x49, 0x36, // 8
        0x06, 0x49, 0x49, 0x29, 0x1E, // 9
        0x00, 0x36, 0x36, 0x00, 0x00, // :
        0x00, 0x56, 0x36, 0x00, 0x00, // ;
        0x08, 0x14, 0x22, 0x41, 0x00, // <
        0x14, 0x14, 0x14, 0x14, 0x14, // =
        0x00, 0x41, 0x22, 0x14, 0x08, // >
        0x02, 0x01, 0x51, 0x09, 0x06, // ?
        0x32, 0x49, 0x79, 0x41, 0x3E, // @
        0x7E, 0x11, 0x11, 0x11, 0x7E, // A
        0x7F, 0x49, 0x49, 0x49, 0x36, // B
        0x3E, 0x41, 0x41, 0x41, 0x22, // C
        0x7F, 0x41, 0x41, 0x22, 0x1C, // D
        0x7F, 0x49, 0x49, 0x49, 0x41, // E
        0x7F, 0x09, 0x09, 0x09, 0x01, // F
        0x3E, 0x41, 0x49, 0x49, 0x7A, // G
        0x7F, 0x08, 0x08, 0x08, 0x7F, // H
        0x00, 0x41, 0x7F, 0x41, 0x00, // I
        0x20, 0x40, 0x41, 0x3F, 0x01, // J
        0x7F, 0x08, 0x14, 0x22, 0x41, // K
        0x7F, 0x40, 0x40, 0x40, 0x40, // L
        0x7F, 0x02, 0x0C, 0x02, 0x7F, // M
        0x7F, 0x04, 0x08, 0x10, 0x7F, // N
        0x3E, 0x41, 0x41, 0x41, 0x3E, // O
        0x7F, 0x09, 0x09, 0x09, 0x06, // P
        0x3E, 0x41, 0x51, 0x21, 0x5E, // Q
        0x7F, 0x09, 0x19, 0x29, 0x46, // R
        0x46, 0x49, 0x49, 0x49, 0x31, // S
        0x01, 0x01, 0x7F, 0x01, 0x01, // T
        0x3F, 0x40, 0x40, 0x40, 0x3F, // U
        0x1F, 0x20, 0x40, 0x20, 0x1F, // V
        0x3F, 0x40, 0x38, 0x40, 0x3F, // W
        0x63, 0x14, 0x08, 0x14, 0x63, // X
        0x07, 0x08, 0x70, 0x08, 0x07, // Y
        0x61, 0x51, 0x49, 0x45, 0x43  // Z
    ]
    function fillRect(x: number, y: number, w: number, h: number, on: boolean): void {
        for (let yy = y; yy < y + h; yy++) {
            for (let xx = x; xx < x + w; xx++) {
                pixel(xx, yy, on)
            }
        }
    }
    function drawChar(ch: string, x: number, y: number, size: number): void {
        let code = ch.charCodeAt(0)

        // Convert lowercase to uppercase
        if (code >= 97 && code <= 122) {
            code -= 32
        }

        // Supported range: ASCII 32 to 90
        if (code < 32 || code > 90) {
            code = 63 // ?
        }

        let index = (code - 32) * 5

        for (let col = 0; col < 5; col++) {
            let lineBits = font5x7[index + col]

            for (let row = 0; row < 7; row++) {
                if ((lineBits & (1 << row)) != 0) {
                    if (size <= 1) {
                        pixel(x + col, y + row, true)
                    } else {
                        fillRect(x + col * size, y + row * size, size, size, true)
                    }
                }
            }
        }
    }
    //% block="draw text %message x %x y %y size %size"
    //% x.min=0 x.max=127 y.min=0 y.max=63 size.min=1 size.max=4
    export function text(message: string, x: number, y: number, size: number = 1): void {
        if (size < 1) size = 1
        if (size > 4) size = 4

        for (let i = 0; i < message.length; i++) {
            drawChar(message.charAt(i), x + i * 6 * size, y, size)
        }
    }

    //% block="fill OLED buffer %on"
    export function fill(on: boolean): void {
        let value = on ? 0xFF : 0x00

        for (let k = 0; k < 1024; k++) {
            buffer[k] = value
        }
    }
}

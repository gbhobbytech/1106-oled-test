//% color="#005A9C" icon="\uf26c" block="OLED"
namespace oled {
    const OLED_ADDR = 0x3C
    const OFFSET = 2

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
    }

    //% block="fill OLED %on"
    export function fill(on: boolean): void {
        let value = on ? 0xFF : 0x00

        let row = pins.createBuffer(128)
        for (let i = 0; i < 128; i++) {
            row[i] = value
        }

        for (let page = 0; page < 8; page++) {
            setPage(page)
            data(row)
        }
    }
}
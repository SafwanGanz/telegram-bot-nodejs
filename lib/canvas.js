
const Canvas = require('canvas');
const { registerFont } = require('canvas');

class Canva {
    constructor() {
        this.name = 'Unknown';
        this.groupname = 'Unknown';
        this.ppimg = 'https://graph.org/file/c6e1d6d9eabdc3b227083.png';
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setGroupname(groupname) {
        this.groupname = groupname;
        return this;
    }

    setPpimg(ppimg) {
        this.ppimg = ppimg;
        return this;
    }

    async welcome() {
        registerFont('./assets/font/fanc.ttf', { family: 'bot-fnt' });

        const welcome_canvas = Canvas.createCanvas(1024, 500);
        const welcome_ctx = welcome_canvas.getContext('2d');

        const message = this.name.length > 13 ? this.name.substring(0, 9) + "..." : this.name;
        const groupname = this.groupname.length > 13 ? this.groupname.substring(0, 9) + "..." : this.groupname;

        const background = await Canvas.loadImage('https://graph.org/file/267aaef82bff2e2cca3ef.jpg');
        welcome_ctx.drawImage(background, 0, 0, 1024, 500);

        welcome_ctx.font = '42px bot-fnt';
        welcome_ctx.fillStyle = '#ffffff';
        welcome_ctx.textAlign = 'center';
        welcome_ctx.fillText(`${message}`, welcome_canvas.width - 512, welcome_canvas.height - 150);

        welcome_ctx.font = '32px "bot-fnt"';
        welcome_ctx.fillStyle = '#FFFFFF';
        welcome_ctx.textAlign = 'center';
        welcome_ctx.fillText(`Welcome To ${groupname}`, welcome_canvas.width - 512, welcome_canvas.height - 100);

        welcome_ctx.beginPath();
        welcome_ctx.arc(512, 166, 119, 0, Math.PI * 2, true);
        welcome_ctx.strokeStyle = '#f4ebeb';
        welcome_ctx.lineWidth = 6;
        welcome_ctx.stroke();
        welcome_ctx.save();
        welcome_ctx.closePath();
        welcome_ctx.clip();

        const avatar = await Canvas.loadImage(this.ppimg);
        welcome_ctx.drawImage(avatar, 393, 47, 238, 238);

        return welcome_canvas.toBuffer();
    }

}

module.exports = Canva;
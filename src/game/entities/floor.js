// Entidade do chao
class Floor {
    constructor(width, height, bottomGap = 61) {
        this.x = 0;
        this.height = 24;
        this.y = height - this.height - bottomGap;
        this.width = width;
        this.color = "#2ed573";
    }

    // Desenha o chao no canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Platform {
    constructor(x, y, width, height, color = "#2ed573") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

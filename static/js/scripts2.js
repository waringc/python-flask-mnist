(function() {

    //Initialize
    canvas = document.getElementById('drawCanvas');
    inputImage = document.getElementById('modelInput');
    canvas.width  = 393; // 14 * 28 + 1
    canvas.height = 393; // 14 * 28 + 1
    inputImage.width = 140;
    inputImage.height = 140;

    //Inital drawing of drawing canvas
    this.ctx = this.canvas.getContext('2d');
    ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Inital drawing of mnist input
    this.ctx2 = this.inputImage.getContext('2d');
    ctx2.fillStyle = "white";
	ctx2.fillRect(0, 0, inputImage.width, inputImage.height);


}());

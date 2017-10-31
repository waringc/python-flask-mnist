//for mnist interface and canvas
//based on script from https://github.com/sugyan/tensorflow-mnist

class Main{
    constructor(){
    //Canvas
    this.canvas = document.getElementById('drawCanvas');
    this.inputImage = document.getElementById('modelInput');
    this.canvas.width  = 393; // 14 * 28 + 1
    this.canvas.height = 393; // 14 * 28 + 1
    this.inputImage.width = 28;
    this.inputImage.height = 28;
    this.lineSpace = 14;
    this.ctx = this.canvas.getContext('2d');
    this.ctxs = this.inputImage.getContext('2d');
    this.drawing=false;

    //draw events
    this.canvas.addEventListener("mousedown",this.mouseDown.bind(this));
    this.canvas.addEventListener("mouseup",this.mouseUp.bind(this));
    this.canvas.addEventListener("mousemove",this.mouseMove.bind(this));

    //initalize
    this.initialize();

    }


    initialize(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctxs.clearRect(0, 0, this.inputImage.width, this.inputImage.height)


        //draw grid lines
        this.ctx.lineWidth =0.1;
        this.ctx.strokeStyle="#557292";

        for(var i = 0; i < Math.floor(this.canvas.width/this.lineSpace); i++){
            //vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo((i+1) * this.lineSpace, 0);
            this.ctx.lineTo((i+1) * this.lineSpace, this.canvas.height);
            this.ctx.closePath();
            this.ctx.stroke();

            //horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0 , (i+1) * this.lineSpace);
            this.ctx.lineTo(this.canvas.width, (i+1) * this.lineSpace);
            this.ctx.closePath();
            this.ctx.stroke();
        }

    } //initalize

    mouseDown(e){
        this.canvas.style.cursor = 'default';
        this.drawing = true
        this.prev = this.getPosition(e.clientX,e.clientY)
    }

    mouseUp(){
        this.drawing = false
        this.drawInput();
    }

    mouseMove(e){
        if (this.drawing){
            var curr = this.getPosition(e.clientX,e.clientY)

            this.ctx.lineWidth = 32;
            this.ctx.lineCap = 'round'

            this.ctx.beginPath()
            this.ctx.moveTo(this.prev.x,this.prev.y)
            this.ctx.lineTo(curr.x,curr.y)
            this.ctx.stroke();
            this.ctx.closePath();


            this.prev = curr
         }
    }

    getPosition(clientX,clientY){
        var rect = this.canvas.getBoundingClientRect();
        return{
            x : clientX - rect.left,
            y : clientY - rect.top
        };

    }

    //create scaled down version of input of right size for MNIST model
    drawInput(){
        this.ctxs.drawImage(this.canvas,0,0,this.inputImage.width,this.inputImage.height)
    }

    exportImage(){
         var rawImage = this.ctxs.getImageData(0, 0, this.inputImage.width, this.inputImage.height).data;
         var procImage = []
         //Average 3 channels to flatten to one channel
         for (var i = 0; i < 28; i++) {
            for (var j = 0; j < 28; j++) {
                    var n = 4 * (i * 28 + j);
                    procImage[i * 28 + j] = (rawImage[n + 0] + rawImage[n + 1] + rawImage[n + 2]) / (3);
            }
         }

         return procImage
    }

}

//on page load
$(() => {
    var main = new Main();
    $( "#clear" ).click(function() {
       main.initialize();
       $('#prediction').text("Predicted Number: ")
       $('#graph').empty()
    });

    $( "#predict" ).click(function() {

            $.ajax({
                url: '/api/mnist',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(main.exportImage()),
                success: (data) =>{
                    var max_prob = -1
                    var max_index = 0

                    console.log(data.results)

                    for (let i = 0; i < 10; i++){
                        var value = Math.round(Number(data.results[0][0][i]) * 1000);

                        if (value > max_prob){
                            max_prob = value
                            max_index = i
                            console.log(max_prob)
                            console.log(max_index)
                        }


                    }
                     $('#prediction').text("Predicted Number:" + max_index)
                     d = new Date()
                     $('#graph').empty()
                     $('#graph').prepend($('<img>',{id:'theImg',src:data.results[1] + "?" + +d.getTime()}))

                }
                });


    });
});
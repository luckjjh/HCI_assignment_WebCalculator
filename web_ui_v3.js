let WebUI = {}
WebUI.WidgetTypes = {
    UNDEFINED:      "undefind",
    TEXT:           "text",
    IMAGE:          "image",
    PUSH_BUTTON:    "push_button",
    TEXT_FIELD:     "text_field",
    SWITCH:         "switch",
    CALC_BUTTON:    "calc_button",

    // ADD NEW WIDGET TYPES HERE
    CONTAINER:      "container",
    ROW:            "row",
    COLUMN:         "column",
    HISTORY_FIELD:  "history_field",
    GRAPH_PLOT:     "graph_plot",
    PLOT_BUTTON:    "plot_button",
    GRID_VIEW:      "grid_view"
};

WebUI.Alignment = {
    // ADD ALIGNMENT TYPES HERE
    CENTER:         "center",
    LEFT:           "left",
    RIGHT:          "right",
    TOP:            "top",
    BOTTOM:         "bottom"
};

WebUI.widgets = [];
WebUI.parser = math.parser();
var displayValue='0';
var historyText="";
var historyCol=0;
var ansValue = 0;
var exampleText = "1. 각 버튼에 마우스가 올라가면\n 버튼의 기능이 이 화면에 출력\n됩니다.\n2. Enter key를 눌러 수식을 \n계산할 수 있습니다.\n3. Convert to fraction Switch가\n on이 되면 계산 값이 분수로 출력\n됩니다.";
var function_x = "";
var function_y = "";
var is_decimal = true;
WebUI.focused_widget = null;
WebUI.dragged_widget = null;
WebUI.hovered_widget = null;

WebUI.is_mouse_dragging = false;       
WebUI.mouse_drag_start = {x:0, y:0};
WebUI.mouse_drag_prev = {x:0, y:0};

WebUI.app = null;

WebUI.initialize = function() {
    this.canvas = new fabric.Canvas("c", {
        backgroundColor: "#eee",
        hoverCursor: "default",
        selection: false,
        width: window.innerWidth,
        height: window.innerHeight,
    });
    //
    $(document).keypress(function(event) {
        WebUI.handleKeyPress(event);
    });
    $(document).mousedown(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseDown(p);
    });
    $(document).mouseup(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseUp(p);
    });
    $(document).mousemove(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseMove(p);
    });

    //
    WebUI.initWidgets();
    WebUI.initVisualItems();
    WebUI.layoutWhenResourceReady();
}

WebUI.initWidgets = function() {
    // INITIALIZE WIDGETS HERE
    WebUI.app = new WebUI.Container({//margin 위한 테두리
        desired_size:{width:1500, height:850},
        horizontal_alignment:WebUI.Alignment.CENTER,
        vertical_alignment : WebUI.Alignment.CENTER,
        drawConst:false,
        children:[
            WebUI.app = new WebUI.Container({//main constructor
                desired_size:{width:1400, height:700},
                horizontal_alignment:WebUI.Alignment.CENTER,
                vertical_alignment : WebUI.Alignment.CENTER,
                drawConst:true,//이거만 그대로
                children:[
                    WebUI.app = new WebUI.Column({
                        children:[
                            WebUI.app = new WebUI.Container({//calculator part
                                desired_size:{width:800, height:750},
                                horizontal_alignment:WebUI.Alignment.LEFT,
                                drawConst:false,
                                children:[
                                    WebUI.app = new WebUI.Row({
                                        children:[
                                            new WebUI.Container({
                                                desired_size: {width:800, height:100},
                                                horizontal_alignment: WebUI.Alignment.CENTER,
                                                vertical_alignment : WebUI.Alignment.CENTER,
                                                drawConst:false,
                                                children:[new WebUI.Text("WebUI Calculator",30)],
                                            }),
                                            new WebUI.Container({
                                                desired_size: {width:800, height:90},
                                                horizontal_alignment: WebUI.Alignment.CENTER,
                                                vertical_alignment : WebUI.Alignment.CENTER,
                                                drawConst:false,
                                                children:[
                                                    WebUI.app = new WebUI.Row({
                                                        not_next:true,
                                                            children:[WebUI.calText = new WebUI.TextField(displayValue,{width:700,height:50},'#eeeeee'),
                                                                    WebUI.ansText = new WebUI.HistoryField("Ans = "+ansValue,{width:700,height:30},'#eeeeee',20)]
                                                    })
                                                ],
                                            }),
                                            new WebUI.Container({
                                                desired_size: {width:800,height:525},
                                                horizontal_alignment: WebUI.Alignment.CENTER,
                                                vertical_alignment : WebUI.Alignment.TOP,
                                                drawConst:false,
                                                children:[//////////
                                                    new WebUI.GridView({
                                                        desired_size:{width:725,height:500},
                                                        crossAxisCount:9,
                                                        horizontal_alignment: WebUI.Alignment.LEFT,
                                                        children:[
                                                            new WebUI.CalcButton("sin",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("cos",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("tan",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("csc",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("sec",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("cot",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("h",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("^",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("10^x",{width:70,height:50},'#393e46', '#eeeeee'),//

                                                            new WebUI.CalcButton("<",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton(">",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("<=",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton(">=",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("==",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("!=",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("=",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("x^2",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("x^3",{width:70,height:50},'#393e46', '#eeeeee'),//

                                                            new WebUI.CalcButton("[",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("]",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("(",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton(")",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("i",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("pi",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("e",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("DEL",{width:70,height:50},'#00adb5','#eeeeee'),
                                                            new WebUI.CalcButton("CL",{width:70,height:50},'#00adb5','#eeeeee'),//

                                                            new WebUI.CalcButton("f",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("g",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton(";",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton(":",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("7",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("8",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("9",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("%",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton(",",{width:70,height:50},'#393e46', '#eeeeee'),//

                                                            new WebUI.CalcButton("x",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("y",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("w",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("z",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("4",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("5",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("6",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("*",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("/",{width:70,height:50},'#393e46', '#eeeeee'),//

                                                            new WebUI.CalcButton("exp",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("sqrt",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("cross",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("det",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("1",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("2",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("3",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("+",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("-",{width:70,height:50},'#393e46', '#eeeeee'),//

                                                            new WebUI.CalcButton("log",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("log2",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("log10",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("|x|",{width:70,height:50},'#393e46', '#eeeeee'),
                                                            new WebUI.CalcButton("0",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton(".",{width:70,height:50},'#eeeeee' , '#222831'),
                                                            new WebUI.CalcButton("Ans",{width:70,height:50},'#00adb5','#eeeeee'),
                                                            new WebUI.CalcButton("EVALUATE",{width:150,height:50},'#00adb5','#eeeeee'),//
                                                        ]
                                                    }),
                                                     
                                                ]//버튼 행
                                            })//버튼들
                                        ]//여가까지가 main container children
                                    }),
                                ],
                            }),
                            WebUI.app = new WebUI.Container({//grahp, history part
                                desired_size:{width:500, height:650},
                                horizontal_alignment:WebUI.Alignment.CENTER,
                                drawConst:false,
                                children:[
                                        WebUI.app = new WebUI.Row({
                                            desired_size:{width:500, height:650},
                                            horizontal_alignment:WebUI.Alignment.CENTER,
                                            vertical_alignment:WebUI.Alignment.TOP,
                                            children:[
                                                WebUI.app = new WebUI.Column({
                                                    children:[
                                                        new WebUI.Container({
                                                            desired_size: {width:250, height:100},
                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                            drawConst:false,
                                                            children:[new WebUI.Text("Calculate History",20)],
                                                        }),
                                                        new WebUI.Container({
                                                            desired_size: {width:250, height:100},
                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                            drawConst:false,
                                                            children:[new WebUI.Text("Function Manual",20)],
                                                        }),
                                                    ]
                                                }),
                                                WebUI.app = new WebUI.Column({
                                                    children:[
                                                        new WebUI.Container({
                                                            desired_size: {width:250, height:200},
                                                            horizontal_alignment: WebUI.Alignment.LEFT,
                                                            drawConst:false,
                                                            children:[WebUI.histText = new WebUI.HistoryField(historyText,{width:250,height:200},'black',15)],
                                                        }),
                                                        new WebUI.Container({
                                                            desired_size: {width:250, height:200},
                                                            horizontal_alignment: WebUI.Alignment.LEFT,
                                                            drawConst:false,
                                                            children:[WebUI.exText = new WebUI.HistoryField(exampleText,{width:250,height:200},'black',15)],
                                                        }),
                                                    ]
                                                }),
                                                WebUI.app = new WebUI.Column({
                                                    children:[
                                                        new WebUI.Container({
                                                            desired_size: {width:200, height:300},
                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                            drawConst:false,
                                                            children:[
                                                                WebUI.app = new WebUI.Row({
                                                                    horizontal_alignment: WebUI.Alignment.CENTER,
                                                                    vertical_alignment : WebUI.Alignment.CENTER,
                                                                    children:[
                                                                        new WebUI.Container({
                                                                            desired_size: {width:200, height:150},
                                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                                            drawConst:false,
                                                                            children:[
                                                                                WebUI.app = new WebUI.Row({
                                                                                    children:[
                                                                                        new WebUI.Container({
                                                                                            desired_size: {width:200, height:50},
                                                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                                                            drawConst:false,
                                                                                            children:[new WebUI.Text("Graph Plot",20),]
                                                                                        }),
                                                                                        new WebUI.Container({
                                                                                            desired_size: {width:200, height:50},
                                                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                                                            drawConst:false,
                                                                                            children:[new WebUI.PlotButton("Draw Graph",{width:200,height:50},'#00adb5','#eeeeee'),]
                                                                                        }),
                                                                                        new WebUI.Container({
                                                                                            desired_size: {width:200, height:50},
                                                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                                                            drawConst:false,
                                                                                            children:[
                                                                                                new WebUI.Column({
                                                                                                    children:[
                                                                                                        new WebUI.CalcButton("f(x)",{width:95,height:50},'#393e46', '#eeeeee'),
                                                                                                        new WebUI.CalcButton("g(x)",{width:95,height:50},'#393e46', '#eeeeee'),
                                                                                                    ]
                                                                                                })
                                                                                            ]
                                                                                        }),
                                                                                    ]
                                                                                }),
                                                                            ]
                                                                        }),
                                                                        new WebUI.Container({
                                                                            desired_size: {width:200, height:100},
                                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                                            drawConst:false,
                                                                            children:[
                                                                                WebUI.app = new WebUI.Row({
                                                                                    children:[
                                                                                        new WebUI.Container({
                                                                                            desired_size: {width:200, height:50},
                                                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                                                            drawConst:false,
                                                                                            children:[new WebUI.Text("Convert to fraction",15),]
                                                                                        }),
                                                                                        new WebUI.Container({
                                                                                            desired_size: {width:200, height:50},
                                                                                            horizontal_alignment: WebUI.Alignment.CENTER,
                                                                                            vertical_alignment : WebUI.Alignment.CENTER,
                                                                                            drawConst:false,
                                                                                            children:[new WebUI.Switch(false,{width:100,height:50}),]
                                                                                        }),
                                                                                    ]
                                                                                }),
                                                                            ]
                                                                        })
                                                                    ],
                                                                }),
                                                            ]
                                                        }),
                                                        WebUI.graphRect = new WebUI.Container({
                                                            desired_size: {width:300, height:300},
                                                            horizontal_alignment: WebUI.Alignment.LEFT,
                                                            drawConst:true,
                                                            children:[
                                                                new WebUI.GraphPlot("resources/plot2.png",{width:300,height:300}),
                                                            ]
                                                        }),
                                                    ],
                                                }),
                                                
                                            ]
                                        })
                                ],
                            }),
                        ]
                    })
                ],
                
            }),
        ],
    })


};

//
WebUI.initVisualItems = function() {
    WebUI.widgets.forEach(widget => {
        widget.initVisualItems();
    });
}

WebUI.layoutWhenResourceReady = function() {
    let is_resource_loaded = true;
    for (let i in WebUI.widgets) {
        let widget = WebUI.widgets[i];
        if (!widget.is_resource_ready) {
            is_resource_loaded = false;
            break;
        }
    }

    if (!is_resource_loaded) {
        setTimeout(arguments.callee, 50);
    }
    else {
        WebUI.app.layout();
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleKeyPress = function(event) {
    let is_handled = false;

    if (WebUI.focused_widget) {
        is_handled = WebUI.focused_widget.handleKeyPress(event) || is_handled;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseDown = function(window_p) {
    let is_handled = false;

    if (WebUI.isInCanvas(window_p)) {
        let canvas_p = WebUI.transformToCanvasCoords(window_p);        

        WebUI.is_mouse_dragging = true;
        WebUI.mouse_drag_start = canvas_p;
        WebUI.mouse_drag_prev = canvas_p;

        let widget = WebUI.findWidgetOn(canvas_p);
        if (widget) {
            WebUI.focused_widget = widget;    

            if (widget.is_draggable) {
                WebUI.dragged_widget = widget;
            }
            else {
                WebUI.dragged_widget = null;
            }

            is_handled = widget.handleMouseDown(canvas_p) || is_handled;
        }
        else {
            WebUI.focused_widget = null;
            WebUI.dragged_widget = null;
        }
    }
    else {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.focused_widget = null;
        WebUI.dragged_widget = null;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseMove = function(window_p) {
    let canvas_p = WebUI.transformToCanvasCoords(window_p);
    let is_handled = false;

    let widget = WebUI.findWidgetOn(canvas_p);
    if (widget != WebUI.hovered_widget) {
        if (WebUI.hovered_widget != null) {
            is_handled = WebUI.hovered_widget.handleMouseExit(canvas_p) || is_handled;
        }
        if (widget != null) {
            is_handled = widget.handleMouseEnter(canvas_p) || is_handled;
        }
        WebUI.hovered_widget = widget;
    }
    else {
        if (widget) {
            is_handled = widget.handleMouseMove(canvas_p) || is_handled;
        }
    }

    if (WebUI.is_mouse_dragging) {
        if (WebUI.dragged_widget != null) {
            let tx = canvas_p.x - WebUI.mouse_drag_prev.x;
            let ty = canvas_p.y - WebUI.mouse_drag_prev.y;
            WebUI.dragged_widget.translate({x: tx, y: ty});

            is_handled = true;
        }
        WebUI.mouse_drag_prev = canvas_p;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseUp = function(window_p) {
    let is_handled = false;
    let canvas_p = WebUI.transformToCanvasCoords(window_p);

    let widget  = WebUI.findWidgetOn(canvas_p);
    if (widget) {
        is_handled = widget.handleMouseUp(canvas_p) || is_handled;
    }

    if (WebUI.is_mouse_dragging) {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.dragged_widget = null;
        
        is_handled = true;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.transformToCanvasCoords = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    let canvas_p = {
        x : window_p.x - rect.left,
        y : window_p.y - rect.top
    };
    return canvas_p;
}

WebUI.isInCanvas = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    if (window_p.x >= rect.left && 
        window_p.x < rect.left + rect.width &&
        window_p.y >= rect.top && 
        window_p.y < rect.top + rect.height) {
        return true;
    }
    else {
        return false;
    }
}

WebUI.findWidgetOn = function(canvas_p) {
    let x = canvas_p.x;
    let y = canvas_p.y;

    for (let i=0; i < this.widgets.length; i++) {
        let widget = this.widgets[i];

        if (x >= widget.position.left &&
            x <= widget.position.left + widget.size.width &&
            y >= widget.position.top &&
            y <= widget.position.top + widget.size.height) {
            return widget;
        }               
    }
    return null;
}

WebUI.maxSize = function(size1, size2) {
    // IMPLEMENT HERE!
    let max_size = {width:0, height:0};
    max_size.width = (size1.width>size2.width)?
                                    size1.width : size2.width;
    max_size.height = (size1.height>size2.height)?
                                    size1.height : size2.height;
    return max_size;
}

WebUI.minSize = function(size1, size2) {
    // IMPLEMENT HERE!
    let min_size = {width:0, height:0};
    min_size.width = (size1.width<size2.width)?
                                    size1.width : size2.width;
    min_size.height = (size1.height<size2.height)?
                                    size1.height : size2.height;
    return min_size;
}


//
WebUI.Widget = function(properties) {
    this.type = WebUI.WidgetTypes.UNDEFINED;
    
    this.is_draggable = false;
    this.is_movable = true;

    //
    this.parent = null;
    this.children = [];
    
    //
    this.position = {left: 0, top: 0};
    this.size = {width: 0, height: 0};

    //
    this.visual_items = [];
    this.is_resource_ready = false;

    //
    WebUI.widgets.push(this);

    // IMPLEMENT HERE: code for adding properties
    if(properties != undefined){
        for(let name in properties){
            let value = properties[name];
            if(name == 'children'){
                value.forEach(child =>{
                    child.parent = this;
                    this.children.push(child);
                });
            }
            else{
                this[name] = value;
            }
        }
    }

    //
    this.setDefaultProperty('desired_size', {width: 0, height: 0});
    this.setDefaultProperty('horizontal_alignment', WebUI.Alignment.CENTER);
    this.setDefaultProperty('vertical_alignment', WebUI.Alignment.TOP);
    this.setDefaultProperty('fill_color', 'white');
    this.setDefaultProperty('stroke_color', 'black');
    this.setDefaultProperty('stroke_width', 1);
    this.setDefaultProperty('text_align', 'left');
    this.setDefaultProperty('text_color', 'black');
    this.setDefaultProperty('font_family', 'System');
    this.setDefaultProperty('font_size', 20);
    this.setDefaultProperty('font_weight', 'bold');
    this.setDefaultProperty('padding', 5);
    this.setDefaultProperty('margin', 10);
}

WebUI.Widget.prototype.setDefaultProperty = function(name, value) {
    if (this[name] == undefined) {
        this[name] = value;
    }
}

WebUI.Widget.prototype.getBoundingRect = function() {
    return {
        left:   this.position.left, 
        top:    this.position.top,
        width:  this.size.width,
        height: this.size.height
    };
}

WebUI.Widget.prototype.layout = function() {
    // IMPLEMENT HERE!
    this.measure();

    this.arrange(this.position);
}

WebUI.Widget.prototype.measure = function() {
    // IMPLEMENT HERE!
    if(this.children.length > 0){
        this.size_children = {width:0, height:0};
        this.children.forEach(child=>{
            let size_child = child.measure();
            this.size_children = 
                this.extendSizeChildren(this.size_children, size_child);
        });
        this.size = WebUI.maxSize(this.desired_size,this.size_children);
    }
    else{
        this.size.width += this.padding * 2;
        this.size.height += this.padding * 2;
    }
    return this.size;
}
 
WebUI.Widget.prototype.arrange = function(position) {
    // IMPLEMENT HERE!
    this.moveTo(position);
    this.visual_items.forEach(item=>{ WebUI.canvas.add(item); });

    if(this.children.length > 0){
        let left_spacing = 0, top_spacing = 0;

        if(this.size.width > this.size_children.width){
            let room_width = this.size.width - this.size_children.width;

            if(this.horizontal_alignment == WebUI.Alignment.LEFT)
                left_spacing = this.padding;
            else if(this.horizontal_alignment == WebUI.Alignment.CENTER)
                left_spacing = this.padding + room_width / 2.0;
            else if(this.horizontal_alignment == WebUI.Alignment.RIGHT)
                left_spacing = this.padding + room_width;
        }
        if(this.size.height > this.size_children.height){
            let room_height = 
                this.size.height - this.size_children.height;
            
            if(this.vertical_alignment == WebUI.Alignment.TOP)
                top_spacing = this.padding;
            else if(this.vertical_alignment == WebUI.Alignment.CENTER)
                top_spacing = this.padding + room_height / 2.0;
            else if(this.vertical_alignment == WebUI.Alignment.BOTTOM)
                top_spacing = this.padding + room_height;
        }
        let next_position = {left: position.left + left_spacing,
                                top: position.top + top_spacing};
        this.children.forEach(child=>{
            child.arrange(next_position);
            next_position = this.calcNextPosition(next_position,child.size);
        });
    }
}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.extendSizeChildren = function(size, child_size) {
    if (size.width < child_size.width)      size.width = child_size.width;
    if (size.height < child_size.height)    size.height = child_size.height;

    return size;
}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;

    return {left: next_left, top: next_top};
}


WebUI.Widget.prototype.initVisualItems = function() {
    this.is_resource_ready = true;
    return true;
}

WebUI.Widget.prototype.moveTo = function(p) {
    if(!this.is_movable)
    {
        return;
    }

    let tx = p.left - this.position.left;
    let ty = p.top - this.position.top;

    this.translate({x: tx, y: ty});
}

WebUI.Widget.prototype.translate = function(v) {
    if(!this.is_movable)
    {
        return;
    }

    this.position.left += v.x;
    this.position.top += v.y;

    this.visual_items.forEach(item => {
        item.left += v.x;
        item.top += v.y;
    });

    this.children.forEach(child_widget => {
        child_widget.translate(v);
    });
}

WebUI.Widget.prototype.destroy = function() {
    if (this == WebUI.focused_widget) WebUI.focused_widget = null;
    if (this == WebUI.dragged_widget) WebUI.dragged_widget = null;
    if (this == WebUI.hovered_widget) WebUI.hovered_widget = null;

    this.visual_items.forEach(item => {
        WebUI.canvas.remove(item);
    });
    this.visual_items = [];
    
    let index = WebUI.widgets.indexOf(this);
    if(index > -1)
    {
        WebUI.widgets.splice(index, 1);
    }

    this.children.forEach(child_widget => {
        child_widget.destroy();
    });
    this.children = [];
}

WebUI.Widget.prototype.handleKeyPress = function(event) {
    return false;
}

WebUI.Widget.prototype.handleMouseDown = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseMove = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseUp = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseEnter = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseExit = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleResize = function() {
    return false;
}


//
WebUI.Container = function(properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.CONTAINER;
    this.stroke_color = 'black';
    this.fill_color='#222831';
    this.stroke_width = 3;
    this.desired_size = properties.desired_size;
    this.drawConst = properties.drawConst;
}

WebUI.Container.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Container.prototype.constructor = WebUI.Container;
WebUI.Container.prototype.initVisualItems = function(){
    let cboundary = new fabric.Rect({
        left:   this.position.left,
        top:    this.position.top,
        width:  this.desired_size.width,
        height: this.desired_size.height,
        fill:   this.fill_color,
        stroke: this.stroke_color,
        strokeWidth:this.stroke_width,
        selectable: false,
    });
    if(this.drawConst){
        this.visual_items.push(cboundary);
    }
    this.is_resource_ready = true;
}
WebUI.Container.prototype.extendSizeChildren = function(size, child_size) {
    // IMPLEMENT HERE!
    if(size.width < child_size.width) size.width = child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}

WebUI.Container.prototype.calcNextPosition = function(position, size) {
    // IMPLEMENT HERE!
    let next_left = position.left;
    let next_top = position.top;
    return {left: next_left, top: next_top};
}

//
WebUI.Column = function(properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.COLUMN;
}

WebUI.Column.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Column.prototype.constructor = WebUI.Column;

WebUI.Column.prototype.extendSizeChildren = function(size, child_size) {
    // IMPLEMENT HERE!
    size.width += child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}

WebUI.Column.prototype.calcNextPosition = function(position, size) {
    // IMPLEMENT HERE!
    let next_left = position.left + size.width;
    let next_top = position.top;
    return {left: next_left, top: next_top};
}


//
WebUI.Row = function(properties) {
    WebUI.Widget.call(this, properties);
    this.not_next = properties.not_next;
    this.type = WebUI.WidgetTypes.ROW;
}

WebUI.Row.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Row.prototype.constructor = WebUI.Row;

WebUI.Row.prototype.extendSizeChildren = function(size, child_size) {
    // IMPLEMENT HERE!
    if(size.width < child_size.width) size.width = child_size.width;
    size.height += child_size.height;
    return size;
}

WebUI.Row.prototype.calcNextPosition = function(position, size) {
    // IMPLEMENT HERE!
    let next_left = position.left;
    let next_top = position.top+size.height;
    if(this.not_next==true){
        next_top=position.top+size.height-10;
    }
    return {left: next_left, top: next_top};
}

WebUI.GridView = function(properties){
    WebUI.Widget.call(this, properties);
    this.crossAxisCount = properties.crossAxisCount-1;//가로로 얼마나 많은 children 배치할지
    this.crossAxisCount_2=properties.crossAxisCount-1;
    this.type = WebUI.WidgetTypes.GRID_VIEW;
}
WebUI.GridView.prototype = Object.create(WebUI.Widget.prototype);
WebUI.GridView.prototype.constructor = WebUI.GridView;
WebUI.GridView.prototype.initVisualItems = function(){
    let cboundary = new fabric.Rect({
        left:   this.position.left,
        top:    this.position.top,
        width:  this.desired_size.width,
        height: this.desired_size.height,
        fill:   'black',
        stroke: 'white',
        strokeWidth:5,
        selectable: false,
    });
    if(this.drawConst){
        this.visual_items.push(cboundary);
    }
    this.is_resource_ready = true;
}
WebUI.GridView.prototype.extendSizeChildren = function(size, child_size) {
    if(size.width < child_size.width) size.width = child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}

WebUI.GridView.prototype.calcNextPosition = function(position,size) {
    let next_top = position.top;
    let next_left = position.left;
    if(this.crossAxisCount!=0){
        next_left = position.left+size.width;
        this.crossAxisCount--;
    }
    else{
        next_left = position.left-(this.crossAxisCount_2*size.width);
        next_top = position.top+size.height
        this.crossAxisCount=this.crossAxisCount_2;
    }
    return {left: next_left, top: next_top};
}


// Text widget
WebUI.Text = function(label,font_size) {
    WebUI.Widget.call(this);

    this.type=WebUI.WidgetTypes.TEXT;
    this.label=label;

    this.font_family='System';
    this.font_size=font_size;
    this.font_weight='bold';
    this.text_align='left';
    this.text_color='white';
}

WebUI.Text.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Text.prototype.constructor = WebUI.Text;

WebUI.Text.prototype.initVisualItems = function() {
    let text=new fabric.Text(this.label,{
        left:this.position.left,
        top:this.position.top,
        selectable:false,
        fontFamily:this.font_family,
        fontSize:this.font_size,
        fontWeight:this.font_weight,
        textAlign:this.text_align,
        stroke:this.text_color,
        fill:this.text_color
    });
    let bound=text.getBoundingRect();
    this.position.left=bound.left;
    this.position.top=bound.top;
    this.size.width=bound.width;
    this.size.height=bound.height;

    this.visual_items.push(text);
    this.is_resource_ready=true;
}

//history text widget
WebUI.HistoryField = function(displayHistory,desired_size,stroke_color,font_size){
    WebUI.Widget.call(this);
    this.type = WebUI.WidgetTypes.HISTORY_FIELD;
    this.displayHistory=displayHistory;
    this.desired_size = desired_size;
    
    this.font_family='System';
    this.font_size=font_size;
    this.font_weight = 'normal';
    this.text_align='left';
    this.text_color='black';
    
    this.stroke_width = 5;
    this.stroke_color = stroke_color;
    this.fill_color = '#eeeeee';
}
WebUI.HistoryField.prototype = Object.create(WebUI.Widget.prototype);
WebUI.HistoryField.prototype.constructor = WebUI.HistoryField;

WebUI.HistoryField.prototype.initVisualItems = function(){
    let historyBndry = new fabric.Rect({
        left:this.position.left,
        top:this.position.top,
        width:this.desired_size.width,
        height:this.desired_size.height,
        fill:this.fill_color,
        stroke:this.stroke_color,
        strokeWidth:this.stroke_width,
        selectable:false,
    });
    let historyTextBox = new fabric.Text(this.displayHistory,{
        left:       this.position.left,
        top:        this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color
    });

    let bound = historyTextBox.getBoundingRect();
    historyTextBox.left = this.position.left + 10;
    historyTextBox.top = this.position.top + 10;

    this.size = this.desired_size;
    this.visual_items.push(historyBndry);
    this.visual_items.push(historyTextBox);
    this.is_resource_ready=true;
}

// Image widget
WebUI.Image = function(path, desired_size) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.IMAGE;
    this.path = path;
    this.desired_size = desired_size;
}

WebUI.Image.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Image.prototype.constructor = WebUI.Image;

WebUI.Image.prototype.initVisualItems = function() {
    let widget = this;

    fabric.Image.fromURL(this.path, function(img){
        if(widget.desired_size!=undefined){
            img.scaleToWidth(widget.desired_size.width);
            img.scaleToHeight(widget.desired_size.height);
            widget.size=widget.desired_size;
        }
        else{
            widget.size={width:img.width,
                        height:img.height};
        }
        img.set({left:widget.position.left,
            top:widget.position.top,
            selectable:false});
        
        widget.visual_items.push(img);
        widget.is_resource_ready=true;
    });
}


// PushButton widget
WebUI.PushButton = function(label, desired_size,color) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.PUSH_BUTTON;
    this.label = label;       
    this.desired_size = desired_size;
    this.is_pushed = false;

    this.stroke_color = '#eeeeee';
    this.fill_color = color;

    this.font_family = 'System';
    this.font_size = 20;
    this.font_weight = 'bold';
    this.text_align = 'center';
    this.text_color = 'black';
}

WebUI.PushButton.prototype = Object.create(WebUI.Widget.prototype);
WebUI.PushButton.prototype.constructor = WebUI.PushButton;

WebUI.PushButton.prototype.initVisualItems = function() {
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: 1,
        selectable: false
    });

    let text = new fabric.Text(this.label, {
        left: this.position.left,
        top: this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    let bound = text.getBoundingRect();
    text.left = this.position.left + this.desired_size.width/2 - bound.width/2;
    text.top = this.position.top + this.desired_size.height/2 - bound.height/2;

    this.size = this.desired_size;

    //
    this.visual_items.push(background);
    this.visual_items.push(text);
    this.is_resource_ready = true;
}

WebUI.PushButton.prototype.handleMouseDown = function() {
    if(!this.is_pushed){
        this.translate({x:0,y:5});
        this.is_pushed=true;
        if(this.onPushed!=undefined){
            this.onPushed.call(this);
        }
        return true;
    }
    else{
        return false;
    }
}

WebUI.PushButton.prototype.handleMouseUp = function() {
    if(this.is_pushed){
        this.translate({x:0,y:-5});
        this.is_pushed=false;
        return true;
    }
    else{
        return false;
    }
}

WebUI.PushButton.prototype.handleMouseEnter = function() {
    this.visual_items[0].set('strokeWidth',3);
    if(this.label=='log'||this.label=='log2'||this.label=='log10')
        WebUI.exText.visual_items[1].text = "Calculate the logarithm of a \nvalue 'log(x,base)'form"+
                                            "Example:\nlog(10,4) = 10000\nlog(1024,2) = 10\nlog2(16) = 4";
    if(this.label=='sin'||this.label=='cos'||this.label=='tan'||
    this.label=='csc'||this.label=='sec'||this.label=='cot'||this.label=='h'){
        WebUI.exText.visual_items[1].text = "Compute the trigonometric \n"+
                                            "function. 'h' is hyperbolic.\nExample:\n"+
                                            "sin(pi/2) = 1\n"+
                                            "sinh(pi/2) = 11.548\n"+
                                            "csc,sec,cot is reciprocal of\n"+
                                            "sin,cos,tan.";
    }
    if(this.label=='|x|'){
        WebUI.exText.visual_items[1].text = "Calculate the absolute value \nof a number.\n"+
                                            "Example:\nabs(-4.2) = 4.2\nabs([3, -5, -1, 0, 2]) = \n[3, 5, 1, 0, 2]";
    }
    if(this.label=='exp'){
        WebUI.exText.visual_items[1].text = "Calculate the exponent of \na value. For matrices, the\nfunction is evaluated element \nwise. \n"+
                                            "Example:\nexp(2)=7.389";
    }
    if(this.label=='^'||this.label=='x^3'||this.label=='x^2'||this.label=='10^x'){
        WebUI.exText.visual_items[1].text = "Calculates the power of x to y\n"+
                                            "Matrix exponentiation is \nsupported for square matrices x\n"+
                                            "and positive integer exponents y.\n"+
                                            "Example:\n2^3 = 8\ni^2=-1";
    }
    if(this.label=='<'||this.label=='>'||this.label=='<='||this.label=='>='||this.label=='=='||this.label=='!='){
        WebUI.exText.visual_items[1].text = "Compare two values. \n"+
                                            "return ture when expression is \n"+
                                            "true, false when expression is \nfalse.\nExample:\n"+
                                            "2>3 = false, 2<3 = true\n"+
                                            "2>=2 = true, 2!=2 = false";
    }
    if(this.label=='['||this.label==']'||this.label=='('||this.label==')'){
        WebUI.exText.visual_items[1].text = "'(, )'is Grouping character.\n"+
                                            "'[, ]'is Matrix Grouping \ncharacter\nExample:\n"+
                                            "2*(3+4) = 14\n[[1,2],[3,4]] = [[1,2],[3,4]]";
    }
    if(this.label=='='){
        WebUI.exText.visual_items[1].text = "Equal operator. \n";
    }
    if(this.label=='f'||this.label=='g'||this.label=='f(x)'||this.label=='g(x)'){
        WebUI.exText.visual_items[1].text = "Function operator. \n"+
                                            "Example:\nf(x) = x^2\ng(x) = x^3+x^2+4";
    }
    if(this.label=='x'||this.label=='y'||this.label=='w'||this.label=='z'){
        WebUI.exText.visual_items[1].text = "Variable x,y,w,z"+
                                            "\nExample:\nx = 2\ny= 3";
    }
    if(this.label=='%'||this.label=='*'||this.label=='/'||this.label=='+'||this.label=='-'){
        WebUI.exText.visual_items[1].text = "Calculate following operation.";
    }
    if(this.label=='sqrt'){
        WebUI.exText.visual_items[1].text = "Calculate the square root of \na value. \n"+
                                            "For matrices, the function is\nevaluated element wise.\n"+
                                            "Example:\nsqrt(25) = 5 \nsqrt(-4) = 2i";
    }
    if(this.label=='cross'){
        WebUI.exText.visual_items[1].text = "Calculate the cross product for\ntwo vectors in three dimensional\nspace.\n"+
                                            "Example:\ncross([1,1,0],[0,1,1]) = [1,-1,1]\ncross([[1,2,3]],[[4],[5],[6]]) = \n[[-3, 6, -3]]";
    }
    if(this.label=='det'){
        WebUI.exText.visual_items[1].text = "Calculate the determinant of a \n"+
                                            "Example:\ndet([[1, 2], [3, 4]]) = -2"
    }
    if(this.label=='DEL'){
        WebUI.exText.visual_items[1].text = "Delete lastest character.";
    }
    if(this.label=='CL'){
        WebUI.exText.visual_items[1].text = "Clear all expression.";
    }
    if(this.label=='EVALUATE'){
        WebUI.exText.visual_items[1].text = "Evaluate input expression.";
    }
    if(this.label=='Ans'){
        WebUI.exText.visual_items[1].text = "Return lastest expression's \nanswer.";
    }
    if(this.label=='e'||this.label=='pi'){
        WebUI.exText.visual_items[1].text = "Constant value 'e', 'pi' \n"+
                                            "Example:\ne = 2.718, pi = 3.1415";
    }
    if(this.label=='i'){
        WebUI.exText.visual_items[1].text = "Complex number 'i'.";
    }
    if(this.label==';'){
        WebUI.exText.visual_items[1].text = "The Statement and Row separator \n"+
                                            "Example:\n[1,2;3,4] = [[1,2],[3,4]]\na=2; b=3; a*b = 6";
    }
    if(this.label==':'){
        WebUI.exText.visual_items[1].text = "The Range operator \n"+
                                            "Example:\n1:4=[1,2,3,4]";
    }
    if(this.label=='Draw Graph'){
        WebUI.exText.visual_items[1].text = "Draw a Graph to right plot when \ninput is f(x) or g(x)"+
                                            "\nExample:\nf(x)=x^2 를 입력하고 f(x) 버튼을 \n누른 후 Draw Graph 버튼 누르기";
    }
    return true;
}

WebUI.PushButton.prototype.handleMouseExit = function() {
    this.visual_items[0].set('strokeWidth',1);
    WebUI.exText.visual_items[1].text = "1. 각 버튼에 마우스가 올라가면\n 버튼의 기능이 이 화면에 출력\n됩니다.\n2. Enter key를 눌러 수식을 \n계산할 수 있습니다.\n3. Convert to fraction Switch가\n on이 되면 계산 값이 분수로 출력\n됩니다.";
    if(this.is_pushed){
        this.translate({x:0,y:-5});
        this.is_pushed=false;
    }
    return true;
}
//CalcButton Class
WebUI.CalcButton = function(label, desired_size,fill_color,text_color){
    WebUI.PushButton.call(this);
    this.type = WebUI.WidgetTypes.CALC_BUTTON;
    this.label = label;
    this.desired_size = desired_size;
    this.is_pushed = false;

    this.stroke_color = '#eeeeee';
    this.fill_color = fill_color;

    this.font_family = 'System';
    this.font_size = 20;
    this.text_align = 'center';
    this.text_color = text_color;
    this.onPushed = this.handleButtonPushed;
}
WebUI.CalcButton.prototype = Object.create(WebUI.PushButton.prototype);
WebUI.CalcButton.prototype.constructor = WebUI.CalcButton;
WebUI.CalcButton.prototype.initVisualItems = function(){
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: 1,
        selectable: false
    });

    let text = new fabric.Text(this.label, {
        left: this.position.left,
        top: this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    let bound = text.getBoundingRect();
    text.left = this.position.left + this.desired_size.width/2 - bound.width/2;
    text.top = this.position.top + this.desired_size.height/2 - bound.height/2;

    this.size = this.desired_size;

    //
    this.visual_items.push(background);
    this.visual_items.push(text);
    this.is_resource_ready = true;
}
WebUI.CalcButton.prototype.handleKeyPress = function(event){
    if(event.keyCode==13){
        try{
            let histValue = displayValue;
            displayValue = WebUI.parser.evaluate(displayValue).toString();
            
            if(historyCol==9){
                WebUI.histText.visual_items[1].text = "";
                WebUI.histText.visual_items[1].text = histValue;
                historyCol=0;
            }
            else{
                WebUI.histText.visual_items[1].text += histValue;
                historyCol++;
            }//history 수식 저장

            if(histValue[0]=="f"){
                function_x = histValue.substr(5,histValue.length);
            }
            else if(histValue[0]=="g"){
                function_y = histValue.substr(5,histValue.length);
            }//function 내용 저장

            let tokens = displayValue.split(' ');
            if(tokens[0]=='function')
            {
                displayValue = tokens[0];
            }
            WebUI.calText.visual_items[1].text = "";

            if(is_decimal==false&&tokens[0]!='function'){
                let tempV = new Fraction(displayValue.substr(0,5));
                displayValue = tempV.toFraction(true);
            }//분수 표현

            ansValue = displayValue;
            WebUI.ansText.visual_items[1].text = "Ans = "+ansValue;
            WebUI.histText.visual_items[1].text += "="+displayValue+'\n';
            displayValue ='0';

        }
        catch (e){
            displayValue = '0';
            if(displayValue != 'function'){
                WebUI.calText.visual_items[1].text = e.message;
            }
        }
    }
    return true;
}
WebUI.CalcButton.prototype.handleButtonPushed = function() {
    if(displayValue=='0') displayValue = '';
    if(this.label=='EVALUATE'){
        try{
            let histValue = displayValue;
            displayValue = WebUI.parser.evaluate(displayValue).toString();
            
            if(historyCol==9){
                WebUI.histText.visual_items[1].text = "";
                WebUI.histText.visual_items[1].text = histValue;
                historyCol=0;
            }
            else{
                WebUI.histText.visual_items[1].text += histValue;
                historyCol++;
            }//history 수식 저장

            if(histValue[0]=="f"){
                function_x = histValue.substr(5,histValue.length);
            }
            else if(histValue[0]=="g"){
                function_y = histValue.substr(5,histValue.length);
            }//function 내용 저장

            let tokens = displayValue.split(' ');
            if(tokens[0]=='function')
            {
                displayValue = tokens[0];
            }
            WebUI.calText.visual_items[1].text = "";

            if(is_decimal==false&&tokens[0]!='function'){
                let tempV = new Fraction(displayValue.substr(0,5));
                displayValue = tempV.toFraction(true);
            }//분수 표현

            ansValue = displayValue;
            WebUI.ansText.visual_items[1].text = "Ans = "+ansValue;
            WebUI.histText.visual_items[1].text += "="+displayValue+'\n';
            displayValue ='0';

        }
        catch (e){
            displayValue = '0';
            if(displayValue != 'function'){
                WebUI.calText.visual_items[1].text = e.message;
            }
        }
    }

    else{
        if(this.label=='CL'){
            displayValue = '0';
            WebUI.calText.visual_items[1].text = displayValue;
            WebUI.ansText.visual_items[1].text = "Ans = ";
            WebUI.calText.label = displayValue;
        }
        else if(this.label=='DEL'){
            let tempstr = displayValue.slice(0,-1);
            displayValue = tempstr;
            WebUI.calText.visual_items[1].text = displayValue;
        }
        else if(this.label=='Ans'){
            displayValue+=ansValue;
            WebUI.calText.visual_items[1].text = displayValue;
        }
        else if(this.label=='10^x'){
            displayValue += '10^';
            WebUI.calText.visual_items[1].text = displayValue;
        }
        else if(this.label=='x^2'){
            displayValue += '^2';
            WebUI.calText.visual_items[1].text = displayValue;
        }
        else if(this.label=='x^3'){
            displayValue += '^3';
            WebUI.calText.visual_items[1].text = displayValue;
        }
        else if(this.label=='log2'){
            displayValue += 'log2(';
            WebUI.calText.visual_items[1].text = displayValue;
        }
        else if(this.label=='log10'){
            displayValue += 'log10(';
            WebUI.calText.visual_items[1].text = displayValue;
        }
        else if(this.label=='|x|'){
            displayValue += 'abs(';
            WebUI.calText.visual_items[1].text = displayValue;
        }
        
        else{
            displayValue += this.label;
            WebUI.calText.visual_items[1].text = displayValue;
        }
    }
};

// TextField widget
WebUI.TextField = function(label, desired_size,stroke_color) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.TEXT_FIELD;
    this.label = label;
    this.desired_size = desired_size;
    this.margin = 10;

    this.stroke_color = stroke_color;
    this.fill_color = '#eeeeee';
    this.stroke_width = 5;    
    this.font_family = 'System';
    this.font_size = 20;
    this.font_weight = 'normal';
    this.text_align = 'left';
    this.text_color = 'black';
}

WebUI.TextField.prototype = Object.create(WebUI.Widget.prototype);
WebUI.TextField.prototype.constructor = WebUI.TextField;

WebUI.TextField.prototype.initVisualItems = function() {
    let boundary=new fabric.Rect({
        left:this.position.left,
        top:this.position.top,
        width:this.desired_size.width,
        height:this.desired_size.height,
        fill:this.fill_color,
        stroke:this.stroke_color,
        strokeWidth:this.stroke_width,
        selectable:false,
    });
    let textbox=new fabric.Textbox(this.label,{
        left:this.position.left+this.margin,
        fontFamily:this.font_family,
        fontSize:this.font_size,
        fontWeight:this.font_weight,
        width:this.desired_size.width,
        textAlign:this.text_align,
        stroke:this.text_color,
        fill:this.text_color,
        selectable:false,
    });

    let bound = textbox.getBoundingRect();
    textbox.top= this.position.top+
                (this.desired_size.height-bound.height)/2;

    this.size=this.desired_size;
    this.visual_items.push(boundary);
    this.visual_items.push(textbox);

    this.is_resource_ready=true;
}

WebUI.TextField.prototype.handleMouseDown = function(canvas_p) {
    let textbox = this.visual_items[1];        
    textbox.enterEditing();

    return true;
}

WebUI.TextField.prototype.handleKeyPress = function(event) {
    let textbox = this.visual_items[1];        

    let new_label = textbox.text;
    let old_label = this.label;
    this.label = new_label;

    if (event.keyCode == 13) {
        let text_enter_removed = new_label.replace(/(\r\n|\n|\r)/gm, "");
        textbox.text = text_enter_removed;
        this.label = text_enter_removed;
        
        if (textbox.hiddenTextarea != null) {
            textbox.hiddenTextarea.value = text_enter_removed;
        }

        textbox.exitEditing();

        return true;    
    }

    if (old_label != new_label && old_label.length < new_label.length) {
        let boundary = this.visual_items[0];
        let canvas = document.getElementById("c");
        let context = canvas.getContext("2d");
        context.font = this.font_size.toString() + "px " + this.font_family;

        let boundary_right = boundary.left + boundary.width - this.margin;
        let text_bound = textbox.getBoundingRect();
        let text_width = context.measureText(new_label).width;
        let text_right = text_bound.left + text_width;

        if (boundary_right < text_right) {
            textbox.text = old_label;
            this.label = old_label;
            
            if (textbox.hiddenTextarea != null) {
                textbox.hiddenTextarea.value = old_label;
            }

            return true;
        }
    }
    
    return false;
}


// Switch widget
WebUI.Switch = function(is_on, desired_size) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.SWITCH;
    this.is_on = is_on;
    this.desired_size = desired_size;
}

WebUI.Switch.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Switch.prototype.constructor = WebUI.Switch;

WebUI.Switch.prototype.initVisualItems = function() {
    let bndry_radius = this.desired_size.width/4;
    let switch_boundary = new fabric.Path('M 0 0 L 50 0 C 80 5, 80 45, 50 50 L 0 50 C -30 45,-30 5,0 0',{
                            left:this.position.left,
                            top:this.position.top,  
                            stroke:'rgb(142,142,147)',
                            strokeWidth:1,
                            fill:'rgb(142,142,147)',
                            selectable:false
                        });
    
    let switch_circle = new fabric.Circle({
        top:this.position.top+bndry_radius*0.1,
        radius:bndry_radius*0.9,
        stroke:'rgb(142,142,147)',
        strokeWidth:1,
        fill:'white',
        selectable:false
    });
    switch_circle.left = this.position.left+bndry_radius*0.1;//45
    this.size=this.desired_size;
    this.visual_items.push(switch_boundary);
    this.visual_items.push(switch_circle);
    this.is_resource_ready = true;
}

WebUI.Switch.prototype.handleMouseDown = function() {
    let switch_boundary = this.visual_items[0];
    let switch_circle = this.visual_items[1];
    
    if(this.is_on==false){
        switch_circle.set('stroke','#00adb5');
        switch_boundary.set('stroke','#00adb5');
        switch_boundary.set('fill','#00adb5');
        switch_circle.animate('left','+=45',{
            onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
            duration:100
        });
        this.is_on=true;
        is_decimal=false;
    }
    else{
        switch_circle.set('stroke','rgb(142,142,147)');
        switch_boundary.set('stroke','rgb(142,142,147)');
        switch_boundary.set('fill','rgb(142,142,147)');
        switch_circle.animate('left','-=45',{
            onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
            duration:100
        });
        this.is_on=false;
        is_decimal=true;
    }
    return true;
}

WebUI.GraphPlot = function(path,desired_size){
    WebUI.Widget.call(this);
    this.type = WebUI.WidgetTypes.GRAPH_PLOT;
    this.desired_size = desired_size;
    this.fill_color = '#eeeeee';
    this.stroke_color = 'black';
    this.stroke_width = 5;

    this.path = path;
}
WebUI.GraphPlot.prototype = Object.create(WebUI.Widget.prototype);
WebUI.GraphPlot.prototype.constructor = WebUI.GraphPlot;
WebUI.GraphPlot.prototype.initVisualItems = function() {
    let graphBndry = new fabric.Rect({
        left:this.position.left,
        top:this.position.top,
        width:this.desired_size.width,
        height:this.desired_size.height,
        fill:this.fill_color,
        stroke:this.stroke_color,
        strokeWidth:this.stroke_width,
        selectable:false,
    });
    
    this.visual_items.push(graphBndry);
    
    let widget = this;

    fabric.Image.fromURL(this.path, function(img){
        if(widget.desired_size!=undefined){
            img.scaleToWidth(widget.desired_size.width-100);
            img.scaleToHeight(widget.desired_size.height-100);
            widget.size=widget.desired_size;
        }
        else{
            widget.size={width:img.width,
                        height:img.height};
        }
        img.set({left:widget.position.left+50,
            top:widget.position.top+50,
            selectable:false});
        
        widget.visual_items.push(img);
        widget.is_resource_ready=true;
    });
}
//

WebUI.PlotButton = function(label,desired_size){
    WebUI.PushButton.call(this);
    this.type = WebUI.WidgetTypes.PLOT_BUTTON;
    this.label = label;
    this.desired_size = desired_size;
    this.is_pushed = false;

    this.stroke_color = '#eeeeee';
    this.fill_color = '#00adb5';

    this.font_family = 'System';
    this.font_size = 20;
    this.text_align = 'center';
    this.text_color = '#eeeeee';
    this.onPushed = this.handleButtonPushed;
}
WebUI.PlotButton.prototype = Object.create(WebUI.PushButton.prototype);
WebUI.PlotButton.prototype.constructor = WebUI.PlotButton;
WebUI.PlotButton.prototype.initVisualItems = function(){
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: 1,
        selectable: false
    });

    let text = new fabric.Text(this.label, {
        left: this.position.left,
        top: this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    let bound = text.getBoundingRect();
    text.left = this.position.left + this.desired_size.width/2 - bound.width/2;
    text.top = this.position.top + this.desired_size.height/2 - bound.height/2;

    this.size = this.desired_size;

    //
    this.visual_items.push(background);
    this.visual_items.push(text);
    this.is_resource_ready = true;
}
WebUI.PlotButton.prototype.handleButtonPushed = function(){
    if(displayValue=='f(x)'){
        displayValue = '';
        WebUI.calText.visual_items[1].text = displayValue;
        try{
            const expression = function_x;
            const expr = math.compile(expression);
    
            const xValues = math.range(-10, 10, 0.5).toArray()
            const yValues = xValues.map(function (x) {
                return expr.evaluate({x: x})
            });
    
            const trace1 = {
                x: xValues,
                y: yValues,
                type: 'scatter'
            };
                const data = [trace1];
                Plotly.newPlot('plot', data)
        }
        catch (err) {
            console.error(err)
            alert(err)
        }
        
    }
    else if(displayValue=='g(x)'){
        displayValue = '';
        WebUI.calText.visual_items[1].text = displayValue;
        try{
            const expression = function_y;
            const expr = math.compile(expression);
    
            const xValues = math.range(-10, 10, 0.5).toArray()
            const yValues = xValues.map(function (x) {
                return expr.evaluate({x: x})
            });
    
            const trace1 = {
                x: xValues,
                y: yValues,
                type: 'scatter'
            };
                const data = [trace1];
                Plotly.newPlot('plot', data)
        }
        catch (err) {
            console.error(err)
            alert(err)
        }
    }
}
$(document).ready(function() {    
    WebUI.initialize();
});


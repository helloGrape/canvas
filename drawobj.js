var MOUSE_POSITION = {
    NONE: 0,      // 在空白处
    DRAWOBJ: 1,      // 在某个图形上
    ANCHOR: 2       // 在某个锚点上
};

/**
 * 图形类型
 */
var DrawType = {
    LINE: 0,          // 直线
    LINE_ARROW: 1,          // 带方向箭头的直线
    RECT: 2,          // 矩形
    RECT_ARROW: 3,          // 带方向箭头的矩形
    POLYGON: 4,          // 多边形
    POLYGON_ARROW: 5,          // 带方向箭头的多边形
    CONCENTRIC: 6,          // 同心矩形
    POINT: 7,          // 点
    TITLE: 8,          // 只能移动的矩形
    RECT_ZOOM: 9,          // 数字放大的矩形
    EN_DRAW_LINE_ARROW_VERNIER: 10,     //客流量的线段
    INVALID: 0xFFFF
};

var MAX_POLYGON_POINTNUM = 6;  // 多边形最多6
var MIN_WIDTH = 10;


/*创建直线对象*/
var Line = function (num, map) {
    this.num = num;                 // 序号
    this.type = DrawType.LINE;               // 类型
    this.isShow = false;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;

    // 坐标信息
    this.map = {
        PointX0: map["PointX0"],
        PointY0: map["PointY0"],
        PointX1: map["PointX1"],
        PointY1: map["PointY1"]

    };
};
Line.prototype = {
    createDrawObj: function (context) {
        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.strokeStyle = this.LineColor;
        context.lineWidth = this.LineWidth;
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        context.lineTo(this.map["PointX1"], this.map["PointY1"]);
        context.stroke();
        context.closePath();

        if ("" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            context.fillText(this.Text, this.map["PointX0"], this.map["PointY0"]);
        }
    },
    isDrawObjSel: function (context, x, y) {           //判断鼠标位置是否在绘制图形内
        var flag,
            centerx = (this.map["PointX1"] + this.map["PointX0"]) / 2,
            centery = (this.map["PointY1"] + this.map["PointY0"]) / 2,
            radians = Math.atan((this.map["PointY1"] - this.map["PointY0"]) /
                (this.map["PointX1"] - this.map["PointX0"])),       //旋转角度
            distance = Math.sqrt(Math.pow(this.map["PointX1"] - this.map["PointX0"], 2) +
                Math.pow(this.map["PointY1"] - this.map["PointY0"], 2));//直线的长度

        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        context.rotate(radians);
        context.strokeStyle = "rgba(255,255,255,0)";
        context.rect(-distance / 2 - 5, -5, distance + 10, 10);
        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        context.restore();
        return flag;
    }
};

/*带箭头方向的直线*/
var arrowLine = function (num, map) {
    // todo 带箭头直线实际可以继承直线的属性和isDraoObjSel方法
    this.num = num;
    this.type = DrawType.LINE_ARROW;
    this.isShow = false;
    // 箭头方向
    this.Direction = (("undefined" != typeof map["Direction"]) && !isNaN(map["Direction"])) ? Number(map["Direction"]) : 0;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {
        PointX0: map["PointX0"],
        PointY0: map["PointY0"],
        PointX1: map["PointX1"],
        PointY1: map["PointY1"]
    };
};
arrowLine.prototype = {
    createDrawObj: function (context) {
        var centerx = (this.map["PointX1"] + this.map["PointX0"]) / 2,
            centery = (this.map["PointY1"] + this.map["PointY0"]) / 2,
            radians = Math.atan((this.map["PointY1"] - this.map["PointY0"]) /
                (this.map["PointX1"] - this.map["PointX0"]));       //旋转角度

        if (!this.isShow)return;

        context.beginPath();
        context.lineWidth = this.LineWidth;
        context.strokeStyle = this.LineColor;
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        context.lineTo(this.map["PointX1"], this.map["PointY1"]);
        context.stroke();

        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        if (((this.map["PointX1"] > this.map["PointX0"]) &&
            (this.map["PointY1"] < this.map["PointY0"])) ||
            ((this.map["PointX1"] > this.map["PointX0"]) &&
            (this.map["PointY1"] > this.map["PointY0"]))
        ) {
            context.rotate(radians);
        }
        else if (((this.map["PointX1"] < this.map["PointX0"]) &&
            (this.map["PointY1"] > this.map["PointY0"])) ||
            ((this.map["PointX1"] < this.map["PointX0"]) &&
            (this.map["PointY1"] < this.map["PointY0"]))
        ) {
            context.rotate(radians + Math.PI);
        }
        if (0 == this.Direction) {  //箭头双向
            context.moveTo(0, 0);
            context.lineTo(0, 20);
            context.lineTo(-8, 12);
            context.lineTo(0, 20);
            context.lineTo(8, 12);
            context.lineTo(0, 20);
            context.lineTo(0, -20);
            context.lineTo(-8, -12);
            context.lineTo(0, -20);
            context.lineTo(8, -12);
            context.lineTo(0, -20);
        }
        else if (1 == this.Direction) { //鼠标划过方向左侧
            context.moveTo(0, 20);   //绘制箭头
            context.lineTo(0, -20);
            context.lineTo(-8, -12);
            context.lineTo(0, -20);
            context.lineTo(8, -12);
            context.lineTo(0, -20);
        }
        else if (2 == this.Direction) {
            context.moveTo(0, -20);   //绘制箭头
            context.lineTo(0, 20);
            context.lineTo(-8, 12);
            context.lineTo(0, 20);
            context.lineTo(8, 12);
            context.lineTo(0, 20);
        }
        context.stroke();
        context.closePath();
        context.restore();

        if ("" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            context.fillText(this.Text, this.map["PointX0"], this.map["PointY0"]);
        }
    },
    isDrawObjSel: function (context, x, y) {
        var flag,
            centerx = (this.map["PointX1"] + this.map["PointX0"]) / 2,
            centery = (this.map["PointY1"] + this.map["PointY0"]) / 2,
            radians = Math.atan((this.map["PointY1"] - this.map["PointY0"]) /
                (this.map["PointX1"] - this.map["PointX0"])),       //旋转角度
            distance = Math.sqrt(Math.pow(this.map["PointX1"] - this.map["PointX0"], 2) +
                Math.pow(this.map["PointY1"] - this.map["PointY0"], 2));

        if (!this.isShow)return;

        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        context.rotate(radians);
        context.strokeStyle = "rgba(255,255,255,0)";
        context.rect(-distance / 2 - 5, -5, distance + 10, 10);
        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        context.restore();
        return flag;
    }
};


/*创建矩形对象*/
var CEZRect = function (num, map) {
    this.num = num;         //图形序号
    this.type = DrawType.RECT;    //图形类型
    this.isShow = false;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {
        Left: map["Left"],
        Top: map["Top"],
        Right: map["Right"],
        Bottom: map["Bottom"]
    };
};
CEZRect.prototype = {
    createDrawObj: function (context) {   //绘制矩形并使图形选中; x,y为鼠标在画布上的坐标
        if (!this.isShow)return;

        context.save();
        context.beginPath();
        context.strokeStyle = this.LineColor;
        context.lineWidth = this.LineWidth;
        context.rect(this.map["Left"], this.map["Top"], (this.map["Right"] - this.map["Left"]), (this.map["Bottom"] - this.map["Top"]));
        context.stroke();
        context.closePath();
        
        // todo 每个类都有重复绘制文字的代码，可以设置一个图形基类，放到图形基类中，其他类继承图形基类
        if ("" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            context.fillText(this.Text, this.map["Left"], this.map["Top"]);
        }
    },
    isDrawObjSel: function (context, x, y) {           //判断鼠标位置是否在绘制图形内，改变标志位drawFlag,将当前对象设为选中状态
        var flag;

        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.strokeStyle = "rgba(255,0,0,0)";
        context.lineWidth = this.LineWidth;
        context.rect(this.map["Left"], this.map["Top"], (this.map["Right"] - this.map["Left"]), (this.map["Bottom"] - this.map["Top"]));
        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        return flag;
    }
};

/*带方向箭头的矩形*/
var arrowRect = function (num, map) {   //方向箭头：0双向；1左侧；2右侧
    this.type = DrawType.RECT_ARROW;
    this.num = num;
    this.isShow = false;
    // 箭头方向
    this.Direction = (("undefined" != typeof map["Direction"]) && !isNaN(map["Direction"])) ? Number(map["Direction"]) : 0;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {
        Left: map["Left"],
        Top: map["Top"],
        Right: map["Right"],
        Bottom: map["Bottom"]
    };
};
arrowRect.prototype = {
    createDrawObj: function (context) {
        var centerx = (this.map["Left"] + this.map["Right"]) / 2,
            centery;

        if (!this.isShow)return;

        if (this.map["Top"] > this.map["Bottom"]) {
            centery = this.map["Bottom"];
        }
        else {
            centery = this.map["Top"];
        }

        context.save();
        context.beginPath();
        context.strokeStyle = this.LineColor;
        context.lineWidth = this.LineWidth;
        context.rect(this.map["Left"], this.map["Top"], (this.map["Right"] - this.map["Left"]), (this.map["Bottom"] - this.map["Top"]));
        context.stroke();

        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        if (1 == this.Direction) {
            context.moveTo(0, 20);   //绘制箭头,出矩形
            context.lineTo(0, -20);
            context.lineTo(-8, -12);
            context.lineTo(0, -20);
            context.lineTo(8, -12);
            context.lineTo(0, -20);
        }
        if (2 == this.Direction) {
            context.moveTo(0, -20);   //绘制箭头，入矩形
            context.lineTo(0, 20);
            context.lineTo(-8, 12);
            context.lineTo(0, 20);
            context.lineTo(8, 12);
            context.lineTo(0, 20);
        }
        context.stroke();
        context.closePath();
        context.restore();

        if ("" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            if(this.map["Left"] > this.map["Right"]){
                context.fillText(this.Text, this.map["Right"] + 20, this.map["Bottom"] + 20);
            }
            else{
                context.fillText(this.Text, this.map["Left"]  + 20, this.map["Top"] + 20);
            }
        }
    },
    isDrawObjSel: function (context, x, y) {
        // todo 此处可以继承矩形的方法
        var flag;

        if (!this.isShow)return;
        context.beginPath();
        context.strokeStyle = "rgba(255,0,0,0)";
        context.lineWidth = this.LineWidth;
        context.rect(this.map["Left"], this.map["Top"], (this.map["Right"] - this.map["Left"]), (this.map["Bottom"] - this.map["Top"]));
        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        return flag;
    }
};

/*多边形*/
var polygon = function (num, map) {
    this.type = DrawType.POLYGON;
    this.num = num;
    this.isShow = false;
    this.isDrawing = false;  //针对多边形是否在重绘
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {};

    for (var i = 0; i < MAX_POLYGON_POINTNUM && ("undefined" != typeof map["PointX" + i]) && ("undefined" != typeof map["PointY" + i]); i++) {
        this.map["PointX" + i] = map["PointX" + i];
        this.map["PointY" + i] = map["PointY" + i];
    }

    this.coordinateNum = i;
};
polygon.prototype = {
    createDrawObj: function (context) {
        var i;

        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.strokeStyle = this.LineColor;
        context.lineWidth = this.LineWidth;
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        // todo <= 中的=控制正在绘制的多边形的正在画的那条动态边可以显示
        // todo 没有正在绘制的多变形最后一个坐标点为 undefined 不过不受影响
        // arrowPolygon中修正了该问题
        for (i = 1; i <= this.coordinateNum; i++) {
            context.lineTo(this.map["PointX" + i], this.map["PointY" + i]);
        }
        if (!this.isDrawing) {    //若多边形正在重绘，则不闭合
            context.lineTo(this.map["PointX0"], this.map["PointY0"]);
        }
        context.stroke();
        context.closePath();

        if (!this.isDrawing && "" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            context.fillText(this.Text, this.map["PointX0"], this.map["PointY0"]);
        }
    },
    isDrawObjSel: function (context, x, y) {           //判断鼠标位置是否在绘制图形内，改变标志位drawFlag,将当前对象设为选中状态
        var flag,
            i;

        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.strokeStyle = "rgba(255,0,0,0)";
        context.lineWidth = this.LineWidth;
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        // todo 与createDrawObj同样的问题
        for (i = 1; i < this.coordinateNum; i++) {
            context.lineTo(this.map["PointX" + i], this.map["PointY" + i]);
        }
        context.lineTo(this.map["PointX0"], this.map["PointY0"]);

        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        return flag;
    }
};


/*带箭头方向的多边形*/
var arrowPolygon = function (num, map) {
    this.type = DrawType.POLYGON_ARROW;
    this.num = num;
    this.isShow = false;
    this.isDrawing = false;
    // 箭头方向
    this.Direction = (("undefined" != typeof map["Direction"]) && !isNaN(map["Direction"])) ? Number(map["Direction"]) : 0;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {};

    for (var i = 0; i < MAX_POLYGON_POINTNUM && ("undefined" != typeof map["PointX" + i]) && ("undefined" != typeof map["PointY" + i]); i++) {
        this.map["PointX" + i] = map["PointX" + i];
        this.map["PointY" + i] = map["PointY" + i];
    }

    this.coordinateNum = i;
};
arrowPolygon.prototype = {
    createDrawObj: function (context) {   //绘制矩形并使图形选中; x,y为鼠标在画布上的坐标
        var i;

        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.strokeStyle = this.LineColor;
        context.lineWidth = this.LineWidth;
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        for (i = 1; i < this.coordinateNum; i++) {
            context.lineTo(this.map["PointX" + i], this.map["PointY" + i]);
        }
        if (this.isDrawing) {
            context.lineTo(this.map["PointX" + this.coordinateNum], this.map["PointY" + this.coordinateNum]);
        }else {
            // 若多边形正在重绘，则不闭合
            context.lineTo(this.map["PointX0"], this.map["PointY0"]);
        }
        context.stroke();
        if (!this.isDrawing) {   //图形已经闭合，开始绘制箭头
            var centerx = (this.map["PointX1"] + this.map["PointX0"]) / 2;  //第一条线的中点坐标
            var centery = (this.map["PointY1"] + this.map["PointY0"]) / 2;

            var flag = this.isArrowDirection(context, centerx, centery);

            var radians = Math.atan((this.map["PointY1"] - this.map["PointY0"]) /
                (this.map["PointX1"] - this.map["PointX0"]));       //旋转角度

            context.save();
            context.beginPath();
            context.translate(centerx, centery);
            context.rotate(radians);
            // todo 此处可以合并
            if (flag && 1 == this.Direction) { //  离开区域
                context.moveTo(0, 20);   //绘制箭头,箭头方向朝上
                context.lineTo(0, -20);
                context.lineTo(-8, -12);
                context.lineTo(0, -20);
                context.lineTo(8, -12);
                context.lineTo(0, -20);
            }
            else if (!flag && 1 == this.Direction) {
                context.moveTo(0, -20);   //绘制箭头,箭头方向朝下
                context.lineTo(0, 20);
                context.lineTo(-8, 12);
                context.lineTo(0, 20);
                context.lineTo(8, 12);
                context.lineTo(0, 20);
            }
            else if (flag && 2 == this.Direction) {  //进入区域
                context.moveTo(0, -20);   //绘制箭头,箭头方向朝下
                context.lineTo(0, 20);
                context.lineTo(-8, 12);
                context.lineTo(0, 20);
                context.lineTo(8, 12);
                context.lineTo(0, 20);
            }
            else if (!flag && 2 == this.Direction) {
                context.moveTo(0, 20);   //绘制箭头，箭头方向朝上
                context.lineTo(0, -20);
                context.lineTo(-8, -12);
                context.lineTo(0, -20);
                context.lineTo(8, -12);
                context.lineTo(0, -20);
            }
            context.stroke();
            context.closePath();
            context.restore();

        }
        context.closePath();

        if (!this.isDrawing && "" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            context.fillText(this.Text, this.map["PointX0"], this.map["PointY0"]);
        }
    },
    isDrawObjSel: function (context, x, y) {           //判断鼠标位置是否在绘制图形内，改变标志位drawFlag,将当前对象设为选中状态
        var flag1,
            i;

        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.strokeStyle = "rgba(255,0,0,0)";
        context.lineWidth = this.LineWidth;
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        // todo 修正polygon中最后一个坐标undefined的问题
        for (i = 1; i < this.coordinateNum; i++) {
            context.lineTo(this.map["PointX" + i], this.map["PointY" + i]);
        }
        context.lineTo(this.map["PointX0"], this.map["PointY0"]);

        flag1 = context.isPointInPath(x, y);
        context.stroke();
        return flag1;
    },
    isArrowDirection: function (context, centerx, centery) {  //判断绘制多边形的箭头方向,centerx,centery:箭头的中点坐标
        var x = centerx;
        var y = centery + 2;  //任取一点，判断此点是否在绘制多边形内，决定箭头方向
        var flag = false;  //标志鼠标位置是否在绘制多边形内
        context.save();
        context.beginPath();
        // context.strokeStyle = this.LineColor;
        // todo 此处再次绘制只为判断点是否在图形上，需设置颜色为透明
        context.strokeStyle = 'rgba(0,0,0,0)';
        context.lineWidth = this.LineWidth;
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        for (var i = 1; i < this.coordinateNum; i++) {
            context.lineTo(this.map["PointX" + i], this.map["PointY" + i]);
        }
        context.lineTo(this.map["PointX0"], this.map["PointY0"]);

        if (context.isPointInPath(x, y)) {
            flag = true;
        }
        context.stroke();
        return flag;
    }
};

/*同心矩形*/
var concentricRect = function (num, map) {
    this.type = DrawType.CONCENTRIC;
    this.num = num;
    this.isShow = false;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColorOut = ("undefined" != typeof map["LineColorOut"]) ? map["LineColorOut"] : "";
    this.LineColorIn = ("undefined" != typeof map["LineColorIn"]) ? map["LineColorIn"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {
        LeftOut: map["LeftOut"],
        TopOut: map["TopOut"],
        RightOut: map["RightOut"],
        BottomOut: map["BottomOut"],
        LeftIn: map["LeftIn"],
        TopIn: map["TopIn"],
        RightIn: map["RightIn"],
        BottomIn: map["BottomIn"]
    };
};
concentricRect.prototype = {
    createDrawObj: function (context) {   //绘制矩形并使图形选中; x,y为鼠标在画布上的坐标
        if (!this.isShow)return;

        context.beginPath();
        context.strokeStyle = this.LineColorOut;
        context.lineWidth = this.LineWidth;
        context.rect(this.map["LeftOut"], this.map["TopOut"], (this.map["RightOut"] - this.map["LeftOut"]),
            (this.map["BottomOut"] - this.map["TopOut"]));
        context.stroke();
        context.closePath();

        context.beginPath();
        context.strokeStyle = this.LineColorIn;
        context.lineWidth = this.LineWidth;
        context.rect(this.map["LeftIn"], this.map["TopIn"], (this.map["RightIn"] - this.map["LeftIn"]),
            (this.map["BottomIn"] - this.map["TopIn"]));
        context.stroke();
        context.closePath();

        if ("" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            // todo Left Top为undefined
            //context.fillText(this.Text, this.map["Left"], this.map["Top"]);
            context.fillText(this.Text, this.map["LeftOut"], this.map["TopOut"]);
        }
    },
    isDrawObjSel: function (context, x, y) {           //判断鼠标位置是否在绘制图形内
        var flag;

        if (!this.isShow)return;

        context.beginPath();
        context.strokeStyle = "rgba(255,0,0,0)";
        context.lineWidth = this.LineWidth;
        context.rect(this.map["LeftOut"], this.map["TopOut"], (this.map["RightOut"] - this.map["LeftOut"]),
            (this.map["BottomOut"] - this.map["TopOut"]));
        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        return flag;
    }
};

/*标定点*/
var point = function (num, map) {
    this.type = DrawType.POINT;
    this.num = num;
    this.isShow = false;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {
        PointX: map["PointX"],
        PointY: map["PointY"]
    };
};
point.prototype = {   //不用判断是否在当前路径内以选中
    createDrawObj: function (context) {
        if (!this.isShow)return;
        context.beginPath();
        context.strokeStyle = this.LineColor;
        // todo lineWidth没加
        context.lineWidth = this.LineWidth;
        context.moveTo(this.map["PointX"], this.map["PointY"]);
        context.lineTo(this.map["PointX"] - 5, this.map["PointY"] - 8);
        context.lineTo(this.map["PointX"] + 5, this.map["PointY"] - 8);
        context.lineTo(this.map["PointX"], this.map["PointY"]);
        context.stroke();
        context.closePath();

        if ("" != this.Text) {
            context.fillStyle = this.LineColor;  //画文字
            context.font = "normal 10px sans-serif";
            context.fillText(this.map["Text"], this.map["PointX"], this.map["PointY"]);
        }
    }
};

/*只能移动的矩形*/
var title = function (num, map) {
    this.type = DrawType.TITLE;
    this.num = num;
    this.isShow = false;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;

    // 是否填充
    this.Fill = (("undefined" != typeof map["Fill"]) && !isNaN(map["Fill"]) && (1 == map["Fill"]));

    // todo 填充颜色
    this.FillColor = ("undefined" != typeof map["FillColor"]) ? map["FillColor"] : "";

    // 坐标信息
    this.map = {
        Left: map["Left"],
        Top: map["Top"],
        Right: map["Right"],
        Bottom: map["Bottom"]
    };
};
title.prototype = {
    createDrawObj: function (context) {
        if (!this.isShow)return;
        context.beginPath();
        context.strokeStyle = this.LineColor;
        context.lineWidth = this.LineWidth;
        if (this.Fill) {
            context.fillStyle = this.FillColor;
        }
        context.rect(this.map["Left"], this.map["Top"], (this.map["Right"] - this.map["Left"]),
            (this.map["Bottom"] - this.map["Top"]));
        context.stroke();
        if (this.Fill) {
            context.fill();
        }
        context.closePath();

        if ("" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            context.fillText(this.Text, this.map["Left"], this.map["Top"]);
        }
    },
    isDrawObjSel: function (context, x, y) {           //判断鼠标位置是否在绘制图形内，改变标志位drawFlag,将当前对象设为选中状态
        var flag;

        if (!this.isShow)return;
        context.save();
        context.beginPath();
        context.strokeStyle = "rgba(255,0,0,0)";
        context.lineWidth = this.LineWidth;
        context.rect(this.map["Left"], this.map["Top"], (this.map["Right"] - this.map["Left"]),
            (this.map["Bottom"] - this.map["Top"]));
        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        return flag;
    }
};


/*客流量线段*/
var lineArrowVernier = function (num, map) {
    this.type = DrawType.EN_DRAW_LINE_ARROW_VERNIER;
    this.num = num;
    this.isShow = false;
    this.bSelVernier = false; //选中游标
    this.vernierNum = 0;      //0表示未选中游标；2:表示选中点2所在游标，3表示选中点3所在游标
    this.ShowVernier = (("undefined" != typeof map["ShowVernier"]) && !isNaN(map["ShowVernier"])) ? Number(map["ShowVernier"]) : 0;  //0不显示，1显示
    // 箭头方向
    this.Direction = (("undefined" != typeof map["Direction"]) && !isNaN(map["Direction"])) ? Number(map["Direction"]) : 0;
    // 文字大小
    this.FontSize = (("undefined" != typeof map["FontSize"]) && !isNaN(map["FontSize"])) ? Number(map["FontSize"]) : 12;
    // 文字内容
    this.Text = ("undefined" != typeof map["Text"]) ? map["Text"] : "";
    // 线颜色
    this.LineColor = ("undefined" != typeof map["LineColor"]) ? map["LineColor"] : "";
    this.VernierColor = ("undefined" != typeof map["VernierColor"]) ? map["VernierColor"] : "";
    // 线宽
    this.LineWidth = (("undefined" != typeof map["LineWidth"]) && !isNaN(map["LineWidth"])) ? Number(map["LineWidth"]) : 2;
    // 坐标信息
    this.map = {};

    for (var i = 0; i < 4 && ("undefined" != typeof map["PointX" + i]) && ("undefined" != typeof map["PointY" + i]); i++) {
        this.map["PointX" + i] = map["PointX" + i];
        this.map["PointY" + i] = map["PointY" + i];
    }
};
lineArrowVernier.prototype = {
    createDrawObj: function (context) {
        var centerx = (this.map["PointX1"] + this.map["PointX0"]) / 2,
            centery = (this.map["PointY1"] + this.map["PointY0"]) / 2,
            radians = Math.atan((this.map["PointY1"] - this.map["PointY0"]) /
                (this.map["PointX1"] - this.map["PointX0"]));       //旋转角度

        if (!this.isShow)return;
        context.beginPath();
        context.lineWidth = this.LineWidth;
        context.strokeStyle = this.LineColor;   //画直线
        context.moveTo(this.map["PointX0"], this.map["PointY0"]);
        context.lineTo(this.map["PointX1"], this.map["PointY1"]);
        context.stroke();

        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        if (((this.map["PointX1"] > this.map["PointX0"]) &&
            (this.map["PointY1"] < this.map["PointY0"])) ||
            ((this.map["PointX1"] > this.map["PointX0"]) &&
            (this.map["PointY1"] > this.map["PointY0"]))) {
            context.rotate(radians);
        }
        else if (((this.map["PointX1"] < this.map["PointX0"]) &&
            (this.map["PointY1"] > this.map["PointY0"])) ||
            ((this.map["PointX1"] < this.map["PointX0"]) &&
            (this.map["PointY1"] < this.map["PointY0"]))
        ) {
            context.rotate(radians + Math.PI);
        }
        if (0 == this.Direction) {  //箭头双向
            context.moveTo(0, 0);
            context.lineTo(0, 20);
            context.lineTo(-8, 12);
            context.lineTo(0, 20);
            context.lineTo(8, 12);
            context.lineTo(0, 20);
            context.lineTo(0, -20);
            context.lineTo(-8, -12);
            context.lineTo(0, -20);
            context.lineTo(8, -12);
            context.lineTo(0, -20);
        }
        else if (1 == this.Direction) { //鼠标划过方向左侧
            context.moveTo(0, 20);   //绘制箭头
            context.lineTo(0, -20);
            context.lineTo(-8, -12);
            context.lineTo(0, -20);
            context.lineTo(8, -12);
            context.lineTo(0, -20);
        }
        else if (2 == this.Direction) {
            context.moveTo(0, -20);   //绘制箭头
            context.lineTo(0, 20);
            context.lineTo(-8, 12);
            context.lineTo(0, 20);
            context.lineTo(8, 12);
            context.lineTo(0, 20);
        }
        context.stroke();
        context.closePath();
        context.restore();
        //绘制游标
        if (1 == this.ShowVernier) {
            context.beginPath();
            context.save();
            context.translate(this.map["PointX2"], this.map["PointY2"]);
            context.rotate(radians);
            context.strokeStyle = this.VernierColor;
            context.lineWidth = this.LineWidth;
            context.moveTo(0, -20);
            context.lineTo(0, 20);
            context.stroke();
            context.restore();

            context.save();
            context.translate(this.map["PointX3"], this.map["PointY3"]);
            context.rotate(radians);
            context.strokeStyle = this.VernierColor;
            context.lineWidth = this.LineWidth;
            context.moveTo(0, -20);
            context.lineTo(0, 20);
            context.stroke();
            context.restore();
            context.closePath();
        }

        if ("" != this.Text) {
            context.fillStyle = "black";  //画文字
            context.font = this.FontSize + "px sans-serif";
            context.fillText(this.Text, this.map["PointX0"], this.map["PointY0"]);
        }
    },
    isDrawObjSel: function (context, x, y) {
        var flag,
            centerx = (this.map["PointX1"] + this.map["PointX0"]) / 2,
            centery = (this.map["PointY1"] + this.map["PointY0"]) / 2,
            radians = Math.atan(((this.map["PointY1"]) - (this.map["PointY0"])) /
                ((this.map["PointX1"]) - (this.map["PointX0"]))),       //旋转角度
            distance = Math.sqrt(Math.pow(this.map["PointX1"] - this.map["PointX0"], 2) +
                Math.pow(this.map["PointY1"] - this.map["PointY0"], 2));

        if (!this.isShow)return;
        // 先判断是否在直线上
        context.save();
        context.beginPath();
        context.translate(centerx, centery);
        context.rotate(radians);
        context.strokeStyle = "rgba(255,255,255,0)";
        context.rect(-distance / 2 - 5, -5, distance + 10, 10);
        flag = context.isPointInPath(x, y);
        context.stroke();
        context.closePath();
        context.restore();

        //不在线上，则判断是否在游标上
        // todo 判断游标之前，不需要重置bSelVernier vernierNum么
        if (!flag && (1 == this.ShowVernier)) {
            // 判断是否在第一个游标上
            context.beginPath();
            context.save();
            context.translate(this.map["PointX2"], this.map["PointY2"]);
            context.rotate(radians);
            context.strokeStyle = 'rgba(255,255,255,0)';
            context.rect(-5, -25, 10, 50);
            var flag1 = context.isPointInPath(x, y);
            if (flag1) {
                this.bSelVernier = true;
                this.vernierNum = 2;
            }
            context.stroke();
            context.restore();
            context.closePath();

            // 不在第一个游标上，则判断是否在第二个游标上
            if (!flag1) {
                context.beginPath();
                context.save();
                context.translate(this.map["PointX3"], this.map["PointY3"]);
                context.rotate(radians);
                context.strokeStyle = 'rgba(255,255,255,0)';
                context.rect(-5, -25, 10, 50);
                if (context.isPointInPath(x, y)) {
                    this.bSelVernier = true;
                    this.vernierNum = 3;
                }
                context.stroke();
                context.restore();
                context.closePath();
            }
        }
        return flag;
    }
};

/*数字放大的矩形*/
var rectZoom = function (num, map) {
    this.type = DrawType.RECT_ZOOM;
    this.num = num;
    this.map = map;
    this.isShow = false;
};
rectZoom.prototype = {
    createDrawObj: function (context, map) {   //绘制矩形并使图形选中; x,y为鼠标在画布上的坐标
        if (!this.isShow)return;
        context.beginPath();
        context.strokeStyle = map["LineColor"];
        context.lineWidth = map["LineWidth"];
        context.rect(map["Left"], map["Top"], (map["Right"] - map["Left"]), (map["Bottom"] - map["Top"]));
        context.stroke();
        context.closePath();
    }
};

var DrawObj = function (canvasPosId, drawObjInfoMap) {
    this.videoID = canvasPosId; // 播放窗口ID
    this.canvas = null;         // 画布对象
    this.ctx = null;            // 绘图上下文
    this.drawMap = {};          // 存储实例化的图形对象的集合
    this.anchorList = [];       // 待绘制描点的坐标集合
    this.currentC = null;       // 存储当前选中的图形对象
    this.tempCurrentC = null;    // 临时记录鼠标所在的图形对象，用于选中事件上报
    this.mousePosition = MOUSE_POSITION.NONE;   // 鼠标所在位置（图形上，锚点上，其他地方）
    this.isMouseDown = false;   // 鼠标是否按下
    this.mouseDownX;             //鼠标按下坐标x
    this.mouseDownY;             //鼠标按下坐标y
    this.changex;               //要拖动的图形坐标点（锚点的中心坐标x）
    this.changey;               //要拖动的图形坐标点（锚点的中心坐标y）
    this.isReport = false;      // 是否需要上报坐标（图形的坐标位置已发生变更）

    // 生成画布
    this.setCanvas();

    // 初始化
    this.init(drawObjInfoMap);

    // 显示
    var that = this;
    // todo 缺少销毁对象、清除定时器的方法
    setInterval(function () {
        that.reDraw(that);
    }, 40);
};
DrawObj.prototype = {
    /*
     * 初始化图形对象
     *
     * @param cavansPosId 画布位置id
     * @param drawObjInfoMap 图形数据集合
     * */
    init: function (drawObjInfoMap) {
        var drawObj,        // 图形对象
            drawObjType,    // 绘图类型
            drawObjInfoList,// 某一绘图类型数据的集合
            index,          // 某一绘图类型数据集合的下标
            len,            // 某一绘图类型数据集合的大小
            drawObjInfo;        // 某一绘图类型集合中的一个图形数据
        //初始化图形坐标
        this.initCoordinate(drawObjInfoMap);

        for (drawObjType in drawObjInfoMap) {
            if (!drawObjInfoMap.hasOwnProperty(drawObjType))continue;
            drawObjType = Number(drawObjType);  // 类型转换
            drawObjInfoList = drawObjInfoMap[drawObjType];
            this.drawMap[drawObjType] = [];
            for (index = 0, len = drawObjInfoList.length; index < len; index++) {
                drawObjInfo = drawObjInfoList[index];
                //todo anchorList挪到外面去写
                this.anchorList = [];
                switch (Number(drawObjType)) {
                    case 0:
                        drawObj = new Line(index, drawObjInfo);
                        break;
                    case 1:
                        drawObj = new arrowLine(index, drawObjInfo);
                        break;
                    case 2:
                        drawObj = new CEZRect(index, drawObjInfo);
                        break;
                    case 3:
                        drawObj = new arrowRect(index, drawObjInfo);
                        break;
                    case 4:
                        drawObj = new polygon(index, drawObjInfo);
                        break;
                    case 5:
                        drawObj = new arrowPolygon(index, drawObjInfo);
                        break;
                    case 6:
                        drawObj = new concentricRect(index, drawObjInfo);
                        break;
                    case 7:
                        drawObj = new point(index, drawObjInfo);
                        break;
                    case 8:
                        drawObj = new title(index, drawObjInfo);
                        break;
                    case 9:
                        drawObj = new rectZoom(index, drawObjInfo);
                        break;
                    case 10:
                        drawObj = new lineArrowVernier(index, drawObjInfo);
                        break;
                    default:
                        throw new Error("unknow drawObjType(" + drawObjType + ")")
                }
                this.drawMap[drawObjType].push(drawObj);
            }
        }
    },

    /*
     * 初始化图形坐标,万分比转换为canvas坐标
     * */
    initCoordinate: function (drawObjInfoMap) {
        var drawObjType,    // 绘图类型
            drawObjInfoList,// 某一绘图类型数据的集合
            index,          // 某一绘图类型数据集合的下标
            len,            // 某一绘图类型数据集合的大小
            drawObjInfo;        // 某一绘图类型集合中的一个图形数据

        for (drawObjType in drawObjInfoMap) {
            if (!drawObjInfoMap.hasOwnProperty(drawObjType))continue;
            drawObjInfoList = drawObjInfoMap[drawObjType];

            for (index = 0, len = drawObjInfoList.length; index < len; index++) {
                drawObjInfo = drawObjInfoList[index];
                switch (Number(drawObjType)) {
                    case 0:
                    case 1:
                        if ((("undefined" != typeof drawObjInfo["PointX0"]) && !isNaN(drawObjInfo["PointX0"])) &&
                            (("undefined" != typeof drawObjInfo["PointY0"]) && !isNaN(drawObjInfo["PointY0"])) &&
                            (("undefined" != typeof drawObjInfo["PointX1"]) && !isNaN(drawObjInfo["PointX1"])) &&
                            (("undefined" != typeof drawObjInfo["PointY1"]) && !isNaN(drawObjInfo["PointY1"]))) {
                            drawObjInfo["PointX0"] = Number(drawObjInfo["PointX0"]) / 10000 * this.canvas.width;
                            drawObjInfo["PointY0"] = Number(drawObjInfo["PointY0"]) / 10000 * this.canvas.height;
                            drawObjInfo["PointX1"] = Number(drawObjInfo["PointX1"]) / 10000 * this.canvas.width;
                            drawObjInfo["PointY1"] = Number(drawObjInfo["PointY1"]) / 10000 * this.canvas.height;
                        }
                        else {
                            drawObjInfo["PointX0"] = 0;
                            drawObjInfo["PointY0"] = 0;
                            drawObjInfo["PointX1"] = 100;
                            drawObjInfo["PointY1"] = 100;
                        }
                        break;
                    case 2:
                    case 3:
                    case 8:
                    case 9:
                        if ((("undefined" != typeof drawObjInfo["Left"]) && !isNaN(drawObjInfo["Left"])) &&
                            (("undefined" != typeof drawObjInfo["Top"]) && !isNaN(drawObjInfo["Top"])) &&
                            (("undefined" != typeof drawObjInfo["Right"]) && !isNaN(drawObjInfo["Right"])) &&
                            (("undefined" != typeof drawObjInfo["Bottom"]) && !isNaN(drawObjInfo["Bottom"]))) {
                            drawObjInfo["Left"] = Number(drawObjInfo["Left"]) / 10000 * this.canvas.width;
                            drawObjInfo["Top"] = Number(drawObjInfo["Top"]) / 10000 * this.canvas.height;
                            drawObjInfo["Right"] = Number(drawObjInfo["Right"]) / 10000 * this.canvas.width;
                            drawObjInfo["Bottom"] = Number(drawObjInfo["Bottom"]) / 10000 * this.canvas.height;
                        }
                        else {
                            drawObjInfo["Left"] = 0;
                            drawObjInfo["Top"] = 0;
                            drawObjInfo["Right"] = 1000;
                            drawObjInfo["Bottom"] = 1000;
                        }
                        break;
                    case 4:
                    case 5:
                        var flag = true;   //坐标值是否满足要求
                        for (var i = 0; i < MAX_POLYGON_POINTNUM && ("undefined" != typeof drawObjInfo["PointX" + i]) && ("undefined" != typeof drawObjInfo["PointY" + i]); i++) {
                            if (isNaN(drawObjInfo["PointX" + i]) || isNaN(drawObjInfo["PointY" + i])) {
                                flag = false;
                            }
                        }
                        for (i = 0; i < MAX_POLYGON_POINTNUM && ("undefined" != typeof drawObjInfo["PointX" + i]) && ("undefined" != typeof drawObjInfo["PointY" + i]); i++) {
                            if (flag) {
                                drawObjInfo["PointX" + i] = Number(drawObjInfo["PointX" + i]) / 10000 * this.canvas.width;
                                drawObjInfo["PointY" + i] = Number(drawObjInfo["PointY" + i]) / 10000 * this.canvas.height;
                            }
                            else {
                                drawObjInfo["PointX" + i] = 0;
                                drawObjInfo["PointY" + i] = 0;
                            }
                        }
                        break;
                    case 6:
                        if ((("undefined" != typeof drawObjInfo["LeftOut"]) && !isNaN(drawObjInfo["LeftOut"])) &&
                            (("undefined" != typeof drawObjInfo["TopOut"]) && !isNaN(drawObjInfo["TopOut"])) &&
                            (("undefined" != typeof drawObjInfo["RightOut"]) && !isNaN(drawObjInfo["RightOut"])) &&
                            (("undefined" != typeof drawObjInfo["BottomOut"]) && !isNaN(drawObjInfo["BottomOut"])) &&
                            (("undefined" != typeof drawObjInfo["LeftIn"]) && !isNaN(drawObjInfo["LeftIn"])) &&
                            (("undefined" != typeof drawObjInfo["TopIn"]) && !isNaN(drawObjInfo["TopIn"])) &&
                            (("undefined" != typeof drawObjInfo["RightIn"]) && !isNaN(drawObjInfo["RightIn"])) &&
                            (("undefined" != typeof drawObjInfo["BottomIn"]) && !isNaN(drawObjInfo["BottomIn"]))) {
                            drawObjInfo["LeftOut"] = Number(drawObjInfo["LeftOut"]) / 10000 * this.canvas.width;
                            drawObjInfo["TopOut"] = Number(drawObjInfo["TopOut"]) / 10000 * this.canvas.height;
                            drawObjInfo["RightOut"] = Number(drawObjInfo["RightOut"]) / 10000 * this.canvas.width;
                            drawObjInfo["BottomOut"] = Number(drawObjInfo["BottomOut"]) / 10000 * this.canvas.height;
                            drawObjInfo["LeftIn"] = Number(drawObjInfo["LeftIn"]) / 10000 * this.canvas.width;
                            drawObjInfo["TopIn"] = Number(drawObjInfo["TopIn"]) / 10000 * this.canvas.height;
                            drawObjInfo["RightIn"] = Number(drawObjInfo["RightIn"]) / 10000 * this.canvas.width;
                            drawObjInfo["BottomIn"] = Number(drawObjInfo["BottomIn"]) / 10000 * this.canvas.height;
                        }
                        else {
                            drawObjInfo["LeftOut"] = 0;
                            drawObjInfo["TopOut"] = 0;
                            drawObjInfo["RightOut"] = 100;
                            drawObjInfo["BottomOut"] = 100;
                            drawObjInfo["LeftIn"] = 20;
                            drawObjInfo["TopIn"] = 20;
                            drawObjInfo["RightIn"] = 80;
                            drawObjInfo["BottomIn"] = 80;
                        }
                        break;
                    case 7:
                        if ((("undefined" != typeof drawObjInfo["PointX"]) && !isNaN(drawObjInfo["PointX"])) && (("undefined" != typeof drawObjInfo["PointY"]) && !isNaN(drawObjInfo["PointY"]))) {
                            drawObjInfo["PointX"] = Number(drawObjInfo["PointX"]) / 10000 * this.canvas.width;
                            drawObjInfo["PointY"] = Number(drawObjInfo["PointY"]) / 10000 * this.canvas.height;
                        }
                        else {
                            drawObjInfo["PointX"] = 100;
                            drawObjInfo["PointY"] = 100;
                        }
                        break;
                    case 10:
                        var flag1 = true;   //坐标值是否满足要求
                        for (i = 0; i < 4 && ("undefined" != typeof drawObjInfo["PointX" + i]) && ("undefined" != typeof drawObjInfo["PointY" + i]); i++) {
                            if (isNaN(drawObjInfo["PointX" + i]) || isNaN(drawObjInfo["PointY" + i])) {
                                flag = false;
                            }
                        }
                        for (i = 0; i < 4 && ("undefined" != typeof drawObjInfo["PointX" + i]) && ("undefined" != typeof drawObjInfo["PointY" + i]); i++) {
                            if (flag1) {
                                drawObjInfo["PointX" + i] = Number(drawObjInfo["PointX" + i]) / 10000 * this.canvas.width;
                                drawObjInfo["PointY" + i] = Number(drawObjInfo["PointY" + i]) / 10000 * this.canvas.height;
                            }
                            else {
                                drawObjInfo["PointX" + i] = 0;
                                drawObjInfo["PointY" + i] = 0;
                            }
                        }
                        break;
                    default:
                        throw new Error("unknow drawObjType(" + drawObjType + ")")
                }
            }
        }
    },

    /**
     * 按媒体比例设置canvas大小及位置
     * */
    setCanvas: function () {
        var canvasHtml = "<canvas id='canvas_" + this.videoID + "' width='0' height='0' style='position:absolute;left: 0;border: 1px solid grey;'></canvas>",
            $video = $("#" + this.videoID),
            $canvas,
            that;

        $("body").append(canvasHtml);
        $canvas = $("#canvas_" + this.videoID);
        this.canvas = $canvas.get(0);
        this.ctx = this.canvas.getContext('2d');
        // todo 目标对象开始选中时，禁止双击变蓝
        this.canvas.onselectstart = function () {
            return false;
        };
        that = this;
        $canvas.mousemove(function () {
            that.doMousemove(that);
        });
        $canvas.mousedown(function () {
            that.doMousedown(that);
        });
        $canvas.mouseup(function () {
            that.doMouseup(that);
        });
        $canvas.dblclick(function () {
            that.doDblclick(that);
        });
        $video.resize(function () {
            that.changeCanvasSize(that);
        });

        this.changeCanvasSize(that);
    },

    /**
     * 改变画布大小使其适应窗口变化
     *
     * */
    // todo that可以不必传入，用this即可
    changeCanvasSize: function (that) {
        that = that || this;
        var video = $("#" + that.videoID).get(0),
            $canvas = $(that.canvas),
            canvasLeft,
            canvasTop,
            videoLeft = video.getBoundingClientRect().left,
            videoTop = video.getBoundingClientRect().top,
            canvasOld = that.canvas;

        if (video.width / video.height > video.videoWidth / video.videoHeight) {   //video宽设置比较大
            canvasLeft = videoLeft + ( video.width - video.height * (video.videoWidth / video.videoHeight)) / 2;
            $canvas.css("left", canvasLeft);
            $canvas.css("top", videoTop);
            that.canvas.width = video.height * (video.videoWidth / video.videoHeight);
            that.canvas.height = video.height;
        }
        else {
            canvasTop = videoTop + (video.height - video.width * (video.videoHeight / video.videoWidth)) / 2;
            $canvas.css("left", videoLeft);
            $canvas.css("top", canvasTop);
            that.canvas.width = video.width;
            that.canvas.height = video.width * (video.videoHeight / video.videoWidth);
        }
        // todo canvasOld与that.canvas不是指向同一个对象？
        this.updateCoordinate(canvasOld, that.canvas);
    },

    /*
     * 更新画布改变后图形实例对象的坐标值
     * */
    updateCoordinate: function (canvasOld, canvasNew) {
        var drawObjType,
            index,
            len,
            drawObjInfo,
            drawObjInfoList;
        if (!this.drawMap)return;  //初始化画布时图形实例为空，此时不必要改变图形比例
        for (drawObjType in this.drawMap) {
            if (!this.drawMap.hasOwnProperty(drawObjType))continue;
            drawObjInfoList = this.drawMap[drawObjType];
            for (index = 0, len = drawObjInfoList.length; index < len; index++) {
                drawObjInfo = drawObjInfoList[index];
                switch (Number(drawObjType)) {
                    case 0:
                    case 1:
                        drawObjInfo["PointX0"] = drawObjInfo["PointX0"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["PointY0"] = drawObjInfo["PointY0"] / canvasOld.height * canvasNew.height;
                        drawObjInfo["PointX1"] = drawObjInfo["PointX1"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["PointY1"] = drawObjInfo["PointY1"] / canvasOld.height * canvasNew.height;
                        break;
                    case 2:
                    case 3:
                    case 8:
                    case 9:
                        drawObjInfo["Left"] = drawObjInfo["Left"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["Top"] = drawObjInfo["Top"] / canvasOld.height * canvasNew.height;
                        drawObjInfo["Right"] = drawObjInfo["Right"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["Bottom"] = drawObjInfo["Bottom"] / canvasOld.height * canvasNew.height;
                        break;
                    case 4:
                    case 5:
                        for (i = 0; i < MAX_POLYGON_POINTNUM && ("undefined" != typeof drawObjInfo["PointX" + i]) && ("undefined" != typeof drawObjInfo["PointY" + i]); i++) {
                            drawObjInfo["PointX" + i] = drawObjInfo["PointX" + i] / canvasOld.width * canvasNew.width;
                            drawObjInfo["PointY" + i] = drawObjInfo["PointY" + i] / canvasOld.height * canvasNew.height;
                        }
                        break;
                    case 6:
                        drawObjInfo["LeftOut"] = drawObjInfo["LeftOut"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["TopOut"] = drawObjInfo["TopOut"] / canvasOld.height * canvasNew.height;
                        drawObjInfo["RightOut"] = drawObjInfo["RightOut"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["BottomOut"] = drawObjInfo["BottomOut"] / canvasOld.height * canvasNew.height;
                        drawObjInfo["LeftIn"] = drawObjInfo["LeftIn"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["TopIn"] = drawObjInfo["TopIn"] / canvasOld.height * canvasNew.height;
                        drawObjInfo["RightIn"] = drawObjInfo["RightIn"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["BottomIn"] = drawObjInfo["BottomIn"] / canvasOld.height * canvasNew.height;
                        break;
                    case 7:
                        drawObjInfo["PointX"] = drawObjInfo["PointX"] / canvasOld.width * canvasNew.width;
                        drawObjInfo["PointY"] = drawObjInfo["PointY"] / canvasOld.height * canvasNew.height;
                        break;
                    case 10:
                        for (var i = 0; i < 4 && ("undefined" != typeof drawObjInfo["PointX" + i]) && ("undefined" != typeof drawObjInfo["PointY" + i]); i++) {
                            drawObjInfo["PointX" + i] = drawObjInfo["PointX" + i] / canvasOld.width * canvasNew.width;
                            drawObjInfo["PointY" + i] = drawObjInfo["PointY" + i] / canvasOld.height * canvasNew.height;
                        }
                        break;
                    default:
                        throw new Error("unknow drawObjType(" + drawObjType + ")")
                }
            }
        }
    },

    /**
     * 绘制锚点
     *
     * */
    drawAnchor: function () {
        var i,
            len,
            pointX,
            pointY;

        for (i = 0, len = this.anchorList.length; i < len; i++) {
            pointX = Number(this.anchorList[i]["PointX"]);
            pointY = Number(this.anchorList[i]["PointY"]);
            this.ctx.beginPath();
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;
            this.ctx.rect((pointX - 4), (pointY - 4), 8, 8);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    },

    /*
     * 更新锚点信息图形
     *
     * */
    updateAnchor: function () {
        var drawOjbPosMap = this.currentC["map"],
            pointMap,
            j;

        this.anchorList = [];

        switch (Number(this.currentC["type"])) {
            case 0:
            case 1:
                for (j = 0; j < 2; j++) {
                    pointMap = {};
                    pointMap["PointX"] = drawOjbPosMap["PointX" + j];
                    pointMap["PointY"] = drawOjbPosMap["PointY" + j];
                    pointMap["refPointKey"] = ["PointX" + j, "PointY" + j];
                    this.anchorList.push(pointMap);
                }
                break;

            case 2:
            case 3:
            case 9:
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["Left"];
                pointMap["PointY"] = drawOjbPosMap["Top"];
                pointMap["refPointKey"] = ["Left", "Top"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["Right"];
                pointMap["PointY"] = drawOjbPosMap["Top"];
                pointMap["refPointKey"] = ["Right", "Top"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["Left"];
                pointMap["PointY"] = drawOjbPosMap["Bottom"];
                pointMap["refPointKey"] = ["Left", "Bottom"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["Right"];
                pointMap["PointY"] = drawOjbPosMap["Bottom"];
                pointMap["refPointKey"] = ["Right", "Bottom"];
                this.anchorList.push(pointMap);
                break;

            case 4:
            case 5:
                for (j = 0; j < this.currentC["coordinateNum"]; j++) {
                    pointMap = {};
                    pointMap["PointX"] = drawOjbPosMap["PointX" + j];
                    pointMap["PointY"] = drawOjbPosMap["PointY" + j];
                    pointMap["refPointKey"] = ["PointX" + j, "PointY" + j];
                    this.anchorList.push(pointMap);
                }
                break;

            case 6:
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["LeftIn"];
                pointMap["PointY"] = drawOjbPosMap["TopIn"];
                pointMap["refPointKey"] = ["LeftIn", "TopIn"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["RightIn"];
                pointMap["PointY"] = drawOjbPosMap["TopIn"];
                pointMap["refPointKey"] = ["RightIn", "TopIn"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["LeftIn"];
                pointMap["PointY"] = drawOjbPosMap["BottomIn"];
                pointMap["refPointKey"] = ["LeftIn", "BottomIn"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["RightIn"];
                pointMap["PointY"] = drawOjbPosMap["BottomIn"];
                pointMap["refPointKey"] = ["RightIn", "BottomIn"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["LeftOut"];
                pointMap["PointY"] = drawOjbPosMap["TopOut"];
                pointMap["refPointKey"] = ["LeftOut", "TopOut"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["RightOut"];
                pointMap["PointY"] = drawOjbPosMap["TopOut"];
                pointMap["refPointKey"] = ["RightOut", "TopOut"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["LeftOut"];
                pointMap["PointY"] = drawOjbPosMap["BottomOut"];
                pointMap["refPointKey"] = ["LeftOut", "BottomOut"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["RightOut"];
                pointMap["PointY"] = drawOjbPosMap["BottomOut"];
                pointMap["refPointKey"] = ["RightOut", "BottomOut"];
                this.anchorList.push(pointMap);
                break;
            case 7:
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["PointX"];
                pointMap["PointY"] = drawOjbPosMap["PointY"];
                pointMap["refPointKey"] = ["PointX", "PointY"];
                this.anchorList.push(pointMap);
                break;
            case 8:
                break;
            case 10:
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["PointX0"];
                pointMap["PointY"] = drawOjbPosMap["PointY0"];
                pointMap["refPointKey"] = ["PointX0", "PointY0"];
                this.anchorList.push(pointMap);
                pointMap = {};
                pointMap["PointX"] = drawOjbPosMap["PointX1"];
                pointMap["PointY"] = drawOjbPosMap["PointY1"];
                pointMap["refPointKey"] = ["PointX1", "PointY1"];
                this.anchorList.push(pointMap);
                break;
            default:
                throw new Error("unknow drawObjType(" + this.currentC["type"] + ")")
        }
    },

    /*
     * 重绘图形
     *
     * */
    reDraw: function (that) {
        var drawObjType,    // 图形类型
            drawObjList,    // 图形对象数组
            drawObj,        // 图形对象
            i,
            len;

        that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height); //清除画布

        // 重绘所有图形
        for (drawObjType in that.drawMap) {
            if (!that.drawMap.hasOwnProperty(drawObjType))continue;
            drawObjList = that.drawMap[drawObjType];
            for (i = 0, len = drawObjList.length; i < len; i++) {
                drawObj = drawObjList[i];
                drawObj.createDrawObj(that.ctx);
            }
        }

        // 重绘锚点
        that.drawAnchor();
    },

    /*
     * 图形移动事件
     *
     * */
    moveDrawObj: function (x, y) {
        var distanceX = x - this.mouseDownX,
            distanceY = y - this.mouseDownY,
            drawOjbPosMap = this.currentC["map"],
            i;
        //todo 这两句话相当于保存了前一次move的坐标结果，用作下一个move的前一个坐标值
        this.mouseDownX = x;
        this.mouseDownY = y;

        switch (this.currentC["type"]) {
            case 0:
            case 1:
                drawOjbPosMap["PointX0"] += distanceX;
                drawOjbPosMap["PointY0"] += distanceY;
                drawOjbPosMap["PointX1"] += distanceX;
                drawOjbPosMap["PointY1"] += distanceY;

                break;
            case 2:
            case 3:
            case 8:
                drawOjbPosMap["Left"] += distanceX;
                drawOjbPosMap["Top"] += distanceY;
                drawOjbPosMap["Right"] += distanceX;
                drawOjbPosMap["Bottom"] += distanceY;
                break;
            case 4:
            case 5:
                for (i = 0; i < this.currentC.coordinateNum; i++) {
                    drawOjbPosMap["PointX" + i] += distanceX;
                    drawOjbPosMap["PointY" + i] += distanceY;
                }
                break;
            case 6:
                drawOjbPosMap["LeftIn"] += distanceX;
                drawOjbPosMap["TopIn"] += distanceY;
                drawOjbPosMap["RightIn"] += distanceX;
                drawOjbPosMap["BottomIn"] += distanceY;
                drawOjbPosMap["LeftOut"] += distanceX;
                drawOjbPosMap["TopOut"] += distanceY;
                drawOjbPosMap["RightOut"] += distanceX;
                drawOjbPosMap["BottomOut"] += distanceY;
                break;
            case 7:
                break;
            case 9:
                break;
            case 10:
                drawOjbPosMap["PointX0"] += distanceX;
                drawOjbPosMap["PointY0"] += distanceY;
                drawOjbPosMap["PointX1"] += distanceX;
                drawOjbPosMap["PointY1"] += distanceY;
                drawOjbPosMap["PointX2"] += distanceX;
                drawOjbPosMap["PointY2"] += distanceY;
                drawOjbPosMap["PointX3"] += distanceX;
                drawOjbPosMap["PointY3"] += distanceY;
                break;
        }
    },

    /**
     * 画图形（动作）
     **/
    draw: function (x, y) {
        var distanceX,
            distanceY,
            drawOjbPosMap,
            centerX,
            centerY,
            pro,
            pointNum;

        if (!this.currentC)return;

        drawOjbPosMap = this.currentC["map"];
        pointNum = this.currentC["coordinateNum"];

        // TODO 图形最小尺寸 移动距离太小不进行重绘
        if ("undefined" == typeof this.currentC["isDrawing"]) {  //非多边形
            if (Math.pow(Math.abs(x - this.mouseDownX), 2) + Math.pow(Math.abs(y - this.mouseDownY), 2) < Math.pow(MIN_WIDTH, 2)) return;
        }
        switch (this.currentC["type"]) {
            case 0:
            case 1:
                drawOjbPosMap["PointX0"] = this.mouseDownX;
                drawOjbPosMap["PointY0"] = this.mouseDownY;
                drawOjbPosMap["PointX1"] = x;
                drawOjbPosMap["PointY1"] = y;
                break;
            case 2:
            case 3:
                drawOjbPosMap["Left"] = this.mouseDownX;
                drawOjbPosMap["Top"] = this.mouseDownY;
                drawOjbPosMap["Right"] = x;
                drawOjbPosMap["Bottom"] = y;
                break;
            case 4:
            case 5:
                // 多边形
                drawOjbPosMap["PointX" + pointNum] = x;
                drawOjbPosMap["PointY" + pointNum] = y;
                break;
            case 6:
                drawOjbPosMap["LeftOut"] = this.mouseDownX;
                drawOjbPosMap["TopOut"] = this.mouseDownY;
                drawOjbPosMap["RightOut"] = x;
                drawOjbPosMap["BottomOut"] = y;

                distanceX = (drawOjbPosMap["RightOut"] - drawOjbPosMap["LeftOut"]) / 4;
                distanceY = (drawOjbPosMap["BottomOut"] - drawOjbPosMap["TopOut"]) / 4;

                drawOjbPosMap["LeftIn"] = drawOjbPosMap["LeftOut"] + distanceX;
                drawOjbPosMap["RightIn"] = drawOjbPosMap["RightOut"] - distanceX;
                drawOjbPosMap["TopIn"] = drawOjbPosMap["TopOut"] + distanceY;
                drawOjbPosMap["BottomIn"] = drawOjbPosMap["BottomOut"] - distanceY;
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                if (this.currentC.bSelVernier) { //选中客流量线段的游标
                    centerX = (drawOjbPosMap["PointX0"] + drawOjbPosMap["PointX1"]) / 2;
                    centerY = (drawOjbPosMap["PointY0"] + drawOjbPosMap["PointY1"]) / 2;
                    if (2 == this.currentC.vernierNum) {  //选中点为2的游标
                        // todo 游标绘制边界条件的处理
                        if (((centerX > drawOjbPosMap["PointX0"]) && (x > centerX)) ||
                            ((centerX <= drawOjbPosMap["PointX0"]) && (x < centerX))) {
                            drawOjbPosMap["PointX2"] = centerX;
                            drawOjbPosMap["PointY2"] = centerY;
                            drawOjbPosMap["PointX3"] = centerX;
                            drawOjbPosMap["PointY3"] = centerY;
                        }
                        else if (((centerX > drawOjbPosMap["PointX0"]) && (x < drawOjbPosMap["PointX0"])) ||
                            ((centerX <= drawOjbPosMap["PointX0"]) && (x > drawOjbPosMap["PointX0"]))) {
                            drawOjbPosMap["PointX2"] = drawOjbPosMap["PointX0"];
                            drawOjbPosMap["PointY2"] = drawOjbPosMap["PointY0"];
                            drawOjbPosMap["PointX3"] = drawOjbPosMap["PointX1"];
                            drawOjbPosMap["PointY3"] = drawOjbPosMap["PointY1"];
                        }
                        else {
                            drawOjbPosMap["PointX2"] = x;
                            pro = (drawOjbPosMap["PointX2"] - drawOjbPosMap["PointX0"]) /
                                (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
                            drawOjbPosMap["PointY2"] = drawOjbPosMap["PointY0"] + pro * (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
                            drawOjbPosMap["PointX3"] = drawOjbPosMap["PointX1"] - pro * (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
                            drawOjbPosMap["PointY3"] = drawOjbPosMap["PointY1"] - pro * (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
                        }
                    }
                    else if (3 == this.currentC.vernierNum) {
                        // todo 游标绘制边界条件的处理
                        if (((centerX > drawOjbPosMap["PointX1"]) && (x > centerX)) ||
                            ((centerX <= drawOjbPosMap["PointX1"]) && (x < centerX))) {
                            drawOjbPosMap["PointX2"] = centerX;
                            drawOjbPosMap["PointY2"] = centerY;
                            drawOjbPosMap["PointX3"] = centerX;
                            drawOjbPosMap["PointY3"] = centerY;
                        }
                        else if (((centerX > drawOjbPosMap["PointX1"]) && (x < drawOjbPosMap["PointX1"])) ||
                            ((centerX <= drawOjbPosMap["PointX1"]) && (x > drawOjbPosMap["PointX1"]))) {
                            drawOjbPosMap["PointX2"] = drawOjbPosMap["PointX0"];
                            drawOjbPosMap["PointY2"] = drawOjbPosMap["PointY0"];
                            drawOjbPosMap["PointX3"] = drawOjbPosMap["PointX1"];
                            drawOjbPosMap["PointY3"] = drawOjbPosMap["PointY1"];
                        }
                        else {
                            drawOjbPosMap["PointX3"] = x;
                            pro = (drawOjbPosMap["PointX3"] - drawOjbPosMap["PointX1"]) /
                                (drawOjbPosMap["PointX0"] - drawOjbPosMap["PointX1"]);
                            drawOjbPosMap["PointY3"] = drawOjbPosMap["PointY1"] + pro * (drawOjbPosMap["PointY0"] - drawOjbPosMap["PointY1"]);
                            drawOjbPosMap["PointX2"] = drawOjbPosMap["PointX0"] - pro * (drawOjbPosMap["PointX0"] - drawOjbPosMap["PointX1"]);
                            drawOjbPosMap["PointY2"] = drawOjbPosMap["PointY0"] - pro * (drawOjbPosMap["PointY0"] - drawOjbPosMap["PointY1"]);
                        }
                    }
                }
                else {   //没有选中客流量线段的游标，则重新绘制
                    // todo 原线段的两端横坐标重合，需要用纵坐标计算比例
                    if(drawOjbPosMap["PointX1"] == drawOjbPosMap["PointX0"]){
                        pro = (drawOjbPosMap["PointY2"] - drawOjbPosMap["PointY0"]) /
                            (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
                    }
                    else{
                        pro = (drawOjbPosMap["PointX2"] - drawOjbPosMap["PointX0"]) /
                            (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
                    }


                    drawOjbPosMap["PointX0"] = this.mouseDownX;
                    drawOjbPosMap["PointY0"] = this.mouseDownY;
                    drawOjbPosMap["PointX1"] = x;
                    drawOjbPosMap["PointY1"] = y;

                    drawOjbPosMap["PointX2"] = drawOjbPosMap["PointX0"] + pro * (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
                    drawOjbPosMap["PointY2"] = drawOjbPosMap["PointY0"] + pro * (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
                    drawOjbPosMap["PointX3"] = drawOjbPosMap["PointX1"] - pro * (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
                    drawOjbPosMap["PointY3"] = drawOjbPosMap["PointY1"] - pro * (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
                }
                break;
        }
    },

    /*对锚点的拖拽，使图形放大缩小*/
    changeSize: function (x, y) {
        var drawOjbPosMap = this.currentC["map"],
            distanceX,
            distanceY,
            pro;

        if (DrawType.EN_DRAW_LINE_ARROW_VERNIER == this.currentC["type"]) {
            if(drawOjbPosMap["PointX1"] == drawOjbPosMap["PointX0"]){
                pro = (drawOjbPosMap["PointY2"] - drawOjbPosMap["PointY0"]) /   //先将客流量线段的比例保存下来
                    (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
            }
            else{
                pro = (drawOjbPosMap["PointX2"] - drawOjbPosMap["PointX0"]) /   //先将客流量线段的比例保存下来
                    (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
            }
        }

        drawOjbPosMap[this.changex] = x;
        drawOjbPosMap[this.changey] = y;

        if (DrawType.CONCENTRIC == this.currentC["type"]) { // 同心矩形
            if (this.changex == "LeftOut") { //外矩形左
                distanceX = drawOjbPosMap["LeftIn"] - drawOjbPosMap["LeftOut"];
                if (4 >= distanceX) {    //不能比里面的矩形小
                    drawOjbPosMap["LeftOut"] = drawOjbPosMap["LeftIn"] - 4;
                    drawOjbPosMap["RightOut"] = drawOjbPosMap["RightIn"] + 4;
                }
                else {
                    drawOjbPosMap["RightOut"] = drawOjbPosMap["RightIn"] + distanceX;
                }
            }
            else if (this.changex == "RightOut") {
                distanceX = drawOjbPosMap["RightOut"] - drawOjbPosMap["RightIn"];
                if (4 >= distanceX) {    //不能比里面的矩形小
                    drawOjbPosMap["LeftOut"] = drawOjbPosMap["LeftIn"] - 4;
                    drawOjbPosMap["RightOut"] = drawOjbPosMap["RightIn"] + 4;
                }
                else {
                    drawOjbPosMap["LeftOut"] = drawOjbPosMap["LeftIn"] - distanceX;
                }
            }

            if (this.changey == "TopOut") {
                distanceY = drawOjbPosMap["TopIn"] - drawOjbPosMap["TopOut"];
                if (4 >= distanceY) {
                    drawOjbPosMap["TopOut"] = drawOjbPosMap["TopIn"] - 4;
                    drawOjbPosMap["BottomOut"] = drawOjbPosMap["BottomIn"] + 4;
                }
                else {
                    drawOjbPosMap["BottomOut"] = drawOjbPosMap["BottomIn"] + distanceY;
                }
            }
            else if (this.changey == "BottomOut") {
                distanceY = drawOjbPosMap["BottomOut"] - drawOjbPosMap["BottomIn"];
                if (4 >= distanceY) {
                    drawOjbPosMap["TopOut"] = drawOjbPosMap["TopIn"] - 4;
                    drawOjbPosMap["BottomOut"] = drawOjbPosMap["BottomIn"] + 4;
                }
                else {
                    drawOjbPosMap["TopOut"] = drawOjbPosMap["TopIn"] - distanceY;
                }
            }

            if (this.changex == "LeftIn") {
                distanceX = drawOjbPosMap["LeftIn"] - drawOjbPosMap["LeftOut"];
                if (4 >= distanceX) {
                    drawOjbPosMap["LeftIn"] = drawOjbPosMap["LeftOut"] + 4;
                    drawOjbPosMap["RightIn"] = drawOjbPosMap["RightOut"] - 4;
                }
                else {
                    if (drawOjbPosMap["LeftIn"] >= ((drawOjbPosMap["LeftOut"] + drawOjbPosMap["RightOut"]) / 2 - 4)) {
                        drawOjbPosMap["LeftIn"] = (drawOjbPosMap["LeftOut"] + drawOjbPosMap["RightOut"]) / 2 - 4;
                        drawOjbPosMap["RightIn"] = drawOjbPosMap["LeftIn"] + 8;
                    }
                    else {
                        drawOjbPosMap["RightIn"] = drawOjbPosMap["RightOut"] - distanceX;  //正常情况
                    }
                }
            }
            else if (this.changex == "RightIn") {
                distanceX = drawOjbPosMap["RightOut"] - drawOjbPosMap["RightIn"];
                if (4 >= distanceX) {    //
                    drawOjbPosMap["LeftIn"] = drawOjbPosMap["LeftOut"] + 4;
                    drawOjbPosMap["RightIn"] = drawOjbPosMap["RightOut"] - 4;
                }
                else {
                    if (drawOjbPosMap["RightIn"] <= ((drawOjbPosMap["LeftOut"] + drawOjbPosMap["RightOut"]) / 2 + 4)) {
                        drawOjbPosMap["RightIn"] = (drawOjbPosMap["LeftOut"] + drawOjbPosMap["RightOut"]) / 2 + 4;
                        drawOjbPosMap["LeftIn"] = drawOjbPosMap["RightIn"] - 8;
                    }
                    else {
                        drawOjbPosMap["LeftIn"] = drawOjbPosMap["LeftOut"] + distanceX;
                    }
                }
            }

            if (this.changey == "TopIn") {
                distanceY = drawOjbPosMap["TopIn"] - drawOjbPosMap["TopOut"];
                if (4 >= distanceY) {
                    drawOjbPosMap["TopIn"] = drawOjbPosMap["TopOut"] + 4;
                    drawOjbPosMap["BottomIn"] = drawOjbPosMap["BottomOut"] - 4;
                }
                else {
                    if (drawOjbPosMap["TopIn"] >= ((drawOjbPosMap["TopOut"] + drawOjbPosMap["BottomOut"]) / 2 - 4)) {
                        drawOjbPosMap["TopIn"] = (drawOjbPosMap["TopOut"] + drawOjbPosMap["BottomOut"]) / 2 - 4;
                        drawOjbPosMap["BottomIn"] = drawOjbPosMap["TopIn"] + 8;
                    }
                    else {
                        drawOjbPosMap["BottomIn"] = drawOjbPosMap["BottomOut"] - distanceY;
                    }
                }
            }
            else if (this.changey == "BottomIn") {
                distanceY = drawOjbPosMap["BottomOut"] - drawOjbPosMap["BottomIn"];
                if (4 >= distanceY) {
                    drawOjbPosMap["TopIn"] = drawOjbPosMap["TopOut"] + 4;
                    drawOjbPosMap["BottomIn"] = drawOjbPosMap["BottomOut"] - 4;
                }
                else {
                    if (drawOjbPosMap["BottomIn"] <= ((drawOjbPosMap["TopOut"] + drawOjbPosMap["BottomOut"]) / 2 + 4)) {
                        drawOjbPosMap["BottomIn"] = (drawOjbPosMap["TopOut"] + drawOjbPosMap["BottomOut"]) / 2 + 4;
                        drawOjbPosMap["TopIn"] = drawOjbPosMap["BottomIn"] - 8;
                    }
                    else {
                        drawOjbPosMap["TopIn"] = drawOjbPosMap["TopOut"] + distanceY;
                    }
                }
            }
        } else if (DrawType.EN_DRAW_LINE_ARROW_VERNIER == this.currentC["type"]) { // 更新游标
            drawOjbPosMap["PointX2"] = drawOjbPosMap["PointX0"] + pro * (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
            drawOjbPosMap["PointY2"] = drawOjbPosMap["PointY0"] + pro * (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
            drawOjbPosMap["PointX3"] = drawOjbPosMap["PointX1"] - pro * (drawOjbPosMap["PointX1"] - drawOjbPosMap["PointX0"]);
            drawOjbPosMap["PointY3"] = drawOjbPosMap["PointY1"] - pro * (drawOjbPosMap["PointY1"] - drawOjbPosMap["PointY0"]);
        }
    },

    /* 获取鼠标位置，返回值见 MOUSE_POSITION */
    getMousePosition: function (x, y) {  //isPointIn必须重绘
        var drawObjType,    // 图形类型
            drawObjList,    // 图形对象数组
            drawObj,        // 图形对象
            i,
            len,
            pointX,
            pointY;

        // 恢复初始状态
        this.mousePosition = MOUSE_POSITION.NONE;

        // 先判断是否在锚点上
        for (i = 0, len = this.anchorList.length; i < len; i++) {
            pointX = Number(this.anchorList[i]["PointX"]);
            pointY = Number(this.anchorList[i]["PointY"]);
            this.ctx.beginPath();
            this.ctx.strokeStyle = "'rgba(255,0,0,0)'";
            this.ctx.lineWidth = 2;
            this.ctx.rect((pointX - 4), (pointY - 4), 8, 8);
            if (x && y && this.ctx.isPointInPath(x, y)) {
                this.mousePosition = MOUSE_POSITION.ANCHOR;
                this.changex = this.anchorList[i]["refPointKey"][0];
                this.changey = this.anchorList[i]["refPointKey"][1];
            }
            this.ctx.stroke();
            this.ctx.closePath();

            if (this.mousePosition == MOUSE_POSITION.ANCHOR) {
                break;
            }
        }

        // 若不在锚点上，再判断是否在图形上
        if (this.mousePosition == MOUSE_POSITION.NONE) {
            for (drawObjType in this.drawMap) {
                if (!this.drawMap.hasOwnProperty(drawObjType))continue;
                drawObjList = this.drawMap[drawObjType];

                // 后画的在上面，先被判断到
                for (len = drawObjList.length, i = len - 1; i >= 0; i--) {
                    drawObj = drawObjList[i];
                    if (drawObj.isDrawObjSel(this.ctx, x, y)) {
                        this.mousePosition = MOUSE_POSITION.DRAWOBJ;
                        this.tempCurrentC = drawObj;
                        break;
                    }
                }
                if (this.mousePosition == MOUSE_POSITION.DRAWOBJ) break;
            }
        }

    },

    /*设置鼠标样式*/
    setMouseStyle: function (x, y) {
        var style;
        // todo (先将客流量线段的选中状态重置)这句话加在这里很奇怪 考虑换个位置
        if (this.currentC && 10 == this.currentC.type && this.currentC.bSelVernier) {  //客流量线段游标选中样式
            this.currentC.bSelVernier = false;
        }

        this.getMousePosition(x, y);

        switch (this.mousePosition) {
            case MOUSE_POSITION.DRAWOBJ:
                style = "all-scroll";
                break;

            case  MOUSE_POSITION.ANCHOR:
                style = "crosshair";
                break;

            default:
                if (this.currentC && 10 == this.currentC.type && this.currentC.bSelVernier) {  //客流量线段游标选中样式
                    style = "crosshair";
                }
                else {
                    style = "default";
                }
        }

        $(this.canvas).css("cursor", style);
    },
    // todo 不需要用getEvent，直接捕获事件，将e传入函数即可
    doMousemove: function (that) {
        var _e = getEvent(),
            x = _e.clientX - that.canvas.getBoundingClientRect().left,
            y = _e.clientY - that.canvas.getBoundingClientRect().top;

        if (that.isMouseDown) { // 鼠标按下
            switch (that.mousePosition) {
                case MOUSE_POSITION.DRAWOBJ:    // 在图形上，进行拖动操作
                    that.moveDrawObj(x, y);
                    break;

                case MOUSE_POSITION.ANCHOR:     // 在锚点上，进行改变大小操作
                    that.changeSize(x, y);
                    break;

                default:                        // 在空白的地方，进行画图操作
                    that.draw(x, y);
                    break;
            }
            // todo 非多边形或多边形没在绘制
            if (that.currentC && !that.currentC["isDrawing"]) {  //非多边形
                that.isReport = true;
            }
            this.updateAnchor();    // 图形发生变化需要更新描点信息
        } else {
            // todo 鼠标未按下而多边形正则绘制的情况什么时候出现:mousedown后mouseup
            if (that.currentC && that.currentC["isDrawing"]) {
                that.draw(x, y);    // 画多边形
                // todo up后的锚点是在move时产生的
                this.updateAnchor();    // 图形发生变化需要更新描点信息
            } else {
                that.setMouseStyle(x, y);
            }
        }
    },

    doMousedown: function (that) {
        console.log('downnnnn')
        var e = getEvent();
        that.isMouseDown = true;
        that.mouseDownX = e.clientX - that.canvas.getBoundingClientRect().left;
        that.mouseDownY = e.clientY - that.canvas.getBoundingClientRect().top;

        if (that.currentC && that.currentC["isDrawing"]) return; //多边形绘制过程中

        that.getMousePosition(that.mouseDownX, that.mouseDownY);

        // 选中图形
        if (that.mousePosition == MOUSE_POSITION.DRAWOBJ) {
            if (eventSelDrawObj) {
                eventSelDrawObj(this.tempCurrentC["type"], this.tempCurrentC["num"])
            }
        } else if (MOUSE_POSITION.NONE == that.mousePosition) {

            // 多边形画图初始状态处理
            if (that.currentC && ("undefined" != typeof that.currentC["isDrawing"])) {
                if (!that.currentC["isDrawing"]) {
                    for (var i = 0; i < MAX_POLYGON_POINTNUM; i++) {
                        if (that.currentC["map"]["PointX" + i]) {
                            delete that.currentC["map"]["PointX" + i];
                            delete that.currentC["map"]["PointY" + i];
                        }
                    }
                    that.currentC["map"]["PointX0"] = that.mouseDownX;
                    that.currentC["map"]["PointY0"] = that.mouseDownY;
                    that.currentC["coordinateNum"] = 1;
                    that.currentC["isDrawing"] = true;
                }
            }
        }

    },

    doMouseup: function (that) {
        console.log('uppppp')
        var mouseUpX,
            mouseUpY,
            _e = getEvent(),
            drawOjbPosMap,
            pointNum,
            i;

        that.isMouseDown = false;

        if (!that.currentC)return;
        if (("undefined" != typeof that.currentC["isDrawing"]) && that.currentC["isDrawing"]) {
            drawOjbPosMap = that.currentC["map"];
            pointNum = that.currentC["coordinateNum"];
            mouseUpX = _e.clientX - that.canvas.getBoundingClientRect().left;
            mouseUpY = _e.clientY - that.canvas.getBoundingClientRect().top;

            // 闭合
            if ((pointNum > 2) &&
                (drawOjbPosMap["PointX0"] - 5 < mouseUpX && drawOjbPosMap["PointX0"] + 5 > mouseUpX) &&
                (drawOjbPosMap["PointY0"] - 5 < mouseUpY && drawOjbPosMap["PointY0"] + 5 > mouseUpY)) {
                that.currentC["isDrawing"] = false;
                that.isReport = true;
                // 删除最后一个点
                delete that.currentC["map"]["PointX" + pointNum];
                delete that.currentC["map"]["PointY" + pointNum];
            } else if (pointNum < MAX_POLYGON_POINTNUM) {  //多边形坐标数量未达到饱和
                // 新的点除了闭合的情况，否则不允许落在已有的点上面
                for (i = 0; i < pointNum; i++) {
                    if ((drawOjbPosMap["PointX" + i] - 5 < mouseUpX && drawOjbPosMap["PointX" + i] + 5 > mouseUpX) &&
                        (drawOjbPosMap["PointY" + i] - 5 < mouseUpY && drawOjbPosMap["PointY" + i] + 5 > mouseUpY)) {
                        return;
                    }
                }
                // todo 在mousemove中生成了下一个节点
                pointNum++;
                that.currentC["coordinateNum"] = pointNum;
            }
        }
        that.ReportDrawOjbParam();
    },

    // 双击击事件，处理多边形的画图动作（闭合）
    doDblclick: function (that) {
        console.log('clickkkkk')
        if (!that.currentC)return;
        if ("undefined" == that.currentC["isDrawing"]) return; //非多边形
        // todo 没在绘制时，不必要进行操作
        if (!that.currentC["isDrawing"]) return;
        that.currentC["isDrawing"] = false;
        that.isReport = true;
        // that.ReportDrawOjbParam();
        // 删除最后一个点(todo 双击没有move,最后一个点可能不存在)
        delete that.currentC["map"]["PointX" + that.currentC["coordinateNum"]];
        delete that.currentC["map"]["PointY" + that.currentC["coordinateNum"]];
        // todo 删除完之后上报
        that.ReportDrawOjbParam();

        that.updateAnchor();  //绘图结束更新锚点信息
    },

    // 上报坐标信息
    ReportDrawOjbParam: function () {
        var drawOjbPosMap = this.currentC["map"],
            posParam = "",
            n;

        if (this.isReport) {
            if (eventDrawObjParam) {
                for (n in drawOjbPosMap) {
                    if (!drawOjbPosMap.hasOwnProperty(n)) continue;
                    posParam += n + "=" + drawOjbPosMap[n] + "&";
                }
                posParam = posParam.substring(0, posParam.length - 1);
                eventDrawObjParam(this.currentC["type"], this.currentC["num"], posParam)
            }
            this.isReport = false;
        }
    },

    // 选中图形
    SelDrawObj: function (type, num) {
        // 选中新的图形需要更新描点信息
        this.currentC = this.drawMap[type][num];
        this.updateAnchor();
    },

    // 显示隐藏框体
    ShowDrawObj: function (type, num, isShow) {
        this.drawMap[type][num]["isShow"] = (1 == isShow);
    }
};

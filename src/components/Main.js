require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

var imageDatas = require('../data/imageData.json');

imageDatas = (function getImageURL(imageDatasArr) {
	for (var i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imgURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);
var ControllerUnit = React.createClass({
  handleClick: function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
  },
  render: function () {
    var controllerUnitClassName = 'controller-unit';

      if (this.props.arrange.isCenter) {
        controllerUnitClassName += ' is-center';

        if (this.props.arrange.isInverse) {
          controllerUnitClassName +=' is-inverse';
        }
      }
    return (

      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
});
var ImageFigure = React.createClass({
  handleClick: function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
  },
  render: function () {
    var styleObj = {};

    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgURL} alt={this.props.data.title}/>
        <figurecaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figurecaption>
      </figure>
    );
  }
});

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        // ｛
        //     pos: {
        //       left: 0,
        //       top: 0
        //     },
        //     rotate: 0,
        //     isInverse: false,
        //     isCenter: false
        //  ｝
      ]
    };
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    }
  }
  center (index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  }
  inverse (index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });

    }.bind(this);
  }
  getRangeRandom (low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }
  get30DegRandom () {
    return (Math.random > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
  }
  rearrange (centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      // 选取0-1张
      topImgNum = Math.floor(Math.random() * 2),

      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

      imgsArrangeCenterArr[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      };


      // 因为从索引位置往后取，所以要减去topImgNum
      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

      // 布局位于上测的图片
      imgsArrangeTopArr.forEach(function (value, index) {
        imgsArrangeTopArr[index] = {
          pos: {
            left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
            top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
          },
          rotate: this.get30DegRandom(),
          isCenter: false
        }
      }.bind(this));



      // 布局左右两侧的图片
      for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
        var hPosRangeLORX = null;

        // 前半部分布局左边，右半部分布局右边
        if (i < k) {
          hPosRangeLORX = hPosRangeLeftSecX;
        } else {
          hPosRangeLORX = hPosRangeRightSecX;
        }

        imgsArrangeArr[i] = {
          pos: {
            left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
            top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1])
          },
          rotate: this.get30DegRandom(),
          isCenter: false
        };
      }

      if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
      imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
  }
  // 组件加载以后，为每张图片计算器位置的范围
  componentDidMount () {

    // 拿到舞台大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
    }
    // 计算左侧，右侧区域图片排布位置的的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }
  render() {
    var imgFigures =[];
    var controllerUnits = [];

    imageDatas.forEach(function(value, index){
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: '0',
            top: '0'
          },
          rotate: '0',
          isInverse: false,
          isCenter: false
        };
      }
      imgFigures.push(<ImageFigure data={value} ref={'imgFigure' + index}
        arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
      controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));


    return (
       <section className="stage" ref="stage">
           <section className="img-sec">
            {imgFigures}
           </section>
           <nav className="controller-nav">
            {controllerUnits}
           </nav>
       </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

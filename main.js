//ajax 从后台取出的数据
var correctMap = {
	0: { // 需要给每个知识点一个ID，从0 开始，注意一定不能为-1
		square: { // 图片中的矩形框
			x: '20%', // 矩形框X中心点，数值只能为相对图片宽度百分比
			y: '40%', // 矩形框Y中心点，数值只能为相对图片高度百分比
			width: '10%', // 矩形框的宽度，数值为相对图片的宽度百分比
			height: '10%' // 矩形框的高度，数值为相对图片的宽度百分比（注意此处是宽度百分比并非手写错误）
		},
		correct: false, // 答题是否正确，如果答对系统会自动修改为true 
		itemDesc: 'Z05 总风管截断塞门' // 知识点的内容
	},
	1: {
		square: {
			x: '50%',
			y: '20%',
			width: '10%',
			height: '10%'
		},
		correct: false,
		itemDesc: 'Z06 总风管截断塞门'
	},
	2: {
		square: {
			x: '70%',
			y: '20%',
			width: '10%',
			height: '10%'
		},
		correct: false,
		itemDesc: 'Z07 总风管截断塞门'
	}
}

var imgUrl = "img/background.png" // 需要考核学生的知识点图片
var arrowImgUrl = "img/arrow.png" // 红线箭头的图标
var remainSec = 60 * 45 // 45 分钟
var name = "无名氏" //考生姓名

// 以上为配置的内容

var nameDom = document.getElementById("name")
nameDom.innerHTML = name
var timeDom = document.getElementById("time")

var container = document.getElementById("container")
var img = document.getElementById('image')
img.style.backgroundImage = "url(" + imgUrl + ")"

var darging = false
var dargIndex = -1

var arrowDom = null // 每次操作的红线
var containPoint = {} // 容器的起点
var startPoint = {} // 红线起点
var endPoint = {} // 红线终点，每次mousemove 都会改变

function moveArrow(sp, ep, arrowDom) {
	var absW = Math.abs(ep.x - sp.x)
	var absH = Math.abs(ep.y - sp.y)
	var lenght = Math.sqrt(Math.pow(absW, 2) + Math.pow(absH, 2))
		// 数学角度[-180,180]
		// Y 轴需要取反 保证转化为数学坐标
	var deg = 180 * Math.atan2(-ep.y + sp.y, ep.x - sp.x) / Math.PI

	var arrowDeg = -deg + 90 //  转化为旋转角度

	arrowDom.style.transform = 'rotate(' + arrowDeg + 'deg)'
	if(lenght > 6) {
		lenght = Math.floor(lenght - 6)
		arrowDom.style.height = lenght + 'px'
	}

}

function insertSquare(correctMap) {
	//				<div class="square" data-index="0" style="left:15%;bottom:10%;">
	//					<!--<div class="border"></div>-->
	//				</div>
	for(var key in correctMap) {
		var square = correctMap[key].square
		var dom = document.createElement('div')
		dom.classList.add('square')
		dom.setAttribute('data-index', key)
		dom.style.left = square.x
		dom.style.top = square.y
		dom.style.width = square.width
		dom.style.paddingBottom = square.height
		img.appendChild(dom)

	}
}

function insertItem(correctMap) {
	//				<div class="item" data-index="0">
	//				Z05 总风管截断塞门
	//				<div class="arrow">
	//					<div class="content"></div>
	//				</div>
	//			</div>
	for(var key in correctMap) {
		var arrow = document.createElement('div')
		arrow.className = "arrow"
		var arrowImg = document.createElement("img")
		arrowImg.src = arrowImgUrl
		arrowImg.className = "arrowImg"

		var arrowCnt = document.createElement('div')
		arrow.appendChild(arrowImg)
			//arrowCnt.appendChild(arrowImg)
		arrowCnt.className = "content"
		arrow.appendChild(arrowCnt)
		var item = document.createElement('div')
		item.className = "item"
		item.setAttribute('data-index', key)
		item.innerHTML = correctMap[key].itemDesc
		item.appendChild(arrow)
		container.appendChild(item)
	}
}

var timeId = setInterval(function() {
	var sec = remainSec % 60
	var mins = Math.floor(remainSec / 60) % 60
	var hour = Math.floor(remainSec / (60 * 60))
	if(sec < 10) sec = '0' + sec
	if(mins < 10) mins = '0' + mins
	if(hour < 10) hour = '0' + hour
	timeDom.innerHTML = hour + ':' + mins + ':' + sec

	if(remainSec == 0) {
		clearInterval(timeId)
		return
	}
	remainSec--

}, 1000)

containPoint.x = container.offsetLeft
containPoint.y = container.offsetTop

container.addEventListener('mousedown', function(e) {
	var target = e.target
	dragIndex = target.getAttribute('data-index')
	if(!target.classList.contains('item') || dragIndex == null){
		dragIndex=-1
		return; // 只有知识点可以触发点击事件
	} 

	darging = true

	//线条起点默认为知识点的中心
	arrowDom = target.querySelector('.arrow')
	arrowDom.style.height = 0; //需要设置为0 才能保证startPoint 计算正确
	startPoint.x = target.offsetLeft + target.scrollWidth / 2
	startPoint.y = target.offsetTop + target.scrollHeight / 2

	if(correctMap[dragIndex] != null)
		correctMap[dragIndex].correct = false //重现时需要重设正确性

	// containPoint 可能会发生变化，需要每次计算
	containPoint.x = container.offsetLeft
	containPoint.y = container.offsetTop

	endPoint.x = e.pageX - containPoint.x
	endPoint.y = e.pageY - containPoint.y
	moveArrow(startPoint, endPoint, arrowDom)

})

document.body.addEventListener('mousemove', function(e) {
	e.preventDefault()
	e.stopPropagation()
	if(!darging) return;

	endPoint.x = e.pageX - containPoint.x
	endPoint.y = e.pageY - containPoint.y
	moveArrow(startPoint, endPoint, arrowDom)
		//console.log(e)

})

container.addEventListener('mouseup', function(e) {
	//if(!draging) return; //非拖动状态不触发逻辑判断
	darging = false

	var el = document.elementFromPoint(e.clientX, e.clientY)
	if(!el.classList.contains('square')) {
		el = document.elementFromPoint(e.clientX + 2, e.clientY + 4) // 在取一个点进行判断，避免一个点带来的误差
		if(!el.classList.contains('square')) {
			dragIndex = -1
			return;
		}

	}
	var sqIndex = el.getAttribute('data-index')
	if(sqIndex == dragIndex) { //答案选对了
		correctMap[sqIndex].correct = true
		alert('选对了')
	}

	dragIndex = -1
})

insertSquare(correctMap) // 插入从ajax取到的矩形框数据 
insertItem(correctMap) // 插入知识点
var Shudu = { 
	// �洢ÿ�����Ӷ�������
	ceils : [ [], [], [], [], [], [], [], [], [], [] ],
	// ������Ϸ���Ѷ�
	level : 3,
	// ĳһ���������
	example : [],
	// ��ǰ�û�����Ľ�
	nowResult : [],
	// �������Բ����������ĵ�
	failPoint : [],
	// ʱ�����ж���
	timeObj : {
		sign : null,
		h : 0,
		m : 0,
		s : 0
	},
	// ��ʼ��
	init : function() {
		var doc = document;
		var shuduTable = doc.getElementById("shudu");
		var ceilTables = shuduTable.getElementsByTagName("table");
		var ctLen = ceilTables.length;
		var l, d, ll, dd;
		// �ٴγ�ʼ��
		var ceils = this.ceils;
		// �����ʼ��
		for ( var i = 0; i < ctLen; i++) {
			// ��ȡ����ֵ
			l = Math.floor(i / 3);
			d = i % 3;
			var trs = ceilTables[i].rows;
			var trLen = trs.length;
			for ( var k = 0; k < trLen; k++) {
				var tds = trs[k].cells;
				var tdLen = tds.length;
				// ��ȡʵ�ʵ���ֵ
				ll = l * 3 + k + 1;
				for ( var c = 0; c < tdLen; c++) {
					// ��ȡʵ�ʵ���ֵ
					dd = d * 3 + c + 1;
					var td = tds[c];
					td.setAttribute("row", ll);
					td.setAttribute("col", dd);
					ceils[ll][dd] = td;
				}
			}
		}
	},
	// ���к���
	run : function() {
		//this.endTime();
		//this.beginTime();
		this.clearData();
		this.resetData();
		this.bindEvent();
	},
	// �����������
	clearData : function() {
		// ����������
		var ceils = this.ceils;
		var i, k;
		for (i = 1; i <= 9; i++) {
			for (k = 1; k <= 9; k++) {
				var ceil = ceils[i][k];
				// ����¼���
				if (ceil.getAttribute("read") == "no") {
					var input = ceil.getElementsByTagName("input")[0];
					removeEvent(input, "blur", this.blurHandler);
					removeEvent(input, "keypress", this.keypressHandler);
				}
				ceil.className = "";
				ceil.innerHTML = "";
				ceil.setAttribute("td_value", '');
			}
		}
		// ��ʼ����������
		this.example = [ [], [], [], [], [], [], [], [], [], [] ];
		this.nowResult = [ [], [], [], [], [], [], [], [], [], [] ];
		this.failPoint = [ [], [], [], [], [], [], [], [], [], [] ];
		this.timeObj = {
			sign : null,
			h : 0,
			m : 0,
			s : 0
		};
	},
	// �����趨����
	resetData : function() {
		// �����Ѷȵȼ�
		// this.level = document.getElementById("level").value;
		this.level = parseInt(document.getElementById("level").value);
		var doc = document;
		var example = this.example;
		var failPoint = this.failPoint;
		var ceils = this.ceils;
		var nowResult = this.nowResult;
		// ��ÿ��н�
		var result = this.cSolution();
		// ���ý�����ӣ��͵�ǰ�û��Ľ�
		for (i = 1; i <= 9; i++) {
			for (k = 1; k <= 9; k++) {
				example[i][k] = result[i][k];
			}
		}
		// ���Դ������н⣬�ó�����
		this.cRandomResult(result);
		// ��Ⱦ���,���ҳ�ʼ����ǰ�⣬�Ͳ�����������
		for (i = 1; i <= 9; i++) {
			for (k = 1; k <= 9; k++) {
				var ceil = ceils[i][k];
				var value = result[i][k];
				nowResult[i][k] = value;
				failPoint[i][k] = false;
				// ����TDֵ
				ceil.setAttribute("td_value", value);
				// ���û��ֵ��˵�����û���д�𰸵ط�
				if (value == '') {
					// �����ڵ�
					var div = doc.createElement("div");
					var input = doc.createElement("input");
					input.type = "text";
					input.value = "";
					input.className = "input_no";
					input.maxLength = 1;
					input.setAttribute("text_input", 1);
					ceil.appendChild(input);
					ceil.appendChild(div);
					// ����ֻ����־��
					ceil.setAttribute("read", 'no');
					// ������ʽ
					ceil.className = "td_nor";
				} else {
					// ����ֻ����־��
					ceil.innerHTML = value;
					ceil.setAttribute("read", 'yes');
				}
			}
		}
	},
	// ���¼�
	bindEvent : function() {
		// Ϊ���������ӵ���¼�
		var table = document.getElementById("shudu");
		addEvent(table, "click", this.clickHandler);
		// Ϊ�û����Բ����ĸ������ʧȥ�����¼�
		var ceils = this.ceils;
		var i, k;
		for (i = 1; i <= 9; i++) {
			for (k = 1; k <= 9; k++) {
				var el = ceils[i][k];
				if (el.getAttribute("read") == 'no') {
					var input = el.getElementsByTagName("input")[0];
					// ����¼�
					addEvent(input, "blur", this.blurHandler);
					addEvent(input, "keypress", this.keypressHandler);
				}
			}
		}
	},
	// ����һ�����н�
	cSolution : function() {
		var result = [ [], [], [], [], [], [], [], [], [], [] ];
		var finished = false;
		var constraint = this.validate;
		while (!finished) {
			result = [ [], [], [], [], [], [], [], [], [], [] ];
			backTrack(result, 1);
		}
		return result;
		function backTrack(result, t) {
			// ����Ѿ���ɻ���
			if (finished)
				return;
			// ȥ����ͷ
			if (t > 81) {
				finished = true;
				return;
			}
			// ÿ��СTableΪһ��L���ܹ���1-9��L
			var l = (t == 1) ? 1 : Math.ceil(t / 9);
			// ���񣬴�1-9
			var d = t % 9;
			var d = (d == 0) ? 9 : d;
			// ʹ���������ʹ��ÿ�εĳ����ĳ�ʼ���Ľⶼ��ͬ
			// ����һ��0-9֮�������
			var begin = Math.ceil(Math.random() * 9);
			// ��ѯ����
			for ( var i = begin; i <= 9; i++) {
				// ����ý���������������
				if (constraint(result, l, d, i)) {
					result[l][d] = i;
					t++;
					backTrack(result, t);
					t--;
				}
			}
			for (i = 1; i < begin; i++) {
				// ����ý���������������
				if (constraint(result, l, d, i)) {
					result[l][d] = i;
					t++;
					backTrack(result, t);
					t--;
				}
			}
		}
	},
	// �ø��ӵ�ֵ�Ƿ����Ҫ��
	validate : function(result, l, d, v) {
		var i, k;
		// ��֤3*3�ķ��������Ƿ�����ظ�����
		var ll = Math.floor((l - 1) / 3);
		var dd = Math.floor((d - 1) / 3);
		var lBegin = ll * 3 + 1;
		var dBegin = dd * 3 + 1;
		for (i = 0; i < 3; i++) {
			for (k = 0; k < 3; k++) {
				var lc = lBegin + i;
				var dc = dBegin + k;
				if (lc != l && dc != d && result[lc][dc] == v)
					return false;
			}
		}
		// ��֤ͬһ����û���ظ�����
		for (i = 1; i <= 9; i++) {
			if (i != d && result[l][i] == v)
				return false;
		}
		// ��֤ͬһ�����Ƿ����ظ�����
		for (i = 1; i <= 9; i++) {
			if (i != l && result[i][d] == v)
				return false;
		}
		return true;
	},
	// �����ȥһЩ������ó�����
	cRandomResult : function(result) {
		var level = this.level, blank, c;

		for ( var i = 1; i < 10; i++) {
			blank = level;
			while (blank--) {
				c = Math.ceil(Math.random() * 9);
				if (result[i][c] != '') {
					result[i][c] = '';
				} else {
					blank++;
				}
			}
		}
	},
	clickHandler : function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;
		// ����DIVռ��TD�Ŀռ�����
		if (target.nodeName == 'DIV') {
			target = target.parentNode;
		}
		// �ж��Ƿ�����Ҫ�����¼���Ԫ��
		if (target.getAttribute("read") == 'no') {
			var div, input;
			div = target.getElementsByTagName("div")[0];
			div.className = "div_no";
			input = target.getElementsByTagName("input")[0];
			input.className = "input_yes";
			input.focus();
		}
	},
	// ����ֵ�Ĺ���
	keypressHandler : function(e) {
		e = e || window.event;
		var charCode = getCharCode(e);
		if (!/[1-9]/.test(String.fromCharCode(charCode)) && charCode > 9) {
			preventDefault(e);
		}
	},
	// ʧȥ�����¼����
	blurHandler : function(e) {
		var that = Shudu;
		var nowResult = that.nowResult;
		var failPoint = that.failPoint;
		e = e || window.event;
		var target = e.target || e.srcElement;
		// �ж��Ƿ�����Ҫ�����¼���Ԫ��
		if (target.getAttribute("text_input") == 1) {
			var v = target.value;
			var td = target.parentNode;
			target.className = "input_no";
			var div = td.getElementsByTagName("div")[0];
			div.innerHTML = v;
			div.className = "div_yes";
			var row = td.getAttribute("row");
			var col = td.getAttribute("col");
			// ��������ֵ
			nowResult[row][col] = v;
			td.setAttribute("td_value", v);
			if (v != '' && !that.validate(nowResult, row, col, v)) {
				failPoint[row][col] = true;
				td.className = "td_wrong";
			} else {
				failPoint[row][col] = false;
				td.className = "td_nor";
			}
			// ����ʧ�ܽڵ��״̬
			that.updateFailPoint(row, col);
		}
	},
	// ����ʧ�ܵ�״̬
	updateFailPoint : function(row, col) {
		var ceils = this.ceils;
		var failPoint = this.failPoint;
		var nowResult = this.nowResult;
		var i, k, v;
		var validate = this.validate;
		// ������������ʧ�ܵ���м��
		for (i = 1; i <= 9; i++) {
			if (failPoint[row][i]) {
				var td = ceils[row][i];
				v = td.getAttribute("td_value");
				if (validate(nowResult, row, i, v)) {
					failPoint[row][i] = false;
					td.className = "td_nor";
				}
			}
		}
		// ������������ʧ�ܵ���м��
		for (i = 1; i <= 9; i++) {
			if (failPoint[i][col]) {
				var td = ceils[row][i];
				v = td.getAttribute("td_value");
				if (validate(nowResult, i, col, v)) {
					failPoint[i][col] = false;
					td.className = "td_nor";
				}
			}
		}
		// ��3*3�ķ�Χ���м��
		var ll = Math.floor((row - 1) / 3);
		var dd = Math.floor((col - 1) / 3);
		var lBegin = ll * 3 + 1;
		var dBegin = dd * 3 + 1;
		for (i = 0; i < 3; i++) {
			for (k = 0; k < 3; k++) {
				var lc = lBegin + i;
				var dc = dBegin + k;
				if (failPoint[lc][dc]) {
					var td = ceils[lc][dc];
					v = td.getAttribute("td_value");
					if (validate(nowResult, lc, dc, v)) {
						failPoint[lc][dc] = false;
						td.className = "td_nor";
					}
				}
			}
		}
	},
	// ��ʼ��ʱ
	beginTime : function() {
		var doc = document;
		var usetime = doc.getElementById("usetime");
		var beginTime = new Date();
		// ��ȡʱ��
		var bH = beginTime.getHours();
		var bM = beginTime.getMinutes();
		var bS = beginTime.getSeconds();
		// ���ϼ�����ʱ
		Shudu.timeObj.sign = setTimeout(function() {
			// ����ʱ��
			var now = new Date();
			var nH = now.getHours();
			var nM = now.getMinutes();
			var nS = now.getSeconds();
			if (nS < bS) {
				nM--;
				nS += 60;
			}
			if (nM < bM) {
				nH--;
				nM += 60;
			}
			var s = nS - bS;
			var m = nM - bM;
			var h = nH - bH;
			var timeObj = Shudu.timeObj;
			timeObj.h = h;
			timeObj.m = m;
			timeObj.s = s;
			usetime.value = h + ":" + m + ":" + s;
			// �������
			timeObj.sign = setTimeout(arguments.callee, 1000)
		}, 1000);
	},
	// ������ʱ
	endTime : function() {
		var sign = this.timeObj.sign;
		if (sign != null)
			clearTimeout(sign);
	},
	// �������ļ��
	finishCheck : function() {
		if (this.isFinished()) {
			/*
			this.endTime();
			// ���ð�ť����ʾ��ʾ��Ϣ
			var doc = document;
			var timeObj = this.timeObj;
			doc.getElementById("begin").value = "  ��ʼ  ";
			doc.getElementById("finish").disabled = "disabled";
			doc.getElementById("usetime").value = "0:0:0";
			alert("��ϲ���������Ϸ�������ʱ��" + timeObj.h + ":" + timeObj.m + ":"
					+ timeObj.s);
			*/
			doc.getElementById("begin").value = "  ��ʼ  ";
			//doc.getElementById("finish").disabled = "disabled";
			alert("��ɣ�");
			window.navigate("../about.html"); 
			
		} else {
			alert("����û��ɣ�");
		}
	},
	// ȷ���Ƿ�������
	isFinished : function() {
		var nowResult = this.nowResult;
		var failPoint = this.failPoint;
		var i, k;
		// ����Ƿ����
		for (i = 1; i <= 9; i++) {
			for (k = 1; k <= 9; k++) {
				if (nowResult[i][k] == "" || failPoint[i][k]) {
					return false;
				}
			}
		}
		return true;
	}
};

// ����¼����ݴ���
function addEvent(target, type, handler) {
	if (window.addEventListener) {
		addEvent = function(target, type, handler) {
			target.addEventListener(type, handler, false);
		}
	} else {
		addEvent = function(target, type, handler) {
			target.attachEvent("on" + type, handler);
		}
	}
	addEvent(target, type, handler);
}

// ɾ���¼����ݴ���
function removeEvent(target, type, handler) {
	if (window.removeEventListener) {
		removeEvent = function(target, type, handler) {
			target.removeEventListener(type, handler, false);
		}
	} else {
		removeEvent = function(target, type, handler) {
			target.detachEvent("on" + type, handler);
		}
	}
	removeEvent(target, type, handler);
}

// ��ֹð�ݼ��ݴ���
function stopPropagation(e) {
	if (e.stopPropagation) {
		stopPropagation = function(e) {
			e.stopPropagation();
		}
	} else {
		stopPropagation = function(e) {
			e.cancelBubble = true;
		}
	}
	stopPropagation(e);
}

// ��ֹĬ�϶������ݴ���
function preventDefault(e) {
	if (e.preventDefault) {
		preventDefault = function(e) {
			e.preventDefault();
		}
	} else {
		preventDefault = function(e) {
			e.returnValue = false;
		}
	}
	preventDefault(e);
}

// ��ȡ�ַ�����
function getCharCode(e) {
	if (typeof e.charCode == 'number') {
		return e.charCode;
	} else {
		return e.keyCode
	}
}

// ��ʼ�ܾ��
function shuDuRun() {
	// ���°�ť��Ϣ
	var finish = document.getElementById("finish");
	var begin = document.getElementById("begin");
	begin.value = "���¿���";
	finish.disabled = "";
	// ��������
	Shudu.run();
}

// ��ɾ��
function shuDuFinish() {
	Shudu.finishCheck();
}

// ��ʼ�����
function loadRun() {
	// ��ʼ������
	Shudu.init();
	var begin = document.getElementById("begin");
	var finish = document.getElementById("finish");
	// ��ӵ���¼�
	addEvent(finish, "click", shuDuFinish);
	addEvent(begin, 'click', shuDuRun);
}

// ��Ӽ����¼�
addEvent(window, "load", loadRun);
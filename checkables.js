(function () { 
	"use strict"
	var checkables = getAllElementsWithAttribute('data-checkable'),
	checkablesCount = checkables.length,
	checktypes = {
		radio :[],
		checkbox :[],
		select:[],
		selectjs:[]
	},
	idPrefix = 'checkables_',
	cache = [],
	refrate = 1000

	// Sort types of checkables	
	for(var i=0; i<checkablesCount; i++){
		var attributes = checkables[i].attributes;
		for(var s=0, max=attributes.length; s<max; s++){
			var nodeType = (attributes['data-checkable'].nodeValue).replace('-', '');
			checktypes[nodeType].push(attributes['data-checkable'].ownerElement);
		}
	}
	
	//Removes any duplicates
	checktypes.selectjs = checktypes.selectjs.filter(function(elem, index, self) {
	    return index == self.indexOf(elem);
	});
	
	//build javascript select boxes
	for(var i=0, max=checktypes.selectjs.length; i<max; i++){
		selectJSBuilder(checktypes.selectjs, i);
	}
	
	//Closes dropdons when click away
	window.onclick = function(e){
		var elems = document.querySelectorAll('[data-checkable="select-js"] > ul');
		for(var i=0, m=elems.length; i<m; i++) {
			var h = (e.target.nextSibling!==elems[i]) ? elems[i].style.display = "none" : true;
	    }
	}
	
	//Track scrolling for options postions top/bottom
	windowScroll(function(){
	    for(var i=0, max = cache.length-1; i<=max; i++){
		    var ul = document.getElementById(cache[i]);
		    topBottom(ul, getHiddenHeight(ul.getElementsByTagName('ul')[0], ul.getElementsByTagName('ul')[0].style.display ) );
	    }
	});

	//Functions
	function selectJSBuilder(node, i){
		var that = node[i];
		(!that.id) ? that.id = uniqueID(idPrefix) : null;
		cache.push(that.id);
		var select = that.getElementsByTagName('select')[0];
		select.id=uniqueID(idPrefix);
		var options = select.children;
		append(that, '<div class="clicker"></div><ul id="'+uniqueID(idPrefix)+'"></ul>');
		var clicker = that.getElementsByClassName('clicker')[0];
		var ul = that.getElementsByTagName('ul')[0];
		for(var b=0, max=options.length; b<max; b++){
			var opid = uniqueID(idPrefix);
			append(ul, '<li id="'+opid+'" data-value="'+options[b].value+'">'+options[b].text+'</li>');
		}
		var ulHeight = getHiddenHeight(ul, false);
		addStyles('#'+that.id+'.stick-top > ul { top: -'+ulHeight+'px; } ');
		topBottom(that, ulHeight);
		var list = ul.getElementsByTagName('li');
		clicker.onclick = function(e){
			e.preventDefault();
		    toggleVisible(ul);
		}
		for(var i=0; i<list.length; i++) {
	        list[i].addEventListener('click', function(e){
		        e.preventDefault();
		        setSelectedValue(document.getElementById(select.id), this.attributes['data-value'].value);
				var selected = document.getElementById(select.id).options.selectedIndex;
			    var elems = that.querySelectorAll(".selected");
				[].forEach.call(elems, function(el) {
				    el.className = el.className.replace(/\bselected\b/, "");
				});
			    that.getElementsByTagName('li')[selected].className = "selected";
			    toggleVisible(ul);
		    }, false);
	    }
	}
	
	function getAllElementsWithAttribute(e) {
	    for (var t = [], n = document.getElementsByTagName("*"), o = 0, i = n.length; i > o; o++) null !== n[o].getAttribute(e) && t.push(n[o]);
	    return t
	}
	
	function append(e, t) {
	    return e.innerHTML = e.innerHTML + t
	}
	
	function toggleVisible(e) {
	    if(e.style.display && e.style.display !== "none"){
		    e.style.display = "none" 
	    }else{
		    e.style.display = "block"
	    }
	}
	
	function uniqueID(e) {
		var num = Math.floor((Math.random() * 100) + 1);
	    var t = e + (new Date).getUTCMilliseconds().toString()+num;
	    return document.getElementById(t) && (t = uniqueID(e)), t
	}
	
	function setSelectedValue(e, t) {
	    for (var n = 0; n < e.options.length; n++)
	        if (e.options[n].text == t) return void(e.options[n].selected = !0)
	}
	
	function getPosition(e) {
	    for (var t = 0, n = 0; e;) t += e.offsetLeft - e.scrollLeft + e.clientLeft, n += e.offsetTop - e.scrollTop + e.clientTop, e = e.offsetParent;
	    return {
	        x: t,
	        y: n
	    }
	}
	
	function windowScroll(e) {
	    function t() {
	        n = !0
	    }
	    var n = !1;
	    window.onscroll = t, setInterval(function() {
	        n && (n = !1, e())
	    }, refrate)
	}
	
	function topBottom(e, t) {
	    var n = getPosition(e).y;
	    e.className = e.className.replace('stick-bottom', '');
	    e.className = e.className.replace('stick-top', '');
	    e.className = e.className.replace(/ +(?= )/g,'');
	    window.innerHeight > n + t + 10 ? e.className += " stick-bottom" : e.className += " stick-top"
	}
	
	function addStyles(e) {
	    var t = document.getElementById(idPrefix+"head") ? document.getElementById(idPrefix+"head") : document.getElementsByTagName("head")[0];
	    var st = document.getElementById(idPrefix+"head") ? e : '<style id="'+idPrefix+'head">' + e + '</style>';
	    t.innerHTML = t.innerHTML + st;
	}
	
	function getHiddenHeight(e, set) {
		set = (set) ? set : 'none';
	    e.style.display = "block";
	    var t = e.offsetHeight;
	    e.style.display = set ;
	    return t;
	}
})();
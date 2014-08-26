(function(){

	// Event onload - initiate dom properly
	document.addEventListener("DOMContentLoaded", function() {
  		var puppet = dom.one("#puppet");
		if(!puppet){
			puppet = dom.add(document.body, ['<div id="puppet"></div>']);
		}
		dom.add(puppet, [
			'<div id="puppet-header">Puppet IFrames</div>',
  			' <ol id="puppet-frames"></ol>',
  			'</div>',
  			'<div id="puppet-iframe-popup" class="hide"></div>'
		]);
	});

	// Constructor
	window.Puppet = function(name, url){
		var header = '';
		if(!url){
		url = name;
			name = null;
		}
		if(name){
			header += '<strong>'+name+'</strong>';
		}
		header += '<strong>'+url+'</strong>';
		header = '<li>'+header+'<a>Show IFrame</a><ol class="hide"></ol></li>';
		this.item = dom.add('#puppet-frames', header);
		var iframe = '<iframe class="hide" src="'+url+'"></iframe>';
		this.iframe = dom.add('#puppet-iframe-popup', iframe);
	};

	// Static properties
	window.Puppet.fn = window.Puppet.prototype = {};
	window.Puppet.plugins = [];

	// Static method
	window.Puppet.close = function(){
		dom.remove('#puppet-rightbar');
		dom.one('#puppet-iframe-popup').classList.toggle('hide', true);
		var iframes = dom.get('#puppet-iframe-popup iframe');
		for(var i = 0; i < iframes.length; i++){
			iframes[i].classList.toggle('hide', true);
		}
	};

	window.Puppet.fn.openFullscreen = function(){
		dom.add(document.body, [
			'<div id="puppet-rightbar">',
			' <div class="header">',
			'  <select>',
			'   <option>Add Event</option>',
			'  </select>',
			'  <span class="icon cross" onclick="Puppet.close();">Close Puppet</span>',
			' </div>',
			'</div>'
		]);
		var select = initiateUnselectableDropdownbox('#puppet-rightbar .header select');
		//call plugins
		dom.one('#puppet-iframe-popup').classList.toggle('hide', false);
		this.iframe.classList.toggle('hide', false);
	};

	// Dom utilities used for basic manipulation	
	var dom = {
		get: function(base, nodes){
			if(nodes === undefined){
				nodes = base;
				base = document.body;
			}
			if(typeof nodes === 'string'){
				return base.querySelectorAll(nodes);
			}
			if(!nodes)return [];
			return nodes instanceof Array ? nodes : [nodes];
		},
		one: function(base, node){
			return dom.get(base, node)[0];
		},
		remove: function(nodes){
			nodes = dom.get(nodes);
			for(var i = 0; i < nodes.length; i++){
				//if(!nodes[i] || !nodes[i].parentNode)continue;
				nodes[i].parentNode.removeChild(nodes[i]);
			}
		},
		add: function(single, html){
			if(html.join)html = html.join('\n');
			single = dom.one(single);
			var childs, child, wrapper = document.createElement('div');
			if(typeof html === 'string'){
				wrapper.innerHTML = html;
				childs = wrapper.childNodes;
			}else{
				childs = dom.get(html);
			}
			for(var i in childs){
				if(!childs[i] || childs[i].nodeType !== 1)continue;
				child = childs[i];
				single.appendChild(child);
			}
			return child;
		},
		text: function(base, node){
			var result = [];
			node = dom.one(base, node);
			for (var i = 0; i < node.childNodes.length; i++) {
    			var n = node.childNodes[i];
    			if (n.nodeName === "#text")result.push(n.nodeValue);
    		}
    		return result;
		}
	};

	

	
	// Private methods for specific dom functionality
	
	function initiateUnselectableDropdownbox(selector){
	 	var select = dom.one(selector);
		var addedOptions = {};
		select.onchange = function(){
			var name = select.value;
			select.options[0].selected = true;
			if(addedOptions[name])addedOptions[name]();
		}
		return {
			add: function(name, onclick){
				addedOptions[name] = onclick;
				dom.add(select, ['<option>', name, '</option>']);
			}
		}
	}

	function expandEvent(element){
		var all = dom.get('#puppet-rightbar .event-attr');
		for(var i in all){
			if(all[i].classList)all[i].classList.toggle('hide', true);
		};
		element.classList.toggle('hide', false);
	}

	function addEventToRightBar(name, shownAttributes, selectableAttributes){

		var eventdom = dom.add('#puppet-rightbar', [
			'<div class="event">',
			' <div class="event-name">',
			name,
			'  <span class="icon cross"></span>',
			'  <span class="icon play">Run</span>',
			' </div>',
			' <div class="event-attr">',
			'  <div class="added"></div>',
			' </div>',
			'</div>'
		]);

		dom.one(eventdom, '.cross').onclick = function(event) {
			event.stopPropagation();
			dom.remove(eventdom);
		}

		dom.one(eventdom, '.play').onclick = function(event) {
			event.stopPropagation();
			//TODO
		}

		dom.one(eventdom, '.event-name').onclick = function(){
			expandEvent(dom.one(eventdom, '.event-attr'));
		}
		expandEvent(dom.one(eventdom, '.event-attr'));

		function addAttribute(label, value){
			if(value instanceof Array){
				value = value.map( function(s){ return '<option>'+s+'</option>'; }).join('\n');
				value = '<select>'+value+'</select>';
			}else{
				value = '<input type="text" value="'+value+'"/>';
			}
			dom.add(dom.one(eventdom, '.event-attr .added'), [
				'<div class="attr">',
				' <span><input type="checkbox" checked="checked"/><label>'+label+'</label></span>',
				' <span>'+value+'</span>',
				'</div>'
			]);
		}

		dom.add(dom.one(eventdom, '.event-attr'),[
			'<div class="attr">',
			' <span>',
			'  <span class="icon plus"></span>',
			' </span>',
			' <span>',
			'  <select class="options">',
			'   <option></option>',
			'  </select>',
			' </span>',
			'</div>'
		]);

		var event_select = initiateUnselectableDropdownbox(dom.one(eventdom, '.event-attr .options'));

		for(var key in selectableAttributes){
			var closurekey = key;
			event_select.add(key, function(){
				addAttribute(closurekey, selectableAttributes[closurekey]);
			});
		}
		
		for(var key in shownAttributes){
			addAttribute(key, shownAttributes[key]);
		}
	}

	function serializeEvent(element){
		var result = {};
		var name = dom.text(element, '.event-name').join('').trim();
		var attributes = dom.get(element, '.attr');
		for(var i = 0; i < attributes.length; i++){
			var attr = attributes[i];
			var selected = dom.one(attr, 'input[type=checkbox]');
			if(selected && selected.checked){
				var label = dom.text(attr, 'label')[0];
				var value = dom.one(attr, 'input[type=text], select').value;
				if(!result.hasOwnProperty(label))result[label] = [];
				result[label].push(value);
			}
		}
		return JSON.stringify(result);
	}

    /*<li><strong>Example</strong><strong>./ex.html</strong><a>Show IFrame</a></li>
    <li>
      <strong>Testname</strong><strong>./simple/test.html</strong><a>Show IFrame</a>
      <ol>
        <li class="status">Status</li>
        <li class="error">Error</li>
        <li class="value">Value</li>
      </ol>
    </li>
    <li><strong>./simple/simple.html</strong><a>Show IFrame</a></li>*/


	document.addEventListener("DOMContentLoaded", function() {
		var puppet = new Puppet("test", "http://tutorialzine.com/2012/04/5-lightweight-jquery-alternatives/");
		puppet.openFullscreen();

		addEventToRightBar("test", {
			test: "test",
			x: "xvalue",
			select: ["true", "false"]
		}, {});

		addEventToRightBar("test", {
			test: "test",
			x: "xvalue",
			select: ["true", "false"]
		}, {
			addable: ["true", "false"]
		});

		addEventToRightBar("test", {
			test: "test",
			x: "xvalue",
			select: ["true", "false"]
		}, {});

		console.log(serializeEvent(dom.get('.event')[0]));
	});
	
}());

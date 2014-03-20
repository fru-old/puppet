
Puppet.singleton = null;
Puppet.active = [];

function Puppet(url) {
  if(!(this instanceof Puppet)){
    //Called as function
    if(Puppet.singleton)Puppet.singleton.close();
    Puppet.singleton = new Puppet(url);
    return Puppet.singleton;
  }else{
    //Called as constructor
    if(url)this.visit(url);
  }
}

Puppet.prototype.close = function(){
  var i = Puppet.active.indexOf(this);
  if(i > -1)Puppet.active = Puppet.active.splice(i, 1);
  this.frame = null;
  return this;
};

Puppet.prototype.visit = function(url){
  if(!this.frame){
    this.frame = document.createElement("iframe");
    this.frame.setAttribute("src", url); 
    Puppet.active.push(this);
  }else{
    //set href
  }
  return this;
};

Puppet.prototype.fullscreen = function(show){
  if(this.frame){
    var popup = "puppet-iframe-popup";
    var holder = document.getElementById(popup);
    if(holder)holder.parentNode.removeChild(holder);

    if(show !== false){
      holder = document.createElement("div");
      holder.id = popup;
      document.body.appendChild(holder);

      holder.appendChild(this.frame);

      var close = document.createElement("a");
      close.appendChild(document.createTextNode("Close Fullscreen"));
      close.href = "#";
      holder.appendChild(close);

      var self = this;
      close.onclick = function(){
        Puppet.prototype.fullscreen.call(self, false);
        return false;
      }
    }
  }
  return this;
};

Puppet.prototype.query = function(selector){
  
};

Puppet.prototype.single = function(selector){
  
};
(function(angular){
  'use strict';
  
  angular.module('ngEocities.sparkler-factory', [])
  
  .factory('sparkler', function() {
    // http://sunshinestory96.blogspot.com/2011/07/tutorial-rainbow-sparkle-cursor.html
    var ox, oy, sdown;
    var hex = new Array("00","14","28","3C","50","64","78","8C","A0","B4","C8","DC","F0");
    var r = 1;
    var g = 1;
    var b = 1;
    var seq = 1;
    var sparkles  =  35;
    var x = ox = 400;
    var y = oy = 300;
    var swide = 800;
    var shigh = 600;
    var sleft = sdown = 0;
    var tiny = new Array();
    var star = new Array();
    var starv = new Array();
    var starx = new Array();
    var stary = new Array();
    var tinyx = new Array();
    var tinyy = new Array();
    var tinyv = new Array();


    function sparkle() {
      var c;

      if (x !== ox || y !== oy) {
        ox = x;
        oy = y;
        for (c = 0; c<sparkles; c++) if (!starv[c]) {
          star[c].style.left = (starx[c] = x)+"px";
          star[c].style.top = (stary[c] = y)+"px";
          star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
          star[c].style.visibility = "visible";
          starv[c] = 50;
          break;
        }
      }

      for (c = 0; c < sparkles; c++) {
        if (starv[c]) update_star(c);
        if (tinyv[c]) update_tiny(c);
      }

      setTimeout(sparkle, 40);
    }

    function update_star(i) {
      if (--starv[i]==25) star[i].style.clip = 'rect(1px, 4px, 4px, 1px)';
      if (starv[i]) {
        stary[i] += 1 + Math.random() * 3;

        if (stary[i] < shigh + sdown) {
          star[i].style.top = stary[i] + 'px';
          starx[i] += (i % 5 - 2) / 5;
          star[i].style.left = starx[i] + 'px';
        } else {
          star[i].style.visibility = 'hidden';
          starv[i] = 0;
          return;
        }
      } else {
        tinyv[i] = 50;
        tiny[i].style.top = (tinyy[i] = stary[i]) + 'px';
        tiny[i].style.left = (tinyx[i] = starx[i]) + 'px';
        tiny[i].style.width = '2px';
        tiny[i].style.height = '2px';
        star[i].style.visibility = 'hidden';
        tiny[i].style.visibility = 'visible';
      }
    }

    function update_tiny(i) {
      if (--tinyv[i]==25) {
        tiny[i].style.width="1px";
        tiny[i].style.height="1px";
      }

      if (tinyv[i]) {
        tinyy[i]+=1+Math.random()*3;
        if (tinyy[i]<shigh+sdown) {
          tiny[i].style.top=tinyy[i]+"px";
          tinyx[i]+=(i%5-2)/5;
          tiny[i].style.left=tinyx[i]+"px";
        } else {
          tiny[i].style.visibility="hidden";
          tinyv[i]=0;
          return;
        }
      } else tiny[i].style.visibility="hidden";
    }

    document.onmousemove = function(e) {
      set_scroll();
      y = e.pageY;
      x = e.pageX;
    };

    function set_scroll() {
      if (typeof(self.pageYOffset) === 'number') {
        sdown = self.pageYOffset;
        sleft = self.pageXOffset;
      } else if (document.body.scrollTop || document.body.scrollLeft) {
        sdown = document.body.scrollTop;
        sleft = document.body.scrollLeft;
      } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
        sleft = document.documentElement.scrollLeft;
        sdown = document.documentElement.scrollTop;
      } else {
        sdown = 0;
        sleft = 0;
      }
    }

    function createDiv(height, width) {
      var rainbow, div;
      div = document.createElement('div');
      rainbow = '#' + hex[r] + hex[g] + hex[b];

      if (seq === 6) {
        b--;
        if (b === 0) seq = 1;
      }

      if (seq === 5) {
        r++;
        if (r === 12) seq = 6;
      }

      if (seq === 4) {
        g--;
        if (g === 0) seq = 5;
      }

      if (seq === 3) {
        b++;
        if (b==12) seq=4;
      }

      if (seq===2) {
        r--;
        if (r===0) seq = 3;
      }

      if (seq===1) {
        g++;
        if (g===12) seq=2;
      }

      div.style.position = 'absolute';
      div.style.height = height + 'px';
      div.style.width = width + 'px';
      div.style.overflow = 'hidden';
      div.style.zIndex = '10';
      div.style.backgroundColor = rainbow;

      return (div);
    }

    function initCursor() {
      var i, rats, rlef, rdow;

      if (document.getElementById) {
        
        for (i = 0; i < sparkles; i++) {
          rats = createDiv(3, 3);
          rats.style.visibility="hidden";
          document.body.appendChild(tiny[i]=rats);
          starv[i]=0;
          tinyv[i]=0;
          rats=createDiv(5, 5);
          rats.style.backgroundColor="transparent";
          rats.style.visibility="hidden";
          rlef=createDiv(1, 5);
          rdow=createDiv(5, 1);
          rats.appendChild(rlef);
          rats.appendChild(rdow);
          rlef.style.top="2px";
          rlef.style.left="0px";
          rdow.style.top="0px";
          rdow.style.left="2px";
          document.body.appendChild(star[i]=rats);
        }
        sparkle();
      }
    }

    return initCursor;
  });
}(angular));
#ng-eocities

A library of retro Angular directives

[Demo](http://www.ng-eocities.com/)

##Installation
```bower install ng-eocities```

```npm install```

```gulp serve```

##Usage
All directives and their dependencies have their own module and can be used individually.  To use the entire library, simply add the main ngEocities module as a dependency in your app.

    angular.module('myApp' ['ngEocities']);

###pixelated-img
Tired of the razer sharp images of the modern web?  Pixelate down that fidelity to your heart's content!

source and pixelation values are tied to scope

    <div pixelated-img source="{{image}}" pixelation="{{pixelation}}"></div>
    <input type="range" min="1" max="100" ng-model="pixelation" /></div>

###figlet
Add some pizzazz to your text by figlifying it up

app:
    app.config(function(figlifyProvider) {
        // set the path to your figlet fonts
        figlifyProvider.setFontsRoute('/figlet/fonts/');
    });

html:

    <figlet text='{{model}}' font='smkeyboard'></figlet>
    <input ng-model='model' type='text' placeholder='figlify some text' />

###marquee
Don't let deprecation slow you down, get those marquee's out of your legacy code and into mobile website.

    <div marquee width='100px' duration='3000' direction="right">
        <figlet text="Vrooom!!" font='alligator'></figlet>
    </div>

###blink
Don't blink, or you'll miss it!  Just kidding, try to avoid having a \<blink\> induced seizure.

```options: 'blackwhite', 'rainbow'```

    <div blink option="rainbow" active='true' flashtext='true' interval='100' style='float:left;'>don't  blink</div>

###counter
Everybody is demanding proof about those visitor numbers you've been claiming.  This counter brings the irrefutable truth to your website.

app:

    app.config(function(counterProvider) {
        // point counter to your firebase count url
        counterProvider.setFirebaseURL('https://ng-eocities.firebaseio.com/');
    });

html:

    <div counter></div>

###sparkler
Because who said a mouse should look like a black arrow anyway?

    app.run(function(sparkler) {
        sparkler();
    });

##Backlog
####jukebox
####draggable

##Contributing

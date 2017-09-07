
//Get navigator type.
var agent = navigator.userAgent;
console.log( "agent = " + agent );

var useWebIDE = ( agent.indexOf("Remix")>-1 || agent.indexOf("Chromebook")>-1 );
var isAndroid = ( agent.indexOf("Android")>-1 );

 //Change defaults.
 //Note: I have also modified animation-duration:350ms->100ms in JQM css files;
 $(document).on("mobileinit", function()
 { 
	//$.extend( $.mobile , { ajaxEnabled: false }); //<-- so #bookmarks work.
	$.mobile.defaultPageTransition = 'none'; //'fade';
	$.mobile.buttonMarkup.hoverDelay = 10;
	
	if( navigator.userAgent.indexOf("Android")==-1 ) {
		$.mobile.page.prototype.options.addBackBtn = true;
		$.mobile.page.prototype.options.backBtnTheme  = "c";
	}
	//$.mobile.activeBtnClass = 'unused';
	//$.mobile.removeClass("ui-btn-hover-c").addClass("ui-btn-up-c");
	
	if( navigator.userAgent.indexOf("Android")==-1 )
		$.mobile.ignoreContentEnabled = true;
 });
 
$(document).ready(function () 
{
});

$(document).live( 'pageshow',function(event, ui)
{
	try
	{
		//Remove IOIO links if not relevent.
		//if( document.getElementById("ioio") ) {
		//	if( app.GetName()!="IOIOScript") ioio.innerHTML = "";
		//}
		//Remove NXT links if not relevent.
		//if( document.getElementById("nxt") ) {
		//	if( app.GetName()!="NxtScript") nxt.innerHTML = "";
		//}
		
		//Set appropriate body style.
		if( !isAndroid || useWebIDE )
			document.body.className = "bodyPC";
		
		//Remove 'Copy' and 'Run' buttons on PC.
		if( !isAndroid || useWebIDE )
			hidecopy();
		
		//If on Android, save current page.
		if( isAndroid && !useWebIDE ) {
			setTimeout( "app.SetData( 'CurWebDoc', document.title )", 1 ); //<-- to stop HTC crash.
		}
			
		//Get current page id.
		var curPage = $.mobile.activePage.attr('id');
		
		//Show plugins list if 'plugins' page is loading.
		if( curPage=="plugins" )
			OnPageShow();
	}
	catch( e ) {}
});

//Dynamically create plugins page.
function OnPageShow()
{
	try
	{
		//If on device.
		if( isAndroid && !useWebIDE )
		{
			//Create a list of plugins.
			var html = "<ul data-role=\"listview\" data-inset=\"true\" data-filter=\"false\">";
			var fldr = app.GetPrivateFolder( "Plugins" );
			var list = app.ListFolder( fldr,"");
			for( var i=0; i<list.length && list[0]!=""; i++ )
			{
				//Filter for folders.
				var plugName = list[i];
				if( app.IsFolder( fldr+"/"+plugName ) )
				{
					//Get case sensitive title of plugin from inc file.
					var incFiles = app.ListFolder( fldr+"/"+plugName, ".inc", 1 );
					if( incFiles.length > 0 ) {
						var jarName = incFiles[0];
						var plugTitle = jarName.split(".")[0];
						var url = "file://"+fldr+"/"+plugName+"/"+plugTitle+".html";
						html += "<li><a href=\""+ url +"\">"+ plugTitle +"</a></li>";
					}
				}
			}
			html += "</ul>";
			$('#divPlugs').html(html);
			$('#divPlugs').trigger("create")
		}
		//If on PC.
		else
		{
			//Get list from device.
			xmlHttp = new XMLHttpRequest();
			xmlHttp.onload = function() 
			{ 
				//Extract plugins list.
				var list = JSON.parse(xmlHttp.responseText).plugins.split(","); 
				
				//Build html list.
				var html = "<ul data-role=\"listview\" data-inset=\"true\" data-filter=\"false\">";
				for( var i=0; i<list.length && list[0]!=""; i++ )
				{
					var plugTitle = list[i];
					var url = "plugins/"+plugTitle.toLowerCase()+"/"+plugTitle+".html";
					html += "<li><a href=\""+ url +"\">"+ plugTitle +"</a></li>";
				}
				html += "</ul>";
				$('#divPlugs').html(html);
				$('#divPlugs').trigger("create")
			};
			xmlHttp.open( "get", "/ide?cmd=getplugins", true );
			xmlHttp.send();
		}
	}
	catch( e ) {}
}
	
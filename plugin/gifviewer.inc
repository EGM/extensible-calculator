app.CreateGifViewer = function() { return new GifViewer();}

function GifViewer( options )
{
	var dw = app.GetDisplayWidth();
	var dh = app.GetDisplayHeight();
    this.plg = _CreatePlugin( "com.twoseventwodev.plugins.user.GifViewer", options );  
	this._GetArch = function() { return this.plg.Send( "getArch" ); }
	this._GetPlgDir = function() { return this.plg.Send( "getPlgDir" ); }
    this.GetGifPath = function(name) { return ((app.IsAPK()) ? this._GetPlgDir() : app.GetAppPath())+'/Gif/'+name+'.gif'; }    
    this.GetVersion = function(type) { type = type||'full'; return this.plg.Send( "GetVersion", ''+type ); }
	this.CreateGifImage = function( path,width,height ) {
    if (path === null) { path = this._GetPlgDir()+'/blank.gif'; }
	 width = width*dw||-1; height = height*dh||-1;
     var ret = this.plg.CreateObj( "GifImage", path, width, height );  
     if (ret) return new GIF(ret,this); else return null; 
    }
    this.GetError = function() {
	 var e = this.plg.Send( "getError" );
	 return (e === 'false') ? false : e;
	}
}

function GIF(id, p) {
    var obj = new Obj( id );
    obj.GetType = function() { return "GifImage"; }
    obj.Stop = function() { return p.plg.SendObj( "stop", obj ); }
    obj.Pause = function() { return p.plg.SendObj( "pause", obj ); }
    obj.OnAnimationComplete = function(cb) { return p.plg.SendObj( "listener", obj, cb.name ); }
    obj.SetImage = function(path) { return p.plg.SendObj( "file", obj, path ); }
    obj.SetSpeed = function(i) { return p.plg.SendObj( "speed", obj, i ); }
    obj.SeekTo = function(i) { return p.plg.SendObj( "seek", obj, i ); }
    obj.Play = function() { return p.plg.SendObj( "play", obj ); }
    obj.Reset = function() { return p.plg.SendObj( "reset", obj ); }
    obj.Details = function() { return p.plg.SendObj( "info", obj ); }
   	obj.SetOnTouch = function ( cb ) { return p.plg.SendObj( "touch", obj, cb.name ); }
    obj.IsPlaying = function() { return (p.plg.SendObj( "running", obj ) == 'true'); }
    obj.GetDuration = function() { return parseInt(p.plg.SendObj( "duration", obj )); }
    obj.IsSeekable = function() { return (p.plg.SendObj( "seekable", obj ) == 'true'); }
    obj.GetPosition = function() { return parseInt(p.plg.SendObj( "current", obj )); }
    return obj;
}

_GifNatives();

function _GifNatives() {
var soFile1 = "libpl_droidsonroids_gif.so";
var soFile2 = "libpl_droidsonroids_gif_surface.so";
var g = app.CreateGifViewer();
var plugDir = g._GetPlgDir();
var arch = g._GetArch();
var installedArch = app.LoadText('GifArch','none');

if (app.IsNewVersion()) {
if (app.IsAPK()) app.ExtractAssets('Gif', plugDir+'/Gif', true);
}

if (app.FileExists(plugDir+'/'+soFile1) && (installedArch === arch)) return;

var zip = app.CreateZipUtil();
zip.Open( plugDir+"/natives.dat" );
zip.Extract(arch+"_"+soFile1, plugDir+"/"+soFile1);
zip.Extract(arch+"_"+soFile2, plugDir+"/"+soFile2);
app.SaveText('GifArch', arch);
}

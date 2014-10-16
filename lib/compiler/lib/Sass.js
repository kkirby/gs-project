var
	spawn = require('child_process').spawn,
	mPath = require('path'),
	mDeasync = require('deasync');

module.exports = (function(){
	function Sass(){
	
	}

	Sass.Compile = function(text){
		var result = '';
		var err = '';
		var done = false;
		var executable = mPath.join(__dirname,'..','..','ruby_ship','bin','ruby_ship.sh');
		var sass = spawn(executable,[
			'-S',
			'sass',
			'-s',
			'--scss',
			'--cache-location',
			mPath.join(__dirname,'sassCache'),
			'-r',
			mPath.join(__dirname,'..','..','data','resource','css','math.rb')
		]);
		sass.stdout.on('data',function(data){
			result += data.toString();
		});
		sass.stderr.on('data',function(data){
			err += data.toString();
		});
		sass.on('close',function(){
			done = true;
		});
		sass.stdin.write(text);
		sass.stdin.end();
		while(done === false){
			mDeasync.sleep(100);
		}
		if(err){
			if(err.indexOf('Error: ') != -1){
				throw err;
			}
			else {
				console.log(err);
			}
		}
		return result;
	};
	
	return Sass;
})();
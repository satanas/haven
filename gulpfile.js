var gulp = require('gulp');
var shell = require('shelljs');

gulp.task('build:nw', function() {
  shell.exec('zip -r dist/haven.nw package.json src/*');
});

gulp.task('build:mac', ['build:nw'], function() {
  shell.exec('unzip dist/node-webkit-v0.11.5-osx-x64.zip -d dist');
  shell.mv('dist/haven.nw', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/app.nw');
  shell.cp('-r', 'dist/Info.plist', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Info.plist');
  shell.mv('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app', 'dist/Haven.app');
  // Clean up
  shell.rm('-r', 'dist/node-webkit-v0.11.5-osx-x64/');
  //fs.createReadStream('path/to/archive.zip').pipe(unzip.Extract({ path: 'output/path' }));

  //gulp.src('dist/node-webkit-v0.11.5-osx-x64.zip')
  //.pipe(unzip())
  //.pipe(gulp.dest('dist'))
  //.on('end', function() {
  //  //fs.rename('dist/haven.nw', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/app.nw', function(err){
  //  //  console.log('Error renaming haven.nw', err);
  //  //});

  //  var read, write;
  //  //read = fs.createReadStream('dist/haven.nw');
  //  //write = fs.createWriteStream('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/app.nw');
  //  //read.pipe(write);
  //  mv('dist/haven.nw', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/app.nw', {mkdirp: true}, function(err) {
  //    console.log('Error renaming haven.nw', err);
  //  });

  //  //mv('dist/Info.plist', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Info.plist', function(err){
  //  //  console.log('info.plist', err);
  //  //});

  //  read = fs.createReadStream('dist/Info.plist');
  //  write = fs.createWriteStream('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Info.plist');
  //  read.pipe(write);

  //  //read = fs.createReadStream('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app');
  //  //write = fs.createWriteStream('dist/haven.app');
  //  //read.pipe(write);
  //  mv('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app', 'dist/haven.app', {mkdirp: true}, function(err) {
  //    console.log('haven.app', err);
  //  });

  //  del(['dist/*.nw', 'dist/node-webkit-v0.11.5-osx-x64']);

    //gulp.src('dist/haven.nw')
    //.pipe(rename('app.nw'))
    //.pipe(gulp.dest('dist'))
    //.on('end', function() {
    //  gulp.src('dist/app.nw')
    //  .pipe(gulp.dest('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/'))
    //  .on('end', function() {
    //    gulp.src('dist/Info.plist')
    //    .pipe(gulp.dest('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/'))
    //    .on('end', function() {
    //      gulp.src('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app')
    //      .pipe(rename('haven.app'))
    //      .pipe(gulp.dest('dist'));
    //    });
    //  });
    //});
  //});
});

gulp.task('build:win64', ['build:nw'], function() {
  shell.exec('unzip dist/node-webkit-v0.11.5-win-x64.zip -d dist');
  shell.exec('copy /b dist\\node-webkit-v0.11.5-win-x64\\nw.exe+dist\\haven.nw dist\\node-webkit-v0.11.5-win-x64\\haven.exe');
  shell.mv('dist/node-webkit-v0.11.5-win-x64', 'dist/haven-win-x64');
  shell.exec('cd dist && zip -r haven-win-x64.zip haven-win-x64');
  // Clean up
  shell.rm('-r', 'dist/haven-win-x64', 'dist/haven.nw');
  //gulp.src('dist/node-webkit-v0.11.5-win-x64.zip')
  //.pipe(unzip())
  //.pipe(gulp.dest('dist'))
  //.on('end', function() {
  //  exec('copy /b dist\\node-webkit-v0.11.5-win-x64\\nw.exe+dist\\haven.nw dist\\node-webkit-v0.11.5-win-x64\\haven.exe', function(err, stdout, stderr) {
  //    if (err) {
  //      console.log('exe', err, stderr);
  //    } else {
  //      exec('move dist\\node-webkit-v0.11.5-win-x64 dist\\haven-win-x64', function(err, stdout, stderr) {
  //        if (err) {
  //          console.log('moving', err, stderr);
  //        } else {
  //          gulp.src('dist/haven-win-x64/**/*')
  //          .pipe(zip('haven-win-x64.zip'))
  //          .pipe(gulp.dest('dist'))
  //          .on('end', function() {
  //            del(['dist/haven-win-x64']);
  //          });
  //        }
  //      });
  //    }
  //  });
  //});
});

gulp.task('build:win32', ['build:nw'], function() {
  shell.exec('unzip dist/node-webkit-v0.11.5-win-ia32.zip -d dist');
  shell.cp('-f', 'dist/haven.nw', 'dist/node-webkit-v0.11.5-win-ia32/');
  shell.exec('cd dist/node-webkit-v0.11.5-win-ia32/ && copy /b nw.exe+haven.nw haven.exe');
  shell.rm('dist/node-webkit-v0.11.5-win-ia32/haven.nw');
  shell.mv('dist/node-webkit-v0.11.5-win-ia32', 'dist/haven-win-ia32');
  shell.exec('cd dist && zip -r haven-win-ia32.zip haven-win-ia32');
  // Clean up
  shell.rm('-r', 'dist/haven-win-ia32', 'dist/haven.nw');
  //gulp.src('dist/node-webkit-v0.11.5-win-ia32.zip')
  //.pipe(unzip())
  //.pipe(gulp.dest('dist'))
  //.on('end', function() {
  //exec('copy /b dist\\node-webkit-v0.11.5-win-ia32\\nw.exe+dist\\haven.nw dist\\node-webkit-v0.11.5-win-ia32\\haven.exe', function(err, stdout, stderr) {
  //  if (err) {
  //    console.log('exe', err, stderr);
  //  } else {
  //    exec('move dist\\node-webkit-v0.11.5-win-ia32 dist\\haven-win-ia32', function(err, stdout, stderr) {
  //      if (err) {
  //        console.log('moving', err, stderr);
  //      } else {
  //        return gulp.src('dist/haven-win-ia32/**/*')
  //        .pipe(zip('haven-win-ia32.zip'))
  //        .pipe(gulp.dest('dist'))
  //        .on('end', function() {
  //          del(['dist/haven-win-ia32']);
  //        });
  //      }
  //    });
  //  }
  //});
  //});
});

gulp.task('clean', function() {
  shell.rm('-r', [
    'dist/haven.nw',
    'dist/node-webkit-v0.11.5-win-x64',
    'dist/node-webkit-v0.11.5-win-ia32',
    'dist/node-webkit-v0.11.5-osx-x64'
  ]);
});

//copy = function(orig, dest) {
//  var read = fs.createReadStream(orig);
//  var write = fs.createWriteStream(dest);
//  read.pipe(write);
//};

var fs = require('fs');
var gulp = require('gulp');
var shell = require('shelljs');
var exec = require('child_process').exec;
var path = require('path');
var SSH = require('ssh-kit'),
    ssh = new SSH();

gulp.task('build:nw', ['clean'], function() {
  shell.exec('zip -r dist/haven.nw package.json src/*');
});

gulp.task('build:mac', ['build:nw'], function() {
  shell.exec('unzip dist/node-webkit-v0.11.5-osx-x64.zip -d dist');
  shell.mv('dist/haven.nw', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/app.nw');
  shell.cp('-f', 'dist/Info.plist', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Info.plist');
  shell.cp('-f', 'dist/haven.icns', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/nw.icns');
  shell.cp('-f', 'dist/Credits.html', 'dist/node-webkit-v0.11.5-osx-x64/node-webkit.app/Contents/Resources/Credits.html');
  shell.mv('dist/node-webkit-v0.11.5-osx-x64/node-webkit.app', 'dist/Haven.app');
  // Clean up
  shell.rm('-r', 'dist/node-webkit-v0.11.5-osx-x64/');
});

gulp.task('build:win64', ['build:nw'], function() {
  shell.exec('unzip dist/node-webkit-v0.11.5-win-x64.zip -d dist');
  shell.exec('copy /b dist\\node-webkit-v0.11.5-win-x64\\nw.exe+dist\\haven.nw dist\\node-webkit-v0.11.5-win-x64\\haven.exe');
  shell.mv('dist/node-webkit-v0.11.5-win-x64', 'dist/haven-win-x64');
  shell.exec('cd dist && zip -r haven-win-x64.zip haven-win-x64');
  // Clean up
  shell.rm('-r', 'dist/haven-win-x64', 'dist/haven.nw');
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
});

gulp.task('build:linux64', ['build:nw'], function() {
  shell.exec('tar -xvzf dist/node-webkit-v0.11.5-linux-x64.tar.gz -C dist');
  shell.cp('-f', 'dist/haven.nw', 'dist/node-webkit-v0.11.5-linux-x64/');
  exec('cd dist/node-webkit-v0.11.5-linux-x64 && cat nw haven.nw > haven', function() {
    shell.chmod('+x', 'dist/node-webkit-v0.11.5-linux-x64/haven');
    shell.rm('dist/node-webkit-v0.11.5-linux-x64/haven.nw');
    shell.mkdir('dist/haven-linux-x64');
    shell.mv('dist/node-webkit-v0.11.5-linux-x64/*', 'dist/haven-linux-x64/');
    shell.rm('-r', 'dist/node-webkit-v0.11.5-linux-x64');
    shell.exec('cd dist && zip -r haven-linux-x64.zip haven-linux-x64');
    // Clean up
    shell.rm('-r', 'dist/haven-linux-x64', 'dist/haven.nw');
  });
});

gulp.task('build:linux32', ['build:nw'], function() {
  shell.exec('tar -xvzf dist/node-webkit-v0.11.5-linux-ia32.tar.gz -C dist');
  shell.cp('-f', 'dist/haven.nw', 'dist/node-webkit-v0.11.5-linux-ia32/');
  exec('cd dist/node-webkit-v0.11.5-linux-ia32 && cat nw haven.nw > haven', function() {
    shell.chmod('+x', 'dist/node-webkit-v0.11.5-linux-ia32/haven');
    shell.rm('dist/node-webkit-v0.11.5-linux-ia32/haven.nw');
    shell.mkdir('dist/haven-linux-ia32');
    shell.mv('dist/node-webkit-v0.11.5-linux-ia32/*', 'dist/haven-linux-ia32/');
    shell.rm('-r', 'dist/node-webkit-v0.11.5-linux-ia32');
    shell.exec('cd dist && zip -r haven-linux-ia32.zip haven-linux-ia32');
    // Clean up
    shell.rm('-r', 'dist/haven-linux-ia32', 'dist/haven.nw');
  });
});

gulp.task('clean', function() {
  shell.rm('-r', [
    'dist/haven.nw',
    'dist/node-webkit-v0.11.5-win-x64',
    'dist/node-webkit-v0.11.5-win-ia32',
    'dist/node-webkit-v0.11.5-osx-x64',
    'dist/node-webkit-v0.11.5-linux-ia32',
    'dist/node-webkit-v0.11.5-linux-x64',
    'dist/haven-win-x64',
    'dist/haven-win-ia32',
    'dist/Haven.app',
    'dist/haven-linux-x64.zip'
  ]);
});

gulp.task('deploy', function() {
  ssh.set('username', 'satanas');
  ssh.set('host', '45.55.172.242');
  //ssh.set('sshKey', '~/.ssh/id_rsa');

  ssh.exec('sudo rm -rvf /var/www/haven/');
  ssh.exec('sudo rm -rvf /tmp/haven/');
  ssh.exec('sudo git clone https://github.com/satanas/haven.git /tmp/haven/');
  ssh.exec('sudo mv /tmp/haven/src/ /var/www/haven');
  ssh.exec('sudo cp -Rv /var/ftp/haven/assets/ /var/www/haven/assets/');
  ssh.exec('sudo chown -R www-data:www-data /var/www/haven');
  ssh.exec('sudo chmod -R 755 /var/www/haven');
  ssh.exec('sudo service nginx reload');
});

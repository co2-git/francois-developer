#!/bin/bash

npmls="$(npm ls -g | grep francois-dev)";
npmg=y;

[ -z "$npmls" ] && {
  npmg=n;
  npmls="$(npm ls | grep francois-dev)";
}

[ -z "$npmls" ] && {
  echo 'Error: francois-dev not found in npm list (global AND local)';
  exit;
}

path="$(echo "$npmls" | cut -d' ' -f2)";

cd $path;

node_version='v0.10.15';

script="ui/app.js";

bin=node_modules/.bin;

env='development';

for arg; do
  [[ "$arg" == env=* ]] && {
    env="$(echo "$arg" | cut -d= -f2)";
  }
done

function fdev.version() {
  cd $path;
  cat package.json | grep '"version":' | sed 's/\s\+"version": "\(.\+\)",/\1/';
}

function fdev.build() {
  cd $path;
  echo 1>&2 'Compiling less...';
  node $bin/lessc --yui-compress \
    ui/public/bower_components/bootstrap/less/bootstrap.less \
    > ui/public/css/bootstrap.min.css;
  node $bin/lessc --yui-compress \
    ui/public/bower_components/bootstrap/less/responsive.less \
    > ui/public/css/bootstrap-responsive.min.css;
  
  echo 1>&2 'Copying images...';
  cp ui/public/bower_components/bootstrap/img/* ui/public/img;
  
  echo 1>&2 'Bower install...';
  cd ui/public;
  node ../../$bin/bower install;
  cd $path;

  echo Built :\);
}

function fdev.status() {
  cd $path;
  list="$(node $bin/forever list)";
  echo "$list" | grep 1>&2 $script && {
    echo Running;
    return 0;
  } || {
    echo Stopped;
    return 1
  }
}

function fdev.stop() {
  cd $path;
  node $bin/forever stop $path/$script;
}

function fdev.start() {
  cd $path;
  if fdev.status 1>/dev/null 2>/dev/null; then
    echo 'Already running';
    return;
  fi
  [ ! -d admin ] && mkdir admin;
  touch admin/forever.log;
  touch admin/forever.out;
  touch admin/forever.err;
  touch admin/forever.pid;
  echo 1>&2 Environment: $env;
  echo 1>&2 Starting foreverjs;
  export NODE_ENV="$env";
  node $bin/forever \
      --append \
      -l $path/admin/forever.log \
      -o $path/admin/forever.out \
      -e $path/admin/forever.err \
      --pidFile $path/admin/forever.pid \
      --debug \
      --watch \
      --watchDirectory $path \
    start $path/$script;
}

case "$1" in
  (version)
    fdev.version;
    ;;

  (build)
    fdev.build;
    ;;

  (status)
    fdev.status 2>/dev/null;
    ;;

  (start)
    fdev.start;
    ;;

  (stop)
    fdev.stop;
    ;;

  (update)
    cd $my_path;
    [ -d .git ] || {
      echo "git not found";
      git init;
      cp .npmignore .gitignore;
      git add -A;
      git commit -a -m 'Installing update by git';
      git remote add origin https://github.com/co2-git/francois-developer.git;
      git pull -f origin master;
    }
    branch="$(git branch | grep \* | sed 's/* //')";
    [ "$branch" = master ] || {
      echo Can not update if not on branch master;
      exit 1;
    }
    git pull origin master;
    $0 build;
    ;;

  (help|*)
    echo francois-dev \{ help \| version \| build \| start \| status \| stop \| update \}
    ;;
esac
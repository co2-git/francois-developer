#!/bin/bash
my_path="$(dirname $(cd >/dev/null $(dirname ${BASH_SOURCE[0]:-$0}) && pwd))";
node_version="v0.10.15";
node_bin=~/.nvm/$node_version/bin/node;
forever="$node_bin $my_path/node_modules/forever/bin/forever";
bower="$node_bin $my_path/node_modules/bower/bin/bower";
less="$node_bin $my_path/node_modules/less/bin/lessc";
script="$my_path/ui/app.js";
env='development';

for arg; do
  [[ "$arg" == env=* ]] && {
    env="$(echo "$arg" | cut -d= -f2)";
  }
done

case "$1" in
  (build)
    $less --yui-compress $my_path/ui/public/bower_components/bootstrap/less/bootstrap.less \
      > $my_path/ui/public/css/bootstrap.min.css;
    $less --yui-compress $my_path/ui/public/bower_components/bootstrap/less/responsive.less \
      > $my_path/ui/public/css/bootstrap-responsive.min.css;
    cp $my_path/ui/public/bower_components/bootstrap/img/* $my_path/ui/public/img;
    ;;

  (install)
    cd $my_path;
    cd ui/public;
    $bower install;
    ;;

  (status)
    list="$($forever list)";
    echo "$list" | grep 1>&2 $script && {
      echo Running;
      exit 0;
    } || {
      echo Stopped;
      exit 1;
    }
    ;;

  (start)
    [ ! -d $my_path/admin ] && mkdir $my_path/admin;
    touch $my_path/admin/forever.log;
    touch $my_path/admin/forever.out;
    touch $my_path/admin/forever.err;
    touch $my_path/admin/forever.pid;
    export NODE_ENV="$env";
    $forever \
        --append \
        -l $my_path/admin/forever.log \
        -o $my_path/admin/forever.out \
        -e $my_path/admin/forever.err \
        --pidFile $my_path/admin/forever.pid \
        --debug \
        --watch \
        --watchDirectory $my_path \
      start $script;
    ;;

  (stop)
    $forever stop $script;
    ;;

  (update)
    cd $my_path;
    [ -d .git ] || {
      echo "git not found";
      git init;
      cp .npmignore .gitignore;
      git add -A;
      git remote add origin https://github.com/co2-git/francois-developer.git;
      git pull -f origin master;
    }
    branch="$(git branch | grep \* | sed 's/* //')";
    [ "$branch" = master ] || {
      echo Can not update if not on branch master;
      exit 1;
    }
    git pull origin master;
    cd ui/public;
    $bower install;
    ;;

  (help|*)
    echo francois-dev \{ install \| build \| start \| status \| stop \| update \}
    ;;
esac
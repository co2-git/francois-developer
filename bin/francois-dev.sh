#!/bin/bash
my_path="$(dirname $(cd >/dev/null $(dirname ${BASH_SOURCE[0]:-$0}) && pwd))";
node_bin=~/.nvm/v0.10.15/bin/node;
forever="$node_bin $my_path/node_modules/forever/bin/forever";
script="$my_path/ui/app.js";

case "$1" in
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
    $forever \
        --append \
        -l $my_path/admin/forever.log \
        -o $my_path/admin/forever.out \
        -e $my_path/admin/forever.err \
        --pidFile $my_path/admin/forever.pid \
        --debug \
        --watch \
        --watchDirectory $my_path/ui \
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
      git remote add origin https://github.com/co2-git/francois-developer.git;
    }
    branch="$(git branch | grep \* | sed 's/* //')";
    [ "$branch" = master ] || {
      echo Can not update if not on branch master;
      exit 1;
    }
    git pull origin master;
    ;;

  (help|*)
    echo francois-dev \{ start \| status \| stop \| update \}
    ;;
esac
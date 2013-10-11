#!/usr/bin/env node
switch ( process.argv[2] ) {
	case undefined:
    console.log('francois-dev');
    break;
  case 'start':
    require('../ui/app');
}
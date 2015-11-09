// Generated by LiveScript 1.4.0
/**
 * @author Viacheslav Lotsmanov
 * @license MIT (https://raw.githubusercontent.com/unclechu/front-end-gulp-pattern/master/LICENSE-MIT)
 * @see {@link https://github.com/unclechu/front-end-gulp-pattern|GitHub}
 */
(function(){
  var path, fs, yargs, gulp, del, vinylPaths, tasks, gcb, plumber, gulpif, rename, sourcemaps, argv, pkg, isProductionMode, ignoreErrors, supportedTypes, watchTasks, defaultTasks, cleanTasks, renameBuildFile, initTaskIteration, initWatcherTask, preparePaths, checkForSupportedType, rmIt, typicalCleanTask, spritesCleanTasks, spritesBuildTasks, spritesWatchTasks, spritesData, ref$, spritePreparePaths, spriteCleanTask, spriteBuildTask, spriteGetNameByMask, spriteInitTasks, name, item, stylesCleanTasks, stylesBuildTasks, stylesWatchTasks, stylesData, stylesCleanTask, stylesBuildTask, stylesInitTasks, scriptsCleanTasks, scriptsBuildTasks, scriptsWatchTasks, scriptsData, scriptsCleanTask, scriptsJshintTask, scriptsBuildBrowserifyTask, scriptsExpandRelativeShimPaths, scriptsInitTasks, htmlCleanTasks, htmlBuildTasks, htmlWatchTasks, htmlData, htmlGetFilesSelector, htmlCleanTask, htmlBuildTask, htmlInitTasks, cleanData, distCleanData, distCleanTasks;
  path = require('path');
  fs = require('fs');
  yargs = require('yargs');
  gulp = require('gulp');
  del = require('del');
  vinylPaths = require('vinyl-paths');
  tasks = require('gulp-task-listing');
  gcb = require('gulp-callback');
  plumber = require('gulp-plumber');
  gulpif = require('gulp-if');
  rename = require('gulp-rename');
  sourcemaps = require('gulp-sourcemaps');
  argv = yargs['default']({
    production: false,
    ignoreErrors: false
  }).boolean('production').boolean('ignore-errors').argv;
  pkg = require(path.join(process.cwd(), 'package.json'));
  if (pkg.gulp == null) {
    throw new Error('No "gulp" key in package.json');
  }
  gulp.task('help', tasks);
  isProductionMode = argv.production;
  ignoreErrors = argv.ignoreErrors;
  supportedTypes = {
    sprites: ['spritesmith'],
    styles: ['stylus', 'less'],
    scripts: ['browserify'],
    html: ['jade']
  };
  watchTasks = [];
  defaultTasks = [];
  cleanTasks = [];
  renameBuildFile = function(buildPath, mainSrc, buildFile){
    if (buildPath.basename === path.basename(mainSrc, path.extname(mainSrc))) {
      buildPath.extname = path.extname(buildFile);
      buildPath.basename = path.basename(buildFile, buildPath.extname);
    }
  };
  initTaskIteration = function(name, item, initFunc){
    var subTaskName, ref$, subTask, subTaskParams;
    initFunc(name, item);
    if (item.subTasks == null) {
      return;
    }
    for (subTaskName in ref$ = item.subTasks) {
      subTask = ref$[subTaskName];
      subTaskParams = importAll$(importAll$(clone$(item), {
        subTask: null
      }), subTask);
      initFunc(name + "-" + subTaskName, subTaskParams, true);
    }
  };
  initWatcherTask = function(subTask, watchFiles, addToWatchersList, watchTaskName, watchersList, buildTaskName){
    var addToList;
    addToList = addToWatchersList === true || (!subTask && addToWatchersList !== false);
    gulp.task(watchTaskName, function(){
      ignoreErrors = true;
      gulp.watch(watchFiles, [buildTaskName]);
    });
    if (addToList) {
      watchersList.push(watchTaskName);
    }
  };
  preparePaths = function(params, cb){
    var destDir, ref$, srcDir, srcFilePath;
    destDir = (ref$ = params.destDir) != null
      ? ref$
      : path.join(params.path, 'build');
    srcDir = (ref$ = params.srcDir) != null
      ? ref$
      : path.join(params.path, 'src');
    srcFilePath = params.mainSrc != null ? path.join(srcDir, params.mainSrc) : null;
    if (srcFilePath != null && !fs.existsSync(srcFilePath)) {
      throw new Error("Source file '" + srcFilePath + "' isn't exists");
    }
    cb(srcFilePath, srcDir, destDir);
  };
  checkForSupportedType = curry$(function(category, type){
    if (supportedTypes[category] == null) {
      throw new Error("Unknown category: '" + category + "'");
    }
    if (!(function(it){
      return in$(it, supportedTypes[category]);
    })(
    type)) {
      throw new Error("Unknown " + category + " type: '" + type + "'");
    }
  });
  rmIt = function(toRemove, cb){
    return del(toRemove, {
      force: true
    }).then(cb.bind(null, null))['catch'](cb.bind(null));
  };
  typicalCleanTask = function(name, params, cb){
    preparePaths(params, function(srcFilePath, srcDir, destDir){
      rmIt((function(){
        switch (false) {
        case params.destDir == null:
          return path.join(destDir, params.buildFile);
        default:
          return destDir;
        }
      }()), cb);
    });
  };
  spritesCleanTasks = [];
  spritesBuildTasks = [];
  spritesWatchTasks = [];
  spritesData = (ref$ = pkg.gulp.sprites) != null
    ? ref$
    : {};
  spritePreparePaths = function(params, cb){
    var img, data;
    img = Object.create(null);
    data = Object.create(null);
    if (params.path == null) {
      if (params.imgSrcDir == null || params.imgDestDir == null || params.dataDestDir == null) {
        throw new Error('Not enough parameters');
      }
    } else {
      img.srcDir = path.join(params.path, 'src');
      img.destDir = path.join(params.path, 'build');
      data.destDir = path.join(params.path, 'build');
    }
    if (params.imgSrcDir != null) {
      img.srcDir = params.imgSrcDir;
    }
    if (params.imgDestDir != null) {
      img.destDir = params.imgDestDir;
    }
    if (params.dataDestDir != null) {
      data.destDir = params.dataDestDir;
    }
    img.buildFilePath = path.join(img.destDir, params.imgBuildFile);
    data.buildFilePath = path.join(data.destDir, params.dataBuildFile);
    img.publicPath = img.buildFilePath;
    if (params.imgPublicPath != null) {
      img.publicPath = params.imgPublicPath;
    }
    cb(img, data);
  };
  spriteCleanTask = function(name, spriteParams, params, cb){
    spritePreparePaths(params, function(img, data){
      var toRemove;
      toRemove = [data.buildFilePath].concat([params.imgDestDir != null && img.buildFilePath || img.destDir]);
      rmIt(toRemove, cb);
    });
  };
  spriteBuildTask = function(name, spriteParams, params, cb){
    var spritesmith;
    spritesmith = require('gulp.spritesmith');
    spritePreparePaths(params, function(img, data){
      var spriteData, ready, postCb;
      spriteData = gulp.src(path.join(img.srcDir, '*.png')).pipe(gulpif(ignoreErrors, plumber({
        errorHandler: cb
      }))).pipe(spritesmith(spriteParams));
      ready = {
        img: false,
        data: false
      };
      postCb = function(){
        if (ready.img && ready.data) {
          cb();
        }
      };
      spriteData.img.pipe(gulp.dest(img.destDir)).pipe(gcb(function(){
        ready.img = true;
        postCb();
      }));
      spriteData.css.pipe(gulp.dest(data.destDir)).pipe(gcb(function(){
        ready.data = true;
        postCb();
      }));
    });
  };
  spriteGetNameByMask = function(name, s, mask){
    return Object.keys(s).reduce(function(result, key){
      return result.replace(new RegExp("\\#" + key + "\\#", 'g'), s[key]);
    }, mask.replace(new RegExp('\\#task-name\\#', 'g'), name));
  };
  spriteInitTasks = function(name, item, subTask){
    var params;
    subTask == null && (subTask = false);
    params = {
      type: item.type,
      path: item.path || null,
      imgBuildFile: item.imgBuildFile || 'build.png',
      imgSrcDir: item.imgSrcDir || null,
      imgDestDir: item.imgDestDir || null,
      dataBuildFile: item.dataBuildFile || 'build.json',
      dataDestDir: item.dataDestDir || null,
      imgPublicPath: item.imgPublicPath || null,
      dataItemNameMask: item.dataItemNameMask || 'sprite-#task-name#-#name#'
    };
    checkForSupportedType('sprites')(
    params.type);
    spritePreparePaths(params, function(img){
      var spriteParams, cleanTaskName, buildTaskName, watchTaskName, preBuildTasks, ref$, watchFiles;
      spriteParams = {
        imgName: params.imgBuildFile,
        cssName: params.dataBuildFile,
        imgPath: img.publicPath,
        padding: item.padding || 1,
        algorithm: item.algorithm || 'top-down',
        imgOpts: {
          format: 'png'
        },
        cssFormat: item.dataType || void 8,
        cssVarMap: (function(name){
          return function(s){
            s.name = spriteGetNameByMask(name, s, params.dataItemNameMask);
          };
        }.call(this, name))
      };
      cleanTaskName = "clean-sprite-" + name;
      buildTaskName = "sprite-" + name;
      watchTaskName = buildTaskName + "-watch";
      preBuildTasks = [cleanTaskName].concat((ref$ = item.buildDeps) != null
        ? ref$
        : []);
      gulp.task(cleanTaskName, (function(name, spriteParams, params){
        return function(cb){
          spriteCleanTask(name, spriteParams, params, cb);
        };
      }.call(this, name, spriteParams, params)));
      gulp.task(buildTaskName, preBuildTasks, (function(name, spriteParams, params){
        return function(cb){
          spriteBuildTask(name, spriteParams, params, cb);
        };
      }.call(this, name, spriteParams, params)));
      spritesCleanTasks.push(cleanTaskName);
      if (!subTask) {
        spritesBuildTasks.push(buildTaskName);
      }
      watchFiles = (ref$ = item.watchFiles) != null
        ? ref$
        : path.join(img.srcDir, '*.png');
      initWatcherTask(subTask, watchFiles, item.addToWatchersList, watchTaskName, spritesWatchTasks, buildTaskName);
    });
  };
  for (name in spritesData) {
    item = spritesData[name];
    initTaskIteration(name, item, spriteInitTasks);
  }
  if (spritesCleanTasks.length > 0) {
    gulp.task('clean-sprites', spritesCleanTasks);
    cleanTasks.push('clean-sprites');
  }
  if (spritesBuildTasks.length > 0) {
    gulp.task('sprites', spritesBuildTasks);
    defaultTasks.push('sprites');
  }
  if (spritesWatchTasks.length > 0) {
    gulp.task('sprites-watch', spritesWatchTasks);
    watchTasks.push('sprites-watch');
  }
  stylesCleanTasks = [];
  stylesBuildTasks = [];
  stylesWatchTasks = [];
  stylesData = (ref$ = pkg.gulp.styles) != null
    ? ref$
    : {};
  stylesCleanTask = typicalCleanTask;
  stylesBuildTask = function(name, params, cb){
    preparePaths(params, function(srcFilePath, srcDir, destDir){
      var options, ref$, sourceMaps, plugin;
      options = import$((ref$ = Object.create(null), ref$.compress = isProductionMode, ref$), params.type === 'stylus' && params.shim != null
        ? {
          use: (function(){
            var i$, x$, ref$, len$, results$ = [];
            for (i$ = 0, len$ = (ref$ = params.shim).length; i$ < len$; ++i$) {
              x$ = ref$[i$];
              results$.push(require(path.join(process.cwd(), x$)));
            }
            return results$;
          }())
        }
        : params.type === 'less' && params.shim != null
          ? (function(){
            throw Error('unimplemented');
          }())
          : {});
      sourceMaps = params.sourceMaps === true || (!isProductionMode && params.sourceMaps !== false);
      plugin = (function(){
        switch (params.type) {
        case 'stylus':
          return require('gulp-stylus');
        case 'less':
          return require('gulp-less');
        default:
          throw Error('unimplemented');
        }
      }());
      gulp.src(srcFilePath).pipe(gulpif(ignoreErrors, plumber({
        errorHandler: cb
      }))).pipe(gulpif(sourceMaps, sourcemaps.init())).pipe(plugin(options)).pipe(gulpif(sourceMaps, sourcemaps.write())).pipe(rename(function(buildPath){
        renameBuildFile(buildPath, params.mainSrc, params.buildFile);
      })).pipe(gulp.dest(destDir)).pipe(gcb(cb));
    });
  };
  stylesInitTasks = function(name, item, subTask){
    var params, cleanTaskName, buildTaskName, watchTaskName, preBuildTasks, ref$;
    subTask == null && (subTask = false);
    params = import$({
      type: item.type,
      path: item.path,
      mainSrc: item.mainSrc,
      srcDir: item.srcDir || null,
      buildFile: item.buildFile,
      destDir: item.destDir || null,
      shim: item.shim || null
    }, typeof item.sourceMaps === 'boolean' && {
      sourceMaps: item.sourceMaps
    } || {});
    checkForSupportedType('styles')(
    params.type);
    cleanTaskName = "clean-styles-" + name;
    buildTaskName = "styles-" + name;
    watchTaskName = buildTaskName + "-watch";
    preBuildTasks = [cleanTaskName].concat((ref$ = item.buildDeps) != null
      ? ref$
      : []);
    gulp.task(cleanTaskName, (function(name, params){
      return function(cb){
        stylesCleanTask(name, params, cb);
      };
    }.call(this, name, params)));
    gulp.task(buildTaskName, preBuildTasks, (function(name, params){
      return function(cb){
        stylesBuildTask(name, params, cb);
      };
    }.call(this, name, params)));
    stylesCleanTasks.push(cleanTaskName);
    if (!subTask) {
      stylesBuildTasks.push(buildTaskName);
    }
    preparePaths(params, function(srcFilePath, srcDir){
      var watchFiles;
      watchFiles = (function(){
        switch (false) {
        case item.watchFiles == null:
          return item.watchFiles;
        case item.type !== 'less':
          return path.join(srcDir, '**/*.less');
        case item.type !== 'stylus':
          return ['**/*.styl', '**/*.stylus'].map(function(it){
            return path.join(srcDir, it);
          });
        default:
          throw Error('unimplemented');
        }
      }());
      initWatcherTask(subTask, watchFiles, item.addToWatchersList, watchTaskName, stylesWatchTasks, buildTaskName);
    });
  };
  for (name in stylesData) {
    item = stylesData[name];
    initTaskIteration(name, item, stylesInitTasks);
  }
  if (stylesCleanTasks.length > 0) {
    gulp.task('clean-styles', stylesCleanTasks);
    cleanTasks.push('clean-styles');
  }
  if (stylesBuildTasks.length > 0) {
    gulp.task('styles', stylesBuildTasks);
    defaultTasks.push('styles');
  }
  if (stylesWatchTasks.length > 0) {
    gulp.task('styles-watch', stylesWatchTasks);
    watchTasks.push('styles-watch');
  }
  scriptsCleanTasks = [];
  scriptsBuildTasks = [];
  scriptsWatchTasks = [];
  scriptsData = (ref$ = pkg.gulp.scripts) != null
    ? ref$
    : {};
  scriptsCleanTask = typicalCleanTask;
  scriptsJshintTask = function(name, params, cb){
    preparePaths(params, function(srcFilePath, srcDir){
      var jshint, stylish, src;
      jshint = require('gulp-jshint');
      stylish = require('jshint-stylish');
      src = [path.join(srcDir, '**/*.js')].concat((function(){
        var i$, x$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = params.jshintExclude).length; i$ < len$; ++i$) {
          x$ = ref$[i$];
          results$.push("!" + x$);
        }
        return results$;
      }()));
      gulp.src(src).pipe(jshint(params.jshintParams)).pipe(jshint.reporter(stylish)).pipe(rename('x')).end(cb);
    });
  };
  scriptsBuildBrowserifyTask = function(name, params, cb){
    var options, browserify, uglify;
    options = import$(import$({
      shim: params.shim,
      debug: params.debug === true || (!isProductionMode && params.debug !== false)
    }, params.transform != null && {
      transform: params.transform
    } || {}), params.extensions != null && {
      extensions: params.extensions
    } || {});
    browserify = require('gulp-browserify');
    uglify = require('gulp-uglify');
    preparePaths(params, function(srcFilePath, srcDir, destDir){
      gulp.src(srcFilePath, {
        read: false
      }).pipe(gulpif(ignoreErrors, plumber({
        errorHandler: cb
      }))).pipe(browserify(options)).pipe(gulpif(isProductionMode, uglify({
        preserveComments: 'some'
      }))).pipe(rename(function(buildPath){
        renameBuildFile(buildPath, params.mainSrc, params.buildFile);
      })).pipe(gulp.dest(destDir)).pipe(gcb(cb));
    });
  };
  scriptsExpandRelativeShimPaths = function(srcDir, shim){
    shim == null && (shim = {});
    return Object.keys(shim).reduce(function(result, name){
      return (function(it){
        return import$(it, result);
      })(function(it){
        var ref$;
        return ref$ = {}, ref$[name + ""] = it, ref$;
      }(shim[name].relativePath == null
        ? shim[name]
        : Object.keys(shim[name]).reduce(function(shimItem, param){
          var val;
          val = shim[name][param];
          if (param === 'relativePath') {
            shimItem.path = path.join(srcDir, val);
          } else {
            shimItem[param] = val;
          }
          return shimItem;
        }, {})));
    }, {});
  };
  scriptsInitTasks = function(name, item, subTask){
    var srcParams;
    subTask == null && (subTask = false);
    srcParams = import$({
      type: item.type,
      path: item.path,
      mainSrc: item.mainSrc,
      srcDir: item.srcDir || null,
      buildFile: item.buildFile,
      destDir: item.destDir || null,
      jshintEnabled: !!item.jshintEnabled,
      jshintParams: item.jshintParams || null,
      transform: item.transform || null,
      extensions: item.extensions || null
    }, typeof item.debug === 'boolean' && {
      debug: item.debug
    } || {});
    checkForSupportedType('scripts')(
    srcParams.type);
    preparePaths(srcParams, function(srcFilePath, srcDir){
      var params, ref$, ref1$, cleanTaskName, buildTaskName, jshintTaskName, watchTaskName, preBuildTasks, watchFiles;
      params = (ref$ = (ref1$ = import$({}, srcParams), ref1$.shim = scriptsExpandRelativeShimPaths(srcDir, item.shim), ref1$), ref$.jshintExclude = (item.jshintExclude || []).concat((function(){
        var i$, x$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = item.jshintRelativeExclude || []).length; i$ < len$; ++i$) {
          x$ = ref$[i$];
          results$.push(path.join(srcDir, x$));
        }
        return results$;
      }())), ref$);
      cleanTaskName = "clean-scripts-" + name;
      buildTaskName = "scripts-" + name;
      jshintTaskName = buildTaskName + "-jshint";
      watchTaskName = buildTaskName + "-watch";
      preBuildTasks = [cleanTaskName].concat((ref$ = item.buildDeps) != null
        ? ref$
        : [], params.jshintEnabled && [jshintTaskName] || []);
      if (params.jshintEnabled) {
        gulp.task(jshintTaskName, (function(name, params){
          return function(cb){
            scriptsJshintTask(name, params, cb);
          };
        }.call(this, name, params)));
      }
      gulp.task(cleanTaskName, (function(name, params){
        return function(cb){
          scriptsCleanTask(name, params, cb);
        };
      }.call(this, name, params)));
      switch (item.type) {
      case 'browserify':
        gulp.task(buildTaskName, preBuildTasks, (function(name, params){
          return function(cb){
            scriptsBuildBrowserifyTask(name, params, cb);
          };
        }.call(this, name, params)));
        break;
      default:
        throw Error('unimplemented');
      }
      scriptsCleanTasks.push(cleanTaskName);
      if (!subTask) {
        scriptsBuildTasks.push(buildTaskName);
      }
      watchFiles = (function(){
        switch (false) {
        case item.watchFiles == null:
          return item.watchFiles;
        case item.type !== 'browserify':
          return path.join(srcDir, '**/*.js').concat((function(){
            var i$, x$, ref$, len$, results$ = [];
            for (i$ = 0, len$ = (ref$ = params.extensions || []).length; i$ < len$; ++i$) {
              x$ = ref$[i$];
              results$.push(path.join(srcDir, "**/*" + x$));
            }
            return results$;
          }()));
        default:
          throw Error('unimplemented');
        }
      }());
      initWatcherTask(subTask, watchFiles, item.addToWatchersList, watchTaskName, scriptsWatchTasks, buildTaskName);
    });
  };
  for (name in scriptsData) {
    item = scriptsData[name];
    initTaskIteration(name, item, scriptsInitTasks);
  }
  if (scriptsCleanTasks.length > 0) {
    gulp.task('clean-scripts', scriptsCleanTasks);
    cleanTasks.push('clean-scripts');
  }
  if (scriptsBuildTasks.length > 0) {
    gulp.task('scripts', scriptsBuildTasks);
    defaultTasks.push('scripts');
  }
  if (scriptsWatchTasks.length > 0) {
    gulp.task('scripts-watch', scriptsWatchTasks);
    watchTasks.push('scripts-watch');
  }
  htmlCleanTasks = [];
  htmlBuildTasks = [];
  htmlWatchTasks = [];
  htmlData = (ref$ = pkg.gulp.html) != null
    ? ref$
    : {};
  htmlGetFilesSelector = curry$(function(srcDir, params){
    srcDir == null && (srcDir = '');
    switch (params.type) {
    case 'jade':
      return [path.join(srcDir, '**/*.jade')];
    default:
      throw Error('unimplemented');
    }
  });
  htmlCleanTask = function(name, params, cb){
    preparePaths(params, function(srcFilePath, srcDir, destDir){
      if (params.destDir != null && srcFilePath == null) {
        gulp.src(htmlGetFilesSelector(null, params), {
          base: srcDir,
          read: false
        }).pipe(rename(function(buildPath){
          buildPath.extname = '.html';
        })).pipe(gulp.dest(destDir)).pipe(vinylPaths(del)).on('finish', function(){
          cb();
        });
      } else {
        rmIt((function(){
          switch (false) {
          case params.destDir == null:
            return path.join(destDir, params.buildFile);
          default:
            return destDir;
          }
        }()), cb);
      }
    });
  };
  htmlBuildTask = function(name, params, cb){
    preparePaths(params, function(srcFilePath, srcDir, destDir){
      var options, ref$, sourceMaps, plugin, isSingleFile, src, hasErr;
      options = import$((ref$ = Object.create(null), ref$.pretty = params.pretty === true, ref$), params.locals != null && {
        locals: params.locals
      } || {});
      sourceMaps = params.sourceMaps === true || (!isProductionMode && params.sourceMaps !== false);
      plugin = (function(){
        switch (params.type) {
        case 'jade':
          return require('gulp-jade');
        default:
          throw Error('unimplemented');
        }
      }());
      isSingleFile = params.mainSrc != null && params.buildFile != null;
      src = srcFilePath != null
        ? srcFilePath
        : htmlGetFilesSelector(srcDir, params);
      hasErr = false;
      gulp.src(src).pipe(gulpif(ignoreErrors, plumber({
        errorHandler: function(){
          if (!hasErr) {
            cb.apply(this, arguments);
          }
          hasErr = true;
        }
      }))).pipe(gulpif(sourceMaps, sourcemaps.init())).pipe(plugin(options)).pipe(gulpif(sourceMaps, sourcemaps.write())).pipe(gulpif(isSingleFile, rename(function(buildPath){
        renameBuildFile(buildPath, params.mainSrc, params.buildFile);
      }))).pipe(gulp.dest(destDir)).on('finish', function(){
        if (!hasErr) {
          cb();
        }
      });
    });
  };
  htmlInitTasks = function(name, item, subTask){
    var params, ref$, cleanTaskName, buildTaskName, watchTaskName, preBuildTasks;
    subTask == null && (subTask = false);
    params = import$({
      type: item.type,
      path: item.path,
      mainSrc: item.mainSrc || null,
      srcDir: item.srcDir || null,
      buildFile: item.buildFile || null,
      destDir: item.destDir || null,
      pretty: (ref$ = item.pretty) != null ? ref$ : null,
      locals: (ref$ = item.locals) != null ? ref$ : null
    }, typeof item.sourceMaps === 'boolean' && {
      sourceMaps: item.sourceMaps
    } || {});
    checkForSupportedType('html')(
    params.type);
    cleanTaskName = "clean-html-" + name;
    buildTaskName = "html-" + name;
    watchTaskName = buildTaskName + "-watch";
    preBuildTasks = [cleanTaskName].concat((ref$ = item.buildDeps) != null
      ? ref$
      : []);
    gulp.task(cleanTaskName, (function(name, params){
      return function(cb){
        htmlCleanTask(name, params, cb);
      };
    }.call(this, name, params)));
    gulp.task(buildTaskName, preBuildTasks, (function(name, params){
      return function(cb){
        htmlBuildTask(name, params, cb);
      };
    }.call(this, name, params)));
    htmlCleanTasks.push(cleanTaskName);
    if (!subTask) {
      htmlBuildTasks.push(buildTaskName);
    }
    preparePaths(params, function(srcFilePath, srcDir){
      var watchFiles;
      watchFiles = (function(){
        switch (false) {
        case item.watchFiles == null:
          return item.watchFiles;
        case item.type !== 'jade':
          return path.join(srcDir, '**/*.jade');
        default:
          throw Error('unimplemented');
        }
      }());
      initWatcherTask(subTask, watchFiles, item.addToWatchersList, watchTaskName, htmlWatchTasks, buildTaskName);
    });
  };
  for (name in htmlData) {
    item = htmlData[name];
    initTaskIteration(name, item, htmlInitTasks);
  }
  if (htmlCleanTasks.length > 0) {
    gulp.task('clean-html', htmlCleanTasks);
    cleanTasks.push('clean-html');
  }
  if (htmlBuildTasks.length > 0) {
    gulp.task('html', htmlBuildTasks);
    defaultTasks.push('html');
  }
  if (htmlWatchTasks.length > 0) {
    gulp.task('html-watch', htmlWatchTasks);
    watchTasks.push('html-watch');
  }
  cleanData = (ref$ = pkg.gulp.clean) != null
    ? ref$
    : [];
  distCleanData = (ref$ = pkg.gulp.distclean) != null
    ? ref$
    : [];
  distCleanTasks = [];
  if (cleanData.length > 0 || cleanTasks.length > 0) {
    gulp.task('clean', cleanTasks, function(cb){
      rmIt(cleanData, cb);
    });
    distCleanTasks.push('clean');
  }
  if (distCleanTasks.length > 0 || distCleanData.length > 0) {
    gulp.task('distclean', distCleanTasks, function(cb){
      rmIt(distCleanData, cb);
    });
  }
  if (watchTasks.length > 0) {
    gulp.task('watch', watchTasks);
  }
  gulp.task('default', defaultTasks);
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
  function clone$(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

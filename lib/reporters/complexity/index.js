'use strict';

//TODO: make this not a janky munge of old plato code and the new stuff

var escomplex = require('typhonjs-escomplex'),
	escomplexModule = require('typhonjs-escomplex-module'),
	babel = require('@babel/core'),
	_ = require('lodash');


function process(source, options, reportInfo) {
	var report = {};

	if ('babelConfig' in options) {
    var ast = babel.parseSync(source, {
      ...options.babelConfig,
      filename: reportInfo.fileShort
    });
    report = escomplexModule.analyze(ast, options);
	} else {
		report = escomplex.analyzeModule(source, options);
	}

	// Make the short filename easily accessible
	report.module = reportInfo.fileShort;

	// Munge the new `escomplex-js` format to match the older format of
	// `complexity-report`



	//this is just adapting the new module to the old stuff.
	//TODO its messy and it needs ot not be here forever.
	/*
	date: date,
	sloc: r.aggregate.sloc.physical,
	lloc: r.aggregate.sloc.logical,
	functions: r.functions.length,
	deliveredBugs: r.aggregate.halstead.bugs,
	maintainability: r.maintainability,
	difficulty: r.aggregate.halstead.difficulty
	*/



	report.aggregate = report.aggregate || {};
	report.aggregate.complexity = _.clone(report.methodAggregate);


	function methodToReportFunction(func) {



		func.complexity = _.extend({},{
			cyclomatic: func.cyclomatic,
			sloc: func.sloc,
			halstead: func.halstead
		});

		func.line = func.line || func.lineStart;
		return func;
	}

	// console.log('complexity:');
	// console.log(report);

	function allClassMethods(report){


		if(!report.classes.length){
			return [];
		}

		return _
			.chain(report.classes)
			.map(function(_class){
				return _class.methods;
			})
			.flatten()
			.value();
	}

	let functions = report.methods.concat(allClassMethods(report));


	report.functions = _
		.chain(functions)
		.map(methodToReportFunction)
		.value();


	// if(report.classes){
	// 	console.log(report.classes);
	// }
	//
	// if(report.classes.length){
	// 	console.log('functions', functions);
	// }

	return report;
}

exports.process = process;

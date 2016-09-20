// default settings. fis3 release

// Global start
fis.hook('relative');

fis.set('project.ignore', ['dist/**', 'fis-conf.js','antd-demo/**', 'node_modules/**'])

//fis.match('(*{_aio.js,_map.js,_aio.css})',{
//	release:'jrctpublic/aio/$1'
//})

fis.match('::package', {
	postpackager: fis.plugin('loader', {
		allInOne: false
	})
})


fis.media('pro').match('::package', {
	postpackager: fis.plugin('loader', {
		allInOne: true
	})
})

fis.media('pro').match('*.{js,css}', {
	useHash: false
});

fis.media('pro').match('::image', {
	useHash: false
});

fis.media('pro').match('*.js', {
	optimizer: fis.plugin('uglify-js')
});

fis.match('*.min.js', {
	optimizer: null
})

fis.media('pro').match('*.css', {
	optimizer: fis.plugin('clean-css')
});

fis.match('*.min.css', {
	optimizer: null
})


fis.match('**',{
	relative:true
})

fis.media('pro').match('*', {
	deploy: fis.plugin('local-deliver', {
		to: 'dist/'
	})
})


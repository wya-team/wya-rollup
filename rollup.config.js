console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
const ENV_IS_DEV = process.env.NODE_ENV === 'development';
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
// dev server
import serve from 'rollup-plugin-serve';

// PostCSS plugins
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';


import babelrc from 'babelrc-rollup';

const mainConfig = {
	// 输入
	input: 'src/main.js',
	// 输出
	output: {
		file: `${ ENV_IS_DEV ? `build` : `dist`}/pluginsName.min.js`,
		format: 'iife',
		sourcemap: 'inline'
	},
	// 自执行函数
	
	plugins: [
		// 使用postcss
		postcss({
			plugins: [
				simplevars(),
				nested(),
				cssnext({
					warnForDuplicates: false,
				}),
				cssnano(),
			],
			extensions: ['.css'],
		}),
		// 使用amd模块引入，第三方模块支持
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		// 使用amd模块引入
		commonjs(),
		// 使用eslint
		eslint({
			exclude: [
				'src/styles/**',
			]
		}),
		// 使用babel
		babel(babelrc()),
		// 提花全局字段ENV为....
		replace({
			exclude: 'node_modules/**',
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		// 是否压缩代码
		(!ENV_IS_DEV && uglify())
	]
};

const localIp = (() => {
	let ips = [];
	let os = require('os');
	let ntwk = os.networkInterfaces();
	for (let k in ntwk) {
		for (let i = 0; i < ntwk[k].length; i++) {
			let _add = ntwk[k][i].address;
			if (_add && _add.split('.').length == 4 && !ntwk[k][i].internal && ntwk[k][i].family == 'IPv4') {
				ips.push(ntwk[k][i].address);
			}
		}
	}
	return ips[0] || 'localhost';
})();

const devServer = serve({
	// 自动打开浏览器
	open: false,
	// 终端中打印server地址
	verbose: true,
	// 路径
	contentBase: ['example', 'build'],
	historyApiFallback: true,
	host: localIp,
	port: 10001,
	https: false,
	// set headers
	headers: {
		foo: 'bar'
	}
});
ENV_IS_DEV && mainConfig.plugins.push(devServer); 
export default [mainConfig];
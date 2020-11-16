const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
    assetsDir: "./",
    lintOnSave: false, // 去掉语法检查
    productionSourceMap: false, // 去掉 map
    configureWebpack: () => { // Gzip 压缩
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
                        threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
                        deleteOriginalAssets: false, // 是否删除原文件
                        minRatio: 0.8
                    })
                ]
            }
        }
    }
}

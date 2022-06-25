const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            'border-radius-base': '4px',
                            'box-shadow-base': '0 1px 6px rgba(0, 0, 0, 0.2), 0 3px 12px 0 rgba(0, 0, 0, 0.08)',

                            'animation-duration-slow': '.192s', // modal, 12*16ms
                            'animation-duration-base': '.128s', // popover, 8*16ms
                            'animation-duration-fast': '.080s', // tooltip, 5*16ms
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
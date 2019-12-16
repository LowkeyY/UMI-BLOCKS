export default {
    plugins: [
        ['umi-plugin-block-dev', {}],
        ['umi-plugin-react', {
            dva: true,
            antd: true
        }]
    ],
    routes: [
        {
            path: '/',
            routes: [
                {
                    path: '/',
                    component: './index',
                },
                {
                    path: '/manage',
                    component: './manage'
                }
            ]
        }

    ]

};

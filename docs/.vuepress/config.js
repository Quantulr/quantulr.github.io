module.exports = {
  title: 'quantulr',
  description: 'This is the description of the website.',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  ga:'UA-127856372-1',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '记事', link: '/note/' },
      { text: 'GitHub', link: 'https://github.com/quantulr' },
      { text: 'Vuepress', link: 'https://vuepress.vuejs.org/zh/'}
    ],
    sidebar: {
      '/note/': [{
      	title: '记事',
      	collapsable: false,
      	children: [
      		'',
      		'Qt_for_Python_Signals_and_Slots',
      	]
      }]
    }
  }
}

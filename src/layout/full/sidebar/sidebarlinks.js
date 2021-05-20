export default [
    {
    url: "/home",
    name: "Home",
    i18n: "Home",
    icon: "mdi mdi-home",
    index: 1
},
    {
        name: "Activity",
        i18n: "Activity",
        icon: "mdi mdi-clock",
        index: 2.0,
        child: [
            {
                url:  '/streak',
                name: "Streaks",
                i18n: "Streaks",
                icon: "mdi mdi-clock-start",
                index: 2.1
            },
            {
                url:  '/online',
                name: "Who's Online",
                i18n: "Who's Online",
                icon: "mdi mdi-clock-fast",
                index: 2.2
            },
        ]
    },
    {
        url:  '/badges',
        name: "Badges",
        i18n: "Badges",
        icon: "mdi mdi-trophy",
        index: 3.0,

    },

]
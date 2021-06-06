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
    {
        name: "Connections",
        i18n: "Connections",
        icon: "mdi mdi-account-multiple",
        index: 4.0,
        child: [
            {
                url:  '/following',
                name: "Following",
                i18n: "Following",
                icon: "mdi mdi-account-multiple-plus",
                index: 4.1
            },
            {
                url:  '/followers',
                name: "Followers",
                i18n: "Followers",
                icon: "mdi mdi-account-multiple-outline",
                index: 4.2
            },
        ]
    },
    {

        name: "Messages",
        i18n: "Messages",
        icon: "mdi mdi-forum",
        index: 5.0,
        child: [
            {
                url:  '/messages',
                name: "Member Chat",
                i18n: "Member Chat",
                icon: "mdi mdi-message-processing",
                index: 5.1
            },
            {
                url:  '/support',
                name: "Support",
                i18n: "Support",
                icon: "mdi mdi-message",
                index: 5.2
            },
        ]
    },
    {
        url:  '/points',
        name: "Points",
        i18n: "Points",
        icon: "mdi mdi-tag-multiple",
        index: 6.0,

    },
    {
        name: "Walls",
        i18n: "Walls",
        icon: "mdi mdi-comment-multiple-outline",
        index: 7.0,
        child: [
            {
                url:  '/forum',
                name: "Forum",
                i18n: "Forum",
                icon: "mdi mdi-comment-question-outline",
                index: 7.1
            },
            {
                url:  '/social',
                name: "Social",
                i18n: "Social",
                icon: "mdi mdi-comment-text-outline",
                index: 7.2
            },
            {
                url:  '/chatroom',
                name: "Chatroom",
                i18n: "Chatroom",
                icon: "mdi mdi-comment-processing-outline",
                index: 7.3
            },
        ]
    },
]
